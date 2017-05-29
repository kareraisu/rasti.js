const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    var ret = ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<div>
            <input type="radio" name="${uid}[]" value="${d.value}">
            <label>${d.label}</label>
        </div>`
    }
    return ret
},

init : function($el) {
    $el.find('input').change(function(e) {
        var $el = $(this)
        $el.closest('[block=radios]').val($el.attr('value'))
    })
    $el.find('input +label').click(function(e) {
        var $el = $(this)
        $el.prev().click()
    })
    $el.change(function(e) {
        var $el = $(this)
        $el.find('[value="'+ $el.val() +'"]').prop('checked', true)
    })
},

style : `
    [block=radios]>div {
        height: 24px;
        padding-top: 5px
    }
`

}