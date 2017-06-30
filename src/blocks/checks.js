const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    var ret = ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<div>
            <input type="checkbox" name="${uid}[]" value="${d.value}">
            <label>${d.label}</label>
        </div>`
    }
    return ret
},

init : function($el) {
    var values = $el[0].value = []
    $el.find('div').click(function(e) {
        // forward clicks to hidden input
        $(e.currentTarget).find('input').click()
    })
    $el.find('input').click(function(e) {
        // prevent event loop (due to click bubbling up to div)
        e.stopPropagation()
    })
    $el.find('input').change(function(e) {
        // update component value
        var $input = $(e.currentTarget),
            val = $input.attr('value')
        $input.prop('checked')
            ? values.push(val)
            : values.remove(val)
    })
    $el.change(function(e) {
        // update component ui
        var $input, checked
        $el.find('input').each(function(i, input){
            $input = $(input)
            checked = values.includes( $input.attr('value') )
            $input.prop('checked', checked)
        })
    })
},

style : `
    [block=checks] label {
        height: 40px;
        padding: 12px 0;
    }
    [block=checks] div {
        cursor: pointer;
    }
    [block=checks] div:hover label {
        font-weight: 600;
    }
`

}