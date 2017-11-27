/*
firebase.auth().onAuthStateChanged( user => {
    if (user) {
        // If user state changes and 'user' exists, check Firebase Database for user
        const userReference = db.ref(`users/${user.uid}`);
        userReference.once('value', snapshot => {
            if (!snapshot.val()) {
                // User does not exist, create user entry
                userReference.set({
                    email: user.email,
                    displayName: user.displayName
                });
            }
        });
    }
});*/

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
app.use(express.static(path.join(__dirname, '/public')));

//Link external route files
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

//Console log listener @ PORT
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});