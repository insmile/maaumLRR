'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResourceSchema = new Schema({
    name: {
        type: String
    },
    resType: {
        type: String,
        enum: ['str', 'file', 'bool', 'video']
    },
    strType: {
        type: String,
        enum: ['text', 'textarea']
    },
    value: {
        type: String
    },
    timeout: { // 이미지 과제에서 자동으로 넘어가는 시간
        type: Number,
        default: -1
    },
    imageOrientation: { // 이미지 과제에서 최초 표시 시 좌-우-중앙 위치 설정
        type: String,
        enum: ['left', 'right', 'center']
    },
    height: {
        type: Number
    },
    width: {
        type: Number
    },
    isAnswer: {
        type: Boolean,
        default: false
    },
    isDefinition: {
        type: Boolean,
        default: false
    },
    note: {
        type: String
    }
});

/**
 * Task Schema
 */
var TaskSchema = new Schema( {
    /*
    category: {
        type: String,
        trim: true,
        required: [true, '과제 유형을 입력해 주십시오.'],
    },
    */

   category: {
        type: Schema.ObjectId,
        ref: 'MyTaskCategory'
    },
    
    name: {
        type: String,
        default: '',
        required: [true, '과제명을 입력해 주십시오.'],
        trim: true
    },
    answer: {
        type: String,
        enum: ['select', 'record', 'draw-one', 'draw-two', 'manual', 'manual_now', 'same', 'pick15', 'ray', 'forms', 'visual30', 'visual34', 'sound', 'pick08','draw-one2']
    },
    isRandom: {
        type: Boolean
    },
    numOfProblem: {
        type: Number
    },
    score_type: {
        type: String,
        default: 'n/a'
    },
    max_score: {
        type: Number
    },

    preview: { // 사진!!
        type: String
    },
    resources: [ResourceSchema],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    sortOrder: Number,
    setSize: Number,
    isOpen: Boolean,
    center: {
        type: Schema.ObjectId,
        ref: 'Center'
    }

    // 2018.08.07 추가.
    , taskType : { 
        type: String        
        // , enum: ['LT', 'RT', 'LRE']
    } 

});


var ProblemSchema = new Schema({
    name: {
        type: Number,
        required: [true, '문항 세트 ID를 입력해 주십시오.']
    },

    refTask: {
        type: Schema.ObjectId,
        ref: 'Task',
        required: [true, '과제를 선택해 주십시오.']
    },

    // 원레 있던거.
    taskCategory: {
        type: String
    },

    taskName: {
        type: String
    },
    same: {
        type: Boolean
    },
    level: { // legacy
        type: Number
    },
    practice: {
        type: Boolean
    },
    seq: {
        type: Number,
        required: [true, '문제 순서를 입력해 주십시오.']
    },
    note: {
        type: String
    },
    resources: [ResourceSchema],
    def: [ResourceSchema],
    res: [ResourceSchema],
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    updated: {
        type: Date
    }
    
    // 2018.08.07 추가.
    , taskType : { 
        type: String        
        // , enum: ['LT', 'RT', 'LRE']
    } 
});

mongoose.model('Problem', ProblemSchema);
mongoose.model('Task', TaskSchema);

// problems, tasks 로 바뀐당.
