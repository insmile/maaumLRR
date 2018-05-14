'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var PayHistorySchema = new Schema({
    center: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Center'
    },
    center_id : {
        type : String
    },
    center_name : {
        type : String
    },
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    product_name : {
        type : String
    },
    price : {
        type : Number
    },
    key_num : {
        type : Number,
        default : 0
    },
    period : {
        type : Number
    },
    request_date : {
        type : Date,
        default : Date.now()
    },
    approved : {
        type : Boolean,
        default : false
    },
    approved_date : {
        type : Date
    },
    start_date : {
        type: Date
    },
    expired_date : {
        type : Date
    },
    refund : {
        type: Boolean,
        default : false
    },
    created : {
        type : Date,
        default : Date.now()
    },
    updated : {
        type : Date,
        default : Date.now()
    }
});

mongoose.model('PayHistory', PayHistorySchema);
