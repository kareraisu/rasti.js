const {is} = require('../utils')

module.exports = {

template : function(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( !is.array(data) ) throw 'invalid data, must be string or array'
    return data
        .map( d => `<li>${d.trim()}</li>` )
        .join('')
},

init : function($el) {},

style : ''

}