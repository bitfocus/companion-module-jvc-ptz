exports.getPresets = function () {
	let presets = []

	// Stealth Toggle
	presets.push({
		category: 'Pan/Tilt',
		label: 'UP',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_UP,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Up',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'DOWN',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_DOWN,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Down',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'RIGHT',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Right',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'LEFT',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Left',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'RIGHTUP',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_UP_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'RightUp',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'RIGHTDOWN',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_DOWN_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'RightDown',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'LEFTUP',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_UP_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'LeftUp',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});
	presets.push({
		category: 'Pan/Tilt',
		label: 'LEFTDOWN',
		bank: {
			style: 'png',
			text: '',
			png64: this.ICON_DOWN_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: '16777215',
			bgcolor: this.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'LeftDown',
					speed: '15'
				}
			}
		],
		release_actions: [
			{
				action: 'joyStickOperationPT',
				options: {
					direction: 'Stop',
					speed: '0'
				}
			}
		]
	});




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
