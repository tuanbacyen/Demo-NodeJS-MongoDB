'use strict';

var mongoose = require('mongoose'),
    Events = mongoose.model('Events'),
    notification = require('../manages/notification.js');

var utils = require('../manages/utils.js');

const KSTATUS_SUCCESS = 1;
const KSTATUS_ERROR = 2;

//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
exports.list = function(req, res) {
    var pageOb = utils.pageObject(req.body.index, req.body.limit);
    var query = Events.find({ 'coupleid': req.body.coupleid }).sort('-eventid');

    Events.paginate(query, {
        page: pageOb.index,
        limit: pageOb.limit
    }, function(err, result) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                indexNext: -1,
                result: null
            });
        } else {
            // remove _id field & ensure has enough key in Schema
            var userModel = require('../models/eventModel');
            var resultSearch = new Array();
            for (var i = 0; i < result['docs'].length; i++) {
                var item = userModel.castModel(result['docs'][i], utils.hostURL(req));
                resultSearch.push(item);
            }

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Success',
                indexNext: result['page'] < result['pages'] ? result['page'] + 1 : -1,
                result: resultSearch
            });
        }
    });
};

exports.create = function(req, res) {
    var new_task = new Events(req.body);

    // get id max of user
    Events.findIdMax(function(err, idMax) {
        if (err)
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                result: null
            });

        new_task.eventid = idMax;
        new_task.save(function(err, model) {
            if (err) {
                res.json({
                    status: KSTATUS_ERROR,
                    message: err,
                    result: null
                });
                return;
            }
                
            var userModel = require('../models/eventModel');
            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Register event success',
                result: userModel.castModel(model, utils.hostURL(req))
            });
        });
    });
};

exports.update = function(req, res) {
    var query = { 'eventid': req.body.eventid };
    var param = req.body;
    delete param['coupleid']; // don't replace coupleid

    Events.findOneAndUpdate(query, param, { new: true }, function(err, doc) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                result: null
            });
        } else if (doc == null) {
            res.json({
                status: KSTATUS_ERROR,
                message: 'Don\'t exists eventid',
                result: null
            });
        } else {
            notification.eventUpdate(req.body.user_id_send, req.body.eventid);

            var userModel = require('../models/eventModel');
            var userRe = userModel.castModel(doc, utils.hostURL(req));

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Update event success',
                result: userRe
            });
        }
    });
};

exports.delete = function(req, res) {
    Events.remove({ eventid: parseInt(req.body.eventid) }, function(err, obj) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err
            });
        } else if (obj.result.n === 0) {
            res.json({
                status: KSTATUS_ERROR,
                message: 'Events: eventid was not found'
            });
        } else {
            notification.eventDelete(req.body.user_id_send, req.body.eventid);

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Delete event success'
            });
        }
    });
};