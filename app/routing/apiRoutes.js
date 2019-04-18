// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData = require("../data/friends");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
    //friendsData is the entire array of JSON objects that were prepopulated into the array and will be what we will compare the user's input to
    res.json(friendsData);    
  });



  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // req.body is available since we're using the body parsing middleware
    
    var match = {
        name: "",
        photo: "",
        difference: 1000
    };
    
    //userData is the input from the user's input form that holds all of the inputs from the DOM i.e. name, photo and answers to each question in value form
    var userData = req.body;
    //UserScore is more specifically the scores array that I created from the numerical values of each of the questions asked in the form
    var userScore = userData.scores;
    //var differenceArray = [];
    //Checking to see that the user's answers values were properly pushed to the array
    console.log(userScore);
    //Setting a variable that will hold the total difference score between the user's inputs and that of the of the pre-existing friends' inputs
    var scoreDifference = 0;
    //creating a for loop that will loop through each of the pre-existing friends in the JSON object array from friends.js
    for (var i = 0; i < friendsData.length; i++) {

        scoreDifference = 0;
        //creating a variable to specify into the scores array of each of the pre-existing friends from the friends.js json object array
        var friendScore = friendsData[i].scores;
        //checking to see that I properly pulled the friends' scores array from each of the JSON objects
        console.log(friendScore);

        //Creating a nested for loop inside to go through each of the indexes of the array of scores for each of the friends objects
        for (var j = 0; j < friendScore.length; j++) {
            //using the scoreDifference variable to concatenate the total absolute difference between the individual scores of each of the pre-existing friends with that of the user
            scoreDifference += Math.abs(friendScore[j] - userScore[j]);
            //Here I am checking the scoreDifference amount with the match object difference (defined above) to see if the scoreDifference is lower than the predefined amount
            if(scoreDifference <= match.difference) {
                //if the above is true, then the match object's property name will be updated to the respective name of the friend from the friend object that it matches with
                match.name = friendsData[i].name;
                //The same will be done to the photo of the friend
                match.photo = friendsData[i].photo;
                //This will set the difference score for each friend to the match.difference. as it goes through the array it is looking for the next smallest number that compares to the user's score.  It will continue to replace this value until the lowest difference is discovered and the loop will settle on that selected match
                match.difference = scoreDifference;
            } 
        }
        //This is to just console log the match object to see that everything is populated properly
        console.log(JSON.stringify(match));

    }

    //Pushing the request body to the friendsData response
    friendsData.push(userData);
    //Pushing the match object to the response JSON to be used when displaying the content in the survey.html modal
    res.json(match);
    friendsData.name = "";
    friendsData.photo = "";
    friendsData.scores = [];
    

  });

  app.post("/api/clear", function(req, res) {
    // Empty out the arrays of data
    friendsData.length = 0;

    res.json({ ok: true });
  });
};
