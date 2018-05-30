'use strict';

exports.LocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

exports.RegId = function(property) {
    return /^\d{9,10}$/.test(property);
};

exports.phone = function(v) {
    return /^\d{2,3}-\d{3,4}-\d{4}$/.test(v) || /^\d{9,11}/.test(v);
};

exports.email = function(v) {
    return /^.+\@.+\..+$/.test(v);
};