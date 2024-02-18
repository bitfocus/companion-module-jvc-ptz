const { Regex } = require('@companion-module/base')

module.exports = function (self) {

	let actions = {}

	actions['joyStickOperationPan'] = {
		name: 'Pan camera',
		options: [
			{
				label: 'Select direction',
				type: 'dropdown',
				id: 'direction',
				default: 'Stop',
				choices: [{ label: 'Left', id: 'Left' }, { label: 'Right', id: 'Right' }, { label: 'RightUp', id: 'RightUp' } , { label: 'RightDown', id: 'RightDown' }, { label: 'LeftUp', id: 'LeftUp' }, { label: 'LeftDown', id: 'LeftDown' }, { label: 'Stop', id: 'Stop' }]
			},
			{
				label: 'Select speed (0-100)',
				type: 'textinput',
				id: 'speed',
				default: '15',
				regex: Regex.NUMBER
			}
		],
		callback: async ({options}) => {
			self.tilt = "Stop"
			self.direction = options.direction
			switch (options.direction) {
			case "RightUp":
				self.tilt = "Up"
				self.direction = "Right"
				break
			case "RightDown":
				self.tilt = "Down"
				self.direction = "Right"
				break
			case "LeftUp":
				self.tilt = "Up"
				self.direction = "Left"
				break
			case "LeftDown":
				self.tilt = "Down"
				self.direction = "Left"
				break
			}
			self.sendCommand( {
				Command: 'JoyStickOperation',
				Params: { PanDirection: self.direction, PanSpeed: parseInt(options.speed), TiltDirection: self.tilt, TiltSpeed: parseInt(options.speed) },
			})
			self.sendCommand({ Command: 'GetPTPosition' })
		},
	}

	actions['joyStickOperationTilt'] = {
		name: 'Tilt camera',
		options: [
			{
				label: 'Select direction',
				type: 'dropdown',
				id: 'direction',
				default: 'Stop',
				choices: [{ label: 'Up', id: 'Up' }, { label: 'Down', id: 'Down' }, { label: 'Stop', id: 'Stop' }]
			},
			{
				label: 'Select speed (0-100)',
				type: 'textinput',
				id: 'speed',
				default: '15',
				regex: '/^([0-9]|[1-2][0-9]|100)$/'
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'JoyStickOperation',
				Params: { PanDirection: 'Stop', PanSpeed: 0, TiltDirection: options.direction, TiltSpeed: parseInt(options.speed) },
			})
			self.sendCommand({ Command: 'GetPTPosition' })
		},
	}

	actions['zoom'] = {
		name: 'Zoom',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Stop',
				choices: [{ label: 'Stop', id: 'Stop' }, { label: 'Tele1', id: 'Tele1' }, { label: 'Tele2', id: 'Tele2' }, { label: 'Tele3', id: 'Tele3' }, { label: 'Wide1', id: 'Wide1' }, { label: 'Wide2', id: 'Wide2' }, { label: 'Wide3', id: 'Wide3' }]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Zoom', Button: options.button },
			})
		},
	}

	actions['zoomSwitchOperation'] = {
		name: 'Zoom switch',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'direction',
				default: 'Stop',
				choices: [{ label: 'Stop', id: 'Stop' }, { label: 'Tele', id: 'Tele' }, { label: 'Wide', id: 'Wide' }]
			},
			{
				label: 'Speed (0-8)',
				type: 'textinput',
				id: 'speed',
				default: '2',
				regex: '/^[0-8]$/'
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'ZoomSwitchOperation',
				Params: { Direction: options.direction, Speed: parseInt(options.speed) },
			})
		},
	}

	actions['focus'] = {
		name: 'Focus',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Stop',
				choices: [
					{ label: 'Stop', id: 'Stop' }, 
					{ label: 'PushAuto', id: 'PushAuto' }, 
					{ label: 'Far1', id: 'Far1' }, 
					{ label: 'Far2', id: 'Far2' }, 
					{ label: 'Far3', id: 'Far3' }, 
					{ label: 'Near1', id: 'Near1' }, 
					{ label: 'Near2', id: 'Near2' }, 
					{ label: 'Near3', id: 'Near3' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Focus', Button: options.button },
			})
		},
	}

	actions['gain'] = {
		name: 'Gain control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: '+1',
				choices: [
					{ label: '+1', id: 'Up1' }, 
					{ label: '-1', id: 'Down1' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Gain', Button: options.button },
			})
		},
	}

	actions['whb'] = {
		name: 'White balance control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Awb',
				choices: [
					{ label: 'Auto WB', id: 'Awb' }, 
					{ label: '3200K', id: '3200K' }, 
					{ label: '5600K', id: '5600K' }, 
					{ label: 'Manual', id: 'Manual' }, 
					{ label: 'Faw', id: 'Faw' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Whb', Button: options.button },
			})
		},
	}

	actions['iris'] = {
		name: 'iris control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Open1',
				choices: [
					{ label: 'Open 1', id: 'Open1' }, 
					{ label: 'Close 1', id: 'Close1' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Iris', Button: options.button },
			})
		},
	}

	actions['exposure'] = {
		name: 'Exposure settings',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Manual',
				choices: [
					{ label: 'Manual', id: 'Manual' }, 
					{ label: 'Auto', id: 'Auto' }, 
					{ label: 'Iris Priority', id: 'IrisPriority' }, 
					{ label: 'Shutter Priority', id: 'ShutterPriority' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Exposure', Button: options.button },
			})
		},
	}

	actions['exposure'] = {
		name: 'Menu control',
		options: [
			{
				label: 'Button',
				type: 'dropdown',
				id: 'button',
				default: 'Manual',
				choices: [
					{ label: 'Menu', id: 'Menu' },
					{ label: 'Cancel', id: 'Cancel' },
					{ label: 'Set', id: 'Set' },
					{ label: 'Up', id: 'Up' },
					{ label: 'Down', id: 'Down' },
					{ label: 'Left', id: 'Left' },
					{ label: 'Right', id: 'Right' },
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebButtonEvent',
				Params: { Kind: 'Menu', Button: options.button },
			})
		},
	}

	actions['setPTZPreset'] = {
		name: 'Preset operations',
		options: [
			{
				label: 'Preset number (1-100)',
				type: 'textinput',
				id: 'preset',
				default: '1',
				regex: '/^([0-9]|[1-9][0-9]|100)$/'
			},
			{
				label: 'Operation',
				type: 'dropdown',
				id: 'operation',
				default: 'Move',
				choices: [
					{ label: 'Recall', id: 'Move' }, 
					{ label: 'Store', id: 'Set' }, 
					{ label: 'Delete', id: 'Delete' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetPTZPreset',
				SessionID: self.sessionID,
				Params: { No: parseInt(options.preset), Operation: options.operation },
			})
			self.sendCommand({ Command: 'GetPTPosition' })
		},
	}

	actions['SetWebSliderEvent'] = {
		name: 'Web Slider Event',
		options: [
			{
				label: 'Kind',
				type: 'dropdown',
				id: 'kind',
				default: 'PresetSpeedBar',
				choices: [
					{ label: 'PresetSpeedBar', id: 'PresetSpeedBar' }, 
					{ label: 'ZoomBar', id: 'ZoomBar' }, 
					{ label: 'IrisBar', id: 'IrisBar' }]
			},
			{
				label: 'Position',
				type: 'textinput',
				id: 'position',
				default: '1',
				regex: Regex.NUMBER,
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetWebSliderEvent',
				Params: { Kind: options.kind, Position: parseInt(options.position) },
			})
		},
	}
	/***Extra options***/

	actions['setZoomCtrl'] = {
		name: 'Set zoom position',
		options: [{
			label: 'postion (0-499)',
			type: 'textinput',
			id: 'position',
			default: '350',
			regex: '/^([0-9]|[1-9][0-9]|[1-4][0-9][0-9])$/'
		}],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetZoomCtrl', 
				Params: { Position: options.position }
			})
		},
	}

	actions['setPresetZoomPosition'] = {
		name: 'Set preset zoom position in memory',
		options: [
			{
				label: 'postion (A B C D)',
				type: 'dropdown',
				id: 'positionStore',
				default: 'A',
				choices: [
					{ label: 'A', id: 'A' }, 
					{ label: 'B', id: 'B' }, 
					{ label: 'C', id: 'C' }, 
					{ label: 'D', id: 'D' }
				]
			}, {
				label: 'postion (0-499)',
				type: 'textinput',
				id: 'position',
				default: '350',
				regex: '/^([0-9]|[1-9][0-9]|[1-4][0-9][0-9])$/'
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetPresetZoomPosition',
				Params: { ID: options.positionStore, Position: options.position },
			})
		},
	}

	actions['setCamCtrl'] = {
		name: 'Recording control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'ctrl',
				default: 'Rec',
				choices: [
					{ label: 'Record', id: 'Rec' }, 
					{ label: 'Stop recording', id: 'Stop' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetCamCtrl', 
				Params: { CamCtrl: options.ctrl } 
			})

		},
	}
	actions['setStreamingCtrl'] = {
		name: 'Streaming control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'ctrl',
				default: 'Stream',
				choices: [
					{ label: 'Start Stream', id: 'On' }, 
					{ label: 'Stop Stream', id: 'Off' }
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetStreamingCtrl', 
				Params: { Streaming: options.ctrl } 
			})

		},
	}

	actions['setStudioTally'] = {
		name: 'Tally lamp control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'ctrl',
				default: 'Program',
				choices: [
					{ label: 'Program/PGM', id: 'Program' }, 
					{ label: 'Preview/PVW', id: 'Preview' }, 
					{ label: 'Off', id: 'Off' }]
			}
		],
		callback: async ({options}) => {
			try {
				await self.sendCommand( {
					Command: 'SetStudioTally', 
					Params: { Indication: options.ctrl } 
				})
				self.tally = options.ctrl
				self.checkFeedbacks('tally_PGM', 'tally_PVW')
			} catch (error) {
				
			}
		},
	}
	
	actions['setTallyLampPriority'] = {
		name: 'Set Tally Lamp Priority',
		options: [
			{
				label: 'Select Priority',
				type: 'dropdown',
				id: 'ctrl',
				tooltip: 'Different camera models are using different options for external control: Web, External or Studio',
				default: 'Camera',
				choices: [
					{ label: 'Camera/record controls tally', id: 'Camera' },
				]
			}
		],
		callback: async ({options}) => {
			self.sendCommand( {
				Command: 'SetTallyLampPriority', 
				Params: { Priority: options.ctrl } 
			})
			self.checkFeedbacks('tally_PGM', 'tally_PVW')
		},
	}
	
	// special actions for tally

	actions['setStudioPVWTally'] = {
		name: 'Set Tally PVW',
		options: [],
		callback: async ({options}) => {
			try {
				await self.sendCommand( {
					Command: 'SetStudioTally', 
					Params: { Indication: 'Preview' } 
				})
				self.tally = 'Preview'
				self.checkFeedbacks('tally_PVW')
			} catch (error) {
				
			}
		},
	}
	actions['setStudioPGMTally'] = {
		name: 'Set Tally PGM',
		options: [],
		callback: async ({options}) => {
			try {
				await self.sendCommand( {
					Command: 'SetStudioTally', 
					Params: { Indication: 'Program' }
				})
				self.tally = 'Program'
				self.checkFeedbacks('tally_PGM')
			} catch (error) {
				
			}
		},
	}

	actions['setStudioOFFTally'] = {
		name: 'Set Tally Off',
		options: [],
		callback: async ({options}) => {
			try {
				await self.sendCommand( {
					Command: 'SetStudioTally', 
					Params: { Indication: 'Off' } 
				})
				self.tally = 'Off'
				self.checkFeedbacks('tally_PGM')
			} catch (error) {
				
			}
		},
	}
	
	actions['checkPVWtoPGM'] = {
		 name: 'Switch Tally PGM if on Preview',
		 options: [],
		 callback: async ({options}) => {
			if (self.tally == 'Preview') {
				self.sendCommand( {
					Command: 'SetStudioTally', 
					Params: { Indication: 'Program' }
				})
			}
			self.tally = 'Program'
			self.checkFeedbacks('tally_PGM')
		 },
	}

	// actions for automatic tracking (only on some cameras)

	actions['SetTracking'] = {
		name: 'Set Tracking On/Off',
		options: [
			{
				label: 'Tracking',
				type: 'dropdown',
				id: 'ctrl',
				default: 'Toggle',
				choices: [
					{ label: 'Tracking Off', id: 'Off' }, 
					{ label: 'Tracking On', id: 'On' },
					{ label: 'Toggle', id: 'toggle'}
				]
			}
		],
		callback: async ({options}) => {
			if (self.tracking) {
				let val
				if (options.ctrl === 'toggle' && self.tracking === 'On') {
					val = 'Off'
				} else if (options.ctrl === 'toggle') {
					val = 'On'
				} else {
					val = options.ctrl
				}
				try {
					await self.sendCommand( {
						Command: 'SetTracking', 
						Params: { Tracking: val } 
					})
					self.tracking = val
					self.checkFeedbacks('tracking')
				} catch (error) {
					
				}
			} else {
				self.log('warn', 'The connected camera does not support tracking')
			}
		},
	}

	actions['SetTrackingMode'] = {
		name: 'Set Tracking Mode',
		options: [
			{
				label: 'Mode',
				type: 'dropdown',
				id: 'mode',
				default: 'Standard',
				choices: [
					{ label: 'Standard', id: 'Standard' },
					{ label: 'Stage', id: 'Stage' }, 
					{ label: 'Area', id: 'Area' }, 
					{ label: 'Wide Area', id: 'WideArea' }, 
					{ label: 'Fine Adjustment', id: 'FineAdjustment' }, 
				]
			}
		],
		callback: async ({options}) => {
			if (self.tracking) {
				self.sendCommand( {
					Command: 'SetTrackingMode', 
					Params: { TrackingMode: options.mode } 
				})
			} else {
				self.log('warn', 'The connected camera does not support tracking')
			}
		},
	}

	self.setActionDefinitions(actions)
}
