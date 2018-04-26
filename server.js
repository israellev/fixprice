const express = require('express');
const app = express();
const port = process.env.PORT || '8080';
const serverURL = process.env.serverURL || "https://gentle-beyond-83301.herokuapp.com/parse";
console.log(serverURL);
const ejs = require('ejs');
app.set('view engine', 'ejs');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
app.use('/assets', express.static(__dirname + '/public'));

const mongo = require('./config/mongo.json');
let api = new ParseServer({
    databaseURI: 'mongodb://' + mongo.user + ':' + mongo.pwd + '@ds227865.mlab.com:27865/addressbook',
    // cloud: './cloud/main.js',
    appId: 'aregfdsgfsdzfgs',
    fileKey: 'sdfgrdsafvdzsv',
    masterKey: 'zsdfgfrsdfvfdzsgf',
});
app.use('/parse', api);

app.get('/', function (req, res) {
    res.render('index', { serverURL: serverURL });
    // res.sendfile(__dirname + '/public/index.html');
});

app.get('/cofix', function (req, res) {
    res.render('cofix', { serverURL: serverURL });
});
app.get('/cofizz', function (req, res) {
    res.render('cofizz', { serverURL: serverURL });
});

app.listen(port, () => console.log(`port: ${port}`));