var express = require('express');

var app = express();

app.get('/', function (req, res) {
    res.json("Here's the deal bran.");
});

app.get('/health', function (req, res) {
    res.json('Ok');
});

app.listen(3000, function (err) {
    if (err) throw err;
    console.log('Server is running on port 3000');
});
