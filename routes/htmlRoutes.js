var path = require("path");

//Routes to export
module.exports = function(app){
	//Routes to html
	app.get("/", function(req,res){
		res.sendFile(path.join(__dirname, "../public/login.html"));
	});

	app.get("/home", function(req, res){
		res.sendFile(path.join(__dirname, "../public/main.html"));
	});

	app.get("/rep", function(req, res){
		res.sendFile(path.join(__dirname, "../public/rep.html"));
	});

	app.get("/map", function(req, res){
		res.sendFile(path.join(__dirname, "../public/map.html"));
	});

	app.get("/bill", function(req, res){
		res.sendFile(path.join(__dirname, "../public/bill.html"));
	});

	app.get("*", function(req, res){
		res.sendFile(path.join(__dirname, "../public/login.html"));
	});

};