// Initialize Firebase
var config = {
  apiKey: "AIzaSyBB_W09v1DGSbOLrgfw24dONdiQG7ZS3sc",
  authDomain: "seanmahurst.firebaseapp.com",
  databaseURL: "https://seanmahurst.firebaseio.com",
  projectId: "seanmahurst",
  storageBucket: "seanmahurst.appspot.com",
  messagingSenderId: "969031865743"
};
firebase.initializeApp(config);


function saveToFirebase(highScore) {

  firebase.database().ref('high-scores').push().set(highScore)
    .then(function (snapshot) {
      console.log(highScore);

    }, function (error) {
      console.log('error' + error);
      error(); // some error method
    });
}

function getScores() {
  firebase.database().ref("high-scores").orderByChild('value').limitToLast(25).on('value', function (snapshot) {
    scoreList = snapshotToArray(snapshot);
    lowestScore = scoreList[0].value;
    listScores();
  });
}

function snapshotToArray(snapshot) {
  var returnArr = [];

  snapshot.forEach(function (childSnapshot) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
};

function listScores() {
  var body = document.getElementById("scoreBoard");

  var maxRows = scoreList.length > 28 ? 28 : scoreList.length - 1;

  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");

  // creating all cells
  for (var i = 0; i < maxRows; i++) {

    // creates a table rowmfw the 
    var row = document.createElement("tr");

    for (var j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");

      if (j == 0) {
        var cellText = document.createTextNode(scoreList[maxRows - i].name.toString() + ": ");
      }
      if (j == 1) {
        var cellText = document.createTextNode(scoreList[maxRows - i].value.toString());
      }
      cell.appendChild(cellText);
      row.appendChild(cell);
      row.setAttribute("title", scoreList[maxRows - i].name);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 0;
  tbl.setAttribute("border", "0");

}
getScores();