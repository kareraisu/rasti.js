const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    const first = data[0]
    let head, body
    try {
        if (utils.is.array(data)) {
            headers = Object.keys(data[0])
            head = headers.map( h =>`<th>${h}</th>` ).join('')
            body = data.map( obj => '<tr>'
                + headers.map( key => `<td>${obj[key]}</td>` ).join('') 
                + '</tr>' )
        }
        else if (utils.is.string(data)) {
            data = data.split(/[\n]/)
                .map(row => row.split(','))
            head = data.shift().map( h =>`<th>${h}</th>` ).join('')
            body = data.map( row => '<tr>'
                + row.map( v => `<td>${v}</td>` ).join('') 
                + '</tr>' )
        }
        return '<thead><tr>'
            + head
            + '</tr></thead><tbody>'
            + body
            + '</tbody>'
    } catch(err) {
        utils.rastiError('Error parsing table data: ' + err)
        return ''
    }
        
},

init : function($el) {},

style : ''

}