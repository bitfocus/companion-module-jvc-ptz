const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {

	let presets = {}

	// Stealth Toggle
	presets['UP'] = {
		category: 'Pan/Tilt',
		name: 'UP',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_UP,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Up',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['DOWN'] = {
		category: 'Pan/Tilt',
		name: 'DOWN',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_DOWN,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Down',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['RIGHT'] = {
		category: 'Pan/Tilt',
		name: 'RIGHT',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Right',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['LEFT'] = {
		category: 'Pan/Tilt',
		name: 'LEFT',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Left',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['RIGHTUP'] = {
		category: 'Pan/Tilt',
		name: 'RIGHTUP',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_UP_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'RightUp',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['RIGHTDOWN'] = {
		category: 'Pan/Tilt',
		name: 'RIGHTDOWN',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_DOWN_RIGHT,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'RightDown',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['LEFTUP'] = {
		category: 'Pan/Tilt',
		name: 'LEFTUP',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_UP_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'LeftUp',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	};
	presets['LEFTDOWN'] = {
		category: 'Pan/Tilt',
		name: 'LEFTDOWN',
		type: 'button',
		style: {
			text: '',
			png64: self.ICON_DOWN_LEFT,
			pngalignment: 'center:center',
			size: '18',
			color: 16777215,
			bgcolor: 0
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'LeftDown',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Pan left'] = {
		category: 'Pan/Tilt',
		name: 'Pan left',
		type: 'button',
		style: {
			text: 'Pan left, speed 15',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Left',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Pan right'] = {
		category: 'Pan/Tilt',
		name: 'Pan right',
		type: 'button',
		style: {
			text: 'Pan right, speed 15',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Right',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationPan',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Tilt up'] = {
		category: 'Pan/Tilt',
		name: 'Tilt up',
		type: 'button',
		style: {
			text: 'Tilt up, speed 15',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Up',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Tilt Down'] = {
		category: 'Pan/Tilt',
		name: 'Tilt Down',
		type: 'button',
		style: {
			text: 'Tilt down, speed 15',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Down',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'joyStickOperationTilt',
					options: {
						direction: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Zoom Tele2'] = {
		category: 'Zoom/Focus',
		name: 'Zoom Tele2',
		type: 'button',
		style: {
			text: 'Zoom Tele2',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'zoom',
					options: {
						button: 'Tele2',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'zoom',
					options: {
						button: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Zoom Wide2'] = {
		category: 'Zoom/Focus',
		name: 'Zoom Wide2',
		type: 'button',
		style: {
			text: 'Zoom Wide2',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'zoom',
					options: {
						button: 'Wide2',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'zoom',
					options: {
						button: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Focus Near2'] = {
		category: 'Zoom/Focus',
		name: 'Focus Near2',
		type: 'button',
		style: {
			text: 'Focus Near2',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'focus',
					options: {
						button: 'Near2',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'focus',
					options: {
						button: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	presets['Focus Far2'] = {
		category: 'Zoom/Focus',
		name: 'Focus Far2',
		type: 'button',
		style: {
			text: 'Focus Far2',
			size: '14',
			color: 0,
			bgcolor: combineRgb(235, 235, 235)
		},
		steps: [{
			down: [
				{
					actionId: 'focus',
					options: {
						button: 'Far2',
						speed: '15'
					}
				}
			],
			up: [
				{
					actionId: 'focus',
					options: {
						button: 'Stop',
						speed: '0'
					}
				}
			]
		}]
	}

	self.setPresetDefinitions(presets)
}
