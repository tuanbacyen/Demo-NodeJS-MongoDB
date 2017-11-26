'use strict';

var mongoose = require('mongoose'),
    Users = mongoose.model('Users'),
    RequestLoves = mongoose.model('RequestLoves');
    
var notification = require('../manages/notification.js');
var utils = require('../manages/utils');

var state_request = 'request';
var state_accept = 'accept';
var state_cancel = 'cancel';

const KSTATUS_SUCCESS = 1;
const KSTATUS_ERROR = 2;

//--------------------------------------------------------------------------------
function errorHandler(res, err) {
    res.json({
        status: KSTATUS_ERROR,
        message: err,
        result: null
    });
}

//--------------------------------------------------------------------------------

exports.create = function(req, res) {
    // validate
    var qUserInArray = { 'userid': { $in: [req.body.senderid, req.body.receiveid] } };
    Users.find(qUserInArray, function(err, model) {
        if (err) {
            errorHandler(res, err);
        } else if (model.length !== 2) {
            errorHandler(res, 'Error: don\'t exists user sender or user receive');
        } else {
            if (!utils.stringEmpty(model[0].coupleid) || !utils.stringEmpty(model[1].coupleid)) {
                errorHandler(res, 'Error: user sender or user receive has relationshiped');
                return;
            }

            var query = {
                $and: [{
                    $or: [
                        { $and: [{ senderid: req.body.senderid }, { receiveid: req.body.receiveid }] },
                        { $and: [{ receiveid: req.body.senderid }, { senderid: req.body.receiveid }] }
                    ]
                }]
            };

            RequestLoves.find(query, function(err, model) {
                if (err) {
                    errorHandler(res, err);
                    return;
                }

                if (model.length > 0) {
                    // has exists => response
                    var userModel = require('../models/requestLoveModel');
                    res.json({
                        status: KSTATUS_SUCCESS,
                        message: 'Success',
                        result: userModel.castModel(model[0])
                    });
                    return;
                }

                var new_task = new RequestLoves(req.body);
                new_task.state = state_request;

                // create new request
                RequestLoves.findIdMax(function(err, idMax) {
                    if (err) {
                        errorHandler(res, err);
                        return;
                    }

                    new_task.requestloveid = idMax;
                    new_task.save(function(err, model) {
                        if (err) {
                            errorHandler(res, err);
                            return;
                        }

                        notification.requestLove(req.body.senderid, req.body.receiveid, model.requestloveid);

                        var userModel = require('../models/requestLoveModel');
                        res.json({
                            status: KSTATUS_SUCCESS,
                            message: 'Request love success',
                            result: userModel.castModel(model)
                        });
                    });
                });
            });
        }
    });
};

exports.acceptORcancel = function(req, res) {
    var state = req.body.state;

    if (state === state_accept) {
        // update state: request => accept
        var query = {
            $and: [{
                    $or: [
                        { $and: [{ senderid: req.body.senderid }, { receiveid: req.body.receiveid }] },
                        { $and: [{ receiveid: req.body.senderid }, { senderid: req.body.receiveid }] }
                    ]
                },
                { 'state': { $ne: state_accept } }
            ]
        };

        RequestLoves.findOneAndUpdate(query, { 'state': state }, { new: true }, function(err, docLove) {
            if (err) {
                errorHandler(res, err);
            } else if (docLove == null) {
                errorHandler(res, 'Error request love');
            } else {
                // create coupleID for two user
                var qUserInArray = { 'userid': { $in: [req.body.senderid, req.body.receiveid] } };

                Users.update(qUserInArray, { 'coupleid': utils.generatorCoupleID() }, { multi: true }, function(err, raw) {
                    if (err) {
                        errorHandler(res, err);
                    } else {
                        notification.requestLoveAccept(req.body.senderid, req.body.receiveid);

                        var userModel = require('../models/requestLoveModel');
                        res.json({
                            status: KSTATUS_SUCCESS,
                            message: 'Congratulation. Set relationship success',
                            result: userModel.castModel(docLove, utils.hostURL(req))
                        });
                    }
                });
            }
        });

    } else if (state === state_cancel) {
        var query = {
            $or: [
                { $and: [{ senderid: req.body.senderid }, { receiveid: req.body.receiveid }] },
                { $and: [{ receiveid: req.body.senderid }, { senderid: req.body.receiveid }] }
            ]
        }

        RequestLoves.remove(query, function(err) {
            if (err) {
                errorHandler(res, err);
                return;
            }

            notification.requestLoveCancel(req.body.senderid, req.body.receiveid);

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Delete request success',
                result: null
            });
        });
    } else {
        errorHandler(res, 'Please input param: state');
    }
};