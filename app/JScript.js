window.onload = function() {
		
	let data = {
		timestamp: 0,
		progress: 0,
		scroll: 0,
		lastSave: null
	};
		
	let sidePanel = document.createElement('aside');	
	sidePanel.id = 'sidePanel';
	sidePanel.innerHTML = 
	
		`<div id="progressBar">
			<div id="meterWrap">
				<div id="meter"></div>
			</div>
		</div>
		<div id="stats">
			<table>
				<tr>
					<th colspan="2">Progress</th>
				</tr>
				<tr>
					<td id="percentTotal" class="number">0.0%</td>
					<td id="percentSession" class="green number">0.0</td>
				</tr>
				<tr>
					<th colspan="2">Time</th>
				</tr>
				<tr>
					<td>Total:</td>
					<td id="timeTotal" class="number">00:00:00</td>
				</tr>
				<tr>
					<td>Session:</td>
					<td id="timeSession" class="number">00:00:00</td>
				</tr>
			</table>
		</div>
		<div id="saveMessage">
			<p>Error!</p>
		</div>
		<div id="saveBtn">
			<div></div>
		</div>
		<div id="label">
			<label>Brightness</label>
		</div>
		<div id="slider">	
			<input type="range" value=100 step=1></input>
		</div>	
		<div id="lock">
			<p>&#128275;</p>
		</div>`;
	
	document.body.appendChild( sidePanel );
	
	let popUp = document.createElement('div');
	popUp.id = 'popUp';
	document.body.appendChild( popUp );
	
	function $(id) { return document.getElementById(id); }
							 						  	
	let totalBookLength = Math.max(	
	  document.body.scrollHeight, document.documentElement.scrollHeight,
	  document.body.offsetHeight, document.documentElement.offsetHeight,
	  document.body.clientHeight, document.documentElement.clientHeight
	  ) - window.innerHeight,
	
    percentTotal = $('percentTotal'),
	percentSession = $('percentSession'),
	timeTotal = $('timeTotal'),
	timeSession = $('timeSession'),
    meter = $('meter'),
    saveBtn = $('saveBtn').childNodes[1],
	saveMessage = $('saveMessage').childNodes[1],
	slider = $('slider').childNodes[1],
	lock = $('lock').childNodes[1],
	lockHandler = false;
	label = $('label').childNodes[1],
	filePath = decodeURIComponent(window.location.href),
	mouseX = null,
	sessionTimestamp = 0,
	startDate = new Date();	
	
	
	function calcTime(timestamp) {
		timestamp = Math.floor( timestamp / 1000 );
		let time = [];
		time[0] = timestamp % 60; timestamp -= time[0];
		timestamp = Math.floor( timestamp / 60 );
		time[1] = timestamp % 60; timestamp -= time[1];
		timestamp = Math.floor( timestamp / 60 );
		time[2] = timestamp % 60;
		
		for ( let i = 0; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = '0' + time[i];
			}
		}	
		
		return `${time[2]}:${time[1]}:${time[0]}`;
	}
	
	function timer() { 		
		sessionTimestamp = new Date().getTime() - startDate.getTime();	
		timeSession.innerHTML = `${calcTime(sessionTimestamp)}`;
		
		let totalTime = data.timestamp + sessionTimestamp;
		timeTotal.innerHTML = `${calcTime(totalTime)}`;
	}
	
	setInterval( timer, 1000 );
	
	let months = ['January', 'February', 'March', 'April', 'May', 'June',
				  'July', 'August', 'September', 'October', 'November', 'December'];
	
	function calcDate( date ) {
		let year = date.getFullYear(),
		month = date.getMonth(),
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes();
		
		if ( min < 10 ) { min = '0' + min }
		if ( hour < 10 ) { hour = '0' + hour }
		
		return `${day} ${months[month]} ${year}  ${hour}:${min}`;
	} 
					
	window.addEventListener('scroll', function() {
		data.progress = ( 100 - ( totalBookLength - window.pageYOffset ) /
		( totalBookLength / 100 )).toFixed(1);
		
		function fixPercent(num, output) {
			if ( num <= 0 ) {
				output.textContent = '0.0%';
			} 
			else if ( data.progress >= 100 ) {
				output.textContent = '100%';
			} 
			else { output.textContent = num + '%'; }	
		}
		
		fixPercent( data.progress, percentTotal );		
		
		let sessionProgress = (( window.pageYOffset - data.scroll ) /
		( totalBookLength / 100 )).toFixed(1);				
		
		if ( sessionProgress < 0.1 && sessionProgress > -0.1 ) {
			percentSession.textContent = '0.0';
		} 
		else if ( sessionProgress >= 0.1 ) {
			percentSession.textContent = '+' + sessionProgress;
		}
		else {
			percentSession.textContent = sessionProgress;
		}
				
		meter.style.width = data.progress + '%';	
	});
	
	function saving() {
	
		data.scroll = window.pageYOffset;
		data.timestamp += sessionTimestamp;
		data.lastSave = calcDate(new Date());		
		
		localStorage.setItem(`${filePath}`, JSON.stringify(data));	
				
		if (localStorage.getItem(`${filePath}`)) {
			saveMessage.style.color = '#87ce57';
			saveMessage.textContent = 'Saved!';
		} 
		else { 
			saveMessage.style.color = 'red';
			saveMessage.textContent = 'Error!';
		}
		
		saveBtn.classList.add('rotateY');
		setTimeout( function() {
			saveMessage.style.visibility = 'visible';
		}, 600 );
		setTimeout( function() {
			saveMessage.style.visibility = 'hidden';
		}, 900 );
		setTimeout( function() {
			saveBtn.classList.remove('rotateY');
		}, 1000 );
					
		startDate = new Date();
		
		console.log(`New save: ${calcDate(new Date())}`);
		console.log(filePath);
		console.log(JSON.parse(localStorage.getItem(`${filePath}`)));		
	}
		
	saveBtn.addEventListener('click', saving );	
	
	window.onmousemove = function(event) {
		event = event || window.event;	
		mouseX = event.pageX;
		if ( mouseX > -1 && mouseX <= 30 ) {
			sidePanel.style.left = '0';
			sidePanel.isShowed = true;
		} 
		if ( mouseX > 400 && !lockHandler ) { 
			sidePanel.style.left = '-280px'; 
			sidePanel.isShowed = false;
		}	
	}
	
	function setBackground() {
		document.body.style.backgroundColor = `hsl(35, 33%, ${slider.value/2 + 50}%)`;
	}
	
	slider.addEventListener('input', function() {
		setBackground();
		label.innerHTML = `${slider.value}`;
		console.log(slider.value);
	});
	
	function labelChangStyle() {
		label.classList.toggle('green');
		label.classList.toggle('number');
	}
	
	slider.addEventListener('mouseover', function() {
		label.innerHTML = `${slider.value}`;
		labelChangStyle();
	});
	
	slider.addEventListener('mouseout', function() {
		label.innerHTML = 'Brightness';
		labelChangStyle();
	});
	
	function lockUnlock() {
		lockHandler ? lock.innerHTML = '&#128275;' : lock.innerHTML = '&#128274;';
		lockHandler = !lockHandler;		
	}
	
	lock.addEventListener('click', lockUnlock);
		
	function showHidePopUp() {
		popUp.style.bottom = '10px';
		setTimeout(function() {
			popUp.style.bottom = '-110px';
		}, 2000);
	} 	
		
	let timeCountKey;	
	document.addEventListener('keydown', function(event) {
		if ( event.code == 'KeyS' ) { 
			saving();
			
			if ( sidePanel.style.left == '-280px' ) {
				popUp.innerHTML = `<p>New save:</p>
							   	   <p>${data.lastSave}</p>`;
				showHidePopUp();
			}
		}
		if ( event.code == 'KeyP' ) {
			if ( sidePanel.isShowed ) {
				sidePanel.style.left = '-280px';
				sidePanel.isShowed = false;
			} 
			else {
				sidePanel.style.left = '0';
				sidePanel.isShowed = true;
			}
		}
		if ( event.code == 'ArrowLeft' || event.code == 'ArrowRight' ) {
			clearTimeout(timeCountKey);
									
			event.code == 'ArrowLeft' ? slider.value -= 20 : 
										slider.value = +(slider.value) + 20;
															
			label.classList.add('number');
			label.classList.add('green');
			label.innerHTML = `${slider.value}`;			
			setBackground();
		}
	});	
		
	document.addEventListener('keyup', function(event) {
		if ( event.code == 'ArrowLeft' || event.code == 'ArrowRight' ) {
			timeCountKey = setTimeout( function() {
				label.classList.remove('number');
				label.classList.remove('green');
				label.innerHTML = 'Brightness';
			}, 800 );
		}
	});
	
	if ( localStorage.getItem(`${filePath}`) ) {
		data = JSON.parse(localStorage.getItem(`${filePath}`));
	
		popUp.innerHTML = `<p>Loaded save:</p>
						   <p>${data.lastSave}</p>`;
						   
		meter.style.width = data.progress + '%';
		window.scrollTo( 0, data.scroll );			
		startDate = new Date();
	}	
	else {
		popUp.innerHTML = `<p>New book</p>
						   <p>Save not found</p>`;
	}
	
	setTimeout( function() {
		showHidePopUp();
	}, 1000 );
}