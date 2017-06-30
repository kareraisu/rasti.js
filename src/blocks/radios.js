const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    var ret = ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<div>
            <input type="radio" name="${uid}" value="${d.value}">
            <label>${d.label}</label>
        </div>`
    }
    return ret
},

init : function($el) {
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
        $el.val( $(e.currentTarget).attr('value') )
    })
    $el.change(function(e) {
        // update component ui
        $el.find('[value="'+ $el.val() +'"]').prop('checked', true)
    })
},

style : `
    [block=radios] label {
        height: 40px;
        padding: 12px 0;
    }
    [block=radios] div {
        cursor: pointer;
    }
    [block=radios] div:hover label {
        font-weight: 600;
    }
`

}