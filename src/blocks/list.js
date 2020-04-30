const { is } = require('../utils')

module.exports = {

render : function(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( !is.array(data) ) throw 'invalid data, must be string or array'
    const html = data
        .map( d => `<li>${d.trim()}</li>` )
        .join('')
    $el.html(html)
},

}