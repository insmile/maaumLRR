'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Result Schema
 */
var ResultSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Result name',
        trim: true
    },
    trainingType: {
        type: String,
        enum: ['single', 'protocol']
    },
    refProtocol: {
        type: Schema.ObjectId,
        ref: 'Protocol'
    },
    refTask: {
        type: Schema.ObjectId,
        ref: 'Task'
    },
    setNum: Number,
    isProtocol: Boolean,
    refTakehome: {
        type: Schema.ObjectId,
        ref: 'Takehome'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
    },
    patientID: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    totalTime: { // sec단위로 기록?
        type: Number
    },
    totalScore: {
        type: String
    },
    maxScore: {
        type: String
    },
    numOfProblem: {
        type: Number
    },
    numOfResponse: {
        type: Number
    },
    numOfCorrect: {
        type: Number
    },
    formJson: {
        type: String
    },
    isChecked: {
        type: Boolean
    },
    checkDate: {
        type: Date
    },
    checkUserID: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    meanTime: Number,
    stdTime: Number,
    json: String,
    tasks: [{
        refTask: {
            type: Schema.ObjectId,
            ref: 'Task',
            required: '과제를 선택해 주십시오.'
        },
        answerType: {
            type: String
        },
        scoreType: {
            type: String
        },
        setID: {
            type: Number,
            required: '문항 세트 ID를 입력해 주십시오.'
        },
        totalScore: {
            type: String
        },
        maxScore: {
            type: Number
        },
        numOfCorrect: {
            type: Number
        },
        numOfResponse: {
            type: Number
        },
        numOfProblem: {
            type: Number
        },
        meanTime: Number,
        stdTime: Number,
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        totalTime: { // sec단위로 기록?
            type: Number
        },
        formJson: {
            type: String
        },
        problems: [{
            refProblem: {
                type: Schema.ObjectId,
                ref: 'Problem',
                required: '문제를 선택해 주십시오.'
            },
            drawJson: {
                type: String
            },
            recordFile: {
                type: String
            },
            answerIdx: {
                type: Number
            },
            selectTime: { // sec단위로 기록?
                type: Number
            },
            endTime: { // sec단위로 기록?
                type: Number
            },
            score: {
                type: Number
            },
            isCorrect: {
                type: Boolean
            },
            wrongType: {
                type: Number
            },
            isChecked: {
                type: Boolean
            },
            formJson: {
                type: String
            }
        }]
    }]
});

mongoose.model('Result', ResultSchema);