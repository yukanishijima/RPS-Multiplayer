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
var connectedRef = db.ref(".info/connected");
var playersRef = db.ref("/players");
var player1Ref = db.ref("/players/player1");
var player2Ref = db.ref("/players/player2");
var chatRef = db.ref("/chat");
var playerNum = 0;


//when someone clicks "start" button, display on his page
$("#submit-name").on("click", function (event) {
  event.preventDefault();

  //runs only when there's a value 
  if ($("#player-name").val().length !== 0) {

    //get user input
    player = $("#player-name").val().trim();

    playersRef.once("value", function (snapshot) {

      // if player1 doesn't exist, assign as player 1
      if (!snapshot.child("player1").exists()) {
        player1Ref.onDisconnect().remove();
        player1Ref.set({
          playerName: player,
          wins: 0,
          loses: 0
        });
        chatRef.push({
          name: "admin",
          message: player + " joined the game!"
        });
        $("#game-message").html("Welcome " + player + "! You're Player 1!");
        $("#start").hide();

        console.log(snapshot);
        console.log(snapshot.val()); //why null?
        console.log(snapshot.child("player1").val());  //why null?

        //if player1 exists, assign as player 2
      } else if (!snapshot.child("player2").exists()) {
        player2Ref.onDisconnect().remove();
        player2Ref.set({
          name: player,
          wins: 0,
          loses: 0
        });
        chatRef.push({
          name: "admin",
          message: player + " joined the game!"
        });
        $("#game-message").html("Welcome " + player + "! You're Player 2!");
        $("#start").hide();

        // if both player 1 and 2 exist, display the message
      } else {
        $("#start").html("Sorry, the game is full!");
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
});

// display player1's name on any page
player1Ref.on("value", function (snapshot) {
  // when no player 1 or player 1 leaves the game
  if (snapshot.val() === null) {
    $("#player1-name").html("<p>Waiting for Player 1 to join!</p>");
    console.log("no player 1!");
  } else if (snapshot.val() !== null) {
    //when player 1 joins
    var name = snapshot.child("name").val();
    $("#player1-name").html(name);
    playerNum = 1;
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// display player2's name on any page
player2Ref.on("value", function (snapshot) {
  // when no player 2 or player 2 leaves the game
  if (snapshot.val() === null) {
    $("#player2-name").html("<p>Waiting for Player 1 to join!</p>");
    console.log("no player 2!");
  } else if (snapshot.val() !== null) {
    //when player 2 joins
    var name = snapshot.child("name").val();
    $("#player2-name").html(name);
    playerNum = 2;
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//when player leaves the game
playersRef.on("child_removed", function (snapshot) {
  chatRef.push({
    name: "admin",
    message: snapshot.val().playerName + " has left the game!"
  });
});

//chat function
$("#submit-msg").on("click", function (event) {
  event.preventDefault();

  //runs only when there's a value 
  if ($("#player-msg").val().length !== 0) {

    console.log(player);

    chatRef.once("value", function () {
      chatRef.push({
        name: player,
        message: $("#player-msg").val().trim()
      });
    });
    //remove user input after pushing into database
    $("#player-msg").val("");
  }
});

chatRef.on("child_added", function (snapshot) {
  var message = $("<p>").html(snapshot.child("message").val());
  $("#msg-display").prepend(message);
});



