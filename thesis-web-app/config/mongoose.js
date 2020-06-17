module.exports = {
	uris: `mongodb://localhost/${process.env.DB_NAME}`,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};
