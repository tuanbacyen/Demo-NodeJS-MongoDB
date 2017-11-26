'use strict';

module.exports = function(app) {
	// user
	var user = require('../controllers/userController');
	app.route('/users').get(user.list);
	app.route('/login').post(user.login);
	app.route('/register').post(user.register);
	app.route('/searchuser').post(user.search);
	app.route('/userupdate').post(user.update);
	app.route('/userchangepass').post(user.changepass);	
	app.route('/userchangeavatar').post(user.changeAvarta);

	app.route('/userdelete').post(user.delete);
	app.route('/testpush').get(user.testpush);
	
	// notification
	var notification = require('../controllers/notificationController');
	app.route('/notifications').post(notification.list);
	app.route('/notificationdelete').post(notification.delete);

	// aniversarry
	var aniversarry = require('../controllers/aniversarryController');
	app.route('/aniversarry').post(aniversarry.list);
	app.route('/aniversarrydetail').post(aniversarry.detail);
	app.route('/aniversarrycreate').post(aniversarry.create);
	app.route('/aniversarryupdate').post(aniversarry.update);
	app.route('/aniversarrydelete').post(aniversarry.delete);
	app.route('/aniversarryadd').post(aniversarry.addGallery);
	app.route('/garellydelete').post(aniversarry.deleteGallery);
	
	// chatbox
	var chatbox = require('../controllers/chatboxController');
	app.route('/chatbox').post(chatbox.list);
	app.route('/chatSend').post(chatbox.send);

	// converimage
	var converimage = require('../controllers/coverImageController');
	app.route('/getconverimages').post(converimage.getconverimages);
	app.route('/getemojis').post(converimage.getemojis);

	// event
	var event = require('../controllers/eventController');
	app.route('/event').post(event.list);
	app.route('/eventcreate').post(event.create);
	app.route('/eventupdate').post(event.update);
	app.route('/eventdelete').post(event.delete);

	// gallery
	var gallery = require('../controllers/galleryController');

	// requestLove
	var requestLove = require('../controllers/requestLoveController');
	app.route('/requestlovecreate').post(requestLove.create);
	app.route('/requestloveaoc').post(requestLove.acceptORcancel);

};