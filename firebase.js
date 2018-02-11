// Initialize Firebase
var config = {
	apiKey: "AIzaSyA4TgtmM6_Gv8nU1P4Wk9Us3VQUVSH2YAc",
	authDomain: "seansnake-c1c38.firebaseapp.com",
	databaseURL: "https://seansnake-c1c38.firebaseio.com",
	projectId: "seansnake-c1c38",
	storageBucket: "",
	messagingSenderId: "79007695585"
	};
firebase.initializeApp(config);



function saveToFirebase(highScore) {
	
    firebase.database().ref('high-scores').push().set(highScore)
        .then(function(snapshot) {
            alert('success'); 
        }, function(error) {
            console.log('error' + error);
            error(); // some error method
        });
}

function getScores() {
	firebase.database().ref("high-scores").orderByChild('value').limitToLast(25).on('value', function(snapshot) {
		//console.log(snapshotToArray(snapshot));
		scoreList = snapshotToArray(snapshot);
		console.log(scoreList[23].name);
		listScores();
		});	
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

getScores();

function listScores(){

  var body = document.getElementsByTagName("P")[0];
 
  // creates a <table> element and a <tbody> element
  var tbl = document.createElement("table");
  var tblBody = document.createElement("tbody");
 
  // creating all cells
  for (var i = 0; i < 24; i++) {
    // creates a table row
    var row = document.createElement("tr");
 
    for (var j = 0; j < 2; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      
	  if (j == 0){var cellText = document.createTextNode(scoreList[24-i].name.toString() + ": ");}
	  if (j == 1){var cellText = document.createTextNode(scoreList[24-i].value.toString());}
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
 
    // add the row to the end of the table body
    tblBody.appendChild(row);
  }
 
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "0");

}


