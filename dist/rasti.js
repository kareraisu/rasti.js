(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rasti = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    list    : require('./list'),
	buttons : require('./buttons'),
	checks  : require('./checks'),
	radios  : require('./radios'),
	multi   : require('./multi'),
	select  : require('./select'),
}
},{"./buttons":2,"./checks":3,"./list":4,"./multi":5,"./radios":6,"./select":7}],2:[function(require,module,exports){
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

},{"../utils":13}],3:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var uid = utils.random()
    return data
        .map( d => utils.checkData(d) )
        .map( d => `<input type="checkbox" name="${uid}[]" value="${d.value}"><label>${d.label}</label>` )
        .join('')
},

init : function($el) {
    var values = $el[0].value = []
    $el.on('click', 'label', function(e) {
        // forward clicks to hidden input
        $(e.currentTarget).prev().click()
    })
    $el.on('change', 'input', function(e) {
        // update component value
        var $input = $(e.currentTarget),
            val = $input.attr('value')
        $input.prop('checked')
            ? values.push(val)
            : values.remove(val)
    })
    $el.on('change', function(e) {
        // update component ui
        var $input, checked
        $el.find('input').each(function(i, input){
            $input = $(input)
            checked = values.includes( $input.attr('value') )
            $input.prop('checked', checked)
        })
    })
},

style : ``

}
},{"../utils":13}],4:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    return data
        .map( d => `<li>${d}</li>` )
        .join('')
},

init : function($el) {},

style : ''

}
},{"../utils":13}],5:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    $el[0].total = data.length // WARNING : SIDE EFFECTS

    var ret = $el[0].hasAttribute('filter')
        ? `<input field type="text" placeholder="${ $el.attr('filter') }"/>`
        : ''

    return ret + data
        .map( d => utils.checkData(d) )
        .map( d => `<option value="${d.value}" alias="${d.alias}">${d.label}</option>` )
        .join('')
},

init : function($el) {
    var el = $el[0]
    var field = $el.attr('field')

    if (!field) return rasti.error('Missing field name in [field] attribute of element:', el)
    
    el.value = []
    el.max = parseInt($el.attr('max'))

    if (el.initialized) {
        // empty selected options (and remove full class in case it was full)
        $el.find('[selected]').empty()
        $el.removeClass('full')
        // then exit (skip structure and bindings)
        return
    }

    // structure

    $el.html('<div selected/><div add/>')
    $el.closest('[page]').children('.page-options')
        .append('<div field block=multi options='+ field +'>')
    var $selected = $el.find('[selected]')
    var $options = $el.closest('[page]').find('[options='+ field +']')

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
                rasti.warn('Dropped %s overflowed values in el:', dif, el)
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

    el.initialized = true
},

style : `
    [block=multi] {
        display: flex;
        min-height: 35px;
        padding-right: 0;
        text-shadow: 0 0 0 #000;
        cursor: pointer;
    }
    [block=multi] [add] {
        display: flex;
        align-items: center;
        width: 20px;
        border-left: 1px solid rgba(0,0,0,0.2);
    }
    [block=multi] [add]:before {
        content: '〉';
        padding-left: 6px;
    }
    [block=multi].open [add] {
        box-shadow: inset 0 0 2px #000;
    }
    [block=multi].full {
        padding-right: 5px;
    }
    [block=multi].full [add] {
        display: none;
    }
    [block=multi] option {
        padding: 2px 0;
    }
    [block=multi] option:before {
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
    [block=multi] [selected] {
        flex-basis: 100%;
        max-height: 100px;
        overflow-y: auto;
    }
    [block=multi] [selected] > option:hover:before {
        color: #d90000;
        background-color: rgba(255, 0, 0, 0.5);
    }
    [block=multi][options] {
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
    [block=multi][options] > option:before {
        transform: rotate(45deg);
    }
    [block=multi][options] > option:hover:before {
        color: #008000;
        background-color: rgba(0, 128, 0, 0.5);
    }
    [block=multi][options] input {
        border: 1px solid #000;
        margin: 10px 0;
    }

`

}
},{"../utils":13}],6:[function(require,module,exports){
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
},{"../utils":13}],7:[function(require,module,exports){
const utils = require('../utils')

module.exports = {

template : function(data, $el) {
    var ret = ''
    for (var d of data) {
        d = utils.checkData(d)
        ret += `<option value="${d.value}">${d.label}</option>`
    }
    return ret
},

init : function($el) {
    var imgpath = $el.attr('img')
    if (!imgpath) return

    var $selected = $el.find('[selected]'),
        $wrapper = $('<div select>'),
        $options = $('<div options>')

    // clone original select
    $.each($el[0].attributes, function() {
        $wrapper.attr(this.name, this.value);
    });

    // wrap with clone
    $el.wrap($wrapper)
    // regain wrapper ref (it is lost when wrapping)
    $wrapper = $el.parent()
    // add caret
    $wrapper.append('<div caret>&#9660</div>')

    if (!$el.attr('data')) {
        // clone original options
        $el.find('option').each(function(opt, i) {
            $options.append(`<div value="${opt.value}">${opt.innerHTML}</div>`)
        })
    }
    // add options
    $wrapper.append($options)
    // replace ref with divs
    $options = $options.children()

    // recreate selected option, if none select first one
    var i = $selected.length ? $selected.index() : 0
    $options[i].classList.add('selected')
    // recreate select value
    $wrapper.val($el.val() || $options[i].getAttribute('value'))

    // add images
    setImg($wrapper, imgpath)
    $options.each(function(i, el) {
        setImg($(el), imgpath)
    })

    // bind clicks
    $options.click(function(e) {
        var $opt = $(this)
        $opt.siblings().removeClass('selected')
        $opt.addClass('selected')
        var $wrapper = $opt.closest('[select]')
        $wrapper.val($opt.attr('value'))
        var imgpath = $wrapper.attr('img')
        if (imgpath) setImg($wrapper, imgpath)
    })

    // remove original select
    $el.remove()

},

style : `
    [select] select {
        display: none;
    }
    [select] {
        cursor: pointer;
        border-radius: 4px;
    }
    [select]:hover [options] {
        display: block;
    }
    [select] [options] {
        display: none;
        position: absolute;
        margin-top: 42px;
        margin-left: -4px;
        border: 4px solid #b9b9b9;
        border-radius: 4px;
    }
    [select] [options] div:hover {
        border: 4px solid #fff;
    }
    [select] [options] div.selected {
        border: 2px solid #0f97bd;
    }
    [select] [caret] {
        float: right;
        margin-top: 15px;
        margin-right: 5px;
        font-size: small;
    }
    [select][img] {
        padding: 0;
    }
`

}

},{"../utils":13}],8:[function(require,module,exports){
const { is, resolveAttr } = require('./utils')

class History {

    constructor() {
        this.i = 0
        this.content = []
    }
    
    back() {
        if (this.i > 0) navTo(this.content[--(this.i)])
    }
    forth() {
        if (this.i < this.content.length) navTo(this.content[++(this.i)])
    }
    push(page) {
        this.content.splice(this.i, null, page)
        this.i++
    }
}


class Pager {

    constructor(id, results, page_size) {
        this.id = id
        if ( !is.string(id) ) return rasti.error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( !is.array(results) ) return rasti.error('%s Results must be an array', this.logid)
        if ( !is.number(page_size) ) return rasti.error('%s Page size must be a number', this.logid)
        this.results = results
        this.sizes = [5, 10, 20]
        this.page_size = page_size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)

    }

    next() {
        if (this.hasNext()) this.page++
        else rasti.warn('%s No next page', this.logid)
        return this.getPageResults(this.page)
    }

    prev() {
        if (this.hasPrev()) this.page--
        else rasti.warn('%s No previous page', this.logid)
        return this.getPageResults(this.page)
    }

    hasNext() {
        return this.results.length > this.page * this.page_size
    }

    hasPrev() {
        return this.page > 1
    }

    setPageSize(size) {
        size = parseInt(size)
        if ( !is.number(size) ) return rasti.error('%s Must specify a number as the page size', this.logid)
        this.page_size = size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)
    }

    getPageResults(page) {
        if ( !is.number(page) ) {
            rasti.error('%s Must specify a page number to get results from', this.logid)
            return []
        }
        try {
            var i = (page -1) * this.page_size
            return this.results.slice(i, i + this.page_size)
        }
        catch(err) {
            rasti.error('%s Could not get results of page %s, error:', this.logid, page, err)
            return []
        }
    }

}


function state(app) {
    function invalid() {
        error('Saved state for app [%s] is invalid', app.name)
    }

    return Object.defineProperties({}, {
        page  : { get : _ => app.active.page.attr('page'), enumerable : true },
        theme : { get : _ => app.active.theme, enumerable : true },
        lang  : { get : _ => app.active.lang, enumerable : true },
        save : { value : _ => {
            localStorage.setItem('rasti.' + app.name, JSON.stringify(app.state))
            rasti.log('State saved')
        } },
        get : { value : _ => {
            var state
            try {
                state = JSON.parse( localStorage.getItem('rasti.' + app.name) )
                if ( !state ) rasti.log('No saved state found for app [%s]', app.name)
                else if ( !is.object(state) ) invalid()
                else return state
            }
            catch(err) {
                invalid()
            }
        } },
        restore : { value : _ => {
            var state = app.state.get()
            if (state) {
                rasti.log('Restoring state...')
                for (let prop in state) {
                    app.state[prop] = state[prop]
                }
                if (state.theme) app.setTheme(state.theme)
                if (state.lang) app.setLang(state.lang)
                app.navTo(state.page)
                rasti.log('State restored')
            }
            return state
        } },
        clear : { value : _ => {
            window.localStorage.removeItem('rasti.' + app.name)
        } },
    })
}


function crud(app) {
    function checkDataSource(fn) {
        return (datakey, ...args) => {
            const data = app.data[datakey]
            if (!data) {
                rasti.error('Undefined data source "%s"', datakey)
                return false
            }
            else return fn(data, datakey, ...args)
        }
    }

    function exists(el, arr) {
        return is.object(el)
            ? arr.find(d => d.id === el.id)
            : arr.indexOf(el) > -1
    }

    return {
        create : checkDataSource((data, datakey, newel) => {
            const exists = exists(newel, data)
            if (exists) {
                rasti.warn('Element [%s] already exists in data source [%s]', newel.id || newel, datakey)
            }
            else {
                if (is.object(newel)) newel.id = newel.id || datakey + '-' + Date.now()
                data.push(newel)
            }
            return !exists
        }),

        delete : checkDataSource((data, datakey, id) => {
            const el = data.length && (is.object(data[0]) ? data.find(el => el.id === id) : id)
            !el
                ? rasti.warn('Element [%s] not found in data source [%s]', id, datakey)
                : data.remove(el)
            return el
        }),

        update : checkDataSource((data, datakey, el, newel) => {
            const exists_el = exists(el, data)
            const exists_newel = exists(newel, data)
            if (!exists_el) rasti.warn('El [%s] not found in data source [%s]', el, datakey)
            if (exists_newel) rasti.warn('El [%s] already exists in data source [%s]', newel, datakey)
            const valid = exists_el && !exists_newel
            if (valid) data.update(el, newel)
            return valid
        }),

        genInputEl : $el => {
            const template = app.templates[ resolveAttr($el, 'template') ]

            if (!template.props) {
                // extract props from the template's html
                // and generate a props object with placeholder values
                const regexp = /data\.([a-z]*)/g
                let props = {}
                let prop
                while (prop = regexp.exec(template.html)) {
                  props[ prop[1] ] = prop[1]
                }
                // if no props are found, assume data are strings
                // hence, replace the empty props object with the newEl string
                if (!Object.keys(props).length) props = app.options.newEl
                // cache the props in the template
                template.props = props
                rasti.log('Props:', props)
            }
            // create a dummy element using the (self-)extracted props
            const inputEl = $('<div class=rasti-crud-input contenteditable>' + template( [template.props] ) +'</div>')

            // TODO: identify prop elements within the inputEl element and apply [contenteditable] only to them
            
            $el.append(inputEl)
        },

        genDataEl : $el => {
            const template = app.templates[ resolveAttr($el, 'template') ]
            const values = $el.find('.rasti-crud-input').find('[contenteditable]')
            let dataEl
            if ( is.object(template.props) ) {
                dataEl = {}
                Object.keys(template.props).forEach( (key, i) => {
                    dataEl[key] = values[i].html()
                })
            }
            else dataEl = values[0].html()
            return dataEl
        },

        showInputEl : $el => {
            $el.find('.rasti-crud-input').show()
        },

        hideInputEl : $el => {
            $el.find('.rasti-crud-input').hide()
        },

        persistNewEl : $el => {
            $el.find('.rasti-crud-input').removeClass('.rasti-crud-input')
                .find('[contenteditable]').removeAttr('[contenteditable]')
            app.crud.genInputEl($el)
        },
    }
}


