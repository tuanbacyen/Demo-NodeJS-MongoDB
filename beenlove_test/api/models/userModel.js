'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var userSchema = new Schema({
    userid: {
        type: Number,
        unique: true,
        required: true
    },
    coupleid: String,
    username: {
        type: String,
        Required: 'Username is empty'
    },
    pass: {
        type: String,
        Required: 'Password is empty'
    },
    nickname: String,
    birth: Date,
    gender: {
        type: Number, // 0: female, 1: male
        default: [0]
    },
    phone: String,
    ip: String,
    emoticon: String,
    avarta: String,
    devicetoken: String
}, {
    versionKey: false
});

userSchema.plugin(mongoosePaginate);

userSchema.statics.findIds = function(coupleid, callback) {
    this.findOne({ 'coupleid': coupleid }) // 'this' now refers to the Member class
        .exec(function(err, model) {
            callback(err, model);
        });
}

userSchema.statics.findDeviceToken = function(userid, callback) {
    this.findOne({'userid': userid}) // 'this' now refers to the Member class
        .exec(function(err, model) {
            if (model == null) {
                callback(err, '');
            } else {
                var devicetoken = (typeof model.devicetoken !== 'undefined') ? model.devicetoken : '';
                callback(err, devicetoken);
            }
        });
}

userSchema.statics.findIdMax = function(callback) {
    this.findOne({}) // 'this' now refers to the Member class
        .sort('-userid')
        .exec(function(err, model) {
            if (model == null) {
                callback(err, 1);
            } else {
                var idMax = (typeof model.userid !== 'undefined') ? model.userid : 0;
                callback(err, idMax + 1);
            }
        });
}

module.exports = mongoose.model('Users', userSchema);

var gender_female = 'default_woman.png';
var gender_male = 'default_man.png';

module.exports = {
    field_json: function() {
        return ['userid', 'coupleid', 'username', 'nickname', 'birth', 'gender', 'phone', 'ip', 'emoticon', 'avarta', 'devicetoken'];
    },

    castModel: function(model, domain = null) {
        if (model == null) { return null; }

        var new_model = {};
        var props = this.field_json();
        var utils = require('../manages/utils');

        for (var j = 0; j < props.length; j++) {
            new_model[props[j]] = "";
            if (typeof model[props[j]] !== 'undefined') {
                new_model[props[j]] = model[props[j]];
            }

            if (props[j] === 'emoticon') {
                new_model[props[j]] = utils.emojiURL(new_model[props[j]], domain);
            }

            if (props[j] === 'avarta') {
                new_model[props[j]] = utils.avartaURL(new_model[props[j]], domain);

                if (new_model[props[j]] == null) {
                    if (model['gender'] == 0) {
                        new_model[props[j]] = utils.avartaURL(gender_female, domain);
                    }
                    else if (model['gender'] == 1) {
                        new_model[props[j]] = utils.avartaURL(gender_male, domain);
                    }
                }

                new_model.avatar = new_model[props[j]];
                delete new_model[props[j]];
            }
        }

        return new_model;
    },

    castSearchModel: function(model, domain = null) {
        if (model == null) { return null; }
        
        var new_model = {};
        var props = ['userid', 'username', 'nickname', 'avarta', 'state'];
        var utils = require('../manages/utils');

        for (var j = 0; j < props.length; j++) {
            new_model[props[j]] = "";
            if (typeof model[props[j]] !== 'undefined') {
                new_model[props[j]] = model[props[j]];
            }

            if (props[j] === 'emoticon') {
                new_model[props[j]] = utils.emojiURL(new_model[props[j]], domain);
            }

            if (props[j] === 'avarta') {
                new_model[props[j]] = utils.avartaURL(new_model[props[j]], domain);

                if (new_model[props[j]] == null) {
                    if (model['gender'] == 0) {
                        new_model[props[j]] = utils.avartaURL(gender_female, domain);
                    }
                    else if (model['gender'] == 1) {
                        new_model[props[j]] = utils.avartaURL(gender_male, domain);
                    }
                }

                new_model.avatar = new_model[props[j]];
                delete new_model[props[j]];
            }
        }
        return new_model;
    }
}