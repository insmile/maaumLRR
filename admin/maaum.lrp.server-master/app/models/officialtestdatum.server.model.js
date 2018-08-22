'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Officialtestdatum Schema
 */
var OfficialtestdatumSchema = new Schema({
    memo : String, // 검사 메모
    user: { // 검사 등록자, 자동 입력
        type: Schema.ObjectId,
        ref: 'User'
    },
    patient: { // 환자
        type: Schema.ObjectId,
        ref: 'User'
    },
    template : { // 공식검사명, call by reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Officialtesttemplate'
    },
    value : { // 결과 값
        type : Number
    },
    stringValue : { // 사용안함. 문자열 결과 값, 문자열의 가능성을 위해 여분으로 만들어둠.
        type: String,
        trim: true
    },
    testDate : { // 검사시행일
        type: Date,
        default: Date.now
    },
    created: { // 등록일
        type: Date,
        default: Date.now
    }
});

mongoose.model('Officialtestdatum', OfficialtestdatumSchema);
