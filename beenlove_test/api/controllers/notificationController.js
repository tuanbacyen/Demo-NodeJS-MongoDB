'use strict';

var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Notifications = mongoose.model('Notifications');
var utils = require('../manages/utils.js');

const KSTATUS_SUCCESS = 1;
const KSTATUS_ERROR = 2;

exports.list = function(req, res) {
    var pageOb = utils.pageObject(req.body.index, req.body.limit);
    var query = Notifications.find({ 'coupleid': req.body.coupleid }).sort('-notificationid');

    Notifications.paginate(query, {
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
            var userModel = require('../models/notificationModel');
            var resultSearch = new Array();
            for (var i = 0; i < result['docs'].length; i++) {
                var item = userModel.castModel(result['docs'][i], utils.hostURL(req))
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

exports.delete = function(req, res) {
    Notifications.remove({ 'notificationid': notificationid }, function(err, obj) {
        if (err) {
            res.json({
                status: KSTATUS_ERROR,
                message: err
            });
        } else if (obj.result.n === 0) {
            res.json({
                status: KSTATUS_ERROR,
                message: 'Notifications: notificationid was not found'
            });
        } else {
            notification.anivesarryDelete(req.body.user_id_send);

            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Delete notification success'
            });
        }
    });
};