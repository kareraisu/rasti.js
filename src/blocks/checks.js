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
    $el[0].value = []
    $el.find('input').change(function(e) {
        var $el = $(this),
            val = $el.attr('value'),
            values = $el.closest('[block=checks]')[0].value
        if ($el.prop('checked')) {
            values.push(val)
        }
        else {
            values.remove(val)
        }
    })
    $el.find('input +label').click(function(e) {
        var $el = $(this)
        $el.prev().click()
    })
    $el.change(function(e) {
        var $el = $(this), $input, checked
        $el.find('input').each(function(i, input){
            $input = $(input)
            checked = $el[0].value.includes($input.attr('value'))
            $input.prop('checked', checked)
        })
    })
},

style : `
    [block=checks]>div {
        height: 24px;
        padding-top: 5px
    }
`

}