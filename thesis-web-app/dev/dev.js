const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const Record = require('../models/record');
const fs = require('fs');
const path = require('path');

const allFilesSync = (dir, fileList = []) => {
	fs.readdirSync(dir).forEach((file) => {
		const filePath = path.join(dir, file);

		fileList.push(fs.statSync(filePath).isDirectory() ? { [file]: allFilesSync(filePath) } : file);
	});
	return fileList;
};

router.get('/reset', async function (req, res) {
	console.log(`Dev - Reset`);

	const readyState = Account.db.readyState;

	// readyState = 1, if connected to database
	if (readyState === 1) {
		const accRes = await Account.deleteMany({});
		console.log(`Dev - Reset - Removed ${accRes.deletedCount} Accounts`);

		const recRes = await Record.deleteMany({});
		console.log(`Dev - Reset - Removed ${recRes.deletedCount} Records`);
	}

	var tmpPath = path.resolve(__dirname, '../tmp');
	var deletedFiles = 'None';

	if (fs.existsSync(tmpPath)) {
		var deletedFiles = allFilesSync(tmpPath);
		fs.rmdirSync(tmpPath, { recursive: true });
	}

	res.json({
		Messsage: 'All these files and directories are deleted',
		deletedFiles,
	});
});

module.exports = router;
