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

var params = {
    TableName : table,
    KeyConditionExpression: "#flag = :f",
    ExpressionAttributeNames:{
        "#flag": "fightflag"
    },
    ExpressionAttributeValues: {
        ":f":flag
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log(" -", item.year + ": " + item.title);
        });
    }
});



};