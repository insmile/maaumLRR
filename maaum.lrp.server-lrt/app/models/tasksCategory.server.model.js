'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    
var TaskCategorySchema = new Schema({

    /*
        http://localhost:4040/#!/tasks/createCategory?categoryIndex=1&categoryName=TestCCC1
    */
    // ?categoryIndex=1&categoryName=TestCCC1
    categoryIndex: {
        type: String,
        trim: true
    },
    categoryName: {
        type: String,        
        trim: true
    },    
    updated: {
        type: Date
    },    
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('MyTaskCategory', TaskCategorySchema);
