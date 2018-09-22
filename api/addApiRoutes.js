function AddApiRoutes(app) {
	app.use(require('./index.js'));
}

module.exports = function(app) {
	return new AddApiRoutes(app);
};
