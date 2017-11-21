//Dependencies
var geocoder = require("geocoder");
var request = require("request");
var userAddress = "14880 Swallow Ct Woodbridge VA 22193";

//Routes to export
module.exports = function(app){
	//API routes
	app.post("/api/friends", function(req, res){
		var newFriend = req.body;
		res.json(friends.findFriend(newFriend));
	});

	app.get("/api/map", function(req, res){
		var response = {};
		var lat;
		var long;
		geocoder.geocode(userAddress, function(err, data){
			console.log(err);
			lat = data.results[0].geometry.location.lat;
			long = data.results[0].geometry.location.lng;
			response = {
				address: userAddress,
				geocode: [lat, long],
			};
			res.json(response);
		});
	});

	app.get("/api/polls", function(req, res){
		userAddress = userAddress.replace(/ /g, '+');
		var apiKey = "AIzaSyBDBQQzdDurAqr7Ve-KKpKTrdVKb5oDO7s";
		var url = "https://www.googleapis.com/civicinfo/v2/voterinfo?address="+ userAddress +"&electionId=2000&returnAllAvailableData=true&key=" + apiKey;
		request(url, function(err, resp, body){
			body = JSON.parse(body);
			var pollInfo = body.pollingLocations[0];
			var lat;
			var long;
			var addString = pollInfo.address.line1 + " " + pollInfo.address.city + " " + pollInfo.address.state + " " + pollInfo.address.zip;
			geocoder.geocode(addString, function(err, data){
				lat = data.results[0].geometry.location.lat;
				long = data.results[0].geometry.location.lng;
				pollInfo.address.geo = [lat, long];
				res.json(pollInfo);
			});
		});
	});

};