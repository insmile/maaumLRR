'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    v = require('./validate');


/*
 |이름|변수명|타입|설명|
 |-|-|-|-|
 |기관 명|name|string||
 |기관 ID|center_id|string|동일한 이름의 기관을 분류하기 위해 사용|
 |사업자 등록번호|reg_id|string||
 |주소|address|string||
 |전화번호|tel|string||
 |담당자|officer|string||
 |연락처|officer_tel|string||
 |대표 이메일|email|string||
 */

var CenterSchema = new Schema({
    center_id : {
        type : String,
        required : [true, '기관 ID를 입력해 주십시오.']
    },
    name : {
        type : String,
        required : [true, '기관명을 입력해 주십시오.']
    },
    reg_id : {
        type : Number,
        validate: [v.RegId, '사업자등록번호(10자리 숫자)를 입력해 주십시오.'],
        required: [true,'사업자 등록번호를 입력해 주십시오.']
    },
    address : {
        type : String,
        required: [true,'주소를 입력해 주십시오.']
    },
    tel : {
        type : String,
        validate: [v.phone, '000-0000-0000 양식에 맞추어 전화번호를 입력해 주십시오.'],
        required: [true,'전화번호를 입력해 주십시오.']
    },
    officer : {
        type : String
    },
    officer_tel : {
        type : String,
        validate: [v.phone, '000-0000-0000 양식에 맞추어 담당자 연락처를 입력해 주십시오.'],
    },
    email : {
        type : String,
        trim: true,
        match: [/.+\@.+\..+/, '올바른 이메일 주소를 입력해 주십시오.'],
        required: [true,'이메일 주소를 입력해 주십시오.']
    },
    created : {
        type : Date,
        default : Date.now()
    }
});

mongoose.model('Center', CenterSchema);
