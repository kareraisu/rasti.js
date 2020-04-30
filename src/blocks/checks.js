const { random, prepTemplate } = require('../utils')

module.exports = {

render : function(data, $el) {
    const uid = random()
    const template = prepTemplate(d => `<input type="checkbox" name="${uid}[]" value="${d.value}"/><label>${d.label}</label>`)
    $el.html( template(data) )
},

init : function($el) {
    const values = $el[0].value = []

    $el.on('change', 'input', function(e) {
        // update component value
        const $input = $(e.currentTarget),
            val = $input.attr('value')
        $input.prop('checked')
            ? values.push(val)
            : values.remove(val)
    })
    
    $el.on('change', function(e) {
        // update component ui
        let $input, checked
        $el.find('input').each(function(i, input){
            $input = $(input)
            checked = values.includes( $input.attr('value') )
            $input.prop('checked', checked)
        })
    })
},

}