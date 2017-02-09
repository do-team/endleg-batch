var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {

AWS.config.update({
  region: "eu-central-1",
  endpoint: "dynamodb.eu-central-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "endleg-main";
var flag = 1;

var params = {
    TableName:table,
    Key:{
        "fightflag": flag
    }
};

// Read all ready-to-fight users

console.log("Reading fighting participants...");
docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 0));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 0));
    }
});

};