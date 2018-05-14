'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/*
 |이름|변수명|
 |---|------|
 |결재상품명|name|
 |설명문구|desc|
 |허용 키 개수|keys|Number|
 |상품지속일|period|
 |가격|price|
 */

var ProductSchema = new Schema({
    name : {
        type : String,
        require:[true, "상품명을 입력해 주십시오."]
    },
    desc : {
        type : String,
        require:[true, "상품 설명을 입력해 주십시오."]
    },
    keys : {
        type : Number,
        require:[true, "허용 키 개수를 입력해 주십시오."]
    },
    period : {
        type : Number,
        require:[true, "상품지속일을 입력해 주십시오."]
    },
    price : {
        type : Number,
        require:[true, "가격을 입력해 주십시오."]
    }
});

mongoose.model('Product', ProductSchema);
