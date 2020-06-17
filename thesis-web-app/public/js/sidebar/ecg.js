function startBpRecorder(config) {
	var recordId = config.recordId;
	var duration = parseInt(config.duration);

	if (duration > 0) {
		// call the onStart callback
		config.onStart();

		// update the duration text
		var timeLeft = $(document.getElementById(config.timeLeft));
		timeLeft.text(duration + 's');

		var updateInterval = setInterval(() => {
			// update duration
			duration--;
			timeLeft.text(duration + 's');

			// check if finished
			if (duration <= 0) {
				setTimeout(() => {
					// stop recording then process the data recorded
					config.onStop();
					config.onProcess();

					showElement('recording-container', false);
					showElement('recording-finished', true);
					showElement('recording-button', false);
					showElement('record-container', true);

					// to avoid duplicate recording intervals
					clearInterval(updateInterval);

					config.onFinish();
				}, 100);
			}
		}, 1000);
	}
}

function onRecordLegClicked(e) {
	e.preventDefault();
	console.log('record ecg');

	// change the recording ui elements
	showElement('record-container', false);
	showElement('recording-container', true);
	showElement('leg-container', true);

	// start a new record
	var recordId = $(document.getElementById('recordId')).val();
	var duration = $(document.getElementById('duration')).val();

	// declare sockets
	var ecg = io.connect('/socket/ecg');

	startBpRecorder({
		recordId,
		duration,
		timeLeft: 'leg-timeLeft',
		onStart: function () {
			console.log('Record ECG onStart');
			ecg.emit('record-ecg', {
				startRecording: true,
				recordId,
			});
		},
		onStop: function () {
			console.log('Record ECG onStop');
			ecg.emit('record-ecg', {
				stopRecording: true,
				recordId,
			});
			ecg.close();
		},
		onProcess: function () {
			console.log('Record ECG onProcess');
			io.connect('/socket/process/ecg').emit('process-ecg', { recordId, duration });
		},
		onFinish: function () {
			console.log('Record ECG onFinish');
			postRecord('ecg');
		},
	});
}

$(function () {
	showElement('recording-container', false);
	showElement('recording-finished', false);

	// add the events for record button clicks
	var recordLeg = document.getElementById('recordLeg');
	recordLeg.addEventListener('click', onRecordLegClicked);
});
