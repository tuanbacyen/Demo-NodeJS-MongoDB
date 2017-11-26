'use strict';

var mongoose = require('mongoose'),
    Users = mongoose.model('Users'),
    RequestLoves = mongoose.model('RequestLoves');

var utils = require('../manages/utils');
var passwordHash = require('password-hash');
var validator = require('validator');

//--------------------------------------------------------------------------------
function userLogin(res, user, domain) {
    var userModel = require('../models/userModel');

    if (!utils.stringEmpty(user.coupleid)) {
        Users.find({
            $and: [
                { coupleid: user.coupleid },
                { userid: { $ne: user.userid } }
            ]
        }, function(err, userFind) {
            if (userFind.length > 0) {
                res.json({
                    status: 1,
                    message: 'Login success',
                    user: userModel.castModel(user, domain),
                    lover: userModel.castModel(userFind[0], domain),
                });
            } else {
                res.json({
                    status: 1,
                    message: 'Login success',
                    user: userModel.castModel(user, domain),
                    lover: null
                });
            }
        });
    } else {
        res.json({
            status: 1,
            message: 'Login success',
            user: userModel.castModel(user, domain),
            lover: null
        });
    }
}

//--------------------------------------------------------------------------------
exports.list = function(req, res) {
    Users.find({}, function(err, model) {
        if (err) {
            res.json({
                status: 4,
                message: err,
                result: null
            });
            return;
        }

        // remove _id field & ensure has enough key in Schema
        var userModel = require('../models/userModel');
        var result = new Array();
        for (var i = 0; i < model.length; i++) {
            var item = userModel.castModel(model[i], utils.hostURL(req));
            result.push(item);
        }
        res.json(result);
    });
};

exports.login = function(req, res) {
    Users.find({
        $and: [{
            username: req.body.username
        }]
    }, function(err, model) {
        if (err) {
            res.json({
                status: 4,
                message: err,
                result: null
            });
        } else if (model.length === 0) {
            res.json({
                status: 3,
                message: 'Username is wrong',
                user: null,
                lover: null
            });
        } else {
            for (var i = 0; i < model.length; i++) {
                var object = model[i];
                if (passwordHash.verify(req.body.pass, object.pass)) {
                    userLogin(res, object, utils.hostURL(req));
                    return;
                }
            }

            res.json({
                status: 3,
                message: 'Password is wrong',
                user: null,
                lover: null
            });
        }
    });
};

exports.register = function(req, res) {
    if (!validator.isEmail(req.body.username)) {
        res.json({
            status: 2,
            message: 'Email is invalid',
            result: null
        });
        return;
    }

    Users.find({
        username: req.body.username
    }, function(err, model) {
        if (err) {
            res.json({
                status: 4,
                message: err,
                result: null
            });
        } else if (model.length > 0) {
            res.json({
                status: 3,
                message: 'Username has exists',
                result: null
            });
        } else {
            var new_task = new Users(req.body);
            new_task.pass = passwordHash.generate(new_task.pass);

            // get id max of user
            Users.findIdMax(function(err, idMax) {
                if (err)
                    res.json({
                        status: 4,
                        message: err,
                        result: null
                    });

                new_task.userid = idMax;
                new_task.save(function(err, model) {
                    if (err)
                        res.json({
                            status: 4,
                            message: err,
                            result: null
                        });

                    var userModel = require('../models/userModel');
                    res.json({
                        status: 1,
                        message: 'Register user success',
                        result: userModel.castModel(model, utils.hostURL(req))
                    });
                });
            });
        }
    });
};

