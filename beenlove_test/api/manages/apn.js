'use strict';

// var apn = require('apn');
// var options = {
//     token: {
//         key: "path/to/APNsAuthKey_XXXXXXXXXX.p8",
//         keyId: "key-id",
//         teamId: "developer-team-id"
//     },
//     production: false
// };

// var apnProvider = new apn.Provider(options);

module.exports = {
    sendPush: function(deviceToken, alert, payload) {
        // var note = new apn.Notification();

        // // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        // // note.badge = 3;
        // // note.sound = "ping.aiff";
        // note.alert = alert;
        // note.payload = payload;
        // //note.topic = "<your-app-bundle-id>";

        // apnProvider.send(note, deviceToken).then((result) => {
        //     console.log(result);
        // });
    },

    testPush: function() {
    	this.sendPush("", "\uD83D\uDCE7 \u2709 You have a new message", {'messageFrom': 'John Appleseed'});
    }
}