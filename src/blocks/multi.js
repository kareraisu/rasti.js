const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var ret = $el[0].hasAttribute('filter')
        ? `<input field type="text" placeholder="${ $el.attr('filter') || self.options.multiFilterText }"/>`
        : ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<option value="${d.value}" alias="${d.alias}">${d.label}</option>`
    }
    return ret
},

init : function($el) {
    var el = $el[0],
        field = $el.attr('field'),
        $options = $el.closest('[page]').find('[options='+ field +']'),
        initialized = utils.is.number(el.total)
    
    el.value = []
    el.total = $options.children().length
    el.max = parseInt($el.attr('max'))

    if (initialized) {
        // empty selected options (and remove full class in case it was full)
        $el.find('[selected]').empty()
        $el.removeClass('full')
        // then exit (skip structure and bindings)
        return
    }

    // structure

    $el.prepend('<div add>')
    $el.append('<div selected>')
    var $selected = $el.find('[selected]')

    // bindings

    $el.on('click', function(e) {
        $options.siblings('[options]').hide() // hide other options
        if ( utils.onMobile() ) $options.parent().addClass('backdrop')
        $options.css('left', this.getBoundingClientRect().right).show()
        $options.find('input').focus()
    })

    $el.closest('[page]').on('click', '*:not(option)', function(e) {
        if ( $(e.target).attr('field') === field
          || $(e.target).parent().attr('field') === field ) return
        if ( utils.onMobile() ) $options.parent().removeClass('backdrop')
        $options.hide()
    })

    var toggleOption = function(e) {
        e.stopPropagation()
        $options.find('input').focus()
        var $opt = $(e.target),
            val = $opt.attr('value'),
            values = $el[0].value

        if ($opt.parent().attr('options')) {
            // select option
            $el.find('[selected]').append($opt)
            values.push(val)
        }
        else {
            // unselect option
            $options.append($opt)
            values.remove(val)
        }
        checkFull()
        $el.trigger('change', {ui: true}) 
    }

    $el.on('click', 'option', toggleOption)

    $options.on('click', 'option', toggleOption)

    $options.on('click', function(e) { $options.find('input').focus() })

    $options.on('input', 'input', function(e) {
        this.value
            ? $options.find('option').hide().filter('[alias*='+ this.value +']').show()
            : $options.find('option').show()
    })

    $el.on('change', function(e, params){
        if (params && params.ui) return // triggered from ui, do nothing
        $selected.children().each(function(i, el) {
            $options.append(el)
        })
        for (var val of el.value) {
            $selected.append($options.find('[value='+ val +']'))
            if ( checkFull() ) break
        }
    })

    function checkFull() {
        var qty = $selected.children().length,
            dif = el.value.length - qty,
            isFull = qty >= (el.max || el.total)

        if (isFull) {
            if (dif > 0) {
                el.value = el.value.slice(0, qty)
                throw warn('Dropped %s overflowed values in el:', dif, el)
            }
            $el.addClass('full')
            if ( utils.onMobile() ) $options.parent().removeClass('backdrop')
            $options.hide()
        }
        else {
            $el.removeClass('full')
        }

        return isFull
    }
},

style : `
    [rasti=multi] {
        position: relative;
        min-height: 35px;
        padding-right: 20px;
        text-shadow: 0 0 0 #000;
        cursor: pointer;
    }
    [rasti=multi] [add] {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 20px;
        border-left: 1px solid rgba(0,0,0,0.2);
    }
    [rasti=multi] [add]:before {
        content: '〉';
        padding-top: 2px;
        padding-left: 6px;
    }
    [rasti=multi].open [add] {
        box-shadow: inset 0 0 2px #000;
    }
    [rasti=multi].full {
        padding-right: 5px;
    }
    [rasti=multi].full [add] {
        display: none;
    }
    [rasti=multi] option {
        padding: 2px 0;
    }
    [rasti=multi] option:before {
        content: '✕';
        display: inline-block;
        box-sizing: border-box;
        height: 20px;
        width: 20px;
        margin-right: 5px;
        border-radius: 50%;
        text-align: center;
        line-height: 1.5;
    }
    [rasti=multi] [selected] {
        max-height: 100px;
        overflow-y: auto;
    }
    [rasti=multi] [selected]>option:hover:before {
        color: #d90000;
        background-color: rgba(255, 0, 0, 0.5);
    }
    [rasti=multi][options] {
        display: none;
        position: absolute;
        top: 0;
        width: 250px;
        height: 100%;
        padding: 5px 10px;
        border: 1px solid;
        z-index: 10;
        overflow-y: auto;
    }
    [rasti=multi][options]>option:before {
        transform: rotate(45deg);
    }
    [rasti=multi][options]>option:hover:before {
        color: #008000;
        background-color: rgba(0, 128, 0, 0.5);
    }
    [rasti=multi][options] input {
        border: 1px solid #000;
        margin: 10px 0;
    }

`

}