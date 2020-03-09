const {is} = require('../utils')

module.exports = {

template : function(data, $el) {
    if ( is.string(data) ) data = data.split(', ')
    if ( !is.array(data) ) throw 'invalid data, must be string or array'
    return data
        .map( d => `<li>${d}</li>` )
        .join('')
},

init : function($el) {},

style : ''

}