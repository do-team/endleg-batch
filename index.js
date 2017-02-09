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
//    ProjectionExpression: column,           /* The column(s) we want to be returned - in case you want ONLY some columns - we want them all, full object! */
    FilterExpression: "fightflag = :flag",    /* Search term; in this case return rows whose Ansi column value equals 'fightflag' */
    ExpressionAttributeValues: {
         ":flag": flag                     /* Search value 'flag' substituted into the search term where :vlajka is found */
    }
};

console.log("Scanning main table.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all fight-wanting users
        console.log(data);
        console.log("Scan succeeded.");
        data.Items.forEach(function(data) {
           console.log(
                data.name + ": ",
                data.fightflag);
        });

        // continue scanning if we have more users, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}



};