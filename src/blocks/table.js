const utils = require('../utils')

module.exports = {

render : function(data, $el) {
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
            const separator = $el.attr('separator') || ','
            data = data.split(/[\n]/)
                .map(row => row.split(separator))
            head = data.shift().map( h =>`<th>${h.trim()}</th>` ).join('')
            body = data.map( row => '<tr>'
                + row.map( v => `<td>${v.trim()}</td>` ).join('') 
                + '</tr>' ).join('')
        }
        $el.html(
            '<thead><tr>'
            + head
            + '</tr></thead><tbody>'
            + body
            + '</tbody>'
        )
    } catch(err) {
        throw 'Error parsing table data: ' + err
    }
        
},

}