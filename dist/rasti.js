(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rasti = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
	buttons : require('./buttons'),
	checks  : require('./checks'),
	radios  : require('./radios'),
	multi   : require('./multi'),
	select  : require('./select'),
}
},{"./buttons":2,"./checks":3,"./multi":4,"./radios":5,"./select":6}],2:[function(require,module,exports){
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

},{"../utils":8}],3:[function(require,module,exports){
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
},{"../utils":8}],4:[function(require,module,exports){
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
},

style : `
    [block=multi] {
        position: relative;
        min-height: 35px;
        padding-right: 20px;
        text-shadow: 0 0 0 #000;
        cursor: pointer;
    }
    [block=multi] [add] {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 20px;
        border-left: 1px solid rgba(0,0,0,0.2);
    }
    [block=multi] [add]:before {
        content: '〉';
        padding-top: 2px;
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
        max-height: 100px;
        overflow-y: auto;
    }
    [block=multi] [selected]>option:hover:before {
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
    [block=multi][options]>option:before {
        transform: rotate(45deg);
    }
    [block=multi][options]>option:hover:before {
        color: #008000;
        background-color: rgba(0, 128, 0, 0.5);
    }
    [block=multi][options] input {
        border: 1px solid #000;
        margin: 10px 0;
    }

`

}
},{"../utils":8}],5:[function(require,module,exports){
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
},{"../utils":8}],6:[function(require,module,exports){
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

},{"../utils":8}],7:[function(require,module,exports){
(function (global){
/* zepto */

var utils = require('./utils'),
    is = utils.is,
    type = utils.type,
    sameType = utils.sameType

var options = {
    persist : false,
    history : false,
    root    : '',
    theme   : 'base',
    lang    : '',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
}

var breakpoints = {
    phone : 500,
    tablet : 800,
}
var media = {}
for (var device in breakpoints) {
    media[device] = window.matchMedia(`(max-width: ${ breakpoints[device] }px)`).matches
}

var log = function (...params) {
        if (rasti.options.log.search(/debug/i) != -1) console.log.call(this, ...params)
    },
    warn = function (...params) {
        if (rasti.options.log.search(/(warn)|(debug)/i) != -1) console.warn.call(this, ...params)
    },
    error = function (...params) {
        console.error.call(this, ...params)
    }


var rasti = function(name, container) {

    var errPrefix = 'Cannot create rasti app: '

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
    
    var self = this

    var invalidData = 0


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

    this.state = {}
    Object.defineProperties(self.state, {
        page  : { get : function() { return self.active.page.attr('page') }, enumerable : true },
        theme : { get : function() { return self.active.theme }, enumerable : true },
        lang  : { get : function() { return self.active.lang }, enumerable : true },
        save : { value : function() {
            localStorage.setItem('rasti.' + self.name, JSON.stringify(self.state))
            log('State saved')
        } },
        get : { value : function() {
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
        restore : { value : function() {
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
        clear : { value : function() {
            localStorage.removeItem('rasti.' + self.name)
        } },
    })

    this.pages = {}

    this.data = {}

    this.ajax = {}

    this.utils = {
        is : is,
        type : type,
        sameType : sameType,
    }

    this.templates = {}

    this.langs = {}


    this.themes = {

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
                lighten : 'rgba(255,255,255,0.1)',
                darken  : 'rgba(0,0,0,0.1)',
            },
        },

    }


    this.themeMaps = {

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
            else Object.keys(self.options).forEach(function(key){
                if (options[key]) {
                    if ( !sameType(self.options[key], options[key])  ) warn('Init option [%s] is invalid', key)
                    else self.options[key] = options[key]
                }
            })
        }


        // apply defaults
        Object.keys(self.defaults).forEach(function(key){
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
        container.find('[page]').each(function(i, el) {
            $(el).append('<div class="page-options">')
        })


        // init rasti blocks
        container.find('[block]').each(function(i, el) {
            initBlock($(el))
        })


        // create options for selects with data source
        container.find('select[data]').each(function(i, el) {
            updateBlock($(el))
        })


        // create tabs
        container.find('[tabs]').each(function(i, el) {
            createTabs($(el))
        })
        if (media.tablet || media.phone) container.find('[tabs-tablet]').each(function(i, el) {
            createTabs($(el))
        })
        if (media.phone) container.find('[tabs-phone]').each(function(i, el) {
            createTabs($(el))
        })


        // add close btn to modals
        container.find('[modal]').each(function(i, el) {
            $('<button close btn>✕</button>')
            .on('click', function(e){
                $(this).parent().hide()
                self.active.page.find('.backdrop').removeClass('backdrop')
            })
            .appendTo(el)
        })


        // init field validations
        container.find('[validate]').on('click', function (e) {
            var $container = $(this).parent().removeClass('invalid')
            var invalid
            $container.find('[field][required]').each(function(i, el){
                invalid = el.validity && !el.validity.valid
                el.classList.toggle('error', invalid)
                if (invalid) $container.addClass('invalid')
            })
            if ($container.hasClass('invalid')) {
                // prevent any default actions
                e.preventDefault()
                // and any custom actions (such as nav)
                e.stopImmediatePropagation()
            }
        })


        // init nav
        container.find('[nav]').click(function(e) {
            var $el = $(this),
                page = $el.attr('nav'),
                params = {}

            if (!page) return error('Missing page name in [nav] attribute of element:', el)

            if (this.hasAttribute('params')) {
                var $page = self.active.page,
                    paramkeys = $el.attr('params'),
                    $paramEl
                if (paramkeys) {
                    // get specified params
                    paramkeys = paramkeys.split(' ')
                    paramkeys.forEach(function(key) {
                        $paramEl = $page.find('[navparam='+ key +']')
                        if ($paramEl.length) params[key] = $paramEl.val()
                        else warn('Could not find navparam element [%s]', key)
                    })
                }
                else {
                    // get all params
                    $page.find('[navparam]').each(function(i, el){
                        $el = $(el)
                        key = resolveAttr($el, 'navparam')
                        if (key) params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })


        // init submit
        container.find('[submit]').click(function(e) {
            var $el = $(this),
                method = $el.attr('submit'),
                callback = $el.attr('then'),
                template = $el.attr('render'),
                isValidCB = callback && is.function(self.utils[callback]),
                start = window.performance.now(), end

            if (!method) return error('Missing ajax method in [submit] attribute of el:', this)

            if (callback && !isValidCB) error('Undefined utility method [%s] declared in [then] attribute of el:', callback, this)
            
            $el.addClass('loading').attr('disabled', true)

            submitAjax(method, function(resdata){ 
                var time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)

                if (isValidCB) self.utils[callback](resdata)
                if (template) render(template, resdata, time)

                $el.removeClass('loading').removeAttr('disabled')
            })
        })


        // init render
        container.find('[render]').not('[submit]').click(function(e) {
            var $el = $(this),
                template = $el.attr('render')
            if (!template) return error('Missing template name in [render] attribute of element:', el)
            render(template)
        })


        // init actions
        for (var action of 'click change hover load'.split(' ')) {
            container.find('[on-'+ action +']').each(function(i, el){
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
            container.find('['+ action +']').each(function(i, el){
                var $el = $(el),
                    $page = $el.closest('[page]'),
                    targetSelector = $el.attr(action)
                if ( !targetSelector ) return error('Missing target selector in [%s] attribute of element:', action, el)
                var $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)
                $el.on('click', function(e){
                        if ($target[0].hasAttribute('modal')) $page.find('.page-options').addClass('backdrop')
                        $target[action]()
                    })
                    .removeAttr(action)
            })
        }


        // init move
        container.find('[move]').each(function(i, el){
            $(el).move()
        })


        // init collapse
        container.find('[collapse]').on('click', function(e){
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
                    self.active.page = $page
                    page.init()
                }
            }
        }


        // resolve empty headers and labels
        'header label'.split(' ').forEach(function(attr){
            var $el
            container.find('['+attr+']').each(function(i, el) {
                $el = $(el)
                if (!$el.attr(attr)) $el.attr( attr, resolveAttr($el, attr) )
            })
        })


        // fix labels
        'input select textarea'.split(' ').forEach(function(tag){
            container.find(tag + '[label]').each(function(i, el) {
                fixLabel($(el))
            })
        })


        // bind nav handler to popstate event
        window.onpopstate = function(e) {
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
            $(window).on('beforeunload', function(e){ self.state.save() })
        }

        if ( !self.options.persist || !restored ) {

            // set lang (if applicable and not already set)
            if ( self.options.lang && !self.active.lang ) setLang(self.options.lang)
            // if no lang, generate texts
            if ( !self.options.lang ) {
                container.find('[text]').each(function(i, el) {
                    $(el).text( $(el).attr('text') )
                })
            }

            // set theme (if not already set)
            if ( !self.active.theme ) setTheme(self.options.theme)

            // nav to page in hash or to root or to first page container
            var page = location.hash.substring(1) || self.options.root
            navTo(page && self.pages[page] ? page : container.find('[page]').first().attr('page'))
        }


        // init state elements
        container.find('[state]').each(function(i, el){
            var $el = $(el)
            var prop = resolveAttr($el, 'state')

            if (!prop) return

            if (el.value !== undefined) {
                // it's an element
                bindElement($el, prop)
            }
            else {
                // it's a container
                $el.find('[field]').each(function(i, el){
                    $el = $(el)
                    bindElement($el, prop, $el.attr('field'))
                })
            }

            function bindElement($el, prop, subprop){
                var root = self.state
                if (subprop) {
                    root[prop] = root[prop] || {}
                    root = root[prop]
                    prop = subprop
                }
                if ( root[prop] ) {
                    $el.val( root[prop] )
                    if ( $el.attr('block') ) $el.trigger('change')
                }
                else root[prop] = ''
                $el.on('change', function(e){
                    root[prop] = $el.val()
                })
            }
        })


        container
            .on('click', '.backdrop', function(e){
                $(e.target).removeClass('backdrop')
                self.active.page.find('[modal]').hide()
            })
            .removeClass('big loading backdrop')

        var initTime = Math.floor(window.performance.now() - initStart) / 1000
        log('App [%s] initialized in %ss', self.name, initTime)

    }


    function get(selector) {
        if ( !self.active.page || !self.active.page.length ) return error('Cannot get(%s), active page is not defined', selector)
        var $els = self.active.page.find('['+ selector +']')
        if (!$els.length) error('Cannot get(%s), element not found in page [%s]', selector, self.active.page.attr('page'))
        return $els
    }

    function set(selector, value) {        
        if ( !self.active.page || !self.active.page.length ) return error('Cannot set(%s), active page is not defined', selector)
        var $els = self.active.page.find('['+ selector +']')
        if (!$els.length) error('Cannot set(%s), element not found in page [%s]', selector, self.active.page.attr('page'))
        $els.each(function(i, el){
            el.value = value
            $(el).change()
        })
    }

    function add(selector, ...values) {
        if ( !self.active.page || !self.active.page.length ) return error('Cannot add(%s), active page is not defined', selector)
        var $els = self.active.page.find('['+ selector +']')
        if (!$els.length) error('Cannot add(%s), element not found in page [%s]', selector, self.active.page.attr('page'))
        $els.each(function(i, el){
            values.forEach(function(val){
                if (is.array(val)) el.value = el.value.concat(val)
                else el.value.push(val)
            })
            $(el).change()
        })
    }


    function navTo(pagename, params, skipPushState) {

        if (!pagename) return error('Cannot navigate, page undefined')

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) return error('Cannot nav to page [%s]: page container not found', pagename)
        
        self.active.page = $page

        if ( params && !is.object(params) ) warn('Page [%s] nav params must be an object!', pagename)
            
        if (page && page.nav) {
            !is.function(page.nav)
                ? warn('Page [%s] nav property must be a function!', pagename)
                : page.nav(params)
        }

        container.find('[page].active').removeClass('active')
        self.active.page.addClass('active')

        container.trigger('rasti-nav')

        if (skipPushState) return
        if (page && page.url) {
            !is.string(page.url)
                ? warn('Page [%s] url property must be a string!', pagename)
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
            template = function(data, lang) {
                return data.map(function(obj){ return html }).join()
            }
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

        attributes.forEach(function(attr){
            $elems = $elems.add('['+attr+']')
        })

        $elems.each(function(i, el) {
            if (el.hasAttribute('fixed')) el = el.children[0]
            $el = $(el)   
            keys = el.langkeys

            if (!keys) {
                keys = {}
                attributes.forEach(function(attr){
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

        Object.keys(self.defaults).forEach(function(key){
            self.options[key] = lang['rasti_'+key] || self.defaults[key]
        })
    }


    function updateBlock($el, data) {
        var el = $el[0]
        var type = el.nodeName == 'SELECT' ? 'select' : $el.attr('block')
        if (!type) return error('Missing block type in [block] attribute in element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)
        
        if (!data) {
            var datakey = resolveAttr($el, 'data')
            if (!datakey) return

            data = self.data[datakey]
            if (!data) return error('Undefined data source "%s" resolved for element:', datakey, el)
        }

        var $options, field, alias

        // TODO: this should be in the block, not here
        if (type === 'multi') {
            var field = $el.attr('field')
            if (!field) return error('Missing field name in [field] attribute of element:', el)
            // check if options div already exists
            $options = $el.closest('[page]').find('[options='+ field +']')
            if (!$options.length) {
                // if not create it and append it to page
                $options = $('<div field block='+ type +' options='+ field +'>')
                $el.closest('[page]').children('.page-options').append($options)
            }   
        }
        else {
            $options = $el
        }

        is.function(data)
            ? data(applyTemplate)
            : applyTemplate(data)
        
        function applyTemplate(data) {
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
        prefixes.forEach(function(p){
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

        $tabs.each(function(i, tab){
            $tab = $(tab)
            $tab.attr('tab', i)
            label = resolveAttr($tab, 'tab-label') || 'TAB ' + (i+1)

            $labels.append($(`<div tab-label=${i} text="${ label }">`))
        })

        $labels.append($bar).prependTo($el)
        var $flow = $tabs.wrapAll('<div h-flow>').parent()

        $labels.on('click', function(e){
            var $label = $(e.target),
                tabnr = $label.attr('tab-label'),
                $tab = $tabs.filter(`[tab="${ tabnr }"]`)

            $tabs.removeClass('active')
            $tab.addClass('active')[0].scrollIntoView()

            $labels.children().removeClass('active')
            $label.addClass('active')
            
        })

        $flow.on('scroll', function(e){
            position = this.scrollLeft / this.scrollWidth
            $bar.css({ left : position * this.offsetWidth })
        })

        container.on('rasti-nav', function(e){
            if (!isInActivePage($el)) return
            $bar.css({ width : $flow[0].offsetWidth / $tabs.length })
            if (!$labels.children('.active').length) $labels.children().first().click()
        })

        $(window).on('resize', function (e) {
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
        if (!type) return error('Missing block type in [block] attribute in element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        // if applicable, create options from data source
        if (el.hasAttribute('data')) updateBlock($el)

        block.init($el)
    }


    function initHistory() {
        self._history = new History()

        Object.defineProperty(self, 'history', { get: function(){
            return self._history.content
        } })
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
            paging, columns, sizes

        if ($el[0].hasAttribute('columns')) columns = `
            <div class="columns floatl ib_">
                <label>Columns:</label>
                <button btn>1</button>
                <button btn value=2>2</button>
                <button btn value=3>3</button>
            </div>`

        if (pager.total > 1) paging = `<div class="paging ib ib_">
                <button class="btn prev">&lt;</button>
                <span class="page"></span>
                <button class="btn next">&gt;</button>
            </div>`

        sizes = `<div class="sizes floatr ib_">
                <label>Page size:</label>
                <button btn value=5>5</button>
                <button btn value=10>10</button>
                <button btn value=20>20</button>
            </div>`

        $el.html(`
            <div class="results scrolly"></div>
            <div class="controls small bottom centerx ib_">
                ${ columns || '' }
                ${ paging || '' }
                ${ sizes }
            </div>
        `)

        $controls = $el.children('.controls')
        $results = $el.children('.results')

        $controls.on('click', '.next', function(e){
            update( pager.next() )
        })

        $controls.on('click', '.prev', function(e){
            update( pager.prev() )
        })

        $controls.on('click', '.sizes button', function(e){
            pager.setPageSize(this.value)
            update( pager.next() )
            pager.total > 1
                ? $controls.find('.paging').show()
                : $controls.find('.paging').hide()
        })

        $controls.on('click', '.columns button', function(e){
            $results.removeClass('columns-2 columns-3')
                .addClass(this.value ? 'columns-' + this.value : '')
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
        $form.find('[field]').each(function(i, el){
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
            }
            ${ns} [page]    { background-color: ${ values.page[0] }; }
            ${ns} [panel]   { background-color: ${ values.panel[0] }; }
            ${ns} [section] { background-color: ${ values.section[0] }; }

            ${ns} [page][header]:before,
                  [page][footer]:after     { background-color: ${ values.page[1] }; }
            ${ns} [panel][header]:before   { background-color: ${ values.panel[1] }; }
            ${ns} [section][header]:before { background-color: ${ values.section[1] }; }

            ${ns} .tab-labels        { background-color: ${ values.panel[0] }; }
            ${ns} .tab-labels > .bar { background-color: ${ values.btn[0] }; }

            ${ns} [field] {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }

            ${ns} [btn], .btn, [block=buttons] > div {
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


    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }


    // internal classes

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
            if ( !is.string(id) ) return error('Pager id must be a string')
            this.logid = `Pager for template [${ this.id }]:`
            if ( !is.array(results) ) return error('%s Results must be an array', this.logid)
            if ( !is.number(page_size) ) return error('%s Page size must be a number', this.logid)
            this.results = results
            this.page_size = page_size
            this.page = 0
            this.total = Math.ceil(this.results.length / this.page_size)

        }

        next() {
            if (this.hasNext()) this.page++
            else warn('%s No next page', this.logid)
            return this.getPageResults(this.page)
        }

        prev() {
            if (this.hasPrev()) this.page--
            else warn('%s No previous page', this.logid)
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
            if ( !is.number(size) ) return error('%s Must specify a number as the page size', this.logid)
            this.page_size = size
            this.page = 0
            this.total = Math.ceil(this.results.length / this.page_size)
        }

        getPageResults(page) {
            if ( !is.number(page) ) {
                error('%s Must specify a page number to get results from', this.logid)
                return []
            }
            try {
                var i = (page -1) * this.page_size
                return this.results.slice(i, i + this.page_size)
            }
            catch(err) {
                error('%s Could not get results of page %s, error:', this.logid, page, err)
                return []
            }
        }

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
        extend : extend,
        init : init,
        get : get,
        set : set,
        add : add,
        navTo : navTo,
        render : render,
        setLang : setLang,
        setTheme : setTheme,
        updateBlock : updateBlock,
        toggleFullScreen : toggleFullScreen,
    })

}


// static properties and methods
rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.blocks = require('./blocks/all')
rasti.fx = {

    stack : function($el) {
        $el.children().each(function(i, el){
            setTimeout(function(){
                el.style.opacity = 1
                el.style.marginTop = '15px'
            }, i * 50);
        })
    },

}
rasti.options = {log : 'debug'}

module.exports = Object.freeze(rasti)


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
    var options = $.extend({
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


// bootstrap any apps defined via rasti attribute
function bootstrap() {
    var appContainers = $(document).find('[rasti]'),
        appName, app, extendProps

    if (appContainers.length) appContainers.forEach(function(el){
        appName = el.getAttribute('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', el)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, el)
        else {
            global[appName] = app = new rasti(appName, el)
            Object.keys(app.options).forEach(function(key) {
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
    $('head').append(styles)
}


var rastiCSS

rastiCSS = `body {
    margin: 0;
    font-family: sans-serif;
    font-size: 14px;
}
*, *:before, *:after {
    box-sizing: border-box;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: background-color 0.2s,
                font 0.2s;
}
input {
    width: 100%;
    margin: 0;
    vertical-align: text-bottom;
}
input:invalid{
    outline: 1px solid red;
}

input:focus:invalid {
    outline: none;
}


[page], [panel], [section] {
    position: relative;
    overflow: hidden;    
}

[page] {
    height: 100vh;
    width: 100vw;
    padding-bottom: 15px;
    margin-bottom: -5px;
}
[page]:not(.active) {
	display: none !important;
}


[panel] {
    padding: 20px 15px;
    border-radius: 4px;
}


[section] {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 4px;
}
[section] [label]:before {
    text-shadow: 0 0 0 #000;
}
[section]>*:first-child:not([label]) {
    margin-top: 0px;
}


[header][panel] {
    padding-top: 65px;
}
[header][section] {
    padding-top: 55px;
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
    font-size: 2em;
}
[header][section]:before {
    height: 40px;
    padding: 10px;
    font-size: 1.5em;
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


[field], [btn], .field, .btn {
    width: 100%;
    padding: 5px 10px;
    border: 0;
    border-radius: 2px;
    outline: none;
    font-family: inherit !important;
    font-size: inherit;
    color: #222;
}
[btn], .btn {
    height: 50px;
    min-width: 50px;
    border: 1px solid rgba(0,0,0,0.1);
    font-size: 1.2em;
    text-transform: uppercase;
	cursor: pointer;
}
[btn]:not(:disabled):hover, .btn:not(:disabled):hover {
    filter: contrast(1.5);
}
[btn][disabled], .btn[disabled]{
    filter: contrast(0.5);
}
[btn][disabled], .btn[disabled] {
    cursor: auto;
}
[panel] [field], [panel] [btn], [panel] [label],
[panel] .field, [panel] .btn,
[section] [field], [section] [btn], [section] [label],
[section] .field, [section] .btn {
    margin-bottom: 15px;
}
[btn][ib], [btn].ib, .btn[ib], .btn.ib,
[ib_]>[btn], [ib_]>.btn, .ib_>[btn], .ib_>.btn {
    margin-top: 0;
    margin-bottom: 0;
}

[big][field], [big][btn], .big.field , .big.btn,
[big].field, [big].btn, .big[field] , .big[btn],
[big] [field], [big] [btn], .big .field, .big .btn,
[big] .field, [big] .btn, .big [field] , .big [btn] {
    min-height: 70px;
    margin-bottom: 25px;
    font-size: 1.5em;
}
[small][field], [small][btn], .small.field , .small.btn,
[small].field, [small].btn, .small[field] , .small[btn],
[small] [field], [small] [btn], .small .field, .small .btn,
[small] .field, [small] .btn, .small [field] , .small [btn] {
    height: 25px;
    margin-bottom: 15px;
    font-size: 1em;
}
[big] [label], .big [label]{
    margin-top: 25px;
    font-size: 1.2em;
}
[big] [label]:before, .big [label]:before {
    margin-top: -27px;
}
[big] [label][field]:before, .big [label][field]:before {
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
    padding: 15px;
    color: #fff;
    text-align: center;
}
[template] > .stats {
    height: 40px;
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
.tab-labels + [h-flow] {
    height: calc(100% - 40px);
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

.tab-labels {
    display: flex;
    position: relative;
    justify-content: space-around;
    white-space: nowrap;
    min-width: 100vw;
    height: 40px;
    padding: 0;
    border-bottom: 1px solid rgba(0,0,0, 0.2);
    border-radius: 0;
    text-transform: uppercase;
    z-index: 1;
}
.tab-labels > .bar {
    position: absolute;
    bottom: 0; left: 0;
    height: 4px;
    transition: left 0.2s, width 0.2s;
}
[tab-label] {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 auto;
    min-width: 50px;
    max-width: 120px;
    padding: 5px;
    font-size: 1.2em;
    line-height: 1;
    text-align: center;
    text-shadow: 0 0 0 #000;
    cursor: pointer;
}
[tab-label].active {
    filter: contrast(1.5);
}


[modal] {
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
    z-index: 2;
}


[backdrop]:before, .backdrop:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,.7);
    animation: fadeIn .4s;
    z-index: 1;
}


[label] {
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
    left: 0;
    height: 20px;
    font-size: 1.2em;
    text-transform: capitalize;
}
[label][field]:before {
    margin-top: -27px;
    margin-left: -7px;
}
[label][fixed]:before {
    margin-top: -22px;
    margin-left: 4px;
}
[label][field][big]:before {
    margin-left: 0;
}
[inline][label], [inline]>[label] {
    width: auto;
    margin-top: 0;
    margin-bottom: 30px;
    margin-left: calc(40% + 10px);
}
[inline][label]:before, [inline]>[label]:before {
    width: 40%;
    margin-top: 0;
    text-align: right;
}


select[field] {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    padding-right: 25px;
    background-image: url(../img/caret.png);
    background-repeat: no-repeat;
    background-position: right;
    cursor: pointer;
}


textarea[field] {
    height: 70px;
    resize: none;
}


input[type=radio],
input[type=checkbox] {
    display: none;
}
input[type=radio] + label,
input[type=checkbox] + label {
    display: inline-block;
    max-width: 90%;
    margin-left: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}
input[type=radio] + label:before,
input[type=checkbox] + label:before {
    content: '\\2713';
    position: absolute;
    height: 16px;
    width: 16px;
    margin-left: -22px;
    padding: 0;
    border: 1px solid #999;
    color: transparent;
    background-color: #fff;
    font: 16px/1em sans-serif;
    text-align: center;
}
input[type=radio] + label:before {
    content: '\\25cf';
    border-radius: 50%;
    font-size: 1.3em;
    line-height: 0.6;
}
input[type=radio]:checked + label:before,
input[type=checkbox]:checked + label:before {
    color: #222;
    animation: stamp 0.4s ease-out;
}
@keyframes stamp {
    50% { transform: scale(1.2); }
}


.row, [row] {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
}
.row > .col-1,  [row] > [col-1]  { flex-basis: calc(08.33% - 15px); }
.row > .col-2,  [row] > [col-2]  { flex-basis: calc(16.66% - 15px); }
.row > .col-3,  [row] > [col-3]  { flex-basis: calc(25.00% - 15px); }
.row > .col-4,  [row] > [col-4]  { flex-basis: calc(33.33% - 15px); }
.row > .col-5,  [row] > [col-5]  { flex-basis: calc(41.66% - 15px); }
.row > .col-6,  [row] > [col-6]  { flex-basis: calc(50.00% - 15px); }
.row > .col-7,  [row] > [col-7]  { flex-basis: calc(58.33% - 15px); }
.row > .col-8,  [row] > [col-8]  { flex-basis: calc(66.66% - 15px); }
.row > .col-9,  [row] > [col-9]  { flex-basis: calc(75.00% - 15px); }
.row > .col-10, [row] > [col-10] { flex-basis: calc(83.33% - 15px); }
.row > .col-11, [row] > [col-11] { flex-basis: calc(91.66% - 15px); }

.row [class*=col-]:not(:first-child),
[row] [col-1]:not(:first-child),
[row] [col-2]:not(:first-child),
[row] [col-3]:not(:first-child),
[row] [col-4]:not(:first-child),
[row] [col-5]:not(:first-child),
[row] [col-6]:not(:first-child),
[row] [col-7]:not(:first-child),
[row] [col-8]:not(:first-child),
[row] [col-9]:not(:first-child),
[row] [col-10]:not(:first-child),
[row] [col-11]:not(:first-child) { margin-left: 15px; }


.page-options {
    flex-basis: initial !important;
}


/* utils */

[move] {
    user-select: none;
    cursor: move;
}

[resize] {
    resize: both;
    overflow: hidden;
}
[collapse] {
    animation: foldOut 0.5s;
}
[section][collapse].folded {
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




[ib], .ib,
[ib_]>*, .ib_>* {
    display: inline-block;
    width: auto;
}

[floatl], .floatl {
    float: left;
}
[floatr], .floatr {
    float: right;
}

[textc], .textc,
[textc_]>*, .textc_>* {
    text-align: center;
}

[autom], .autom,
[autom_]>*, .autom_>* {
    margin: auto !important;
}

[centerx], .centerx,
[centerx_]>*, .centerx_>* {
    position: absolute;
    left: 0; right: 0;
    margin: auto !important;
}

[centery], .centery,
[centery_]>*, .centery_>* {
    position: absolute;
    top: 0; bottom: 0;
    margin: auto !important;
}

[center], .center,
[center_]>*, .center_>* {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto !important;
}

[left], .left,
[left_]>*, .left_>* {
    position: absolute;
    left: 0;
}

[right], .right,
[right_]>*, .right_>* {
    position: absolute;
    right: 0;
}

[top], .top
[top_]>*, .top_>* {
    position: absolute;
    top: 0;
}

[bottom], .bottom,
[bottom_]>*, .bottom_>* {
    position: absolute;
    bottom: 0;
}

[fix], .fix {
    position: fixed;
}

[fullw], .fullw,
[fullw_]>*, .fullw_>* {
    width: 100%;
}

[fullh], .fullh,
[fullh_]>*, .fullh_>* {
    height: 100%;
}

[autow], .autow,
[autow_]>*, .autow_>* {
    width: auto;
}

[autoh], .autoh,
[autoh_]>*, .autoh_>* {
    height: auto;
}

[scrollx], .scrollx,
[scrollx_]>*, .scrollx_>* {
    overflow-x: auto;
    overflow-y: hidden;
}

[scrolly], .scrolly,
[scrolly_]>*, .scrolly_>* {
    overflow-x: hidden;
    overflow-y: auto;
}

[scroll], .scroll,
[scroll_]>*, .scroll_>* {
    overflow: auto;
}

[columns-2], .columns-2 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
[columns-2]>*, .columns-2>* {
    width: 49%;
    margin-right: 2%;
}
[columns-2]>*:nth-child(2n),
.columns-2>*:nth-child(2n){
    margin-right: 0;
}

[columns-3], .columns-3 {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
[columns-3]>*, .columns-3>* {
    width: 32%;
    margin-right: 2%;
}
[columns-3]>*:nth-child(3n),
.columns-3>*:nth-child(3n){
    margin-right: 0;
}

[pad-s] {
    padding-left: 5%;
    padding-right: 5%;
}
[pad] {
    padding-left: 10%;
    padding-right: 10%;
}
[pad-l] {
    padding-left: 15%;
    padding-right: 15%;
}

[msg], .msg {
    height: 60%;
    width: 60%;
    padding: 10% 5%;
    font-size: large;
}

[icon], .icon {
    border: 1px solid #000;
    font-size: 2em;
    line-height: 1;
}

[round], .round {
    border-radius: 50%;
}

[fab][btn], .fab.btn {
    position: fixed;
    width: 50px;
    margin: 20px;
    border-radius: 50%;
    z-index: 1;
}

[close][btn], .close.btn {
    position: absolute;
    top: 0; right: 0;
    width: 50px;
    background-color: transparent !important;
    border: none;
    font-size: 1.5em
}

.error {
  box-shadow: 0px 0px 16px 2px red;
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
    [pad-s-desktop] {
        padding-left: 5%;
        padding-right: 5%;
    }
    [pad-desktop] {
        padding-left: 10%;
        padding-right: 10%;
    }
    [pad-l-desktop] {
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

    [header][hh-tablet]:before {
        display: none;
    }
    [header][hh-tablet][page] {
        padding-top: 0;
    }
    [header][hh-tablet][panel] {
        padding-top: 20px;
    }
    [header][hh-tablet][section] {
        padding-top: 15px;
    }
    
    [pad-s-tablet] {
        padding-left: 5%;
        padding-right: 5%;
    }
    [pad-tablet] {
        padding-left: 10%;
        padding-right: 10%;
    }
    [pad-l-tablet] {
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

    [class*=col-],
    [col-1], [col-2], [col-3],
    [col-4], [col-5], [col-6],
    [col-7], [col-8], [col-9],
    [col-10], [col-11]  {
        min-width: 100%;
        margin-left: 0;
        margin-bottom: 15px;
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

    [header][hh-phone]:before {
        display: none;
    }
    [header][hh-phone][page] {
        padding-top: 0;
    }
    [header][hh-phone][panel] {
        padding-top: 20px;
    }
    [header][hh-phone][section] {
        padding-top: 15px;
    }

    [pad-s-phone] {
        padding-left: 5%;
        padding-right: 5%;
    }
    [pad-phone] {
        padding-left: 10%;
        padding-right: 10%;
    }
    [pad-l-phone] {
        padding-left: 15%;
        padding-right: 15%;
    }
    


}

`

if (rastiCSS) $('head').append('<style>' + rastiCSS + '</style>')

genBlockStyles()

bootstrap()

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./blocks/all":1,"./utils":8}],8:[function(require,module,exports){
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
	is : is,
	type : type,
	sameType : sameType,
	checkData : checkData,
	random : random,
	onMobile : onMobile,
    rastiError : rastiError,
}
},{}]},{},[7])(7)
});
//# sourceMappingURL=rasti.map
