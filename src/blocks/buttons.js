const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<div value="${d.value}">${d.label}</div>` )
        .join('')
},

init : function($el) {
    $el.on('click', 'div', function(e) {
        $el.val($(e.target).attr('value'))
            .trigger('change')
    })
    $el.on('change', function(e) {
        $el.children().removeClass('active')
        $el.find('[value="'+ $el.val() +'"]').addClass('active')
    })
},

style : `
    [block=buttons] > div {
        display: inline-block;
        margin: 5px !important;
        padding: 5px 10px;
        border-radius: 6px;
        border: 2px outset rgba(255, 255, 255, 0.5);
        background-clip: padding-box;
        text-transform: uppercase;
        cursor: pointer;
    }
    [block=buttons] > div.active {
        filter: contrast(1.5);
        border-style: inset;
        padding: 4px 11px 6px 9px;
        transform: translateY(-1px);
    }
`

}
