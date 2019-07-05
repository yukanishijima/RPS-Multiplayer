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
// var connectedRef = db.ref(".info/connected");
var playersRef = db.ref("/players");
var player1Ref = db.ref("/players/player1");
var player2Ref = db.ref("/players/player2");
var chatRef = db.ref("/chat");
var player1 = false;
var player2 = false;

var selected1 = false;
var selected2 = false;

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
          losses: 0
        });
        chatRef.push({
          name: "admin",
          message: player + " joined the game!"
        });
        $("#game-message").html("Welcome " + player + "! You're Player 1!");
        $("#start").hide();

        console.log(snapshot);
        console.log(snapshot.val()); // null?

        //if player1 exists, assign as player 2
      } else if (!snapshot.child("player2").exists()) {
        player2Ref.onDisconnect().remove();
        player2Ref.set({
          playerName: player,
          wins: 0,
          losses: 0
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

  // when no player 1 
  if (snapshot.val() === null) {
    console.log("no player 1!");
    $("#player1-name").html("<p>Waiting for Player 1 to join!</p>");
    $("#player1-score").empty();
    player1 = false;

    //when player 1 joins
  } else if (snapshot.val() !== null) {
    var name = snapshot.child("playerName").val();
    var wins = snapshot.child("wins").val();
    var losses = snapshot.child("losses").val();

    $("#player1-name").html(name);
    $("#player1-score").html($("<p>wins: " + wins + "</p>")).append($("<p>losses: " + losses + "</p>"));
    player1 = true;
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// display player2's name on any page
player2Ref.on("value", function (snapshot) {

  // when no player 2
  if (snapshot.val() === null) {
    console.log("no player 2!");
    $("#player2-name").html("<p>Waiting for Player 2 to join!</p>");
    $("#player2-score").empty();
    player2 = false;

    //when player 2 joins
  } else if (snapshot.val() !== null) {
    var name = snapshot.child("playerName").val();
    var wins = snapshot.child("wins").val();
    var losses = snapshot.child("losses").val();

    $("#player2-name").html(name);
    $("#player2-score").html($("<p>wins: " + wins + "</p>")).append($("<p>losses: " + losses + "</p>"));
    player2 = true;
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//when player leaves the game --------------------------------------------
playersRef.on("child_removed", function (snapshot) {
  chatRef.push({
    name: "admin",
    message: snapshot.val().playerName + " has left the game!"
  });
  console.log("someone has left the game!");
  $("#game-message").empty();
  $("#player1-choices").empty();
  $("#player2-choices").empty();
  selected1 = false;
  selected2 = false;

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


//chat function --------------------------------------------------------
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
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//display choices --------------------------------------------------------
playersRef.on("value", function (snapshot) {
  var player1Name = snapshot.child("player1/playerName").val();
  var player2Name = snapshot.child("player2/playerName").val();

  //if both players are present
  if (player1 && player2 && !selected1 && !selected2) {
    console.log("Both players are ready for the game!");
    console.log(player);
    console.log("player1Name: " + player1Name);
    console.log("player2Name: " + player2Name);

    //display choices for player 1
    if (player === player1Name) {

      setTimeout(function () {
        $("#player1-choices").html($("<button>Rock</button><button>Paper</button><button>Scissors</button>"));
        $("#player2-choices").html($("<p>Waiting for " + player2Name + " to select!</p>"));
        $("#game-message").html("It's your turn!");

        $("button").on("click", function () {
          selected1 = true;
          $("#player1-choices").html("<p class='choice'>" + $(this).text() + "</p>");
          player1Ref.update({
            choice: $(this).text()
          });
        });
      }, 2000);

      //display choices for player 2
    }

    if (player === player2Name) {

      setTimeout(function () {
        $("#player2-choices").html($("<button>Rock</button><button>Paper</button><button>Scissors</button>"));
        $("#player1-choices").html($("<p>Waiting for " + player1Name + " to select!</p>"));
        $("#game-message").html("It's your turn!");

        $("button").on("click", function () {
          selected2 = true;
          $("#player2-choices").html("<p class='choice'>" + $(this).text() + "</p>");
          player2Ref.update({
            choice: $(this).text()
          });
        });
      }, 2000);
    }
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//show result -------------------------------------------------------------
var player1Choice;
var player2Choice;
var player1Wins;
var player1Losses;
var player2Wins;
var player2Losses;

playersRef.on("value", function (snapshot) {
  player1Choice = snapshot.child("player1/choice").val();
  player2Choice = snapshot.child("player2/choice").val();

  //when both player select a choice
  if (player1Choice !== null && player2Choice !== null) {
    showResult();
    console.log("let's see the result!");
  }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

function showResult() {
  console.log(player1Choice);
  console.log(player2Choice);

  if (player1Choice === player2Choice) {
    console.log("Tie!");
    $("#game-message").html("Tie!");
  } else if (player1Choice === "Rock" && player2Choice === "Paper") {
    $("#game-message").html("Player 2 won!");
  } else if (player1Choice === "Rock" && player2Choice === "Scissors") {
    $("#game-message").html("Player 1 won!");
  } else if (player1Choice === "Paper" && player2Choice === "Rock") {
    $("#game-message").html("Player 1 won!");
  } else if (player1Choice === "Paper" && player2Choice === "Scissors") {
    $("#game-message").html("Player 2 won!");
  } else if (player1Choice === "Scissors" && player2Choice === "Rock") {
    $("#game-message").html("Player 2 won!");
  } else if (player1Choice === "Scissors" && player2Choice === "Paper") {
    $("#game-message").html("Player 1 won!");
  }

  $("#player1-choices").html("<p class='choice'>" + player1Choice + "</p>");
  $("#player2-choices").html("<p class='choice'>" + player2Choice + "</p>");
}



