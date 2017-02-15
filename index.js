var AWS = require("aws-sdk");
var nJwt = require('njwt');

exports.handler = (event, context, callback) => {

console.log('Request Headers:', event.headers);
var zkouska = event.headers;
var token = zkouska.sectoken;
console.log('token: ', token);
nJwt.verify(token, "secret", 'HS512');

AWS.config.update({
  region: "eu-central-1",
  endpoint: "dynamodb.eu-central-1.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();
console.log("Tohle je v contextu: ", context);
var incoming = event;
console.log("Tohle je v eventu: ", incoming);

// Params validation goes here - to check, if user is not sending cards out of range.
var params = {
        TableName: "endleg-main",
        Item: {
            "user": incoming.user,
            "name": incoming.name,
            "card1": incoming.card1,
            "card2": incoming.card2,
            "card3": incoming.card3,
            "card4": incoming.card4,
            "card5": incoming.card5,
            "fightflag": 1
        }
    };

var docClient = new AWS.DynamoDB.DocumentClient();

docClient.put(params, function(err, data) {
       if (err) {
           console.log(err);
           console.error("Unable to add new items from user ", incoming.user, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("Request by user", incoming.user, " was successfully added.");
       }
    });

};