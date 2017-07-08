const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var tag = $el[0].hasAttribute('ordered') ? 'ol' : 'ul'
    var ret = '<' + tag + '>'
    for (var d of data) {
        ret += `<li>${d}</li>`
    }
    ret += '</' + tag + '>'
    return ret
},

init : function($el) {},

style : ''

}