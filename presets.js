exports.getPresets = function () {
	let presets = []

	// Stealth Toggle
	presets.push({
		category: 'Pan/Tilt',
		label: 'Pan left',
		bank: {
			style: 'text',
			text: 'Pan left, speed 15',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'joyStickOperationPan',
				options: {
					direction: 'Left',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPan',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Pan/Tilt',
		label: 'Pan right',
		bank: {
			style: 'text',
			text: 'Pan right, speed 15',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'joyStickOperationPan',
				options: {
					direction: 'Right',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPan',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Pan/Tilt',
		label: 'Tit up',
		bank: {
			style: 'text',
			text: 'Tilt up, speed 15',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'joyStickOperationTilt',
				options: {
					direction: 'Up',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationTilt',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Pan/Tilt',
		label: 'Tit Down',
		bank: {
			style: 'text',
			text: 'Tilt down, speed 15',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'joyStickOperationTilt',
				options: {
					direction: 'Down',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationTilt',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Zoom/Focus',
		label: 'Zoom Tele2',
		bank: {
			style: 'text',
			text: 'Zoom Tele2',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'zoom',
				options: {
					button: 'Tele2',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'zoom',
				options: {
					button: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Zoom/Focus',
		label: 'Zoom Wide2',
		bank: {
			style: 'text',
			text: 'Zoom Wide2',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'zoom',
				options: {
					button: 'Wide2',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'zoom',
				options: {
					button: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Zoom/Focus',
		label: 'Focus Near2',
		bank: {
			style: 'text',
			text: 'Focus Near2',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'focus',
				options: {
					button: 'Near2',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'focus',
				options: {
					button: 'Stop',
					speed: '0'
				}
			}
		]
	})

	presets.push({
		category: 'Zoom/Focus',
		label: 'Focus Far2',
		bank: {
			style: 'text',
			text: 'Focus Far2',
			size: '14',
			color: this.rgb(0, 0, 0),
			bgcolor: this.rgb(235, 235, 235)
		},
		actions: [
			{
				action: 'focus',
				options: {
					button: 'Far2',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'focus',
				options: {
					button: 'Stop',
					speed: '0'
				}
			}
		]
	})

	return presets
}
