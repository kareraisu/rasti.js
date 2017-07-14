const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    return data
        .map( d => `<li>${d}</li>` )
        .join('')
},

init : function($el) {},

style : ''

}