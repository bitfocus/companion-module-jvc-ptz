let tcp           = require('../../tcp');
let instance_skel = require('../../instance_skel');
let actions       = require('./actions');

let debug;
let log;
let sessionID = null;

class instance extends instance_skel {

	constructor(system,id,config) {
		super(system,id,config)

		Object.assign(this, {...actions})

		this.actions()
	}

	actions(system) {
		this.setActions(this.getActions());
	}

	init_tcp() {
		var host = this.config.host;
		var port = this.config.port;

		if (this.config.host !== undefined) {
			this.tcp = new tcp(host, port);

			this.tcp.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.tcp.on('error', (err) => {
				debug("Network error", err);
				this.log('error',"Network error: " + err.message);
			});

			this.tcp.on('connect', () => {
				debug("Connected");
				this.authenticationCamera()
			});

			this.tcp.on('data', (data) => {
				console.log(data);
				if(data.match(/Unauthorized/)) { // response to request
					let nonce = data.slice(data.find('nonce=')+7, data.find('blabla'))
					this.tcp.send(`GET /api.php HTTP/1.1\r\nHost: ${this.config.host}\r\nUser-Agent: Mozilla/5.0 (Windows NT 5.1; rv:27.0) Gecko/20100101 Firefox/27.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: ja,en-us;q=0.7,en;q=0.3\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\nAuthorization: Digest username="${this.config.username}", realm="GY-HM650",nonce="${nonce}", uri="/api.php",response="0f4d23f739a0e9fa3b78b826b33edaf8",qop=auth, nc=00000001,cnonce="ee16206547e4dd0e"\r\n\r\n`)
				} else if (data.match(/302 Found/)) { // here comes session ID
					sessionID = data.slice(data.find('SessionID='),data.find('SessionID=')+1234)
				}
			})
		}
	}

	authenticationCamera() {
		if (this.tcp !== undefined) {
			this.tcp.send(`GET /api.php HTTP/1.1\r\nHost: ${this.config.host}\r\nUser-Agent: Mozilla/5.0 (Windows NT 5.1; rv:27.0) Gecko/20100101 Firefox/27.0\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nAccept-Language: ja,en-us;q=0.7,en;q=0.3\r\nAccept-Encoding: gzip, deflate\r\nConnection: keep-alive\r\n\r\n`);
		} else {
			debug('Socket not connected. ProTally may not be active at the destination host/port.');
		}

	}

	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module for the JVC PTZ cameras.'
			},
			{
				type: 'textinput',
				id: 'host',
				width: 6,
				label: 'Target IP Address',
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: '80',
				width: 5,
				regex: self.REGEX_PORT
			}
		]
	}

	action(action) {
		let id = action.action;
		let cmd;
		let opt = action.options;
		let jvcPTZObj = {}

		switch (id){
			case 'systemInfo':
					jvcPTZObj.Request = {"Command":"GetSystemInfo"},{"SessionID":sessionID}
					break
		}

		//send the object
		if (jvcPTZObj.Request !== undefined) {
			if (this.tcp !== undefined) {
				console.log(JSON.stringify(jvcPTZObj));
				console.log(jvcPTZObj);
				this.tcp.send(JSON.stringify(jvcPTZObj));
			} else {
				debug('Socket not connected. PTZ may not be active at the destination host/port.');
			}
		}

	}

	destroy() {
		debug("destroy", this.id);
	}

	init() {
		debug = this.debug;
		log = this.log;

		//this.init_variables()
		this.init_tcp()
	}

	updateConfig(config) {

		this.config = config

		this.actions()

	}

	init_variables() {

		var variables = [
			{ name: 'dynamic1', label: 'dynamic variable' },
			// { name: 'dynamic2', label: 'dynamic var2' },
		]

		this.setVariableDefinitions(variables)

	}

}

exports = module.exports = instance;
