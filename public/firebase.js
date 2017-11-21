$(document).ready( function(){
    var config = {
    apiKey: "AIzaSyBccUXvwfVVLNXMDQOnNck5M5V-JKHqE2A",
    authDomain: "project-2-45594.firebaseapp.com",
    databaseURL: "https://project-2-45594.firebaseio.com",
    projectId: "project-2-45594",
    storageBucket: "",
    messagingSenderId: "921855878944"
    };
    firebase.initializeApp(config);

  //Begin index.html firebase code
  //Begin user login configuration
      // FirebaseUI config.
      var uiConfig = {
        signInSuccessUrl: 'main.html',
        signInOptions: [
          

          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
      };
      

      // Initialize the FirebaseUI Widget using Firebase.
      
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      

      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);

      //jQuery grab elements by ID
      const btnSignOut = $("#btnSignOut");

      //Database references
      const dbRefRoot = firebase.database().ref();
      var dbRefUser;

      //Function create user *Take a look at this*
      const createUser = function (userID, userName, email){
        console.log(userID, userName, email);
        dbRefRoot.child(userID).set({"user":{"name": userName, "email": email}}); 
      }

      //onAuthStateChanged listens for state to change to either logged in or logged out
      firebase.auth().onAuthStateChanged( function(currentUser){
        
        //If user is successfully logged in, currentUser is true, otherwise is null
        if(currentUser){
          console.log(currentUser.uid); 

          //Logs userID to confirm login status, remove before deploy
          btnSignOut.css("visibility", "visible"); //Sets logout button to visible
          

          //Takes snapshot of dbRoot
          dbRefRoot.once('value', function(snapshot) {
            

            //If root has a node with the current user's ID, confirms existance in DB
            if (snapshot.hasChild(currentUser.uid)) {
              console.log("User exists in DB");
            }
            

            //If not, runs createUser which adds their user data to the database
            else {
              console.log("This user does not exist in the DB yet")
              createUser(currentUser.uid, currentUser.displayName, currentUser.email);
            }
          });
        }
        else {
          console.log("Not logged in"); 

          //Use to confirm logout in development
          btnSignOut.css("visibility", "hidden"); 

          //Hides logout button when not logged in
        }
      });

      //onClick event for Logout button
      btnSignOut.on("click", function(){
        firebase.auth().signOut();
      });
      //End index.html firebase code

});//End of document.ready