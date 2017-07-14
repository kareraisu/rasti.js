const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<input type="radio" name="${uid}" value="${d.value}"/><label>${d.label}</label>` )
        .join('')
},

init : function($el) {
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
        $el.find('[value="'+ $el.val() +'"]').prop('checked', true)
    })
},

style : ``

}