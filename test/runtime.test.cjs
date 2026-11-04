const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const base = require('@companion-module/base')
let Instance
vm.runInNewContext(fs.readFileSync(require.resolve('../index.js'), 'utf8'), {
	require: (id) =>
		id === '@companion-module/base'
			? {
					...base,
					runEntrypoint: (instance) => {
						Instance = instance
					},
				}
			: require('node:module').createRequire(require.resolve('../index.js'))(id),
	console,
	setTimeout,
	clearTimeout,
	setInterval,
	clearInterval,
})
function instance() {
	const self = Object.create(Instance.prototype)
	self.log = () => {}
	self.updateStatus = () => {}
	self.checkFeedbacks = () => {}
	return self
}

test('API 1.15 action values are already parsed, including numeric variables', async () => {
	const self = instance()
	const commands = []
	self.sendCommand = (cmd) => commands.push(cmd)
	self.parseVariablesInString = () => {
		throw new Error('Do not parse an already resolved value twice')
	}
	self.setActionDefinitions = (defs) => {
		self.actions = defs
	}
	self.updateActions()
	let exercised = 0
	for (const [id, action] of Object.entries(self.actions)) {
		const variableOptions = action.options.filter((option) => option.useVariables)
		if (!variableOptions.length) continue
		const options = Object.fromEntries(action.options.map((option) => [option.id, option.default]))
		for (const option of variableOptions) {
			assert.equal(option.type, 'textinput')
			options[option.id] = 23
		}
		commands.length = 0
		await action.callback({ options })
		assert.ok(commands.length, id)
		assert.ok(Object.values(commands[0].Params).includes(23), id)
		exercised++
	}
	assert.equal(exercised, 7)
	commands.length = 0
	await self.actions.joyStickOperationPan.callback({ options: { direction: 'LeftUp', speed: '37' } })
	assert.deepEqual(commands[0], {
		Command: 'JoyStickOperation',
		Params: { PanDirection: 'Left', PanSpeed: 37, TiltDirection: 'Up', TiltSpeed: 37 },
	})
	assert.deepEqual(commands[1], { Command: 'GetPTPosition' })
})

test('polling interval visibility uses a host expression', () => {
	const field = instance()
		.getConfigFields()
		.find((field) => field.id === 'interval')
	assert.equal(field.isVisible, undefined)
	assert.equal(field.isVisibleExpression, '$(options:polling) === true')
})
