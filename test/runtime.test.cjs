const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const http = require('node:http')
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

test('real urllib authentication, JSON commands, variables and feedbacks over HTTP', async (t) => {
	const requests = []
	const server = http.createServer((req, res) => {
		if (req.url === '/api.php') {
			res.setHeader('Set-Cookie', ['other=one', 'SessionID=test-session'])
			res.end('ok')
			return
		}
		let body = ''
		req.on('data', (chunk) => {
			body += chunk
		})
		req.on('end', () => {
			const request = JSON.parse(body).Request
			requests.push({ method: req.method, type: req.headers['content-type'], request })
			res.end(
				JSON.stringify({
					Response: {
						Requested: request.Command,
						Result: 'Success',
						Data: request.Command === 'GetPTPosition' ? { Pan: 12, Tilt: 34 } : { Model: 'KY-PZ510', Serial: 'test' },
					},
				}),
			)
		})
	})
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
	t.after(() => new Promise((resolve) => server.close(resolve)))
	const self = instance()
	self.config = { host: `http://127.0.0.1:${server.address().port}`, username: 'jvc', password: '0000' }
	const variables = {}
	const feedbacks = []
	self.setVariableValues = (values) => Object.assign(variables, values)
	self.checkFeedbacks = (...ids) => feedbacks.push(...ids)
	assert.equal(await self.processAuthentication(), 200)
	assert.equal(self.sessionID, 'test-session')
	assert.equal(await self.sendCommand({ Command: 'GetSystemInfo' }), 200)
	assert.equal(await self.sendCommand({ Command: 'GetPTPosition' }), 200)
	assert.deepEqual(variables, { model: 'KY-PZ510', serial: 'test', pan: 12, tilt: 34 })
	assert.equal(requests[0].method, 'POST')
	assert.equal(requests[0].type, 'application/json')
	assert.deepEqual(requests[0].request, { Command: 'GetSystemInfo', SessionID: 'test-session' })
	self.processIncomingData({
		Response: {
			Requested: 'GetCamStatus',
			Data: {
				Camera: { Status: 'Rec' },
				Streaming: { Status: 'Start' },
				Tracking: { Status: 'On' },
				TallyLamp: { StudioTally: 'Program' },
			},
		},
	})
	assert.equal(self.recording, 1)
	assert.equal(self.streaming, 1)
	assert.equal(self.tracking, 'On')
	assert.equal(self.tally, 'Program')
	assert.deepEqual(feedbacks, ['recording', 'streaming', 'tracking', 'tally_PGM', 'tally_PVW'])
	self.config.interval = 1
	self.startPolling()
	assert.ok(self.interval)
	await self.destroy()
	assert.equal(self.interval, undefined)
})
