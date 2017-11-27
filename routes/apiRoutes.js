//Dependencies
var NodeGeocoder = require("node-geocoder");
var request = require("request");

var geoOptions = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyBDBQQzdDurAqr7Ve-KKpKTrdVKb5oDO7s',   
};

var reqOptions = {
	headers: {
		"X-API-Key": "JcaPVmchRmzfYAdk2zs8gxOSDiVedhOF37VExFTX"
	}
};
 
var geocoder = NodeGeocoder(geoOptions);


//Routes to export
module.exports = function(app){
	//API routes
	/*app.post("/api/friends", function(req, res){
		var newFriend = req.body;
		res.json(friends.findFriend(newFriend));
	});*/

	var userAddress = "14880 Swallow Ct Woodbridge VA 22193";
	var googApiKey = "AIzaSyBDBQQzdDurAqr7Ve-KKpKTrdVKb5oDO7s";

	app.get("/api/map", function(req, res){
		//Replace with post request pulling address data from database
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
		userAddress = userAddress.replace(/ /g, '+');
		var url = "https://www.googleapis.com/civicinfo/v2/voterinfo?address="+ userAddress +"&electionId=2000&returnAllAvailableData=true&key=" + googApiKey;
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

	app.post("/api/main", function(req, res){
		var userData = req.body;
		var url = "https://www.googleapis.com/civicinfo/v2/representatives?address="+ userData.address +"&electionId=2000&returnAllAvailableData=true&key=" + googApiKey;
		request(url, function(err, resp, body){
			body = JSON.parse(body);
			userData.posts = [];
			var post;
			body.offices.forEach(function(element){
				post = {};
				post.name = element.name;
				post.ppl = [];
				post.urls = [];
				element.officialIndices.forEach(function(ele){
					post.ppl.push(body.officials[ele].name);
					if(body.officials[ele].urls){
						post.urls.push(body.officials[ele].urls[0]);
					}
					else{
						post.urls.push("/home");
					}
				});
				userData.posts.push(post);
			});
			var getDistrict = userData.posts[3].name.split("-");
			userData.district = getDistrict[1];
			url = "https://www.googleapis.com/civicinfo/v2/elections?key="+ googApiKey;
			request(url, function(err, rsp, body){
				userData.elections = [];
				body = JSON.parse(body);
				console.log(JSON.stringify(body, null, 2));
				body.elections.forEach(function(elmnt){
					if(elmnt.ocdDivisionId === "ocd-division/country:us" || elmnt.ocdDivisionId === "ocd-division/country:us/state:"+ userData.state){
						userData.elections.push(elmnt);
					}
				});
				res.json(userData);
			});
		});

		

	});

	app.get("/api/rep", function(req, res){
		//Creates object for rep data to be stored and passed to front end
		var repData = {};
		//Replace member id at end of url with member id from post request
		reqOptions.url = "https://api.propublica.org/congress/v1/members/W000802.json";
		request(reqOptions, function(err, resp, body){
			body = JSON.parse(body);
			repData.memID = body.results[0].member_id;
			repData.ocd_id = body.results[0].roles[0].ocd_id;
			repData.title = body.results[0].roles[0].short_title;
			repData.name = body.results[0].first_name + " " + body.results[0].last_name;
			repData.state = body.results[0].roles[0].state;
			repData.party = body.results[0].roles[0].party;
			repData.office = body.results[0].roles[0].office;
			repData.phone = body.results[0].roles[0].phone;
			repData.twitter = body.results[0].twitter_account;
			repData.termEnd = body.results[0].roles[0].end_date;
			repData.committees = body.results[0].roles[0].committees;
			repData.missedVotes = body.results[0].roles[0].missed_votes_pct;
			repData.partyVotes = body.results[0].roles[0].votes_with_party_pct;
			reqOptions.url = "https://api.propublica.org/congress/v1/members/"+body.results[0].member_id+"/votes.json";
			request(reqOptions, function(eror, rsp, text){
				text = JSON.parse(text);
				repData.votes = text.results[0].votes;
				var url = "https://www.googleapis.com/civicinfo/v2/representatives?address="+userAddress+"&key="+googApiKey;
				request(url, function(error, rsp, content){
					if(error){
						console.log(error);
					}
					else{
						content = JSON.parse(content);
						for(var j = 0; j < content.officials.length; j++){
							if(content.officials[j].name === repData.name){
								repData.photo = content.officials[j].photoUrl;
								res.json(repData);
							}
						}
						repData.photo = "http://garykingwebdevelopment.com/images/placeholders/team-placeholder.jpg"
						res.json(repData);
					}
				});
			});
		});
	});

};//End module exports