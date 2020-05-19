const { random, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const uid = random()
    const template = prepTemplate(d => `<div><input type="radio" name="${uid}" value="${d.value}"/><label>${d.label}</label></div>`)
    $el.html( template(data) )
},

init($el) {
    $el[0].value = ''
    $el.on('click', 'label', function(e) {
        // forward clicks to hidden input
        $(e.currentTarget).prev().click()
    })
    $el.on('change', 'input', function(e) {
        // update component value
        $el.val( $(e.currentTarget).attr('value') )
    })
    $el.on('change', function(e) {
        // update component ui
        $el.find('[value="'+ $el.val() +'"]').checked = true
    })
},

}