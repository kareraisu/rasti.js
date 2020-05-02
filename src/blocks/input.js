const { is, random } = require('../utils')

module.exports = {

render(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( !is.array(data) ) throw 'invalid data, must be string or array'
    const html = data
        .map( d => `<option value="${d.trim()}"></option>` )
        .join('')
    $el.next('datalist').html(html)
},

init($el) {
    const id = random()
    $el.attr('list', id)
    $el.after(`<datalist id=${id}>`)

    $el.click(e => $el.val(''))
},

}