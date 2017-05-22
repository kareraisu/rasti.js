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
            values = $el.closest('[rasti=checks]')[0].value
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
    [rasti=checks]>div {
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
        $el.closest('[rasti=radios]').val($el.attr('value'))
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
    [rasti=radios]>div {
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
var utils = require('./utils')
var is = utils.is,
    type = utils.type,
    sameType = utils.sameType


module.exports = function(name) {

    var self = this

    var invalidData = 0


    // internal properties

    this.name = 'rasti.' + name.replace(' ', '')

    this.active = {
        page  : null,
        theme : '',
        lang  : '',
    }

    this.pagers = new Map()


    // config objects

    this.options = {
        log   : false,
        state : false,
        root  : '',
        theme : 'base',
        lang  : '',
    }

    this.defaults = {
        stats : '%n results in %t seconds',
        noData : 'No data available',
    }

    this.state = {}
    Object.defineProperties(self.state, {
        page  : { get : function() { return self.active.page.attr('page') }, enumerable : true },
        theme : { get : function() { return self.active.theme }, enumerable : true },
        lang  : { get : function() { return self.active.lang }, enumerable : true },
        save : { value : function() {
            localStorage.setItem(self.name, JSON.stringify(self.state))
            log('State saved')
        } },
        get : { value : function() {
            var state
            try {
                state = JSON.parse( localStorage.getItem(self.name) )
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
                for (let prop in state) {
                    self.state[prop] = state[prop]
                }
                if (state.theme) setTheme(state.theme)
                if (state.lang) setLang(state.lang)
                navTo(self.state.page)
                log('State restored')
            }
            return state
        } },
        clear : { value : function() {
            localStorage.removeItem(self.name)
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


    this.fx = {

        stack : function($el) {
            $el.children().each(function(i, el){
                setTimeout(function(){
                    el.style.opacity = 1
                    el.style.marginTop = '15px'
                }, i * 50);
            })
        },

    }


    this.blocks = require('./blocks/all')


    // methods

    function config(config) {
        for (var key in self) {
            if ($.type(self[key]) === 'object' && $.type(config[key]) === 'object')
                Object.assign(self[key], config[key])
        }
    }


    function init(options) {

        // cache options
        if ( !is.object(options) ) warn('Init options must be an object')
        else Object.keys(self.options).forEach(function(key){
            if (options[key]) {
                if ( !sameType(self.options[key], options[key])  ) warn('Init option [%s] is invalid', key)
                else self.options[key] = options[key]
            }
        })


        // apply defaults
        Object.keys(self.defaults).forEach(function(key){
            if (!self.options[key]) self.options[key] = self.defaults[key]
        })
        

        // define lang (if not already defined)
        if (!self.options.lang) {
            keys = Object.keys(self.langs)
            if (keys.length) self.options.lang = keys[0]
        }


        // append blocks styles
        var styles = '<style blocks>'
        for (var key in self.blocks) {
            styles += self.blocks[key].style
        }
        styles += '</style>'
        $('body').append(styles)


        // append theme style container
        $('body').append('<style theme>')


        // append page-options containers
        $('[page]').each(function(i, el) {
            $(el).append('<div class="page-options">')
        })


        // init rasti blocks
        $('[rasti]').each(function(i, el) {
            initBlock($(el))
        })


        // create options for selects with data source
        $('select[data]').each(function(i, el) {
            updateBlock($(el))
        })


        // create tabs
        $('[tabs]').each(function(i, el) {
            createTabs($(el))
        })


        // init nav
        $('[nav]').click(function(e) {
            var $el = $(this),
                page = $el.attr('nav'),
                params = {}

            if (!page) return error('Please provide a page name in [nav] attribute of element:', el)

            if (this.hasAttribute('params')) {
                var $page = self.active.page
                var paramkeys = $el.attr('params')
                if (paramkeys) {
                    // get specified params
                    paramkeys = paramkeys.split(' ')
                    paramkeys.forEach(function(key) {
                        params[key] = $page.find('[navparam='+ key +']').val()
                    })
                }
                else {
                    // get all params
                    $page.find('[navparam]').each(function(i, el){
                        $el = $(el)
                        key = $el.attr('navparam')
                        if (!key) return error('Please provide a param name in [navparam] attribute of element:', el)
                        params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })


        // init submit
        $('[submit]').click(function(e) {
            var $el = $(this),
                method = $el.attr('submit'),
                callback = $el.attr('then'),
                template = $el.attr('render'),
                isValidCB = callback && is.function(self.utils[callback]),
                start = window.performance.now(), end

            if (!method) return error('Plase provide an ajax method in [submit] attribute')

            if (callback && !isValidCB) error('Utility method [%s] provided in [then] attribute is not defined', callback)
            
            $el.addClass('loading').attr('disabled', true)

            submitAjax(method, function(resdata){
                end = window.performance.now()
                var time = Math.floor(end - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)

                if (isValidCB) self.utils[callback](resdata)
                if (template) render(template, resdata, time)

                $el.removeClass('loading').removeAttr('disabled')
            })
        })


        // init render
        $('[render]').not('[submit]').click(function(e) {
            var $el = $(this),
                template = $el.attr('render')
            if (!template) return error('Please provide a template name in [render] attribute of element:', el)
            render(template)
        })


        // init actions
        for (var action of 'click change'.split(' ')) {
            $('['+ action +']').each(function(i, el){
                var $el = $(el),
                    method = $el.attr( action )
                if ( !app.utils[ method ] ) return error('Undefined utility method "%s" declared in [%s] attribute of element:', method, action, el)
                $(this).on( action , app.utils[ method ] )
            })
        }


        // init pages
        var page, $page
        for (var name in self.pages) {
            page = self.pages[name]
            if ( !is.object(page) ) return error('Page [%s] must be an object!', name)
            $page = $('[page='+ name +']')
            if ( !$page.length ) return error('No container element bound to page [%s]. Please bind one via [page] attribute', name)
            if (page.init) {
                if ( !is.function(page.init) ) return error('Page [%s] init property must be a function!', name)
                else {
                    log('Initializing page [%s]', name)
                    self.active.page = $page
                    page.init()
                }
            }
        }


        // fix labels
        'input select textarea'.split(' ').forEach(function(tag){
            $(tag + '[label]').each(function(i, el) {
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


        // restore and persist state (if applicable)
        var restored
        if (self.options.state) {
            restored = self.state.restore()
            $(window).on('beforeunload', function(e){ self.state.save() })
        }

        if ( !self.options.state || !restored ) {

            // set lang (if applicable and not already set)
            if ( self.options.lang && !self.active.lang ) setLang(self.options.lang)
            // if no lang, generate texts
            if ( !self.options.lang ) {
                $('[text]').each(function(i, el) {
                    $(el).text( $(el).attr('text') )
                })
            }

            // set theme (if not already set)
            if ( !self.active.theme ) setTheme(self.options.theme)

            // nav to page in hash or to root or to first page container
            var page = location.hash.substring(1) || self.options.root
            navTo(page && self.pages[page] ? page : $('[page]').first().attr('page'))
        }


        // init state elements
        $('[state]').each(function(i, el){
            var $el = $(el)
            var prop = $el.attr('state')

            if (!prop) return warn('Missing state prop in [state] attribute of element', el)

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
                    if ( $el.attr('rasti') ) $el.trigger('change')
                }
                else root[prop] = ''
                $el.on('change', function(e){
                    root[prop] = $el.val()
                })
            }
        })


        $(document).trigger('rasti-ready')

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

        var page = self.pages[pagename],
            $page = $('[page='+ pagename +']')

        if (!$page) return error('Page [%s] container not found', pagename)
        
        self.active.page = $page

        if ( params && !is.object(params) ) error('Page [%s] nav params must be an object!', pagename)
            
        if (page && page.nav) {
            !is.function(page.nav)
                ? error('Page [%s] nav property must be a function!', pagename)
                : page.nav(params)
        }

        $('[page].active').removeClass('active')
        self.active.page.addClass('active')

        $(document).trigger('rasti-nav')

        if (skipPushState) return
        if (page && page.url) {
            !is.string(page.url)
                ? log('Page [%s] url property must be a string!', pagename)
                : window.history.pushState(pagename, null, '#'+page.url)
        }
        else {
            window.history.pushState(pagename, null)
        }
    }


    function render(name, data, time) {
        var template = self.templates[name]
        if (!template) return error('Template [%s] is not defined', name)

        var $el = $('[template='+ name +']')
        if (!$el.length) return error('No element bound to template [%s]. Please bind one via [template] attribute.', name)
        var el = $el[0]

        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return error('No data found for template [%s]. Please provide in ajax response or via [data] attribute in element:', name, el)
            data = self.data[datakey]
            if (!data) return error('Undefined data source "%s" in [data] attribute of element:', datakey, el)
        }

        if (!data.length) return $el.html(`<div msg center textc>${ self.options.noData }</div>`)

        var paging = $el.attr('paging')
        paging ? initPager($el, data) : $el.html( template(data) )
        if (el.hasAttribute('stats')) {
            var stats = $('<div section class="stats">')
            stats.html( self.options.stats.replace('%n', data.length).replace('%t', time) )
            $el.prepend(stats)
        }

        var fxkey = $el.attr('fx')
        if (fxkey) {
            var fx = self.fx[fxkey]
            if (!fx) return error('Undefined fx "%s" in [fx] attribute of element', fxkey, el)
            paging ? fx($el.find('.results')) : fx($el)
        }

    }


    function setTheme(themeString) {
        var themeName = themeString.split(' ')[0],
            theme = self.themes[themeName]

        if (!theme) return error('Theme [%s] not found', themeName)

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
        $('style[theme]').html( getThemeStyle(values) )

        // apply any styles defined by class
        for (var key of Object.keys(theme.palette)) {
            var color = theme.palette[key]
            $('.' + key).css('background-color', color)
        }
    }


    function setLang(langName) {
        var lang = self.langs[ langName ]
        if (!lang) return error('Lang [%s] not found', langName)
        if ( !is.object(lang) ) return error('Lang [%s] must be an object!', langName)
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
        var type = el.nodeName == 'SELECT' ? 'select' : $el.attr('rasti')
        if (!type) return error('Missing block type, please provide via [rasti] attribute in element:', el)
        
        var block = self.blocks[type]
        if (!block) return error('Undefined block type "%s" in [rasti] attribute of element:', type, el)
        
        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return error('Missing datakey, please provide via [data] attribute in element:', el)

            data = self.data[datakey]
            if (!data) return error('Undefined data source "%s" in [data] attribute of element:', datakey, el)
        }

        var $options, field, alias

        // TODO: this should be in the block, not here
        if (type === 'multi') {
            var field = $el.attr('field')
            if (!field) return error('Missing [field] attribute value in element:', el)
            // check if options div already exists
            $options = $el.closest('[page]').find('[options='+ field +']')
            if (!$options.length) {
                // if not create it and append it to page
                $options = $('<div field rasti='+ type +' options='+ field +'>')
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
            $tabs = $el.children(':not(.page-options)'),
            $labels = $('<div class="tab-labels">'),
            $bar = $('<div class="bar">'),
            $tab, label, position

        $tabs.each(function(i, tab){
            $tab = $(tab)
            $tab.attr('tab', i)
            label = $tab.attr('label') || $tab.attr('header') || $tab.attr('name') || 'TAB ' + (i+1)

            $labels.append($(`<div tab-label=${i} text="${ label }">`))
        })

        $labels.append($bar).appendTo($el)

        $labels.on('click', function(e){
            var $label = $(e.target),
                tabnr = $label.attr('tab-label'),
                $tab = $tabs.filter(`[tab="${ tabnr }"]`)

            $tabs.removeClass('active')
            $tab.addClass('active')[0].scrollIntoView()

            $labels.children().removeClass('active')
            $label.addClass('active')
            
        })

        $el.on('scroll', function(e){
            position = el.scrollLeft / el.scrollWidth
            $bar.css({ left : position * el.offsetWidth })
        })

        $(document).on('rasti-nav', function(e){
            if (!isInActivePage($el)) return
            $bar.css({ width : el.offsetWidth / $tabs.length })
            if (!$labels.children('.active').length) $labels.children().first().click()
        })

        $(window).on('resize', function (e) {
            if (!isInActivePage($el)) return
            $labels.find('.active').click()
            $bar.css({ width : el.offsetWidth / $tabs.length })
        })

        function isInActivePage($el) {
            return self.active.page.find($el).length
                || self.active.page.attr('page') === $el.attr('page')
        }

    }
    

    function initBlock($el) {
        var el = $el[0]
        var type = el.nodeName == 'SELECT' ? 'select' : $el.attr('rasti')
        if (!type) return error('Missing block type, please provide via [rasti] attribute in element:', el)
        
        var block = self.blocks[type]
        if (!block) return error('Undefined block type "%s" in [rasti] attribute of element:', type, el)

        // if applicable, create options from data source
        if ($el.attr('data')) updateBlock($el)

        block.init($el)
    }


    function initPager($el, data) {
        var name = $el.attr('template'),
            template = self.templates[name],
            fx = $el.attr('fx') && self.fx[$el.attr('fx')],
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

        if (pager.total > 1) paging = `<div class="paging ib_">
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

        $results.html(template( pager.next() ))
        $controls.find('.page').html(pager.page + '/' + pager.total)

        function update(data){
            $results.html( template(data) )
            $controls.find('.page').html(pager.page + '/' + pager.total)
            if ( is.function(fx) ) fx($results)
        }
    }

    function getPager(id) {
        let pager = self.pagers.get(id)
        if (!pager) error('No pager for template [%s]', id)
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

        var $form = $('[ajax='+ method +']')
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
        return `
            body {
                font: ${ values.font };
                color: ${ values.text[0] };
            }
            [page]    { background-color: ${ values.page[0] }; }
            [panel]   { background-color: ${ values.panel[0] }; }
            [section] { background-color: ${ values.section[0] }; }

            [page][header]:before    { background-color: ${ values.page[1] }; }
            [panel][header]:before   { background-color: ${ values.panel[1] }; }
            [section][header]:before { background-color: ${ values.section[1] }; }

            [tabs] > .tab-labels        { background-color: ${ values.panel[0] }; }
            [tabs] > .tab-labels > .bar { background-color: ${ values.btn[0] }; }

            [field] {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }

            [btn], .btn, [rasti=buttons] > div {
                background-color: ${ values.btn[0] };
                color: ${ values.btn[1] }; 
            }

            [header]:before { color: ${ values.header[0] }; }
            [label]:not([header]):before  { color: ${ values.label[0] }; }
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


    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }


    function log(...params) {
        if (self.options.log == 'DEBUG') console.log.call(this, ...params)
    }
    function warn(...params) {
        if (self.options.log) console.warn.call(this, ...params)
    }
    function error(...params) {
        console.error.call(this, ...params)
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


    // prototype extensions

    (function(){

        Array.prototype.remove = function(el) {
            var i = this.indexOf(el);
            if (i >= 0) this.splice(i, 1);
        }

        String.prototype.capitalize = function() {
            return this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
        }

    })()


    // static logger methods

    module.exports.log = log
    module.exports.warn = warn
    module.exports.error = error


    // api

    return Object.freeze({

        // objects
        state : this.state,
        pages : this.pages,
        data : this.data,
        ajax : this.ajax,
        utils : this.utils,
        langs : this.langs,
        themes : this.themes,
        themeMaps : this.themeMaps,
        blocks : this.blocks,
        templates : this.templates,
        fx : this.fx,
        options : this.options,

        // methods
        config : config,
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
