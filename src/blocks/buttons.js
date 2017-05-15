const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var ret = ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<div value="${d.value}">${d.label}</div>`
    }
    return ret
},

init : function($el) {
    $el.find('div').click(function(e) {
        var $el = $(this)
        $el.parent()
            .val($el.attr('value'))
            .trigger('change')
    })
    $el.change(function(e) {
        var $el = $(this)
        $el.children().removeClass('active')
        $el.find('[value="'+ $el.val() +'"]').addClass('active')
    })
},

style : `
    [rasti=buttons] > div {
        display: inline-block;
        margin: 5px !important;
        padding: 5px 10px;
        border-radius: 6px;
        border: 2px outset rgba(255, 255, 255, 0.5);
        background-clip: padding-box;
        cursor: pointer;
    }
    [rasti=buttons] > div.active {
        filter: contrast(1.5);
        border-style: inset;
        padding: 4px 11px 6px 9px;
        transform: translateY(-1px);
    }
`

}