module.exports = {
    History,
    Pager,
    state,
    crud,
}

},{"./utils":13}],9:[function(require,module,exports){
// prototype extensions
Object.defineProperties(Array.prototype, {
    get : { value : function(i) {
       return i < 0 ? this[this.length + i] : this[i]
    }},
    remove : { value : function(el) {
        var i = this.indexOf(el)
        if (i >= 0) this.splice(i, 1)
    }},
    update : { value : function(el, newel) {
        var i = this.indexOf(el)
        if (i >= 0) this.splice(i, 1, newel)
    }},
    capitalize : { value : function() {
       return this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
    }},
})


// $ extensions
$.fn.move = function(options) {
    var options = Object.assign({
            handle: this,
            container: this.parent()
        }, options),
        object = this,
        newX, newY,
        nadir = object.css('z-index'),
        apex = 100000,
        hold = 'mousedown touchstart',
        move = 'mousemove touchmove',
        release = 'mouseup touchend'

    if (!object[0].hasAttribute('move')) object.attr('move', '')

    options.handle.on(hold, function(e) {
        if (e.type == 'mousedown' && e.which != 1) return
        object.css('z-index', apex)
        var marginX = options.container.width() - object.width(),
            marginY = options.container.height() - object.height(),
            oldX = object.position().left,
            oldY = object.position().top,
            touch = e.touches,
            startX = touch ? touch[0].pageX : e.pageX,
            startY = touch ? touch[0].pageY : e.pageY

        $(window)
            .on(move, function(e) {
                var touch = e.touches,
                    endX = touch ? touch[0].pageX : e.pageX,
                    endY = touch ? touch[0].pageY : e.pageY
                newX = Math.max(0, Math.min(oldX + endX - startX, marginX))
                newY = Math.max(0, Math.min(oldY + endY - startY, marginY))

                window.requestAnimationFrame
                    ? requestAnimationFrame(setElement)
                    : setElement()
            })
            .one(release, function(e) {
                e.preventDefault()
                object.css('z-index', nadir)
                $(this).off(move).off(release)
            })

        e.preventDefault()
    })

    return this

    function setElement() {
        object.css({top: newY, left: newX});
    }
}

},{}],10:[function(require,module,exports){
module.exports = {

app : {
    user : '👤',
    users : '👥',
    gear : '⚙️',
    lock : '🔒',
    'open-lock' : '🔓',
    key : '🔑',
    home : '🏠',
    exit : '🚪',
    call : '📞',
    search : '🔍',
    battery : '🔋',
    'power-plug' : '🔌',
    alarm : '🔔',
    'volume-min' : '🔈',
    'volume-mid' : '🔉',
    'volume-max' : '🔊',
    'dim' : '🔅',
    'bright' : '🔆',
    access : '♿',
    bars : '☰',
    'h-dots' : '⋯',
    'v-dots' : '⋮',
    rows : '▤',
    columns : '▥',
    grid : '▦',
    'spaced-grid' : '𝍖',
    warning : '⚠',
    error : '⨂',
    ban : '🛇',
    mute : '🔇',
    'alarm-off' : '🔕',
},

office : {
    file : '📄',
    file2 : '🖻',
    file3 : '🖺',
    folder : '📂',
    edit : '✏️',
    pen : '🖊️',
    pen2 : '🖋️',
    paintbrush : '🖌️',
    cut : '✂️',
    clip : '📎',
    clipboard : '📋',
    link : '🔗',
    ruler : '📏',
    pin : '📌',
    'safety-pin' : '🧷',
    card : '💳',
    label : '🏷️',
    memo : '📝',
    scroll : '📜',
    book : '📕',
    books : '📚',
    bookmark : '🔖',
    'open-book' : '📖',
    notebook : '📓',
    notepad : '🗒️',
    calendar : '📅',
    envelope : '✉️',
    email : '📧',
    mailbox : '📫',
    package : '📦',
    briefcase : '💼',
    newspaper : '📰',
    cabinet : '🗄️',
    'trash-can' : '🗑️',
},

electronics : {
    laptop : '💻',
    desktop : '🖥️',
    keyboard : '⌨️',
    'pc-mouse' : '🖱️',
    printer : '🖨️',
    smartphone : '📱',
    telephone : '☎️',
    microphone : '🎤',
    'studio-mic' : '🎙️',
    headphones : '🎧',
    camera : '📷',
    'video-camera' : '📹',
    'movie-camera' : '🎥',
    projector : '📽️',
    tv : '📺',
    radio : '📻',
    stereo : '📾',
    loudspeaker : '📢',
    gamepad : '🎮',
    joystick : '🕹️',
    'sd-card' : '⛘',
    cd : '💿',
    minidisc : '💽',
    floppy : '💾',
    tape : '📼',
},

tools : {
    wrench : '🔧',
    hammer : '🔨',
    pick : '⛏️',
    tools : '🛠️',
    tools2 : '⚒️',
    toolbox : '🧰',
    clamp : '🗜️',
    bolt : '🔩',
    anchor : '⚓',
    scales : '⚖️',
    'old-key' : '🗝️',
    map : '🗺️',
    compass : '🧭',
    magnet : '🧲',
    abacus : '🧮',
    bulb : '💡',
    flashlight : '🔦',
    microscope : '🔬',
    telescope : '🔭',
    antenna : '📡',
    satellite : '🛰️',
    watch : '⌚',
    stopwatch : '⏱️',
    clock : '⏰',
    hourglass : '⌛',
    dagger : '🗡️',
    swords : '⚔️',
    shield : '🛡️',
    bow : '🏹',
    gun : '🔫',
},

vehicles : {
    skate : '🛹',
    scooter : '🛴',
    bicycle : '🚲',
    motorscooter : '🛵',
    motorcycle : '🏍️',
    car : '🚗',
    'race-car' : '🏎️',
    rv : '🚙',
    bus : '🚌',
    minibus : '🚐',
    truck : '🚚',
    ambulance : '🚑',
    'fire-engine' : '🚒',
    metro : '🚇',
    train : '🚄',
    locomotive : '🚂',
    canoe : '🛶',
    sailboat : '⛵',
    speedboat : '🚤',
    motorboat : '🛥️',
    ferry : '⛴️',
    ship : '🚢',
    plane : '✈️',
    'small-plane': '🛩️',
    helicopter : '🚁',
    rocket : '🚀',
    ufo : '🛸',
},

faces : {
    man : '👨',
    woman : '👩',
    prince : '🤴',
    princess : '👸',
    robot : '🤖',
    skull : '💀',
    imp : '👿',
    monster : '👾',
    alien : '👽',
    ghost : '👻',
    goblin : '👺',
    ogre : '👹',
},

characters : {
    teacher : '👨‍🏫',
    teacherw : '👩‍🏫',
    scientist : '👨‍🔬',
    scientistw : '👩‍🔬',
    hacker : '👨‍💻',
    hackerw : '👩‍💻',
    artist : '👨‍🎨',
    artistw : '👩‍🎨',
    doctor : '👨‍⚕️',
    doctorw : '👩‍⚕️',
    astronaut : '👨‍🚀',
    astronautw : '👩‍🚀',
    elf : '🧝‍♂️',
    elfw : '🧝‍♀️',
    mage : '🧙‍♂️',
    magew : '🧙‍♀️',
    genie : '🧞‍♂️',
    geniew : '🧞‍♀️',
    fairy : '🧚',
    fairym : '🧚‍♂️',
    vampire : '🧛‍♂️',
    vampirew : '🧛‍♀️',
    zombie : '🧟‍♂️',
    zombiew : '🧟‍♀️',
},

animals : {
    elefant : '🐘',
    rhino : '🦏',
    monkey : '🐒',
    gorilla : '🦍',
    sheep : '🐑',
    ram : '🐏',
    goat : '🐐',
    deer : '🦌',
    camel : '🐪',
    horse : '🐎',
    pig : '🐖',
    cow : '🐄',
    turtle : '🐢',
    rabbit : '🐇',
    squirrel : '🐿️',
    hedgehog : '🦔',
    badger : '🦡',
    mouse : '🐁',
    rat : '🐀',
    cat : '🐈',
    dog : '🐕',
    leopard : '🐆',
    tiger : '🐅',
    snake : '🐍',
    gecko : '🦎',
    crocodile : '🐊',
    dragon : '🐉',
    dinosaur : '🦕',
    't-rex' : '🦖',
    dolphin : '🐬',
    shark : '🦈',
    whale : '🐋',
    whale2 : '🐳',
    fugu : '🐡',
    nemo : '🐟',
    dori : '🐠',
    shrimp : '🦐',
    crab : '🦀',
    lobster : '🦞',
    squid : '🦑',
    octopus : '🐙',
    penguin : '🐧',
    bird : '🐦',
    dove : '🕊️',
    parrot : '🦜',
    eagle : '🦅',
    duck : '🦆',
    swan : '🦢',
    owl : '🦉',
    bat : '🦇',
    turkey : '🦃',
    rooster : '🐓',
    chick : '🐥',
    chick2 : '🐤',
    chick3: '🐣',
    snail : '🐌',
    butterfly : '🦋',
    bee : '🐝',
    ant : '🐜',
    cricket : '🦗',
    bug : '🐛',
    ladybug : '🐞',
    spider : '🕷️',
    scorpion : '🦂',
    microbe : '🦠',
},

plants : {
    leaf : '🍂',
    herb : '🌿',
    maple : '🍁',
    shamrock : '☘️',
    luck : '🍀',
    wheat : '🌾',
    corn : '🌽',
    flower : '🌼',
    sunflower : '🌻',
    rose : '🌹',
    hibiscus : '🌺',
    sakura : '🌸',
    tulip : '🌷',
    tree : '🌳',
    pine : '🌲',
    'palm-tree' : '🌴',
    cactus : '🌵',
    sprout : '🌱',
    mushroom : '🍄',
    nut : '🌰',
},

nature : {
    sun : '☀️',
    moon : '🌕',
    'new-moon' : '🌑',
    'crescent-moon' : '🌙',
    fire : '🔥',
    water : '💧',
    wave : '🌊',
    ice : '❄',
    wind : '💨',
    cloud : '☁️',
    mountain : '⛰️',
    volcano : '🌋',
    rainbow : '🌈',
    comet : '☄️',
    asiania : '🌏',
    americas : '🌎',
    eurafrica : '🌍',
    galaxy : '🌌',
    dna : '🧬',
},

actions : {
    add : '✚',
    remove : '─',
    undo : '↶',
    redo : '↷',
    reload : '⟳',
    sync : '🗘',
    minimize : '🗕',
    restore : '🗗',
    maximize : '🗖',
    close : '⨯',
    copy : '🗇',
    accept : '✔️',
    cancel : '✖️',
    eject : '⏏',
    play : '▶',
    pause : 'Ⅱ',
    'play-pause' : '⏯',
    stop : '■',
    prev : '⏮',
    next : '⏭',
    rec : '⚫',
    'rec-on' : '🔴',
    select : '⛶',
    select2 : '⬚',
},

culture : {
    pommee : '🕂',
    maltese : '✠',
    latin : '✝',
    latin2 : '🕇',
    celtic : '🕈',
    jew : '✡',
    ankh : '☥',
    peace : '☮',
    om : '🕉',
    'ying-yang' : '☯',
    atom : '⚛️',
    comunism : '☭',
    'moon-star' : '☪',
    health : '⛨',
    darpa : '☸',
    diamonds : '❖',
},

music : {
    note : '🎵',
    notes : '🎶',
    sharp : '♯',
    flat : '♭',
    cleff : '🎼',
    'cleff-g' : '𝄞',
    'cleff-f' : '𝄢',
    'cleff-c' : '𝄡',
    guitar : '🎸',
    piano : '🎹',
    violin : '🎻',
    saxophone : '🎷',
    trumpet : '🎺',
    drum : '🥁',
},

astro : {
    aries : '♈',
    tauro : '♉',
    gemini : '♊',
    piscis : '♋',
    leo : '♌',
    virgo : '♍',
    libra : '♎',
    scorpio : '♏',
    sagitarius : '♐',
    capricorn : '♑',
    aquarius : '♒',
    cancer : '♓',
    mercury : '☿️',
    venus : '♀',
    earth : '♁',
    mars : '♂',
    jupiter : '♃',
    saturn : '♄',
    uranus : '♅',
    neptune : '♆',
    pluto : '♇',
    ceres : '⚳',
    pallas : '⚴',
    juno : '⚵',
    vesta : '⚶',
    chiron : '⚷',
},

chess : {
    wqueen : '♔',
    wking : '♕',
    wtower : '♖',
    wbishop : '♗',
    whorse : '♘',
    wpawn : '♙',
    bqueen : '♚',
    bking : '♛',
    btower : '♜',
    bbishop : '♝',
    bhorse : '♞',
    bpawn : '♟',
},

arrows : {
    /*
    ↑ ↓ ← → 
    ⬅ ➡ ⬆ ⬇
    ⇦ ⇨ ⇧ ⇩ 
    ◀ ▶ ▲ ▼ 
    ◁ ▷ △ ▽ 
    ↶ ↷
    */
},

keys : {
    command : '⌘',
    option : '⌥',
    shift : '⇧',
    'caps-lock' : '⇪',
    backspace : '⌫',
    return : '⏎',
    enter : '⎆',
    escape : '⎋',
    tab : '↹',
},

geometric : {
    triangle : '▲',
    square : '■',
    pentagon : '⬟',
    hexagon : '⬢',
    circle : '●',
    'curved-triangle' : '🛆',
    'curved-square' : '▢',
    'square-quadrant' : '◰',
    'round-quadrant' : '◴',
    contrast : '◐',
    contrast2 : '◧',
    contrast3 : '◩',
},

hieroglyph : {
    'an-eye' : '𓁹',
    'tear-eye' : '𓂀',
    'an-ear' : '𓂈',
    'writing-arm' : '𓃈',
    'a-leg' : '𓂾',
    'watering-leg' : '𓃂',
    'closed-hand' : '𓂧',
    'open-hand' : '𓂩',
    'a-finger' : '𓂭',
    'crying-blank-eye' : '𓂍',
    'arms-hat-spear' : '𓂙',
    'a-staff' : '𓋈',
    'a-fan' : '𓇬',
    'a-jar' : '𓄣',
    'a-beetle' : '𓆣',
    'a-wasp' : '𓆤',
    'a-fairy' : '𓋏',
    'sitting-man' : '𓀀',
    'happy-sitting-man' : '𓁏',
    'exited-sitting-man' : '𓁕',
    'sitting-woman' : '𓁑',
    'sitting-bird-man' : '𓁟',
    'sitting-wolf-man' : '𓁢',
    'dancing-man' : '𓀤',
    'broken-arms-man' : '𓀣',
    'upside-down-man' : '𓀡',
    'dead-guy' : '𓀿',
    'three-leg-guy' : '𓁲',
},

other : {
    'thumbs-up' : '👍',
    'thumbs-down' : '👎',
    cool : '🤙',
    metal : '🤘',
    spock : '🖖',
    strong : '💪',
    eye : '👁️',
    ear : '👂',
    brain : '🧠',
    glasses : '👓',
    sunglasses : '🕶️',
    goggles : '🥽',
    ribbon : '🎀',
    backpack : '🎒',
    cart : '🛒',
    poo : '💩',
    heart : '❤️',
    hearts : '💕',
    'broken-heart' : '💔',
    star : '⭐',
    crown : '👑',
    trophy : '🏆',
    diamond : '💎',
    jar : '🏺',
    pill : '💊',
    globe : '🌐',
    voltage : '⚡',
    flag : '⚑',
    film : '🎞️',
    recycle : '♻',
    network : '🖧',
    newbie : '🔰',
    trident : '🔱',
    japan : '🗾',
    fuji : '🗻',
    'tokyo-tower' : '🗼',
    liberty : '🗽',
    die : '🎲',
    palette : '🎨',
    frame : '🖼️',
    'crystal-ball' : '🔮',
    bomb : '💣',
    poison : '☠️',
    bitcoin : '₿',
    bisexual : '⚥',
    pansexual : '⚧',
},

/*

🐼🐻🐺🐮🐷🐭🐹🐰🐱🐶🐵🐴🐯🐲🐨🐸🦄

sports & entertainment
🏄🏃🏂🏇🏊🏀⚽⚾🎾⛷⛸⛵⛵
🎳🎲🎱🎰🎯🎭🎬🎩
🎊🎉🎈🎇🎆🎅🎄🎃🎂🎁

food & drink
🍔🍕🍝🍞🍟🍖🍗🍙🍚🍛🍜🍡🍣🍤
🍲🍱🍰🍮🍬🍫🍪🍩🍨🍧🍦
🍓🍒🍑🍐🍏🍎🍍🍌🍋🍊🍉🍈🍇🍅🍄
🍻🍺🍹🍸🍷🍶🍴🍳

other
🎐🎏🎎🎋🏯
🏰🏭🏬🏫🏪🏩🏨🏧🏦🏥🏣🏢
✋❦

*/

}

},{}],11:[function(require,module,exports){
(function (global){
require('./extensions')
const { History, Pager, state, crud } = require('./components')
const utils = require('./utils')
const { is, sameType, resolveAttr, html } = utils
const { themes, themeMaps } = require('./themes')

const options = {
    persist : false,
    history : false,
    root    : '',
    theme   : 'base',
    lang    : '',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
    newEl   : 'New element',
    imgPath : 'img/',
    imgExt  : '.png',
}

const breakpoints = {
    phone : 500,
    tablet : 800,
}
const media = {}
for (let device in breakpoints) {
    media[device] = window.matchMedia(`(max-width: ${ breakpoints[device] }px)`).matches
}

const TEXT_ATTRS = 'label header text placeholder'.split(' ')
const EVENT_ATTRS = 'click change hover load'.split(' ')
const ACTION_ATTRS = 'show hide toggle'.split(' ')
const NOCHILD_TAGS = 'input select textarea img'.split(' ')

const log = (...params) => {
    if (rasti.options.log.search(/debug/i) != -1) console.log.call(this, ...params)
}
const warn = (...params) => {
    if (rasti.options.log.search(/(warn)|(debug)/i) != -1) console.warn.call(this, ...params)
}
const error = (...params) => {
    console.error.call(this, ...params)
}


function rasti(name, container) {

    const errPrefix = 'Cannot create rasti app: '

    if ( !is.string(name) ) return error(errPrefix + 'app must have a name!')

    this.name = name.replace(' ', '')

    if ( !container ) {
        container = $('body')
    }
    else if ( !(container.selector) ) {
        if ( is.string(container) || (container.tagName && 'BODY DIV'.search(container.tagName) != -1) ) container = $(container)
        else return error(errPrefix + 'app container is invalid. Please provide a selector string, a jQuery object ref or a DOM element ref')
    }
    container.attr('rasti', this.name)
    
    const self = this

    let invalidData = 0


    // private properties  

    this.active = {
        page  : null,
        theme : '',
        lang  : '',
    }
    this.pagers = new Map()
    this.crud = crud(this)


    // public properties

    this.options = Object.assign({}, options)
    this.defaults = {
        stats : self.options.stats,
        noData : self.options.noData,
    }
    this.state = state(this)

    this.props = {}
    this.methods = {}
    this.pages = {}
    this.templates = {}
    this.data = {}
    this.langs = {}

    this.themes = themes
    this.themeMaps = themeMaps


    // methods

    function extend(props) {
        if (!props || !is.object(props)) return error('Cannot extend app: no properties found')
        for (let key in self) {
            if ( is.object(self[key]) && is.object(props[key]) )
                Object.assign(self[key], props[key])
        }
    }


    function init(options) {
        const initStart = window.performance.now()
        log('Initializing app [%s]...', self.name)

        container
            .addClass('big loading backdrop')
            .removeAttr('hidden')

        // cache options
        if (options) {
            if ( !is.object(options) ) warn('Init options must be an object!')
            else Object.keys(self.options).forEach( key => {
                if (options[key]) {
                    if ( !sameType(self.options[key], options[key])  ) warn('Init option [%s] is invalid', key)
                    else self.options[key] = options[key]
                }
            })
        }


        // apply defaults
        Object.keys(self.defaults).forEach( key => {
            if (!self.options[key]) self.options[key] = self.defaults[key]
        })
        

        // define lang (if not already defined)
        if (!self.options.lang) {
            const keys = Object.keys(self.langs)
            if (keys.length) self.options.lang = keys[0]
        }


        // append theme style container
        container.append('<style theme>')


        // append page-options containers
        container.find('[page]').each( (i, el) => {
            $(el).append('<div class="page-options">')
        })


        // init rasti blocks
        container.find('[block]').each( (i, el) => {
            initBlock($(el))
        })


        // create items for selects and lists with data source
        container.find('select[data]')
            .add('ol[data]', container)
            .add('ul[data]', container)
            .each( (i, el) => {
                updateBlock($(el))
            })


        // create tabs
        container.find('.tabs').each( (i, el) => {
            createTabs($(el))
        })
        if (media.tablet || media.phone) container.find('.tabs-tablet').each( (i, el) => {
            createTabs($(el))
        })
        if (media.phone) container.find('.tabs-phone').each( (i, el) => {
            createTabs($(el))
        })


        // add close btn to modals
        container.find('[modal]').each( (i, el) => {
            $('<div icon=close class="top right" />')
            .on('click', e => {
                el.style.display = 'none'
                self.active.page.find('.backdrop').removeClass('backdrop')
            })
            .appendTo(el)
        })


        // auto-close menus
        container.find('[menu]').each( (i, el) => {
            $(el).on('click', e => {
                el.style.display = 'none'
            })
        })


        // init field validations
        container.find('[validate]').each( (i, btn) => {
            btn.disabled = true
            const $container = $(btn).parent()
            const $fields = $container.find('[required]')
            $fields.each( (i, field) => {
                const invalid = field.validity && !field.validity.valid
                field.classList.toggle('error', invalid)
                $(field).change( e => {
                    invalid = field.validity && !field.validity.valid
                    field.classList.toggle('error', invalid)
                    btn.disabled = $container.find('.error').length
                })
            })
        })


        // init nav
        container.find('[nav]').click( e => {
            const el = e.target
            const $el = $(el)
            const page = $el.attr('nav')
            let params = {}

            if (!page) return error('Missing page name in [nav] attribute of element:', el)

            if (el.hasAttribute('params')) {
                const $page = self.active.page
                let navparams = $el.attr('params')
                let $paramEl

                if (navparams) {
                    // check to see if params is an object
                    if (navparams[0]=='{') {
                        try {
                            params = JSON.parse(navparams)
                        }
                        catch(err){
                            error('Invalid JSON in [params] attribute of element:', el)
                            error('Tip: be sure to use double quotes ("") for both keys and values')
                            return
                        }
                    }
                    else {
                        // get values of specified navparams
                        navparams = params.split(' ')
                        navparams.forEach( key => {
                            $paramEl = $page.find('[navparam='+ key +']')
                            if ($paramEl.length) params[key] = $paramEl.val()
                            else warn('Could not find navparam element [%s]', key)
                        })
                    }
                }
                else {
                    // get values of all navparams in page
                    $page.find('[navparam]').each( (i, el) => {
                        const $el = $(el)
                        const key = resolveAttr($el, 'navparam')
                        if (key) params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })


        // init submit
        container.find('[submit]').click( e => {
            const $el = $(e.target)
            const method = $el.attr('submit')
            const callback = $el.attr('then')
            const template = $el.attr('render')
            const isValidCB = callback && is.function(self.methods[callback])
            const start = window.performance.now()

            if (!method) return error('Missing method in [submit] attribute of el:', this)

            if (callback && !isValidCB) error('Undefined method [%s] declared in [then] attribute of el:', callback, this)
            
            $el.addClass('loading').attr('disabled', true)

            submitAjax(method, resdata => { 
                const time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)

                if (isValidCB) self.methods[callback](resdata)
                if (template) render(template, resdata, time)

                $el.removeClass('loading').removeAttr('disabled')
            })
        })


        // init render
        container.find('[render]').not('[submit]').click( e => {
            const el = e.target
            const template = el.getAttribute('render')
            if (!template) return error('Missing template name in [render] attribute of element:', el)
            render(template)
        })


        // init field dependencies
        container.find('[prop][bind]').each( (i, el) => {
            const $el = $(el)
            const deps = $el.attr('bind')
            if (deps) deps.split(' ').forEach( dep => {
                $el.closest('[page]').find('[prop='+ dep +']')
                    .change( e => { updateBlock($el) })
            })
        })


        // init actions
        for (let action of EVENT_ATTRS) {
            container.find('[on-'+ action +']').each( (i, el) => {
                const $el = $(el)
                const methodName = $el.attr('on-' + action)
                if ( !methodName ) return error('Missing utility method in [on-%s] attribute of element:', action, el)
                const method = self.methods[methodName]
                if ( !method ) return error('Undefined utility method "%s" declared in [on-%s] attribute of element:', methodName, action, el)
                $el.on(action, method)
                   .removeAttr('on-' + action)
                if (action == 'click') el.style.cursor = 'pointer'
            })
        }
        for (let action of ACTION_ATTRS) {
            container.find('['+ action +']').each( (i, el) => {
                const $el = $(el)
                const $page = $el.closest('[page]')
                const targetSelector = $el.attr(action)

                if ( !targetSelector ) return error('Missing target selector in [%s] attribute of element:', action, el)
                let $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)

                $el.on('click', e => {
                    const target = $target[0]
                    if (target.hasAttribute('modal')) $page.find('.page-options').toggleClass('backdrop')
                    $target[action]()
                    target.style.display != 'none'
                        ? target.focus()
                        : target.blur()
                })
            })
        }


        // init pages
        let page
        let $page
        for (let name in self.pages) {
            page = self.pages[name]
            if ( !is.object(page) ) return error('pages.%s must be an object!', name)
            $page = container.find('[page='+ name +']')
            if ( !$page.length ) return error('No container found for page "%s". Please bind one via [page] attribute', name)
            if (page.init) {
                if ( !is.function(page.init) ) return error('pages.%s.init must be a function!', name)
                else {
                    log('Initializing page [%s]', name)
                    self.active.page = $page // to allow app.get() etc in page.init
                    page.init()
                }
            }
        }
        self.active.page = null // must clear it in case it was assigned


        // resolve empty attributes
        TEXT_ATTRS.forEach( attr => {
            let $el
            container.find('['+attr+'=""]').each( (i, el) => {
                $el = $(el)
                $el.attr( attr, resolveAttr($el, attr) )
            })
        })


        // resolve bg images
        container.find('[img]').each( (i, el) => {
            let path = resolveAttr($(el), 'img')
            if (path.indexOf('/')==-1) path = self.options.imgPath + path
            if (path.charAt(path.length-4)!='.') path += self.options.imgExt
            el.style['background-image'] = `url(${path})`
        })


        // fix labels
        NOCHILD_TAGS.forEach( tag => {
            container.find(tag + '[label]').each( (i, el) => {
                fixLabel($(el))
            })
        })


        // fix icons
        container.find('input[icon]').each( (i, el) => {
            fixIcon($(el))
        })


        // bind nav handler to popstate event
        window.onpopstate = e => {
            var page = e.state || location.hash.substring(1)
            page
                ? e.state ? navTo(page, null, true) : navTo(page)
                : navTo(self.options.root)
        }


        // init history (if applicable)
        if (self.options.history) initHistory()


        // restore and persist state (if applicable)
        let restored
        if (self.options.persist) {
            restored = self.state.restore()
            $(window).on('beforeunload', e => { self.state.save() })
        }

        if ( !self.options.persist || !restored ) {

            // set lang (if applicable and not already set)
            if ( self.options.lang && !self.active.lang ) setLang(self.options.lang)
            // if no lang, generate texts
            if ( !self.options.lang ) {
                container.find('[text]').each( (i, el) => {
                    $(el).text( $(el).attr('text') )
                })
            }

            // set theme (if not already set)
            if ( !self.active.theme ) setTheme(self.options.theme)

            // nav to page in hash or to root or to first page container
            const page = location.hash.substring(1) || self.options.root
            navTo(
                page && self.pages[page]
                ? page
                : container.find('[page]').first().attr('page')
            )
        }


        // init statefull elements
        container.find('[state]').each( (i, el) => {
            const $el = $(el)
            const prop = resolveAttr($el, 'state')

            if (!prop) return

            if (el.value !== undefined) {
                // it's an element
                bindElement($el, prop)
            }
            else {
                // it's a container
                $el.find('[prop]').each( (i, el) => {
                    const $el = $(el)
                    const subprop = $el.attr('prop')
                    if (subprop) bindElement($el, prop, subprop)
                })
            }

            function bindElement($el, prop, subprop){
                const root = self.state

                if (subprop) {
                    // go down one level
                    root[prop] = root[prop] || {}
                    root = root[prop]
                    prop = subprop
                }
                if ( root[prop] ) {
                    // update ui from restored state
                    $el.val( root[prop] )
                    if ( $el.attr('block') ) $el.trigger('change')
                }
                else {
                    // first invocation, create empty (sub)prop
                    root[prop] = ''
                }

                $el.on('change', e => {
                    // update state on ui change
                    root[prop] = $el.val()
                })
            }
        })


        // render automatic templates
        container.find('[auto][template]').each( (i, el) => {
            render(el)
        })


        // init bound templates
        container.find('[bind][template]').each( (i, el) => {
            bind(el)
        })


        // init crud templates
        container.find('[crud][template]').each( (i, el) => {
            const $el = $(el)
            const template = resolveAttr($el, 'template')
            const datakey = resolveAttr($el, 'data')

            render(el)

            $el.on('click', '.rasti-crud-delete', e => {
                const $controls = $(e.currentTarget).closest('[data-id]')
                const id = $controls.attr('data-id')
                if ( id && self.crud.delete(datakey, id) ) {
                    $controls.parent().detach()
                    log('Removed element [%s] from template [%s]', id, template)
                }
            })

            $el.on('click', '.rasti-crud-update', e => {
                // TODO: add update logic
            })

            $el.on('click', '.rasti-crud-create', e => {
                self.crud.showInputEl($el)
                $el.addClass('active')
            })

            $el.on('click', '.rasti-crud-accept', e => {
                // TODO: finish this
                const newel = self.crud.genDataEl($el)
                if (newel && self.crud.create(datakey, newel) ) {
                    self.crud.persistNewEl($el)
                }
                $el.removeClass('active')
            })

            $el.on('click', '.rasti-crud-cancel', e => {
                self.crud.hideInputEl($el)
                $el.removeClass('active')
            })
        })


        // init move
        container.find('.movable').each( (i, el) => {
            $(el).move()
        })


        // init collapse
        container.find('.collapsable').on('click', e => {
            e.target.classList.toggle('folded')
        })


        container
            .on('click', '.backdrop', e => {
                $(e.target).removeClass('backdrop')
                self.active.page.find('[modal]').hide()
            })
            .removeClass('big loading backdrop')

        const initTime = Math.floor(window.performance.now() - initStart) / 1000
        log('App [%s] initialized in %ss', self.name, initTime)

    }


    function get(selector) {
        var $els = self.active.page && self.active.page.find('['+ selector +']')
        if (!$els || !$els.length) $els = container.find('['+ selector +']')
        if (!$els.length) warn('No elements found for selector [%s]', selector)
        return $els
    }

    function set(selector, value) {        
        var $els = get(selector)
        $els.each( (i, el) => {
            el.value = value
            $(el).change()
        })
        return $els
    }

    function add(selector, ...values) {
        var $els = get(selector)
        $els.each( (i, el) => {
            values.forEach( val => {
                if (is.array(val)) el.value = el.value.concat(val)
                else el.value.push(val)
            })
            $(el).change()
        })
        return $els
    }


    function navTo(pagename, params, skipPushState) {

        if (!pagename) return error('Cannot navigate, page undefined')

        var $prevPage = self.active.page,
            prevPagename = $prevPage && $prevPage.attr('page'),
            prevPage = prevPagename && self.pages[prevPagename]
        
        if (pagename == prevPagename) return

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) return error('Cannot navigate to page [%s]: page container not found', pagename)

        if ($prevPage) $prevPage.removeClass('active')

        if (prevPage && prevPage.out) {
            !is.function(prevPage.out)
                ? warn('Page [%s] {out} property must be a function!', prevPagename)
                : prevPage.out(params)
        }

        self.active.page = $page

        if ( params && !is.object(params) ) warn('Page [%s] nav params must be an object!', pagename)
        if (page && page.in) {
            !is.function(page.in)
                ? warn('Page [%s] {in} property must be a function!', pagename)
                : page.in(params)
        }

        $page.addClass('active')

        container
            .find('nav [nav]').removeClass('active')
            .filter('[nav='+ pagename +']').addClass('active')

        container.trigger('rasti-nav')

        if (skipPushState) return
        if (page && page.url) {
            !is.string(page.url)
                ? warn('Page [%s] {url} property must be a string!', pagename)
                : window.history.pushState(pagename, null, '#'+page.url)
        }
        else {
            window.history.pushState(pagename, null)
        }
    }


    function bind(el) {
        const errPrefix = 'Cannot bind template: '
        const $el = el.nodeName ? $(el) : el
        el = $el[0]
        const src = $el.attr('bind')
        const $src = container.find('[name='+ src +']')
        if (!$src.length) return error(errPrefix + 'source element "%s" not found, declared in [bind] attribute of el: ', src, el)
        $el.attr('template', 'bind=' + src)
        $src.on('change', e => render($el, e.target.value))
            .trigger('change')
    }


    function render(el, data, time) {
        let $el, name
        if ( is.string(el) ) {
            name = el
            $el = container.find('[template='+ name +']')
        }
        else {
            $el = el.nodeName ? $(el) : el
            name = $el.attr('template')
        }
        const errPrefix = 'Cannot render template ['+ name +']: '
        if (!$el.length) return error(errPrefix + 'no element bound to template. Please bind one via [template] attribute.')
        el = $el[0]

        if (!data) {
            const datakey = resolveAttr($el, 'data')
            if (!datakey) return error(errPrefix + 'no data found for template. Please provide in ajax response or via [data] attribute in element:', el)
            data = self.data[datakey]
            if (!data) return error(errPrefix + 'undefined data source "%s" resolved for element:', datakey, el)
        }
        if ( is.string(data) ) data = data.split(', ')
        if ( !is.array(data) ) return error(errPrefix + 'invalid data provided, must be a string or an array')
        if (!data.length) return $el.html(`<div msg center textc>${ self.options.noData }</div>`)

        let template = self.templates[name]
        let html
        if (!template || is.string(template)) try {
            html = template || $el.html()
            html = html.trim()
            template = genTemplate(html)
            template.html = html
            self.templates[name] = template
        }
        catch(err) {
            return error(errPrefix + 'parsing error: ' + err)
        }
        if (!is.function(template)) return error(errPrefix + 'template must be a string or a function')

        const isCrud = el.hasAttribute('crud')
        if (isCrud) {
            if (is.object(data[0]) && !data[0].id) data.forEach((el, i) => el.id = i)
            //log('crud data:', data)
            const el_controls =
                '<div class="rasti-crud right centery small_ round_ inline_" data-id=${ rasti.utils.is.object(data) ? data.id : data }>\
                    <div class="rasti-crud-update" icon=edit></div>\
                    <div class="rasti-crud-delete" icon=trash-can></div>\
                </div>'
            html = append(template.html, el_controls)
            template = genTemplate(html)
            template.html = html
        }

        const paging = $el.attr('paging')
        paging
            ? initPager($el, template, data, getActiveLang())
            : $el.html( template(data).join('') )

        if (el.hasAttribute('stats')) {
            const stats = $('<div section class="stats">')
            stats.html( self.options.stats.replace('%n', data.length).replace('%t', time) )
            $el.prepend(stats)
        }

        if (isCrud) {
            const container_controls = `
                <div class="rasti-crud right small_ round_ ">
                    <div class="rasti-crud-create" icon=star></div>
                    <div class="rasti-crud-accept" icon=accept></div>
                    <div class="rasti-crud-cancel" icon=cancel></div>
                </div>`
            $el.prepend(container_controls)
            self.crud.genInputEl($el)
        }

        $el.addClass('rendered')
        if (!paging) applyFX($el)

    }


    function genTemplate(html) {
        return data => evalTemplate(html, data, self.props, self.methods, getActiveLang())
    }

    function evalTemplate(string, dataArray, props, methods, lang) {
        return dataArray.map(data => eval('html`'+string+'`'))
    }

    function wrap(template, wrapper) {
        return (data, props, methods, lang) => template(data, props, methods, lang).map(html => wrapper.replace('{{content}}', html))
    }

    function append(html, appendix) {
        return html.substring(0, html.length-6).concat(appendix + '</div>')
    }

    function applyFX($el, selector) {
        const el = $el[0]
        const fxkey = $el.attr('fx')
        if (!fxkey) return
        const fx = rasti.fx[fxkey]
        if (!fx) return warn('Undefined fx "%s" declared in [fx] attribute of element', fxkey, el)
        if ( !is.function(fx) ) return error('fx.%s must be a function!', fxkey)
        if ( selector && !is.string(selector) ) return error('Cannot apply fx, invalid selector provided for el', el)
        const $target = selector ? $el.find(selector) : $el
        if (!$target.length) return warn('Cannot apply fx, cannot find target "%s" in el', target, el)
        fx($target)
    }

    function getActiveLang() {
        return self.langs && self.langs[self.active.lang]
    }


    function setTheme(themeString) {
        var themeName = themeString.split(' ')[0],
            theme = self.themes[themeName],
            baseTheme = self.themes.base,
            baseMap = self.themeMaps.dark

        if (!theme) return error('Cannot set theme [%s]: theme not found', themeName)

        var mapName = themeString.split(' ')[1] || ( is.object(theme.maps) && Object.keys(theme.maps)[0] ) || 'dark',
            themeMap = ( is.object(theme.maps) && theme.maps[mapName] ) || self.themeMaps[mapName]

        if (!themeMap) {
            warn('Theme map [%s] not found, using default theme map [dark]', mapName)
            themeMap = baseMap
            mapName = 'dark'
        }

        log('Setting theme [%s:%s]', themeName, mapName)
        self.active.theme = themeName
        
        // clone themeMap
        themeMap = Object.assign({}, themeMap)

        var values = { font : theme.font || baseTheme.font, },
            colorNames, colors, c1, c2, defaultColorName

        // map palette colors to attributes
        for (let attr of Object.keys(baseMap)) {
            colorNames = themeMap[attr] || baseMap[attr]
            colorNames = [c1, c2] = colorNames.split(' ')
            colors = [theme.palette[ c1 ], theme.palette[ c2 ]]

            for (let i in colors) {
                defaultColorName = baseMap[attr].split(' ')[i]
                if (defaultColorName && !colors[i]) {
                    // look for color in base palette
                    colors[i] = baseTheme.palette[ colorNames[i] ]
                    if (!colors[i]) {
                        warn('Color [%s] not found in theme nor base palette, using it as is', colorNames[i])
                        colors[i] = colorNames[i]
                        /*
                        warn('Mapping error in theme [%s] for attribute [%s]. Color [%s] not found. Falling back to default color [%s].', themeName, attr, colorNames[i], defaultColorName)
                        colors[i] = baseTheme.palette[ defaultColorName ]
                        */
                    }
                }
            }

            values[attr] = colors
            if (themeMap[attr]) delete themeMap[attr]
        }

        var invalidKeys = Object.keys(themeMap)
        if (invalidKeys.length) warn('Ignored %s invalid theme map keys:', invalidKeys.length, invalidKeys)

        // generate theme style and apply it
        container.find('style[theme]').html( getThemeStyle(values) )

        // apply bg colors
        var colorName, color
        container.find('[bg]').each( (i, el) => {
            colorName = el.getAttribute('bg')
            color = theme.palette[colorName] || baseTheme.palette[colorName]
            if (color) el.style['background-color'] = color
            else warn('Invalid color [%s] declared in el:', colorName, el)
        })
    }


    function setLang(langName) {
        var lang = self.langs[ langName ],
            errPrefix = 'Cannot set lang [%s]: '

        if (!lang) return error(errPrefix + 'lang not found', langName)
        if ( !is.object(lang) ) return error(errPrefix + 'lang must be an object!', langName)

        log('Setting lang [%s]', langName)
        self.active.lang = langName

        var $elems = $(), $el, keys, string
        
        TEXT_ATTRS.forEach( attr => {
            $elems = $elems.add('['+attr+']')
        })

        $elems.each( (i, el) => {
            if (el.hasAttribute('fixed')) el = el.children[0]
            $el = $(el)   
            keys = el.langkeys

            if (!keys) {
                keys = {}
                attributes.forEach( attr => {
                    if ($el.attr(attr)) keys[attr] = $el.attr(attr)
                })
                el.langkeys = keys
            }

            for (let attr in keys) {
                string = getString(langName, keys[attr])
                attr === 'text'
                    ? $el.text(string || keys[attr])
                    : string ? $el.attr(attr, string) : null
            }
        })

        Object.keys(self.defaults).forEach( key => {
            self.options[key] = lang['rasti_'+key] || self.defaults[key]
        })
    }


    function updateBlock($el, data) {
        var types = {
            SELECT : 'select',
            OL : 'list',
            UL : 'list',
        }
        var el = $el[0]
        var type = types[el.nodeName] || $el.attr('block')
        if (!type) return error('Missing block type in [block] attribute of element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" resolved for element:', type, el)
        
        if (!data) {
            var datakey = resolveAttr($el, 'data')
            if (!datakey) return

            data = self.data[datakey]
            if (!data) return error('Undefined data source "%s" resolved for element:', datakey, el)
        }

        // TODO: this should be in multi block, not here
        var $options = type === 'multi'
            ? $el.closest('[page]').find('[options='+ $el.attr('prop') +']')
            : $el

        var deps = $el.attr('deps')
        var depValues = {}
        if (deps) deps.split(' ').forEach( prop => {
            depValues[prop] = get('prop='+prop).val()
        })

        is.function(data)
            ? data(render, depValues)
            : render(data)
        
        function render(data) {
            if ( is.string(data) ) data = data.split(', ')
            $options.html( block.template(data, $el) )

            if (invalidData) {
                var prop = $el.attr('prop'),
                    page = $el.closest('[page]').attr('page')
                warn('Detected %s invalid data entries for prop [%s] in page [%s]', invalidData, prop, page)
                invalidData = 0
            }
        }


    }


    function toggleFullScreen(e) {
        var prefixes = 'moz webkit'.split(' ')
        prefixes.forEach( p => {
            if ( ! (p + 'FullscreenElement' in document) ) return
            if ( !document[ p + 'FullscreenElement' ]) {
                document.documentElement[ p + 'RequestFullScreen' ]();
            }
            else if (document[ p + 'CancelFullScreen' ]) {
                document[ p + 'CancelFullScreen' ]();
            }
        })
    }


    // internal utils

    
    function createTabs($el) {
        var el = $el[0],
            $tabs = el.hasAttribute('page')
                ? $el.children('[panel]:not([modal])')
                : el.hasAttribute('panel')
                    ? $el.children('[section]:not([modal])')
                    : undefined
        if (!$tabs) return error('[tabs] attribute can only be used in pages or panels, was found in element:', el)

        var $labels = $('<div class="tab-labels">'),
            $bar = $('<div class="bar">'),
            $tab, label, position

        $tabs.each( (i, tab) => {
            $tab = $(tab)
            $tab.attr('tab', i)
            label = resolveAttr($tab, 'tab-label') || 'TAB ' + (i+1)

            $labels.append($(`<div tab-label=${i} text="${ label }">`))
        })

        $labels.append($bar).prependTo($el)
        var $flow = $tabs.wrapAll('<div h-flow>').parent()

        $labels.on('click', e => {
            var $label = $(e.target),
                tabnr = $label.attr('tab-label'),
                $tab = $tabs.filter(`[tab="${ tabnr }"]`)

            $tabs.removeClass('active')
            $tab.addClass('active')[0].scrollIntoView()

            $labels.children().removeClass('active')
            $label.addClass('active')
            
        })

        $flow.on('scroll', e => {
            position = this.scrollLeft / this.scrollWidth
            $bar.css({ left : position * this.offsetWidth })
        })

        container.on('rasti-nav', e => {
            if (!isInActivePage($el)) return
            $bar.css({ width : $flow[0].offsetWidth / $tabs.length })
            if (!$labels.children('.active').length) $labels.children().first().click()
        })

        $(window).on('resize', e => {
            if (!isInActivePage($el)) return
            $labels.find('.active').click()
            $bar.css({ width : $flow[0].offsetWidth / $tabs.length })
        })

        function isInActivePage($el) {
            return self.active.page.find($el).length
                || self.active.page.attr('page') === $el.attr('page')
        }

    }
    

    function initBlock($el) {
        var el = $el[0]
        var type = el.nodeName == 'SELECT' ? 'select' : $el.attr('block')
        if (!type) return error('Missing block type in [block] attribute of element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        if (!is.function(block.init)) return error('Invalid or missing init function in block type "%s" declared in [block] attribute of element:', type, el)

        block.init($el)

        // if applicable, create options from data source
        if (el.hasAttribute('data')) updateBlock($el)
    }


    function initHistory() {
        self._history = new History()

        Object.defineProperty(self, 'history', { get: () => self._history.content })
        Object.defineProperties(self.history, {
            back : { value : self._history.back },
            forth : { value : self._history.forth },
        })
    }


    function initPager($el, template, data, lang) {
        var name = $el.attr('template'),
            page_size = parseInt($el.attr('paging')),
            pager = newPager(name, data, page_size),
            paging, columns, sizes, col=1, size=0

        if ($el[0].hasAttribute('columns')) columns = `<button btn icon=columns />`

        if (pager.total > 1) paging = `<div class="paging inline inline_">
                <button btn icon=prev />
                <span class=page />
                <button btn icon=next />
            </div>`

        sizes = `<button btn icon=rows />`

        $el.html(`
            <div class="results scrolly"></div>
            <div class="controls centerx bottom ib_">
                ${ columns || '' }
                ${ paging || '' }
                ${ sizes }
            </div>
        `)

        $controls = $el.children('.controls')
        $results = $el.children('.results')

        $controls.on('click', '[icon=next]', e => {
            update( pager.next() )
        })

        $controls.on('click', '[icon=prev]', e => {
            update( pager.prev() )
        })

        $controls.on('click', '[icon=rows]', e => {
            size += 1
            var newSize = pager.sizes[size % pager.sizes.length]
            pager.setPageSize(newSize)
            $(e.target).html(newSize)
            update( pager.next() )
            pager.total > 1
                ? $controls.find('.paging').show()
                : $controls.find('.paging').hide()
        })

        $controls.on('click', '[icon=columns]', e => {
            col = col+1 > 3 ? 1 : col+1
            $(e.target).html(col)
            $results.removeClass('columns-1 columns-2 columns-3')
                .addClass('columns-' + col)
        })

        update( pager.next() )

        function update(data){
            $results.html( template(data).join('') )
            $controls.find('.page').html(pager.page + '/' + pager.total)
            applyFX($el, '.results')
        }
    }

    function getPager(id) {
        let pager = self.pagers.get(id)
        if (!pager) error('No pager found for template [%s]', id)
        return pager
    }
    function newPager(id, results, page_size) {
        let pager = new Pager(id, results, page_size)
        self.pagers.set(id, pager)
        return pager
    }
    function deletePager(pager) {
        if (!pager || !pager.id) return
        self.pagers.delete(pager.id)
    }


    function submitAjax(method, callback) {
        var ajax = self.methods[ method ]
        if ( !is.function(ajax) ) return error('Ajax method ['+ method +'] is not defined')

        var $form = container.find('[ajax='+ method +']')
        if (!$form.length) return error('No container element bound to ajax method [%s]. Please bind one via [ajax] attribute', method)

        var reqdata = {}, prop
        $form.find('[prop]').each( (i, el) => {
            $el = $(el)
            prop = $el.attr('prop')
            if (prop) {
                reqdata[prop] = $el.val() || $el.attr('value')
            }
        })

        ajax(reqdata, callback)
    }


    function getThemeStyle(values) {
        var ns = `[rasti=${ self.name }]`
        return `
            ${ns} {
                font: ${ values.font };
                color: ${ values.text[0] };
                background-color: ${ values.page[0] };
            }
            ${ns} [page]    { background-color: ${ values.page[0] }; }
            ${ns} [panel]   { background-color: ${ values.panel[0] }; }
            ${ns} [section] { background-color: ${ values.section[0] }; }

            ${ns} [page][header]:before,
            ${ns} [page][footer]:after     { background-color: ${ values.page[1] }; }
            ${ns} [panel][header]:before   { background-color: ${ values.panel[1] }; }
            ${ns} [section][header]:before { background-color: ${ values.section[1] }; }

            ${ns} .tab-labels        { background-color: ${ values.panel[0] }; }
            ${ns} .tab-labels > .bar { background-color: ${ values.btn[0] }; }

            ${ns} input:not([type=radio]):not([type=checkbox]),
            ${ns} select,
            ${ns} textarea {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }

            ${ns} button,
            ${ns} [block=buttons] > div,
            ${ns} nav > div.active,
            ${ns} nav > a.active,
            ${ns} .list > div.active {
                background-color: ${ values.btn[0] };
                color: ${ values.btn[1] }; 
            }

            ${ns} [header]:before { color: ${ values.header[0] }; }
            ${ns} [label]:not([header]):before  { color: ${ values.label[0] }; }
        `
    }


    function getString(lang, key) {
        if ( !is.object(self.langs[lang]) ) {
            error('Lang [%s] is not defined', lang)
            return
        }
        var string = self.langs[lang][key]
        if ( !is.string(string) ) warn('Lang [%s] does not contain key [%s]', lang, key)
        else return string
    }


    function fixLabel($el) {
        var $div = $(`<div fixed label="${ $el.attr('label') }" >`)
        $el.wrap($div)
        $el[0].removeAttribute('label')
    }


    function fixIcon($el) {
        var $div = $(`<div icon=${ $el.attr('icon') } class=floating >`)
        $el.wrap($div)
        $el[0].removeAttribute('icon')
    }


    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }


    // api

    return {
        // objects
        options : this.options,
        props : this.props,
        methods : this.methods,
        templates : this.templates,
        data : this.data,
        pages : this.pages,
        history : this.history,
        state : this.state,
        langs : this.langs,
        themes : this.themes,
        themeMaps : this.themeMaps,

        // methods
        extend,
        init,
        navTo,
        render,
        setLang,
        setTheme,
        updateBlock,
        toggleFullScreen,
    }

}


// static properties and methods
rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils
rasti.blocks = require('./blocks/all')
rasti.icons = require('./icons')
rasti.fx = {

    stack : $el => {
        $el.addClass('fx-stack-container')
        const $children = $el.children()
        $children.each( (i, el) => {
            el.classList.add('fx-stack-el')
            setTimeout( _ => {
                el.classList.remove('fx-stack-el')
            }, i * 50);
        })
        setTimeout( _ => {
            $el.removeClass('fx-stack-container')
        }, $children.length * 50 + 500);

    },

    stamp : $el => {
        $el.addClass('fx-stamp-container')
        const $children = $el.children()
        $children.each( (i, el) => {
            el.classList.add('fx-stamp-el')
            setTimeout( _ => {
                el.classList.remove('fx-stamp-el')
            }, i * 40);
        })
        setTimeout( _ => {
            $el.removeClass('fx-stamp-container')
        }, $children.length * 40 + 500);
    },

}
rasti.options = {log : 'debug'}

module.exports = Object.freeze(rasti)



// bootstrap any apps declared via rasti attribute
function bootstrap() {
    var appContainers = $(document).find('[rasti]'),
        appName, app, extendProps

    if (appContainers.length) appContainers.forEach( container => {
        appName = container.getAttribute('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', container)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, container)
        else {
            log('Creating app [%s]...', appName)
            global[appName] = app = new rasti(appName, container)
            Object.keys(app.options).forEach( key => {
                if (container.hasAttribute(key)) {
                    app.options[key] = container.getAttribute(key)
                    // non-value boolean attributes are true
                    if (is.boolean(options[key]) && !app.options[key]) app.options[key] = true
                }
            })
            // load any declared sources
            var sources = container.getAttribute('src')
            if (sources) {
                log('Loading sources for app [%s]...', appName)
                utils.inject(sources)
            }
        }
    })
}


function genBlockStyles() {
    let styles = ['<style blocks>'], style
    for (let key in rasti.blocks) {
        style = rasti.blocks[key].style
        if (style) styles.push(style)
    }
    styles.push('</style>')
    $('head').prepend(styles.join(''))
}


function genIconStyles() {
    let styles = ['<style icons>'], glyph
    for (let category in rasti.icons) {
        category = rasti.icons[category]
        for (let name in category) {
            glyph = category[name]
            style = `[icon=${name}]:before{content:'${glyph}';}`
            styles.push(style)
        }
    }
    styles.push('</style>')
    $('head').prepend(styles.join(''))
}


$('head').prepend(`<style>/*******************************************************************************
********************************* ELEMENTS *************************************
*******************************************************************************/

body {
    margin: 0;
    overflow-x: hidden;
}

*, *:before, *:after {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: background-color 0.2s;
}

h1 { font-size: 4em; }
h2 { font-size: 3em; }
h3 { font-size: 2em; }
h4 { font-size: 1.5em; }

p.big { font-size: 1.5em; }

input, select, textarea {
    min-height: 35px;
    width: 100%;
    padding: 5px 10px;
    border: 0;
    margin: 0;
    font-size: inherit;
    vertical-align: text-bottom;
}
input:focus:invalid {
    box-shadow: 0 0 0 2px red;
}
input:focus:valid {
    box-shadow: 0 0 0 2px green;
}
input, select, textarea, button {
    border-radius: 2px;
    outline: none;
    font-family: inherit !important;
}
input[type=range], select, button {
    cursor: pointer;
}

button {
    display: inline-block;
    height: 50px;
    width: auto;
    min-width: 50px;
    padding: 10px 20px;
    border: 1px solid rgba(0,0,0,0.1);
    font-size: 1.2em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
}
button:not(:disabled):hover {
    filter: contrast(1.5);
}
button:disabled {
    filter: contrast(0.5);
    cursor: auto;
}

select {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
}

textarea {
    height: 70px;
    resize: none;
}

input.big, button.big,
.big_ > input, .big_ > button {
    min-height: 70px;
    margin-bottom: 25px;
    font-size: 1.5em;
}

input.small, button.small,
.small_ > input, .small_ > button {
    height: 25px;
    margin-bottom: 15px;
    font-size: 1em;
}

input[type=radio],
input[type=checkbox] {
    display: none;
}
input[type=radio] + label,
input[type=checkbox] + label {
    display: block;
    height: 40px;
    max-width: 90%;
    padding: 12px 0;
    margin-left: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}
input[type=radio] + label:before,
input[type=checkbox] + label:before {
    content: '\\2713';
    position: absolute;
    height: 32px;
    width: 32px;
    margin-top: -8px;
    margin-left: -36px;
    border: 1px solid #999;
    color: transparent;
    background-color: #fff;
    font-size: 2.3em;
    line-height: 1;
    text-align: center;
}
input[type=radio] + label:before {
    content: '\\25cf';
    border-radius: 50%;
    line-height: 0.8;
}
input[type=radio]:checked + label:before,
input[type=checkbox]:checked + label:before {
    color: #222;
    animation: stamp 0.4s ease-out;
}
input[type=radio] + label:hover,
input[type=checkbox] + label:hover {
    font-weight: 600;
}



/*******************************************************************************
********************************* ATTRIBUTES ***********************************
*******************************************************************************/

[page], [panel], [section] {
    position: relative;
    overflow: hidden;    
}

[page] {
    min-height: 100vh;
    width: 100vw !important;
    padding-bottom: 10px;
    margin-bottom: -5px;
    overflow-y: auto;
}
[page]:not(.active) {
	display: none !important;
}
nav ~ [page] {
    min-height: calc(100vh - 50px);
    max-height: calc(100vh - 50px);
}
.fullh[page] {
    height: 100vh;
}


[panel] {
    padding: 25px;
    border-radius: 4px;
}


[section] {
    margin-bottom: 15px;
    padding: 20px;
    border-radius: 4px;
}
[section] [label]:before {
    text-shadow: 0 0 0 #000;
}
[section]>*:first-child:not([label]) {
    margin-top: 0px;
}


[panel] input, [panel] button, [panel] [label],
[section] input, [section] button, [section] [label] {
    margin-bottom: 15px;
}


[header][panel] {
    padding-top: 75px;
}
[header][section] {
    padding-top: 65px;
}
[header][page]:before,
[header][panel]:before,
[header][section]:before,
[footer][page]:after {
    content: attr(header);
    display: block;
    height: 70px;
    width: 100%;
    padding: 20px;
    line-height: 30px;
    font-size: 2.5em;
    text-align: center;
    text-transform: uppercase;
}
[header][page]:before {
    margin-bottom: 15px;
}
[header][panel]:before,
[header][section]:before {
    position: absolute;
    top: 0; left: 0;
}
[header][panel]:before {
    height: 50px;
    padding: 10px 20px;
    line-height: 30px;
    font-size: 2em;
}
[header][section]:before {
    height: 40px;
    padding: 10px;
    line-height: 20px;
    font-size: 1.5em;
}
[header].collapse:before {
    cursor: pointer;
}

[footer][page]:after {
    content: attr(footer);
}

[page][header][fix-header]:before {
    position: fixed;
    top: 0;
}
[page][footer][fix-footer]:after {
    position: fixed;
    bottom: 0;
}


[img] {
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-origin: content-box;
}


[template] {
    visibility: hidden;
    position: relative;
}
[template].rendered {
    visibility: visible;
}
[template] > .results {
    max-height: calc(100% - 40px);
    margin: 0 -15px;
    padding: 0 15px;
}
[template][stats] > .results {
    max-height: calc(100% - 95px);
}
[template] > .controls {
    height: 60px;
    padding: 5px;
    color: #fff;
    text-align: center;
}
[template] > .controls * {
    vertical-align: middle;
}
[template] > .stats {
    height: 40px;
    padding: 10px;
    font-size: 1.1em;
}


[crud] > * {
    position: relative;
}
.rasti-crud-create {
    display: block !important;
}
.rasti-crud,
.rasti-crud-input,
.rasti-crud-accept,
.rasti-crud-cancel,
[crud].active .rasti-crud-create {
    display: none !important;
}
[crud].active .rasti-crud-input,
[crud].active .rasti-crud-accept,
[crud].active .rasti-crud-cancel {
    display: inline-block !important;
}
[crud] > .rasti-crud {
    bottom: -40px;
    z-index: 1;
}
[crud]:hover > .rasti-crud,
[crud]>*:hover > .rasti-crud {
    display: block !important;
}


[h-flow] {
    display: inline-block !important;
    white-space: nowrap;
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}
[h-flow] > * {
    display: inline-block;
    white-space: normal;
    height: 100%;
    min-width: 100%;
    border-radius: 0;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: auto !important;
    margin-right: auto;
    vertical-align: top;
}
.tab-labels + [h-flow] {
    height: calc(100vh - 50px);
}
nav ~ [page] > .tab-labels + [h-flow] {
    height: calc(100vh - 100px);
}

nav, .tab-labels {
    display: flex;
    position: relative;
    white-space: nowrap;
    min-width: 100vw;
    height: 50px;
    padding: 0;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    border-radius: 0;
    text-transform: uppercase;
    z-index: 1;
}
.tab-labels {
    justify-content: space-around;
}
.tab-labels > .bar {
    position: absolute;
    bottom: 0; left: 0;
    height: 4px;
    transition: left 0.2s, width 0.2s;
}
nav > div, nav > a,
[tab-label] {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
    height: 100%;
    min-width: 50px;
    padding: 5px;
    font-size: 1.4em;
    text-shadow: 0 0 0 #000;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}
nav > div, nav > a {
    max-width: 200px;
    transition: all 0.2s;
}
nav > div:hover, nav > a:hover {
    letter-spacing: 4px;
}
nav > .active {
    border-bottom: 5px solid #222;
}
[tab-label].active {
    filter: contrast(1.5);
}


[modal], .modal {
    display: none;
    position: fixed;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
    height: auto;
    width: auto;
    max-height: 600px;
    max-width: 400px;
    overflow-y: auto;
    animation: zoomIn .4s, fadeIn .4s;
    z-index: 11;
}
[modal].big, .modal.big {
    max-height: 800px;
    max-width: 600px;
}
[modal].small, .modal.small {
    max-height: 400px;
    max-width: 200px;
}
[modal] > [icon=close],
.modal > [icon=close] {
    cursor: pointer;
}


[menu] {
    display: none;
    position: fixed;
    background-color: inherit;
    box-shadow: 0 0 4px 4px rgba(0,0,0,0.2);
    z-index: 1;
    cursor: pointer;
}


[label] {
    position: relative;
    margin-top: 25px;
    vertical-align: bottom;
}
[label][fixed]>* {
    margin-bottom: 0;
}
[label]>input,
[label]>select,
[label]>textarea {
    margin-top: 0 !important;
}
[label]:not([panel]):not([section]):before {
    content: attr(label);
    position: absolute;
    height: 35px;
       line-height: 35px;
    font-size: 1.2em;
    text-transform: capitalize;
}
[label]:before {
    margin-top: -35px;
    margin-left: -8px;
}
[label][fixed]:before {
    margin-top: -30px;
    margin-left: 4px;
}
[label].big:before {
    margin-left: 0;
}
.inline[label],
.inline_ > [label] {
    width: auto;
    margin-top: 0;
    margin-left: calc(40% + 10px);
}
.inline[label]:before,
.inline_ > [label]:before {
    width: 80%;
    left: -80%;
    margin-top: -5px;
    text-align: right;
}
.inline[label][fixed]:before,
.inline_ > [label][fixed]:before {
    margin-top: 0;
    margin-left: -8px;
}
.below[label]:before,
.below_ > [label]:before {
    bottom: -40px;
    left: 0;
    right: 0;
    margin-top: 0;
    margin-left: 0;
}
.big [label] {
    margin-top: 25px;
    font-size: 1.2em;
}
.big [label]:before {
    margin-top: -27px;
}


[nav],
[show], [hide], [toggle],
[onclick] {
    cursor: pointer;
}


/*******************************************************************************
******************************* 12 COLUMNS ************************************* 
*******************************************************************************/

.row {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-content: flex-start;
    padding-left: 1%;
}
.col {
    /*min-height: min-content !important;*/
    display: flex;
    flex-flow: column nowrap;
    align-content: flex-start;
    align-items: center;
}
.row > .col-1,  .col > .row-1  { flex-basis: 07.33%; }
.row > .col-2,  .col > .row-2  { flex-basis: 15.66%; }
.row > .col-3,  .col > .row-3  { flex-basis: 24.00%; }
.row > .col-4,  .col > .row-4  { flex-basis: 32.33%; }
.row > .col-5,  .col > .row-5  { flex-basis: 40.66%; }
.row > .col-6,  .col > .row-6  { flex-basis: 49.00%; }
.row > .col-7,  .col > .row-7  { flex-basis: 57.33%; }
.row > .col-8,  .col > .row-8  { flex-basis: 65.66%; }
.row > .col-9,  .col > .row-9  { flex-basis: 74.00%; }
.row > .col-10, .col > .row-10 { flex-basis: 82.33%; }
.row > .col-11, .col > .row-11 { flex-basis: 90.66%; }
.row [class*=col-] {
    margin-left: 0 !important;
    margin-right: 1% !important;
}
.col [class*=row-]{
    margin-top: 0 !important;
    margin-bottom: 1vh !important;
}

.page-options { flex-basis: initial !important; }



/*******************************************************************************
********************************** ICONS *************************************** 
*******************************************************************************/

[icon]:before {
    display: block;
    flex-grow: 0;
    height: 50px;
    width: auto;
    width: 50px;
    font-size: 1.5rem;
    line-height: 2;
    text-align: center;
    text-decoration: none;
}
.small[icon]:before, .small_ > [icon]:before  {
    height: 35px;
    width: 35px;
    font-size: 1.1rem;
}
.big[icon]:before, .big_ > [icon]:before {
    height: 70px;
    width: 70px;
    font-size: 2.2rem;
}
.huge[icon]:before, .huge_ > [icon]:before {
    height: 100px;
    width: 100px;
    font-size: 3.2rem;
    line-height: 1.9;
}
.round[icon]:before, .round_ > [icon]:before {
    border-radius: 50%;
}
.floating[icon]:before {
    position: absolute;
    margin-left: 10px;
    margin-top: -5px;
}
.floating[icon] > input {
    padding-left: 45px;
}


/*******************************************************************************
****************************** VISUAL ENHANCERS ******************************** 
*******************************************************************************/
.list {
    padding: 0;
    border: 1px solid rgba(0,0,0,0.2);
}
.list[header] {
    padding-top: 40px;
}
.list > div {
    height: 7vh;
    padding: 2vh;
    transition: all 0.2s;
}
.list > div:not(:last-child) {
    border-bottom: 1px solid rgba(0,0,0,0.2);
}
.list > div.active {
    border-left: 7px solid #222;
}
.list > div:hover {
    letter-spacing: 4px;
}

.msg {
    height: 60%;
    width: 60%;
    padding: 10% 5%;
    font-size: large;
}

button.fab {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 50px;
    margin: 20px;
    border-radius: 50%;
    z-index: 5;
}

.backdrop:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,.7);
    animation: fadeIn .4s;
    z-index: 10;
}

.loading {
    color: transparent !important;
    position: relative;
}
.loading:after {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    width: 25px; height: 25px;
    margin: auto;
    border-radius: 50%;
    border: 0.25rem solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    animation: spin 1s infinite linear;
}
.big.loading:after {
    position: fixed;
    width: 100px; height: 100px;
    z-index: 10;
}

.loading2 {
    perspective: 120px;
}
.loading2:after {
    content: "";
    position: absolute;
    left: 25px; top: 25px;
    width: 50px; height: 50px;
    background-color: #3498db;
    animation: flip 1s infinite linear;
}



/*******************************************************************************
**************************** FUNCTIONAL ENHANCERS ****************************** 
*******************************************************************************/

.movable {
    user-select: none;
    cursor: move;
}

.resizable {
    resize: both;
    overflow: hidden;
}

.collapsable {
    animation: foldOut 0.5s;
    overflow: hidden; 
}
.collapsable[header].folded {
    animation: foldIn 0.5s;
    height: 0;
    padding-bottom: 0;
    padding-top: 40px;
}



/*******************************************************************************
********************************* ANIMATIONS *********************************** 
*******************************************************************************/
@keyframes stamp {
    50% { transform: scale(1.2); }
}
@keyframes spin {
    0%   { transform: rotate(0); }
    100% { transform: rotate(360deg); }
}
@keyframes flip {
    0%   { transform: rotate(0); }
    50%  { transform: rotateY(180deg); }
    100% { transform: rotateY(180deg) rotateX(180deg); }
}
@keyframes zoomIn {
    0%   { transform: scale(0); }
    100% { transform: scale(1); }
}
@keyframes zoomOut {
    0%   { transform: scale(1); }
    100% { transform: scale(0); }
}
@keyframes fadeIn {
    0%   { opacity: 0; }
    100% { opacity: 1; }
}
@keyframes fadeOut {
    0%   { opacity: 1; }
    100% { opacity: 0; }
}
@keyframes foldIn {
    0% { 
        height: auto;
        padding-top: 55px;
        padding-bottom: 10px;
    }
    100% { 
        height: 0;
        padding-top: 40px;
        padding-bottom: 0;
    }
}
@keyframes foldOut {
    0% { 
        height: 0;
        padding-top: 40px;
        padding-bottom: 0;
    }
    100% { 
        height: auto;
        padding-top: 55px;
        padding-bottom: 10px;
    }
}



/*******************************************************************************
****************************** UTILITY CLASSES ********************************* 
*******************************************************************************/

[hidden], .hidden {
    display: none !important;
}

.inline, .inline_>* {
    display: inline-block;
    margin-top: 0;
    margin-bottom: 0;
}

.floatl, .floatl_>* {
    float: left;
}
.floatr, .floatr_>* {
    float: right;
}

.rel {
    position: relative;
}

.left, .left_>* {
    position: absolute;
    left: 0;
}
.right, .right_>* {
    position: absolute;
    right: 0;
}
.top, .top_>* {
    position: absolute;
    top: 0;
}
.bottom, .bottom_>* {
    position: absolute;
    bottom: 0;
}

.centerx, .centerx_>* {
    position: absolute;
    left: 0; right: 0;
    margin: auto !important;
}
.centery, .centery_>* {
    position: absolute;
    top: 0; bottom: 0;
    margin: auto !important;
}
.center, .center_>* {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
}

.fix {
    position: fixed;
}

.ccx, .ccx_>* {
    display: flex;
    justify-content: center;
}
.ccy, .ccy_>* {
    display: flex;
    align-items: center;
}
.cc, .cc_>* {
    display: flex;
    justify-content: center;
    align-items: center;
}

.scrollx, .scrollx_>* {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}
.scrolly, .scrolly_>* {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
.scroll, .scroll_>* {
    overflow: auto;
}

.textl, .textl_>* {
    text-align: left;
}
.textr, .textr_>* {
    text-align: right;
}
.textc, .textc_>* {
    text-align: center;
}

.fullw, .fullw_>* {
    width: 100%;
}
.fullh, .fullh_>* {
    height: 100%;
}
.halfw, .halfw_>* {
    width: 50%;
}
.halfh, .halfh_>* {
    height: 50%;
}
.autow, .autow_>* {
    width: auto;
}
.autoh, .autoh_>* {
    height: auto;
}

.autom, .autom_>* {
    margin: auto !important;
}

.columns-2 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
.columns-2 > * {
    width: 49%;
    margin-right: 2%;
}
.columns-2 > *:nth-child(2n){
    margin-right: 0;
}

.columns-3 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
.columns-3 > * {
    width: 32%;
    margin-right: 2%;
}
.columns-3 > *:nth-child(3n) {
    margin-right: 0;
}

.pad-s, .pad-s_>* {
    padding-left: 5%;
    padding-right: 5%;
}
.pad, .pad_>* {
    padding-left: 10%;
    padding-right: 10%;
}
.pad-l, .pad-l_>* {
    padding-left: 15%;
    padding-right: 15%;
}

.round, .round_>* {
    border-radius: 50%;
}

.scale, .scale_>* {
    transition: all .2s ease-in-out;
}
.scale:hover, .scale_>*:hover {
    transform: scale(1.1);
}



/*******************************************************************************
************************************* FX *************************************** 
*******************************************************************************/

.fx-stack-container > * {
    transition: margin-top 2s ease; /*FIXME: NOT WORKING*/
    margin-top: 0;
}
.fx-stack-el {
    margin-top: 100px;
}

.fx-stamp-container > * {
    transition: opacity 0.3s;
    animation: stamp 0.3s;
}
.fx-stamp-el {
    opacity: 0;
    animation: none;
}

.flip-container {
    perspective: 1000px;
    position: relative;
}
.flipper {
    transition: 0.6s;
    transform-style: preserve-3d;
    position: absolute;
}
.flipper.flip  {
    transform: rotateY(180deg);
}
.flipper .front, .flipper .back {
    backface-visibility: hidden;
    top: 0;
    left: 0;
}
.flipper .front {
    z-index: 2;
    transform: rotateY(0deg);
}
.flipper .back {
    transform: rotateY(180deg);
}



/*******************************************************************************
********************************* SCROLLBARS *********************************** 
*******************************************************************************/

/* webkit */
::-webkit-scrollbar {
    width: 10px;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    background-clip: content-box;
    border-left: solid transparent 2px;
    border-right: solid transparent 2px;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
}

/* mozilla (NOT WORKING) */
@-moz-document url-prefix(http://), url-prefix(https://) {
    scrollbar {
        -moz-appearance: none !important;
        background: rgb(0,255,0) !important;
    }
    thumb, scrollbarbutton {
        -moz-appearance: none !important;
        background-color: rgb(0,0,255) !important;
    }
    thumb:hover, scrollbarbutton:hover {
        -moz-appearance: none !important;
        background-color: rgb(255,0,0) !important;
    }
    scrollbarbutton {
        display: none !important;
    }
    scrollbar[orient="vertical"] {
        min-width: 15px !important;
    }
}



/*******************************************************************************
****************************** MEDIA QUERIES *********************************** 
*******************************************************************************/

/* desktop only */
@media only screen and (min-width: 800px) {
    .pad-s-desktop {
        padding-left: 5%;
        padding-right: 5%;
    }
    .pad-desktop {
        padding-left: 10%;
        padding-right: 10%;
    }
    .pad-l-desktop {
        padding-left: 15%;
        padding-right: 15%;
    }
}


/* tablet only */
@media only screen and (min-width: 500px) and (max-width: 800px) {

    .hide-tablet {
        display: none;
    }
    .show-tablet {
        display: block;
    }

    [header].hh-tablet:before {
        display: none;
    }
    [header].hh-tablet[page] {
        padding-top: 0;
    }
    [header].hh-tablet[panel] {
        padding-top: 20px;
    }
    [header].hh-tablet[section] {
        padding-top: 15px;
    }
    
    .pad-s-tablet {
        padding-left: 5%;
        padding-right: 5%;
    }
    .pad-tablet {
        padding-left: 10%;
        padding-right: 10%;
    }
    .pad-l-tablet {
        padding-left: 15%;
        padding-right: 15%;
    }

}


/* tablet and phone */
@media only screen and (max-width: 800px) {

    [page][header]:before {
        padding: 10px;
        line-height: 0.8;
    }

}


/* phone only */
@media only screen and (max-width: 500px) {

    [page] {
        padding-bottom: 0;
        overflow-y: auto;
    }

    [template] > .controls > .columns,
    [template] > .controls > .sizes {
        display: none;
    }

    [options] {
        bottom: 0;
        left: 0 !important;
        right: 0;
        height: 80% !important;
        margin: auto;
    }

    .hide-phone {
        display: none;
    }
    .show-phone {
        display: block;
    }

    [header].hh-phone:before {
        display: none;
    }
    [header].hh-phone[page] {
        padding-top: 0;
    }
    [header].hh-phone[panel] {
        padding-top: 20px;
    }
    [header].hh-phone[section] {
        padding-top: 15px;
    }

    .pad-s-phone {
        padding-left: 5%;
        padding-right: 5%;
    }
    .pad-phone {
        padding-left: 10%;
        padding-right: 10%;
    }
    .pad-l-phone {
        padding-left: 15%;
        padding-right: 15%;
    }
    


}

</style>`)

genBlockStyles()

genIconStyles()

bootstrap()

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./blocks/all":1,"./components":8,"./extensions":9,"./icons":10,"./themes":12,"./utils":13}],12:[function(require,module,exports){
exports.themes = {

    base : {
        font : 'normal 14px Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols, EmojiOne Mozilla',
        palette : {
            white   : '#fff',
            lighter : '#ddd',
            light   : '#bbb',
            mid     : '#888',
            dark    : '#444',
            darker  : '#222',
            black   : '#000',
            detail  : 'darkcyan',
            lighten : 'rgba(255,255,255,0.5)',
            darken  : 'rgba(0,0,0,0.2)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'darker lighten', // bg, header bg
        panel   : 'dark lighten',   // bg, header bg
        section : 'mid lighten',    // bg, header bg
        field   : 'light darker',   // bg, text
        btn     : 'detail darker',  // bg, text
        header  : 'darker',         // text
        label   : 'darker',         // text
        text    : 'darker',         // text
    },

    light : {
        page    : 'lighter darken',
        panel   : 'mid lighten',
        section : 'light darken',
        field   : 'lighter dark',
        btn     : 'detail light',
        header  : 'dark',
        label   : 'mid',
        text    : 'darker',
    },
    
}
},{}],13:[function(require,module,exports){
const is = {}
'object function array string number regex boolean'.split(' ').forEach(function(t){
    is[t] = function(exp){ return type(exp) === t }
})
function type(exp) {
        var clazz = Object.prototype.toString.call(exp)
        return clazz.substring(8, clazz.length-1).toLowerCase()
}
function sameType(exp1, exp2) {
    return type(exp1) === type(exp2)
}


function inject(sources) {
    if (is.string(sources)) sources = sources.split(' ')
    if (!is.array(sources)) return rasti.error('Invalid sources, must be an array or a string')
    var script,
        body = $('body'),
        inject = (sources) => {
            script = $('<script>').attr('src', sources.shift())
            if (sources.length) script.attr('onload', () => inject(sources))
            body.append(script)
        }
    inject(sources)
}


function checkData(data) {
    switch (typeof data) {
    case 'string':
        data = {value: data, label: data, alias: data.toLowerCase()}
        break
    case 'object':
        if ( !is.string(data.value) || !is.string(data.label) ) {
            rasti.error('Invalid data object (must have string properties "value" and "label"):', data)
            invalidData++
            data = {value: '', label: 'INVALID DATA', alias: ''}
        }
        else if ( !is.string(data.alias) ) {
            if (data.alias) {
                rasti.error('Invalid data property "alias" (must be a string):', data)
                invalidData++
            }
            data.alias = data.value.toLowerCase()
        }
        else data.alias = data.alias.toLowerCase() +' '+ data.value.toLowerCase()
        break
    default:
        rasti.error('Invalid data (must be a string or an object):', data)
        invalidData++
        data = {value: '', label: 'INVALID DATA', alias: ''}
    }
    return data
}


function html(templateObject, ...substs) {
    // Use raw template strings (don’t want backslashes to be interpreted)
    const raw = templateObject.raw
    let result = ''

    substs.forEach((subst, i) => {
        let lit = raw[i]
        // Turn array into string
        if ( is.array(subst) ) subst = subst.join('')
        // If subst is preceded by an !, escape it
        if ( lit.endsWith('!') ) {
            subst = htmlEscape(subst)
            lit = lit.slice(0, -1)
        }
        result += lit
        result += subst
    })
    // Take care of last template string
    result += raw[raw.length - 1]

    return result
}


function htmlEscape(str) {
    return str.replace(/&/g, '&amp;') // first!
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;')
}



function resolveAttr($el, name) {
    var value = $el.attr(name) || $el.attr('name') || $el.attr('prop') || $el.attr('nav') || $el.attr('template') ||  $el.attr('section') || $el.attr('panel') || $el.attr('page')
    if (!value) rasti.warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
    return value
}


function rastiError(msg, ...args){
    this.msg = msg
    this.el = args.pop()
    this.args = args
}


function random() {
    return (Math.random() * 6 | 0) + 1
}


function onMobile() {
    return window.innerWidth < 500
}


module.exports = {
    is,
    type,
    sameType,
    inject,
    checkData,
    html,
    resolveAttr,
    random,
    onMobile,
    rastiError,
}

},{}]},{},[11])(11)
});
//# sourceMappingURL=rasti.map
