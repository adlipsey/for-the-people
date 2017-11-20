//Dependencies
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

//Set up Express
var app = express();
var PORT = process.env.PORT || 3000;

//Set up bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Link external route files
require("./app/routing/apiRoutes.js")(app);
require("./app/routing/htmlRoutes.js")(app);

//Console log listener @ PORT
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});