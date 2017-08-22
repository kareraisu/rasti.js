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

},{"../utils":12}],3:[function(require,module,exports){
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
},{"../utils":12}],4:[function(require,module,exports){
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
},{"../utils":12}],5:[function(require,module,exports){
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
},{"../utils":12}],6:[function(require,module,exports){
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
},{"../utils":12}],7:[function(require,module,exports){
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

},{"../utils":12}],8:[function(require,module,exports){
const { is } = require('./utils')

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

module.exports = {
    History,
    Pager,
}

},{"./utils":12}],9:[function(require,module,exports){
// prototype extensions
Array.prototype.remove = function(el) {
    var i = this.indexOf(el);
    if (i >= 0) this.splice(i, 1);
}

String.prototype.capitalize = function() {
    return this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
}


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
(function (global){
require('./extensions')
const { History, Pager, createState } = require('./components')
const utils = require('./utils')
const { is, type, sameType } = utils
const themes = require('./themes')

const options = {
    persist : false,
    history : false,
    root    : '',
    theme   : 'base',
    lang    : '',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
}

const breakpoints = {
    phone : 500,
    tablet : 800,
}
const media = {}
for (var device in breakpoints) {
    media[device] = window.matchMedia(`(max-width: ${ breakpoints[device] }px)`).matches
}

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


    // public properties

    this.options = Object.assign({}, options)
    this.defaults = {
        stats : self.options.stats,
        noData : self.options.noData,
    }
    this.state = createState()

    this.pages = {}
    this.data = {}
    this.ajax = {}
    this.utils = {}
    this.templates = {}
    this.langs = {}

    this.themes = themes.themes
    this.themeMaps = themes.themeMaps

    // methods

    function extend(props) {
        if (!props || !is.object(props)) return error('Cannot extend app: no properties found')
        for (var key in self) {
            if ($.type(self[key]) === 'object' && $.type(props[key]) === 'object')
                Object.assign(self[key], props[key])
        }
    }


    function init(options) {
        var initStart = window.performance.now()
        log('Initializing app [%s]...', self.name)

        container.addClass('big loading backdrop')

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
            keys = Object.keys(self.langs)
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
                $(e.target).parent().hide()
                self.active.page.find('.backdrop').removeClass('backdrop')
            })
            .appendTo(el)
        })


        // init field validations
        container.find('[validate]').each( (i, btn) => {
            btn.disabled = true
            var $container = $(btn).parent()
            var fields = $container.find('[field][required]')
            fields.each( (i, field) => {
                var invalid = field.validity && !field.validity.valid
                field.classList.toggle('error', invalid)
                $(field).change( e => {
                    invalid = field.validity && !field.validity.valid
                    field.classList.toggle('error', invalid)
                    btn.disabled = $container.find('[field].error').length
                })
            })
        })


        // init nav
        container.find('[nav]').click( e => {
            var $el = $(e.target),
                page = $el.attr('nav'),
                params = {}

            if (!page) return error('Missing page name in [nav] attribute of element:', el)

            if (e.target.hasAttribute('params')) {
                var $page = self.active.page,
                    paramkeys = $el.attr('params'),
                    $paramEl
                if (paramkeys) {
                    // get specified params
                    paramkeys = paramkeys.split(' ')
                    paramkeys.forEach( key => {
                        $paramEl = $page.find('[navparam='+ key +']')
                        if ($paramEl.length) params[key] = $paramEl.val()
                        else warn('Could not find navparam element [%s]', key)
                    })
                }
                else {
                    // get all params
                    $page.find('[navparam]').each( (i, el) => {
                        $el = $(el)
                        key = resolveAttr($el, 'navparam')
                        if (key) params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })


        // init submit
        container.find('[submit]').click( e => {
            var $el = $(e.target),
                method = $el.attr('submit'),
                callback = $el.attr('then'),
                template = $el.attr('render'),
                isValidCB = callback && is.function(self.utils[callback]),
                start = window.performance.now(), end

            if (!method) return error('Missing ajax method in [submit] attribute of el:', this)

            if (callback && !isValidCB) error('Undefined utility method [%s] declared in [then] attribute of el:', callback, this)
            
            $el.addClass('loading').attr('disabled', true)

            submitAjax(method, resdata => { 
                var time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)

                if (isValidCB) self.utils[callback](resdata)
                if (template) render(template, resdata, time)

                $el.removeClass('loading').removeAttr('disabled')
            })
        })


        // init render
        container.find('[render]').not('[submit]').click( e => {
            var $el = $(e.target),
                template = $el.attr('render')
            if (!template) return error('Missing template name in [render] attribute of element:', el)
            render(template)
        })


        // init deps
        container.find('[deps]').each( (i, el) => {
            var $el = $(el)
            var deps = $el.attr('deps')
            if (deps) deps.split(' ').forEach( field => {
                $el.closest('[page]').find('[field='+ field +']')
                    .change( e => { updateBlock($el) })
            })
        })


        // init actions
        for (var action of 'click change hover load'.split(' ')) {
            container.find('[on-'+ action +']').each( (i, el) => {
                var $el = $(el),
                    methodName = $el.attr('on-' + action)
                if ( !methodName ) return error('Missing utility method in [%s] attribute of element:', action, el)
                var method = self.utils[methodName]
                if ( !method ) return error('Undefined utility method "%s" declared in [on-%s] attribute of element:', methodName, action, el)
                $el.on(action, method)
                   .removeAttr('on-' + action)
            })
        }
        for (var action of 'show hide toggle'.split(' ')) {
            container.find('['+ action +']').each( (i, el) => {
                var $el = $(el),
                    $page = $el.closest('[page]'),
                    targetSelector = $el.attr(action)
                if ( !targetSelector ) return error('Missing target selector in [%s] attribute of element:', action, el)
                var $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)
                $el.on('click', e => {
                        if ($target[0].hasAttribute('modal')) $page.find('.page-options').addClass('backdrop')
                        $target[action]()
                    })
                    .removeAttr(action)
            })
        }


        // init move
        container.find('.move').each( (i, el) => {
            $(el).move()
        })


        // init collapse
        container.find('.collapse').on('click', e => {
            this.classList.toggle('folded')
        })


        // init pages
        var page, $page
        for (var name in self.pages) {
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


        // resolve empty headers and labels
        'header label'.split(' ').forEach( attr => {
            var $el
            container.find('['+attr+']').each( (i, el) => {
                $el = $(el)
                if (!$el.attr(attr)) $el.attr( attr, resolveAttr($el, attr) )
            })
        })


        // fix labels
        'input select textarea'.split(' ').forEach( tag => {
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
        var restored
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
            var page = location.hash.substring(1) || self.options.root
            navTo(page && self.pages[page] ? page : container.find('[page]').first().attr('page'))
        }


        // init statefull elements
        container.find('[state]').each( (i, el) => {
            var $el = $(el)
            var prop = resolveAttr($el, 'state')

            if (!prop) return

            if (el.value !== undefined) {
                // it's an element
                bindElement($el, prop)
            }
            else {
                // it's a container
                $el.find('[field]').each( (i, el) => {
                    var $el = $(el)
                    var subprop = $el.attr('field')
                    if (subprop) bindElement($el, prop, subprop)
                })
            }

            function bindElement($el, prop, subprop){
                var root = self.state
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
                else root[prop] = ''
                $el.on('change', e => {
                    // update state on ui change
                    root[prop] = $el.val()
                })
            }
        })


        container
            .on('click', '.backdrop', e => {
                $(e.target).removeClass('backdrop')
                self.active.page.find('[modal]').hide()
            })
            .removeClass('big loading backdrop')

        var initTime = Math.floor(window.performance.now() - initStart) / 1000
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


    function render(name, data, time) {
        var template = self.templates[name], html,
            errPrefix = 'Cannot render template [%s]: '
        if (!template) return error(errPrefix + 'template is not defined', name)

        if (is.string(template)) {
            html = template
            template = (data, lang) => data.map( obj => html ).join()
        }

        if (!is.function(template)) return error(errPrefix + 'template must be a string or a function', name)

        var $el = container.find('[template='+ name +']')
        if (!$el.length) return error(errPrefix + 'no element bound to template. Please bind one via [template] attribute.', name)
        var el = $el[0]

        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return error(errPrefix + 'no data found for template. Please provide in ajax response or via [data] attribute in element:', name, el)
            data = self.data[datakey]
            if (!data) return error(errPrefix + 'undefined data source "%s" in [data] attribute of element:', name, datakey, el)
        }

        if ( is.string(data) ) data = data.split(', ')
        if ( !is.array(data) ) return error(errPrefix + 'invalid data provided, must be a string or an array', name)

        if (!data.length) return $el.html(`<div msg center textc>${ self.options.noData }</div>`)

        var paging = $el.attr('paging')
        var lang = self.langs && self.langs[self.active.lang]
        paging
            ? initPager($el, template, data, lang)
            : $el.html( template(data, lang) )
        if (el.hasAttribute('stats')) {
            var stats = $('<div section class="stats">')
            stats.html( self.options.stats.replace('%n', data.length).replace('%t', time) )
            $el.prepend(stats)
        }

        var fxkey = $el.attr('fx')
        if (fxkey) {
            var fx = rasti.fx[fxkey]
            if (!fx) return warn('Undefined fx "%s" in [fx] attribute of element', fxkey, el)
            paging ? fx($el.find('.results')) : fx($el)
        }

    }


    function setTheme(themeString) {
        var themeName = themeString.split(' ')[0],
            theme = self.themes[themeName]

        if (!theme) return error('Cannot set theme [%s]: theme not found', themeName)

        var mapName = themeString.split(' ')[1] || ( is.object(theme.maps) && Object.keys(theme.maps)[0] ) || 'dark',
            themeMap = ( is.object(theme.maps) && theme.maps[mapName] ) || self.themeMaps[mapName]

        if (!themeMap) return error('Theme map [%s] not found', mapName)

        log('Setting theme [%s:%s]', themeName, mapName)
        self.active.theme = themeName
        
        var values = {
            font : theme.font || self.themes.base.font,
        }, colorNames, colors, c1, c2, defaultColorName

        // map palette colors to attributes
        for (var attr of Object.keys(themeMap)) {
            if (!self.themeMaps.dark[attr]) return error('Mapping error in theme [%s]. Incorrect theme map property [%s]', themeName, attr)

            colorNames = [c1, c2] = themeMap[attr].split(' ')
            colors = [theme.palette[ c1 ], theme.palette[ c2 ]]

            for (var i in colors) {
                defaultColorName = self.themeMaps.dark[attr].split(' ')[i]
                if (defaultColorName && !colors[i]) {
                    colors[i] = self.themes.base.palette[ colorNames[i] ]
                    if (!colors[i]) {
                        warn('Mapping error in theme [%s] for attribute [%s]. Color [%s] not found. Falling back to default color [%s].', themeName, attr, colorNames[i], defaultColorName)
                        colors[i] = self.themes.base.palette[ defaultColorName ]
                    }
                }
            }
            values[attr] = colors
        }

        // generate theme style and apply it
        container.find('style[theme]').html( getThemeStyle(values) )

        // apply any styles defined by class
        for (var key of Object.keys(theme.palette)) {
            var color = theme.palette[key]
            container.find('.' + key).css('background-color', color)
        }
    }


    function setLang(langName) {
        var lang = self.langs[ langName ],
            errPrefix = 'Cannot set lang [%s]: '

        if (!lang) return error(errPrefix + 'lang not found', langName)
        if ( !is.object(lang) ) return error(errPrefix + 'lang must be an object!', langName)

        log('Setting lang [%s]', langName)
        self.active.lang = langName

        var $elems = $(), $el, keys, string
        var attributes = 'label header text placeholder'.split(' ')

        attributes.forEach( attr => {
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

            for (var attr in keys) {
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
            ? $el.closest('[page]').find('[options='+ $el.attr('field') +']')
            : $el

        var deps = $el.attr('deps')
        var depValues = {}
        if (deps) deps.split(' ').forEach( field => {
            depValues[field] = get('field='+field).val()
        })

        is.function(data)
            ? data(render, depValues)
            : render(data)
        
        function render(data) {
            if ( is.string(data) ) data = data.split(', ')
            $options.html( block.template(data, $el) )

            if (invalidData) {
                var field = $el.attr('field'),
                    page = $el.closest('[page]').attr('page')
                warn('Detected %s invalid data entries for field [%s] in page [%s]', invalidData, field, page)
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

    function createState() {
        return Object.defineProperties({}, {
            page  : { get : () => self.active.page.attr('page'), enumerable : true },
            theme : { get : () => self.active.theme, enumerable : true },
            lang  : { get : () => self.active.lang, enumerable : true },
            save : { value : () => {
                localStorage.setItem('rasti.' + self.name, JSON.stringify(self.state))
                log('State saved')
            } },
            get : { value : () => {
                var state
                try {
                    state = JSON.parse( localStorage.getItem('rasti.' + self.name) )
                    if ( !state ) log('No saved state found for app [%s]', self.name)
                    else if ( !is.object(state) ) invalid()
                    else return state
                }
                catch(err) {
                    invalid()
                }

                function invalid() {
                    error('Saved state for app [%s] is invalid', self.name)
                }
            } },
            restore : { value : () => {
                var state = self.state.get()
                if (state) {
                    log('Restoring state...')
                    for (let prop in state) {
                        self.state[prop] = state[prop]
                    }
                    if (state.theme) setTheme(state.theme)
                    if (state.lang) setLang(state.lang)
                    navTo(state.page)
                    log('State restored')
                }
                return state
            } },
            clear : { value : () => {
                localStorage.removeItem('rasti.' + self.name)
            } },
        })
    }


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
            fx = $el.attr('fx') && rasti.fx[$el.attr('fx')],
            page_size = parseInt($el.attr('paging')),
            pager = newPager(name, data, page_size),
            paging, columns, sizes, col=1, size=0

        if ($el[0].hasAttribute('columns')) columns = `<button btn icon=columns />`

        if (pager.total > 1) paging = `<div class="paging ib ib_">
                <button btn icon=prev />
                <span class="page" />
                <button btn icon=next />
            </div>`

        sizes = `<button btn icon=rows />`

        $el.html(`
            <div class="results scrolly"></div>
            <div class="controls floatcx bottom ib_">
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

        $results.html( template(pager.next(), lang) )
        $controls.find('.page').html(pager.page + '/' + pager.total)

        function update(data){
            $results.html( template(data, lang) )
            $controls.find('.page').html(pager.page + '/' + pager.total)
            if ( is.function(fx) ) fx($results)
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
        var ajax = self.ajax[ method ]
        if ( !is.function(ajax) ) return error('Ajax method ['+ method +'] is not defined')

        var $form = container.find('[ajax='+ method +']')
        if (!$form.length) return error('No container element bound to ajax method [%s]. Please bind one via [ajax] attribute', method)

        var reqdata = {}, field
        $form.find('[field]').each( (i, el) => {
            $el = $(el)
            field = $el.attr('field')
            if (field) {
                reqdata[field] = $el.val() || $el.attr('value')
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

            ${ns} [field] {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }

            ${ns} [btn],
            ${ns} .btn,
            ${ns} [block=buttons] > div,
            ${ns} nav > div.active {
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


    function resolveAttr($el, name) {
        var value = $el.attr(name) || $el.attr('field') || $el.attr('section') || $el.attr('panel') || $el.attr('page')
        if (!value) warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
        return value
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

    return Object.freeze({
        // objects
        options : this.options,
        history : this.history,
        state : this.state,
        pages : this.pages,
        data : this.data,
        ajax : this.ajax,
        utils : this.utils,
        langs : this.langs,
        themes : this.themes,
        themeMaps : this.themeMaps,
        templates : this.templates,

        // methods
        extend,
        init,
        get,
        set,
        add,
        navTo,
        render,
        setLang,
        setTheme,
        updateBlock,
        toggleFullScreen,
    })

}


// static properties and methods
rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils
rasti.blocks = require('./blocks/all')
rasti.fx = {

    stack : $el => {
        $el.children().each( (i, el) => {
            setTimeout( () => {
                el.style.opacity = 1
                el.style.marginTop = '15px'
            }, i * 50);
        })
    },

}
rasti.options = {log : 'debug'}

module.exports = Object.freeze(rasti)



// bootstrap any apps defined via rasti attribute
function bootstrap() {
    var appContainers = $(document).find('[rasti]'),
        appName, app, extendProps

    if (appContainers.length) appContainers.forEach( el => {
        appName = el.getAttribute('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', el)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, el)
        else {
            global[appName] = app = new rasti(appName, el)
            Object.keys(app.options).forEach( key => {
                if (el.hasAttribute(key)) {
                    app.options[key] = el.getAttribute(key)
                    // non-value boolean attributes are true
                    if (is.boolean(options[key]) && !app.options[key]) app.options[key] = true
                }
            })
            log('Created rasti app [%s]', appName)
        }
    })
}


function genBlockStyles() {
    var styles = '<style blocks>'
    for (var key in rasti.blocks) {
        styles += rasti.blocks[key].style
    }
    styles += '</style>'
    $('head').prepend(styles)
}


$('head').prepend(`<style>body {
    margin: 0;
}
*, *:before, *:after {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: background-color 0.2s;
}


[page], [panel], [section] {
    position: relative;
    overflow: hidden;    
}

[page] {
    min-height: 100vh;
    width: 100vw !important;
    padding-bottom: 15px;
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


[field], [btn] {
    min-height: 35px;
    width: 100%;
    border: 0;
    border-radius: 2px;
    outline: none;
    font-family: inherit !important;
    font-size: inherit;
}
[field] {
    padding: 5px 10px;
}
[btn] {
    display: inline-block;
    height: 50px;
    width: auto;
    min-width: 50px;
    border: 1px solid rgba(0,0,0,0.1);
    font-size: 1.2em;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
	cursor: pointer;
}
[btn]:not(:disabled):hover {
    filter: contrast(1.5);
}
[btn]:disabled {
    filter: contrast(0.5);
    cursor: auto;
}
[panel] [field], [panel] [btn], [panel] [label],
[section] [field], [section] [btn], [section] [label] {
    margin-bottom: 15px;
}


.big[field], .big[btn],
.big [field], .big [btn] {
    min-height: 70px;
    margin-bottom: 25px;
    font-size: 1.5em;
}

.small[field], .small[btn],
.small [field], .small [btn] {
    height: 25px;
    margin-bottom: 15px;
    font-size: 1em;
}

.big [label]{
    margin-top: 25px;
    font-size: 1.2em;
}
.big [label]:before {
    margin-top: -27px;
}
.big [label][field]:before {
    margin-top: -25px;
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
nav > div, [tab-label] {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
    height: 100%;
    min-width: 50px;
    padding: 5px;
    font-size: 1.4em;
    text-shadow: 0 0 0 #000;
    cursor: pointer;
}
nav > div {
    max-width: 200px;
    border-right: 1px solid rgba(0,0,0,0.2);
}
[tab-label].active {
    filter: contrast(1.5);
}


[modal], .modal {
    display: none;
    position: fixed;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
    height: 100%;
    width: 100%;
    max-height: 500px;
    max-width: 500px;
    overflow-y: auto;
    animation: zoomIn .4s, fadeIn .4s;
    z-index: 11;
}
[modal] > [icon=close],
.modal > [icon=close] {
    cursor: pointer;
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
[label][field].big:before {
    margin-left: 0;
}
.inline [label],
.inline > [label] {
    width: auto;
    margin-top: 0;
    margin-left: calc(40% + 10px);
}
.inline[label]:before,
.inline > [label]:before {
    width: 80%;
    left: -80%;
    margin-top: -5px;
    text-align: right;
}
.inline[label][fixed]:before,
.inline > [label][fixed]:before {
    margin-top: 0;
    margin-left: -8px;
}


select[field] {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
}

textarea[field] {
    height: 70px;
    resize: none;
}

input[field] {
    width: 100%;
    margin: 0;
    font-size: 1rem;
    vertical-align: text-bottom;
}
input[field]:focus:invalid {
    box-shadow: 0 0 0 2px red;
}
input[field]:focus:valid {
    box-shadow: 0 0 0 2px green;
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
@keyframes stamp {
    50% { transform: scale(1.2); }
}


.row {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    width: 100%;
}
.column {
    display: flex;
    flex-flow: column nowrap;
    min-height: min-content !important;
    align-content: flex-start;
    align-items: center;
}
.row > .col-1  { flex-basis: calc(08.33% - 15px); }
.row > .col-2  { flex-basis: calc(16.66% - 15px); }
.row > .col-3  { flex-basis: calc(25.00% - 15px); }
.row > .col-4  { flex-basis: calc(33.33% - 15px); }
.row > .col-5  { flex-basis: calc(41.66% - 15px); }
.row > .col-6  { flex-basis: calc(50.00% - 15px); }
.row > .col-7  { flex-basis: calc(58.33% - 15px); }
.row > .col-8  { flex-basis: calc(66.66% - 15px); }
.row > .col-9  { flex-basis: calc(75.00% - 15px); }
.row > .col-10 { flex-basis: calc(83.33% - 15px); }
.row > .col-11 { flex-basis: calc(91.66% - 15px); }
.row [class*=col-]:not(:first-child) { margin-left: 15px; }


.page-options {
    flex-basis: initial !important;
}

/* icons */

[icon] {
    flex-grow: 0;
    height: 50px;
    width: auto;
    min-width: 50px;
    font-size: 1.5rem;
    line-height: 2;
    text-align: center;
}
[icon]:before {
    filter: grayscale();
}
[icon].small {
    height: 30px;
    width: 30px;
    font-size: 1em;
}
[icon].big {
    height: 70px;
    width: 70px;
    font-size: 2.2em;
}
[icon].floating:before {
    position: absolute;
    margin-left: 10px;
    margin-top: -5px;
}
[icon].floating > input {
    padding-left: 45px;
}
[icon=options]:before { content: '⋯'; }
[icon=voptions]:before { content: '⋮'; }
[icon=menu]:before { content: '☰'; }
[icon=user]:before { content: '👤'; }
[icon=pass]:before,
[icon=lock]:before { content: '🔒'; }
[icon=file]:before { content: '📄'; }
[icon=folder]:before { content: '📂'; }
[icon=attach]:before,
[icon=clip]:before { content: '📎'; }
[icon=link]:before { content: '🔗'; }
[icon=edit]:before,
[icon=pen]:before { content: '✎'; }
[icon=warning]:before { content: '⚠'; }
[icon=error]:before { content: '⨂'; }/*𐌈*/
[icon=rows]:before { content: '𝌆'; }
[icon=columns]:before { content: '▥'; }
[icon=grid]:before { content: '▦'; }
[icon=spacedgrid]:before { content: '𝍖'; }
[icon=roundgrid]:before { content: '𐄡'; }
[icon=close]:before { content: '✕'; }
[icon=eject]:before { content: '⏏'; }
[icon=play]:before,
[icon=next]:before { content: '▶'; }
[icon=prev]:before { content: '◀'; }
[icon=pause]:before { content: 'Ⅱ'; }
[icon=stop]:before { content: '■'; }
[icon=rec]:before { content: '●'; }
[icon=timer]:before { content: '⏱'; }
[icon=clock]:before { content: '⏰'; }
[icon=cog]:before { content: '⚙'; }
[icon=flag]:before { content: '⚑'; }
[icon=clef]:before { content: '𝄞'; }
[icon=note]:before { content: '♪'; }
[icon=star]:before { content: '★'; }
[icon=goldstar]:before { content: '⭐'; }
[icon=snow]:before { content: '❄'; }
[icon=command]:before { content: '⌘'; }
[icon=pentagon]:before { content: '⬟'; }
[icon=hexagon]:before { content: '⬢'; }
[icon=cycle]:before { content: '⟳'; }
[icon=recycle]:before { content: '♻'; }


/* utils */

.move {
    user-select: none;
    cursor: move;
}

.resize {
    resize: both;
    overflow: hidden;
}

.collapse {
    animation: foldOut 0.5s;
}
[section].collapse.folded {
    animation: foldIn 0.5s;
    height: 0;
    padding-bottom: 0;
    padding-top: 40px;
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
    z-index: 1;
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


[hidden], .hidden {
    display: none !important;
}

.ib, .ib_>* {
    display: inline-block;
    width: auto;
    margin-top: 0;
    margin-bottom: 0;
}

.floatl {
    float: left;
}
.floatr {
    float: right;
}

.textc, .textc_>* {
    text-align: center;
}
.textr, .textr_>* {
    text-align: right;
}
.textl, .textl_>* {
    text-align: left;
}

.autom, .autom_>* {
    margin: auto !important;
}

.floatcx, .floatcx_>* {
    position: absolute;
    left: 0; right: 0;
    margin: auto !important;
}
.floatcy, .floatcy_>* {
    position: absolute;
    top: 0; bottom: 0;
    margin: auto !important;
}
.floatc, .floatc_>* {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
}

.centerx {
    display: flex;
    justify-content: center;
}
.centery {
    display: flex;
    align-items: center;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
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

.fix {
    position: fixed;
}

.fullw, .fullw_>* {
    width: 100%;
}
.fullh, .fullh_>* {
    height: 100%;
}

.autow, .autow_>* {
    width: auto;
}
.autoh, .autoh_>* {
    height: auto;
}

.scrollx, .scrollx_>* {
    overflow-x: auto;
    overflow-y: hidden;
}
.scrolly, .scrolly_>* {
    overflow-x: hidden;
    overflow-y: auto;
}
.scroll, .scroll_>* {
    overflow: auto;
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

.pad-s {
    padding-left: 5%;
    padding-right: 5%;
}
.pad {
    padding-left: 10%;
    padding-right: 10%;
}
.pad-l {
    padding-left: 15%;
    padding-right: 15%;
}

.msg {
    height: 60%;
    width: 60%;
    padding: 10% 5%;
    font-size: large;
}

.round {
    border-radius: 50%;
}

.fab[btn] {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 50px;
    margin: 20px;
    border-radius: 50%;
    z-index: 5;
}


/* fx */

[fx=stack]:not([paging]) > *,
[fx=stack][paging] > .results > * {
    opacity: 0;
    margin-top: 100px;
    transition: opacity 0.5s ease,
                margin-top 0.5s ease;
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


/* scrollbar */

/* webkit */
::-webkit-scrollbar {
    width: 16px;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    background-clip: content-box;
    border-right: solid transparent 8px;
    border-radius: 10px 23px 23px 10px;
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


/*** MEDIA QUERIES ***/


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

bootstrap()

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./blocks/all":1,"./components":8,"./extensions":9,"./themes":11,"./utils":12}],11:[function(require,module,exports){
exports.themes = {

    base : {
        font : 'normal 14px sans-serif',
        palette : {
            white   : '#fff',
            lighter : '#ddd',
            light   : '#bbb',
            mid     : '#888',
            dark    : '#444',
            darker  : '#222',
            black   : '#000',
            detail  : 'darkcyan',
            lighten : 'rgba(255,255,255,0.2)',
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
        text    : 'dark',
    },
    
}
},{}],12:[function(require,module,exports){
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


function checkData(data) {
    switch (typeof data) {
    case 'string':
        data = {value: data, label: data, alias: data.toLowerCase()}
        break
    case 'object':
        if ( !is.string(data.value) || !is.string(data.label) ) {
            error('Invalid data object (must have string properties "value" and "label"):', data)
            invalidData++
            data = {value: '', label: 'INVALID DATA', alias: ''}
        }
        else if ( !is.string(data.alias) ) {
            if (data.alias) {
                error('Invalid data property "alias" (must be a string):', data)
                invalidData++
            }
            data.alias = data.value.toLowerCase()
        }
        else data.alias = data.alias.toLowerCase() +' '+ data.value.toLowerCase()
        break
    default:
        error('Invalid data (must be a string or an object):', data)
        invalidData++
        data = {value: '', label: 'INVALID DATA', alias: ''}
    }
    return data
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
	checkData,
	random,
	onMobile,
    rastiError,
}
},{}]},{},[10])(10)
});
//# sourceMappingURL=rasti.map
