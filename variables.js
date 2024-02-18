module.exports = async function (self) {

    let variableDefinitions = [
        { variableId: 'model',name: 'Camera Model' },
        { variableId: 'serial', name: 'Camera Serial Number' },
        { variableId: 'pan', name: 'Pan Value of Camera' },
        { variableId: 'tilt', name: 'Tilt Value of Camera' },
    ]

	self.setVariableDefinitions(variableDefinitions)
}