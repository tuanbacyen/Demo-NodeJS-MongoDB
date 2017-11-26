// define variable
var express = require('express'),
 	path = require('path'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    aniversarry = require('./api/models/aniversarryModel'),
    chatbox = require('./api/models/chatboxModel'),
    coverImage = require('./api/models/coverImageModel'),
    event = require('./api/models/eventModel'),
    gallery = require('./api/models/galleryModel'),
    requestLove = require('./api/models/requestLoveModel'),
    user = require('./api/models/userModel'),
    notification = require('./api/models/notificationModel'),
    bodyParser = require('body-parser');

// mongodb
mongoose.Promise = global.Promise;

var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

// var options = {
//     useMongoClient: true
// };

mongoose.connect('mongodb://localhost/beenlove_test', options);

// config body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// config path access files/images
var utils = require('./api/manages/utils');
utils.initServer();

app.use(utils.avartaUpload().prefix, express.static(path.join(__dirname, utils.avartaUpload().path)))
app.use(utils.galleryUpload().prefix, express.static(path.join(__dirname, utils.galleryUpload().path)))
app.use(utils.coverImageUpload().prefix, express.static(path.join(__dirname, utils.coverImageUpload().path)))
app.use(utils.backgroundUpload().prefix, express.static(path.join(__dirname, utils.backgroundUpload().path)))
app.use(utils.emojiUpload().prefix, express.static(path.join(__dirname, utils.emojiUpload().path)))

// route
var routes = require('./api/routes/routes');
routes(app);

app.use(function(req, res) {
    res.status(404).send({
        url: req.originalUrl + ' not found'
    })
});

// port
app.listen(port);

// notice server running
console.log('BeenLove RESTful API server started on: ' + port);