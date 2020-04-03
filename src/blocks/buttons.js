const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<div value="${d.value}">${d.label}</div>` )
        .join('')
},

init : function($el) {
    $el[0].value = ''
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
        border-radius: 4px;
        background-clip: padding-box;
        text-transform: uppercase;
        cursor: pointer;
    }
`

}
