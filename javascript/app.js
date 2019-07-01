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
var player1Name = "";
var player2Name = "";
var player1Choice = "";
var player2Choice = "";


$("#submit-name").on("click", function (event) {
  event.preventDefault();

  player = $("#player-name").val().trim();

  db.ref().once("value", function (snapshot) {

    //if player1 doesn't exist, assign as player 1
    if (!snapshot.child("player1").exists()) {
      db.ref("player1").set({
        player1Name: player
      });
      $("#player1-name").html(player);
      $("#game-message").html("Welcome " + player + "! You're Player 1!");
      $("#start").hide();

      //if player1 exists, assign as player 2
    } else if (!snapshot.child("player2").exists()) {
      db.ref("player2").set({
        player2Name: player
      });
      $("#player2-name").html(player);
      $("#game-message").html("Welcome " + player + "! You're Player 2!");
      $("#start").hide();

      // if both player 1 and 2 exist, display the message
    } else {
      $("#start").html("Sorry, the game is full!");
    }

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});


