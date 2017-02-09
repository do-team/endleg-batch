var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {

AWS.config.update({
  region: "eu-central-1",
  endpoint: "dynamodb.eu-central-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "endleg-main";
var column = "fightflag";
var flag = 1;

// Read all ready-to-fight users

var params = {
    TableName: table,                       /* The DynamoDB table to connect to */
    ProjectionExpression: column,           /* The column(s) we want to be returned */
    FilterExpression: "fight = :vlajka",    /* Search term; in this case return rows whose Ansi column value equals 'fight' */
    ExpressionAttributeValues: {
         ":vlajka": flag                     /* Search value 'fight' substituted into the search term where :vlajka is found */
    }
};

console.log("Scanning main table.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all fight wanting users
        console.log("Scan succeeded.");
        data.Items.forEach(function(data) {
           console.log(
                data.user + ": ",
                data.fightflag);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}



};