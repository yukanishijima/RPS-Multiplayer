//firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAkdU7gjm_pXv1AkrKxrQ-Ff9Rfzh9w47E",
  authDomain: "rps-multiplayer-a96a7.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-a96a7.firebaseio.com",
  projectId: "rps-multiplayer-a96a7",
  storageBucket: "rps-multiplayer-a96a7.appspot.com",
  messagingSenderId: "231341482264",
  appId: "1:231341482264:web:450d060ef9f86b71"
};
//initialize firebase
firebase.initializeApp(firebaseConfig);

//reference the database
var db = firebase.database();

//initial values
var player = "";
var playersRef = db.ref("/players");
var player1Ref = db.ref("/players/player1");
var player2Ref = db.ref("/players/player2");


$("#submit-name").on("click", function (event) {
  event.preventDefault();

  //runs only when there's a value 
  if ($("#player-name").val().length !== 0) {
    player = $("#player-name").val().trim();

    playersRef.once("value", function (snapshot) {

      //if player1 doesn't exist, assign as player 1
      if (!snapshot.child("player1").exists()) {
        player1Ref.set({
          player1Name: player
        });
        $("#game-message").html("Welcome " + player + "! You're Player 1!");
        $("#start").hide();
        player1Ref.onDisconnect().remove();

        console.log(snapshot);
        console.log(snapshot.child("player1").val());  //why null?
        console.log(snapshot.child("player1").val().player1Name);  //why not working?

        //if player1 exists, assign as player 2
      } else if (!snapshot.child("player2").exists()) {
        player2Ref.set({
          player2Name: player
        });
        $("#game-message").html("Welcome " + player + "! You're Player 2!");
        $("#start").hide();
        player2Ref.onDisconnect().remove();

        // if both player 1 and 2 exist, display the message
      } else {
        $("#start").html("Sorry, the game is full!");
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
});

//display player1's name
player1Ref.on("value", function (snapshot) {
  if (snapshot.val() !== null) {
    var name = snapshot.val().player1Name;
    $("#player1-name").html(name);
    $("#msg-display").append("<p>" + name + " joined the game!</p>");
  } else if (snapshot.val() === null) {
    //if player 1 leaves the game
    console.log("no player 1!");
    $("#player1-name").html("<p>Waiting for Player 1 to join!</p>");
  }
});

//display player2's name
player2Ref.on("value", function (snapshot) {
  if (snapshot.val() !== null) {
    var name = snapshot.val().player2Name;
    $("#player2-name").html(name);
    $("#msg-display").append("<p>" + name + " joined the game!</p>");
  } else if (snapshot.val() === null) {
    //if player 2 leaves the game
    console.log("no player 2!");
    $("#player2-name").html("<p>Waiting for Player 2 to join!</p>");
  }
});
