import Device from '../models/device-model.js';
import System from '../models/system-model.js';

export const createDeviceInSystem = async (req, res) => {
	const user = req.user;
	const { name, type_id, system_id, description, userAlias } = req.body;

	// Check requirred fields
	if (!name || !type_id || !system_id || !user) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const device = new Device(user.id, type_id, name, description, userAlias);

	try {
		await device.save();
		await device.getId();
		await System.addDeviceToSystem(system_id, device.id);
		res.status(201).json({ message: 'Device created successfully', device_id: device.id });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const createDeviceOutsideSystem = async (req, res) => {
	const user = req.user;
	const { name, type_id, description, userAlias } = req.body;

	// Check requirred fields
	if (!name || !type_id || !user) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const device = new Device(user.id, type_id, name, description, userAlias);

	try {
		await device.save();
		await device.getId();
		res.status(201).json({ message: 'Device created successfully', device_id: device.id });
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export const getMyDevices = async (req, res) => {
	const user = req.user;

	try {
		const devices = await Device.findByOwnerId(user.id);
		res.status(200).json(devices);
	} catch (error) {
		console.error('Error executing query:', error.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}