exports.search = function(req, res) {
    var userid = req.body.userid;
    var username = req.body.username;
    var pageOb = utils.pageObject(req.body.index, req.body.limit);

    // select * from Users where username like 'username' AND coupleid is null
    var query = Users.find({ $and: [{ 'username': new RegExp(username, 'i') }, { $or: [{ 'coupleid': null }, { 'coupleid': '' }] }] })

    Users.paginate(query, {
        page: pageOb.index,
        limit: pageOb.limit
    }, function(err, result) {
        if (err) {
            res.json({
                status: 2,
                message: err,
                indexNext: -1,
                result: null
            });
        } else {
            // remove _id field & ensure has enough key in Schema
            var userModel = require('../models/userModel');
            var resultSearch = new Array();
            var listUserID = new Array();

            for (var i = 0; i < result['docs'].length; i++) {
                var item = userModel.castSearchModel(result['docs'][i], utils.hostURL(req));
                item.state = 'none';
                listUserID.push(item.userid);
                resultSearch.push(item);
            }

            var query = {
                $and: [{
                    $or: [
                        { $and: [{ senderid: userid }, { receiveid: { $in: listUserID } }] },
                        { $and: [{ receiveid: userid }, { senderid: { $in: listUserID } }] }
                    ]
                }]
            };

            RequestLoves.find(query, function(err, models) {
                for (var i = 0; i < resultSearch.length; i++) {
                    for (var j = 0; j < models.length; j++) {
                        if (resultSearch[i].userid === models[j].receiveid || resultSearch[i].userid === models[j].senderid) {
                            resultSearch[i].state = models[j].state;
                        }
                    }
                }

                res.json({
                    status: 1,
                    message: 'Success',
                    indexNext: result['page'] < result['pages'] ? result['page'] + 1 : -1,
                    result: resultSearch
                });
            });
        }
    });

};

exports.changepass = function(req, res) {
    Users.find({
        userid: req.body.userid
    }, function(err, listUser) {
        if (err) {
            res.json({
                status: 2,
                message: err
            });
        } else if (listUser.length === 0) {
            res.json({
                status: 2,
                message: 'Do not exists user'
            });
        } else {
            listUser[0].pass = passwordHash.generate(req.body.newpass);
            listUser[0].save(function(err, updatedUser) {
                if (err) {
                    res.json({
                        status: 2,
                        message: err
                    });
                } else {
                    res.json({
                        status: 1,
                        message: 'Changed password success'
                    });
                }
            });
        }
    });
};

exports.update = function(req, res) {
    var query = { 'userid': req.body.userid };
    var param = req.body;

    delete param['username']; // chan khong cho update username & pass
    delete param['pass'];

    Users.findOneAndUpdate(query, param, { new: true }, function(err, doc) {
        if (err) {
            res.json({
                status: 2,
                message: err,
                result: null
            });
        } else {
            var userModel = require('../models/userModel');
            res.json({
                status: 1,
                message: 'Update success',
                result: userModel.castModel(doc, utils.hostURL(req))
            });
        }
    });
};

exports.delete = function(req, res) {
    Users.remove({ userid: req.body.userid }, function(err) {
        if (err) {
            res.json({
                status: 2,
                message: err,
                result: null
            });
        } else {
            res.json({
                status: 1,
                message: 'Delete Users success',
                result: null
            });
        }
    });
};

exports.changeAvarta = function(req, res) {
    var utils = require('../manages/utils')

    var upload = utils.mUploadAvarta().single('avatar');
    upload(req, res, function(err) {
        if (err) {
            res.json({
                status: 2,
                message: err,
                result: null
            });
        } else {
            var query = { 'userid': req.body.userid };
            Users.findOneAndUpdate(query, { 'avarta': req.file.filename }, { new: true }, function(err, doc) {
                if (err) {
                    res.json({
                        status: 2,
                        message: err,
                        result: null
                    });
                } else if (doc == null) {
                    res.json({
                        status: 2,
                        message: 'Error: don\'t exists userid',
                        result: null
                    });
                } else {
                    var userModel = require('../models/userModel');
                    res.json({
                        status: 1,
                        message: 'Update success',
                        result: userModel.castModel(doc, utils.hostURL(req))
                    });
                }
            });
        }
    })
};

exports.testpush = function(req, res) {
    var apn = require('../manages/apn');
    apn.testpush();
};