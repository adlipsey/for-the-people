//Dependencies
var geocoder = require("geocoder");

//Routes to export
module.exports = function(app){
	//API routes
	app.post("/api/friends", function(req, res){
		var newFriend = req.body;
		res.json(friends.findFriend(newFriend));
	});

	app.get("/api/map", function(req, res){
		var userAddress = "14880 Swallow Ct Woodbridge VA 22193";
		var response = {};
		var lat;
		var long;
		geocoder.geocode(userAddress, function(err, data){
			lat = data.results[0].geometry.location.lat;
			long = data.results[0].geometry.location.lng;
			response = {
				address: userAddress,
				geocode: [lat, long],
			};
			res.json(response);
		});
	});

};