'use strict';

var mongoose = require('mongoose'),
    Chatboxs = mongoose.model('Chatboxs');

var utils = require('../manages/utils.js');

const KSTATUS_SUCCESS = 1;
const KSTATUS_ERROR = 2;

//--------------------------------------------------------------------------------


//--------------------------------------------------------------------------------
exports.list = function(req, res) {
    var pageOb = utils.pageObject(req.body.index, req.body.limit);
    var query = Chatboxs.find({ 'coupleid': req.body.coupleid }).sort('-chatid');

    Chatboxs.paginate(query, {
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
            var userModel = require('../models/chatboxModel');
            var resultSearch = new Array();
            for (var i = 0; i < result['docs'].length; i++) {
                var item = userModel.castModel(result['docs'][i]);
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

exports.send = function(req, res) {
    var new_task = new Chatboxs(req.body);

    // get id max of user
    Chatboxs.findIdMax(function(err, idMax) {
        if (err)
            res.json({
                status: KSTATUS_ERROR,
                message: err,
                result: null
            });

        new_task.chatid = idMax;
        new_task.save(function(err, model) {
            if (err)
                res.json({
                    status: KSTATUS_ERROR,
                    message: err,
                    result: null
                });

            var userModel = require('../models/chatboxModel');
            res.json({
                status: KSTATUS_SUCCESS,
                message: 'Chat send success',
                result: userModel.castModel(model)
            });
        });
    });
};
