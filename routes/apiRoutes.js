//Dependencies
var NodeGeocoder = require("node-geocoder");
var request = require("request");

var options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyBDBQQzdDurAqr7Ve-KKpKTrdVKb5oDO7s',   
};
 
var geocoder = NodeGeocoder(options);


//Routes to export
module.exports = function(app){
	//API routes
	/*app.post("/api/friends", function(req, res){
		var newFriend = req.body;
		res.json(friends.findFriend(newFriend));
	});*/
	var geocoder = NodeGeocoder(options);

	app.get("/api/map", function(req, res){
		var userAddress = "14880 Swallow Ct Woodbridge VA 22193";
		var response = {};
		var lat;
		var long;
		geocoder.geocode(userAddress, function(err, data){
			lat = data[0].latitude;
			long = data[0].longitude;
			response = {
				address: userAddress,
				geocode: [lat, long],
			};
			res.json(response);
		});
	});

	app.get("/api/polls", function(req, res){
		var userAddress = "14880 Swallow Ct Woodbridge VA 22193";
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
				lat = data[0].latitude;
				long = data[0].longitude;
				pollInfo.address.geo = [lat, long];
				res.json(pollInfo);
			});
		});
	});

};//End module exports