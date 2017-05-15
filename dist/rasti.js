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
const utils = require('./utils')
const is = utils.is,
    type = utils.type,
    sameType = utils.sameType


module.exports = function rasti() {

    var self = this

    var invalidData = 0

    // internal properties

    this.activePage = null

    this.activeTheme = ''

    this.activeLang = ''

    this.pagers = new Map()

    // config objects

    this.options = {
        root  : '',
        lang  : '',
        log   : true,
        theme : 'base',
        stats : '%n results in %t seconds',
    }

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
            page    : 'darker lighten',   // bg, header bg
            panel   : 'dark lighten', // bg, header bg
            section : 'mid lighten',   // bg, header bg
            field   : 'light darker',  // bg, text
            btn     : 'detail darker', // bg, text
            header  : 'darker',        // text
            label   : 'darker',        // text
            text    : 'darker',        // text
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

        // cache options (if applicable)
        if (is.object(options)) {
            Object.keys(self.options).forEach(function(name){
                if ( sameType(self.options[name], options[name]) ) self.options[name] = options[name]
            })
        }
        

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
                var $page = self.activePage
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
                    self.activePage = $page
                    page.init()
                }
            }
        }


        // set lang (if applicable and not already set)
        if ( self.options.lang && !self.activeLang ) setLang(self.options.lang)
        // if no lang, generate texts
        if ( !self.options.lang ) {
            $('[text]').each(function(i, el) {
                $(el).text( $(el).attr('text') )
            })
        }


        // fix labels
        'input select textarea'.split(' ').forEach(function(tag){
            $(tag + '[label]').each(function(i, el) {
                fixLabel($(el))
            })
        })


        // set theme (if not already set)
        if ( !self.activeTheme ) setTheme(self.options.theme)


        // bind nav handler to popstate event
        window.onpopstate = function(e) {
            var page = e.state || location.hash.substring(1)
            page
                ? e.state ? navTo(page, null, true) : navTo(page)
                : navTo(self.options.root)
        }


        // nav to page in hash or to root or to first page container
        var page = location.hash.substring(1) || self.options.root
        navTo(page && self.pages[page] ? page : $('[page]').first().attr('page'))


        $(document).trigger('rasti-ready')


    }


    function get(selector) {
        if ( !self.activePage || !self.activePage.length ) return error('Cannot get(%s), active page is not defined', selector)
        var $els = self.activePage.find('['+ selector +']')
        if (!$els.length) error('Cannot get(%s), element not found in page [%s]', selector, self.activePage.attr('page'))
        return $els
    }

    function set(selector, value) {        
        if ( !self.activePage || !self.activePage.length ) return error('Cannot set(%s), active page is not defined', selector)
        var $els = self.activePage.find('['+ selector +']')
        if (!$els.length) error('Cannot set(%s), element not found in page [%s]', selector, self.activePage.attr('page'))
        $els.each(function(i, el){
            el.value = value
            $(el).change()
        })
    }

    function add(selector, ...values) {
        if ( !self.activePage || !self.activePage.length ) return error('Cannot add(%s), active page is not defined', selector)
        var $els = self.activePage.find('['+ selector +']')
        if (!$els.length) error('Cannot add(%s), element not found in page [%s]', selector, self.activePage.attr('page'))
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
        
        self.activePage = $page

        if ( params && !is.object(params) ) error('Page [%s] nav params must be an object!', pagename)
            
        if (page && page.nav) {
            !is.function(page.nav)
                ? error('Page [%s] nav property must be a function!', pagename)
                : page.nav(params)
        }

        $('[page].active').removeClass('active')
        self.activePage.addClass('active')

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

        if (!data.length) return $el.html('<div msg center textc>NO RESULTS</div>')

        var paging = $el.attr('paging')
        paging ? initPager($el, data) : $el.html( template(data) )
        if (el.hasAttribute('stats')) {
            var stats = $('<div section class="stats">')
            stats.html( app.options.stats.replace('%n', data.length).replace('%t', time) )
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
        self.activeTheme = theme
        
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
        self.activeLang = langName

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
            return self.activePage.find($el).length
                || self.activePage.attr('page') === $el.attr('page')
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
        if (self.options.log) console.log.call(this, ...params)
    }
    function warn(...params) {
        if (self.options.log) console.warn.call(this, ...params)
    }
    function error(...params) {
        if (self.options.log) console.error.call(this, ...params)
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


    // api

    return {
        // values
        activePage : function() { return self.activePage },
        activeLang : function() { return self.activeLang },
        activeTheme : function() { return self.activeTheme },
        
        // objects
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
    }

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
}
},{}]},{},[7])(7)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYmxvY2tzL2FsbC5qcyIsInNyYy9ibG9ja3MvYnV0dG9ucy5qcyIsInNyYy9ibG9ja3MvY2hlY2tzLmpzIiwic3JjL2Jsb2Nrcy9tdWx0aS5qcyIsInNyYy9ibG9ja3MvcmFkaW9zLmpzIiwic3JjL2Jsb2Nrcy9zZWxlY3QuanMiLCJzcmMvcmFzdGkuanMiLCJzcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuNkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0YnV0dG9ucyA6IHJlcXVpcmUoJy4vYnV0dG9ucycpLFxuXHRjaGVja3MgIDogcmVxdWlyZSgnLi9jaGVja3MnKSxcblx0cmFkaW9zICA6IHJlcXVpcmUoJy4vcmFkaW9zJyksXG5cdG11bHRpICAgOiByZXF1aXJlKCcuL211bHRpJyksXG5cdHNlbGVjdCAgOiByZXF1aXJlKCcuL3NlbGVjdCcpLFxufSIsImNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxudGVtcGxhdGUgOiBmdW5jdGlvbihkYXRhLCAkZWwpIHtcbiAgICB2YXIgcmV0ID0gJydcbiAgICBmb3IgKHZhciBkIG9mIGRhdGEpIHtcbiAgICAgICAgZCA9IHV0aWxzLmNoZWNrRGF0YShkKVxuICAgICAgICByZXQgKz0gYDxkaXYgdmFsdWU9XCIke2QudmFsdWV9XCI+JHtkLmxhYmVsfTwvZGl2PmBcbiAgICB9XG4gICAgcmV0dXJuIHJldFxufSxcblxuaW5pdCA6IGZ1bmN0aW9uKCRlbCkge1xuICAgICRlbC5maW5kKCdkaXYnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpXG4gICAgICAgICRlbC5wYXJlbnQoKVxuICAgICAgICAgICAgLnZhbCgkZWwuYXR0cigndmFsdWUnKSlcbiAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKVxuICAgIH0pXG4gICAgJGVsLmNoYW5nZShmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpXG4gICAgICAgICRlbC5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAkZWwuZmluZCgnW3ZhbHVlPVwiJysgJGVsLnZhbCgpICsnXCJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfSlcbn0sXG5cbnN0eWxlIDogYFxuICAgIFtyYXN0aT1idXR0b25zXSA+IGRpdiB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgbWFyZ2luOiA1cHggIWltcG9ydGFudDtcbiAgICAgICAgcGFkZGluZzogNXB4IDEwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgICAgYm9yZGVyOiAycHggb3V0c2V0IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcbiAgICAgICAgYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgICBbcmFzdGk9YnV0dG9uc10gPiBkaXYuYWN0aXZlIHtcbiAgICAgICAgZmlsdGVyOiBjb250cmFzdCgxLjUpO1xuICAgICAgICBib3JkZXItc3R5bGU6IGluc2V0O1xuICAgICAgICBwYWRkaW5nOiA0cHggMTFweCA2cHggOXB4O1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFweCk7XG4gICAgfVxuYFxuXG59XG4iLCJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbnRlbXBsYXRlIDogZnVuY3Rpb24oZGF0YSwgJGVsKSB7XG4gICAgdmFyIHVpZCA9IHV0aWxzLnJhbmRvbSgpXG4gICAgdmFyIHJldCA9ICcnXG4gICAgZm9yICh2YXIgZCBvZiBkYXRhKSB7XG4gICAgICAgIGQgPSB1dGlscy5jaGVja0RhdGEoZClcbiAgICAgICAgcmV0ICs9IGA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCIke3VpZH1bXVwiIHZhbHVlPVwiJHtkLnZhbHVlfVwiPlxuICAgICAgICAgICAgPGxhYmVsPiR7ZC5sYWJlbH08L2xhYmVsPlxuICAgICAgICA8L2Rpdj5gXG4gICAgfVxuICAgIHJldHVybiByZXRcbn0sXG5cbmluaXQgOiBmdW5jdGlvbigkZWwpIHtcbiAgICAkZWxbMF0udmFsdWUgPSBbXVxuICAgICRlbC5maW5kKCdpbnB1dCcpLmNoYW5nZShmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpLFxuICAgICAgICAgICAgdmFsID0gJGVsLmF0dHIoJ3ZhbHVlJyksXG4gICAgICAgICAgICB2YWx1ZXMgPSAkZWwuY2xvc2VzdCgnW3Jhc3RpPWNoZWNrc10nKVswXS52YWx1ZVxuICAgICAgICBpZiAoJGVsLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsKVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVzLnJlbW92ZSh2YWwpXG4gICAgICAgIH1cbiAgICB9KVxuICAgICRlbC5maW5kKCdpbnB1dCArbGFiZWwnKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpXG4gICAgICAgICRlbC5wcmV2KCkuY2xpY2soKVxuICAgIH0pXG4gICAgJGVsLmNoYW5nZShmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpLCAkaW5wdXQsIGNoZWNrZWRcbiAgICAgICAgJGVsLmZpbmQoJ2lucHV0JykuZWFjaChmdW5jdGlvbihpLCBpbnB1dCl7XG4gICAgICAgICAgICAkaW5wdXQgPSAkKGlucHV0KVxuICAgICAgICAgICAgY2hlY2tlZCA9ICRlbFswXS52YWx1ZS5pbmNsdWRlcygkaW5wdXQuYXR0cigndmFsdWUnKSlcbiAgICAgICAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJywgY2hlY2tlZClcbiAgICAgICAgfSlcbiAgICB9KVxufSxcblxuc3R5bGUgOiBgXG4gICAgW3Jhc3RpPWNoZWNrc10+ZGl2IHtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICBwYWRkaW5nLXRvcDogNXB4XG4gICAgfVxuYFxuXG59IiwiY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG50ZW1wbGF0ZSA6IGZ1bmN0aW9uKGRhdGEsICRlbCkge1xuICAgIHZhciByZXQgPSAkZWxbMF0uaGFzQXR0cmlidXRlKCdmaWx0ZXInKVxuICAgICAgICA/IGA8aW5wdXQgZmllbGQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIiR7ICRlbC5hdHRyKCdmaWx0ZXInKSB8fCBzZWxmLm9wdGlvbnMubXVsdGlGaWx0ZXJUZXh0IH1cIi8+YFxuICAgICAgICA6ICcnXG4gICAgZm9yICh2YXIgZCBvZiBkYXRhKSB7XG4gICAgICAgIGQgPSB1dGlscy5jaGVja0RhdGEoZClcbiAgICAgICAgcmV0ICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtkLnZhbHVlfVwiIGFsaWFzPVwiJHtkLmFsaWFzfVwiPiR7ZC5sYWJlbH08L29wdGlvbj5gXG4gICAgfVxuICAgIHJldHVybiByZXRcbn0sXG5cbmluaXQgOiBmdW5jdGlvbigkZWwpIHtcbiAgICB2YXIgZWwgPSAkZWxbMF0sXG4gICAgICAgIGZpZWxkID0gJGVsLmF0dHIoJ2ZpZWxkJyksXG4gICAgICAgICRvcHRpb25zID0gJGVsLmNsb3Nlc3QoJ1twYWdlXScpLmZpbmQoJ1tvcHRpb25zPScrIGZpZWxkICsnXScpLFxuICAgICAgICBpbml0aWFsaXplZCA9IHV0aWxzLmlzLm51bWJlcihlbC50b3RhbClcbiAgICBcbiAgICBlbC52YWx1ZSA9IFtdXG4gICAgZWwudG90YWwgPSAkb3B0aW9ucy5jaGlsZHJlbigpLmxlbmd0aFxuICAgIGVsLm1heCA9IHBhcnNlSW50KCRlbC5hdHRyKCdtYXgnKSlcblxuICAgIGlmIChpbml0aWFsaXplZCkge1xuICAgICAgICAvLyBlbXB0eSBzZWxlY3RlZCBvcHRpb25zIChhbmQgcmVtb3ZlIGZ1bGwgY2xhc3MgaW4gY2FzZSBpdCB3YXMgZnVsbClcbiAgICAgICAgJGVsLmZpbmQoJ1tzZWxlY3RlZF0nKS5lbXB0eSgpXG4gICAgICAgICRlbC5yZW1vdmVDbGFzcygnZnVsbCcpXG4gICAgICAgIC8vIHRoZW4gZXhpdCAoc2tpcCBzdHJ1Y3R1cmUgYW5kIGJpbmRpbmdzKVxuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBzdHJ1Y3R1cmVcblxuICAgICRlbC5wcmVwZW5kKCc8ZGl2IGFkZD4nKVxuICAgICRlbC5hcHBlbmQoJzxkaXYgc2VsZWN0ZWQ+JylcbiAgICB2YXIgJHNlbGVjdGVkID0gJGVsLmZpbmQoJ1tzZWxlY3RlZF0nKVxuXG4gICAgLy8gYmluZGluZ3NcblxuICAgICRlbC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICRvcHRpb25zLnNpYmxpbmdzKCdbb3B0aW9uc10nKS5oaWRlKCkgLy8gaGlkZSBvdGhlciBvcHRpb25zXG4gICAgICAgIGlmICggdXRpbHMub25Nb2JpbGUoKSApICRvcHRpb25zLnBhcmVudCgpLmFkZENsYXNzKCdiYWNrZHJvcCcpXG4gICAgICAgICRvcHRpb25zLmNzcygnbGVmdCcsIHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQpLnNob3coKVxuICAgICAgICAkb3B0aW9ucy5maW5kKCdpbnB1dCcpLmZvY3VzKClcbiAgICB9KVxuXG4gICAgJGVsLmNsb3Nlc3QoJ1twYWdlXScpLm9uKCdjbGljaycsICcqOm5vdChvcHRpb24pJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoICQoZS50YXJnZXQpLmF0dHIoJ2ZpZWxkJykgPT09IGZpZWxkXG4gICAgICAgICAgfHwgJChlLnRhcmdldCkucGFyZW50KCkuYXR0cignZmllbGQnKSA9PT0gZmllbGQgKSByZXR1cm5cbiAgICAgICAgaWYgKCB1dGlscy5vbk1vYmlsZSgpICkgJG9wdGlvbnMucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2JhY2tkcm9wJylcbiAgICAgICAgJG9wdGlvbnMuaGlkZSgpXG4gICAgfSlcblxuICAgIHZhciB0b2dnbGVPcHRpb24gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgJG9wdGlvbnMuZmluZCgnaW5wdXQnKS5mb2N1cygpXG4gICAgICAgIHZhciAkb3B0ID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICB2YWwgPSAkb3B0LmF0dHIoJ3ZhbHVlJyksXG4gICAgICAgICAgICB2YWx1ZXMgPSAkZWxbMF0udmFsdWVcblxuICAgICAgICBpZiAoJG9wdC5wYXJlbnQoKS5hdHRyKCdvcHRpb25zJykpIHtcbiAgICAgICAgICAgIC8vIHNlbGVjdCBvcHRpb25cbiAgICAgICAgICAgICRlbC5maW5kKCdbc2VsZWN0ZWRdJykuYXBwZW5kKCRvcHQpXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh2YWwpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyB1bnNlbGVjdCBvcHRpb25cbiAgICAgICAgICAgICRvcHRpb25zLmFwcGVuZCgkb3B0KVxuICAgICAgICAgICAgdmFsdWVzLnJlbW92ZSh2YWwpXG4gICAgICAgIH1cbiAgICAgICAgY2hlY2tGdWxsKClcbiAgICAgICAgJGVsLnRyaWdnZXIoJ2NoYW5nZScsIHt1aTogdHJ1ZX0pIFxuICAgIH1cblxuICAgICRlbC5vbignY2xpY2snLCAnb3B0aW9uJywgdG9nZ2xlT3B0aW9uKVxuXG4gICAgJG9wdGlvbnMub24oJ2NsaWNrJywgJ29wdGlvbicsIHRvZ2dsZU9wdGlvbilcblxuICAgICRvcHRpb25zLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgJG9wdGlvbnMuZmluZCgnaW5wdXQnKS5mb2N1cygpIH0pXG5cbiAgICAkb3B0aW9ucy5vbignaW5wdXQnLCAnaW5wdXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMudmFsdWVcbiAgICAgICAgICAgID8gJG9wdGlvbnMuZmluZCgnb3B0aW9uJykuaGlkZSgpLmZpbHRlcignW2FsaWFzKj0nKyB0aGlzLnZhbHVlICsnXScpLnNob3coKVxuICAgICAgICAgICAgOiAkb3B0aW9ucy5maW5kKCdvcHRpb24nKS5zaG93KClcbiAgICB9KVxuXG4gICAgJGVsLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlLCBwYXJhbXMpe1xuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy51aSkgcmV0dXJuIC8vIHRyaWdnZXJlZCBmcm9tIHVpLCBkbyBub3RoaW5nXG4gICAgICAgICRzZWxlY3RlZC5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgICRvcHRpb25zLmFwcGVuZChlbClcbiAgICAgICAgfSlcbiAgICAgICAgZm9yICh2YXIgdmFsIG9mIGVsLnZhbHVlKSB7XG4gICAgICAgICAgICAkc2VsZWN0ZWQuYXBwZW5kKCRvcHRpb25zLmZpbmQoJ1t2YWx1ZT0nKyB2YWwgKyddJykpXG4gICAgICAgICAgICBpZiAoIGNoZWNrRnVsbCgpICkgYnJlYWtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiBjaGVja0Z1bGwoKSB7XG4gICAgICAgIHZhciBxdHkgPSAkc2VsZWN0ZWQuY2hpbGRyZW4oKS5sZW5ndGgsXG4gICAgICAgICAgICBkaWYgPSBlbC52YWx1ZS5sZW5ndGggLSBxdHksXG4gICAgICAgICAgICBpc0Z1bGwgPSBxdHkgPj0gKGVsLm1heCB8fCBlbC50b3RhbClcblxuICAgICAgICBpZiAoaXNGdWxsKSB7XG4gICAgICAgICAgICBpZiAoZGlmID4gMCkge1xuICAgICAgICAgICAgICAgIGVsLnZhbHVlID0gZWwudmFsdWUuc2xpY2UoMCwgcXR5KVxuICAgICAgICAgICAgICAgIHRocm93IHdhcm4oJ0Ryb3BwZWQgJXMgb3ZlcmZsb3dlZCB2YWx1ZXMgaW4gZWw6JywgZGlmLCBlbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRlbC5hZGRDbGFzcygnZnVsbCcpXG4gICAgICAgICAgICBpZiAoIHV0aWxzLm9uTW9iaWxlKCkgKSAkb3B0aW9ucy5wYXJlbnQoKS5yZW1vdmVDbGFzcygnYmFja2Ryb3AnKVxuICAgICAgICAgICAgJG9wdGlvbnMuaGlkZSgpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoJ2Z1bGwnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzRnVsbFxuICAgIH1cbn0sXG5cbnN0eWxlIDogYFxuICAgIFtyYXN0aT1tdWx0aV0ge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDM1cHg7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gICAgICAgIHRleHQtc2hhZG93OiAwIDAgMCAjMDAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuICAgIFtyYXN0aT1tdWx0aV0gW2FkZF0ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgcmdiYSgwLDAsMCwwLjIpO1xuICAgIH1cbiAgICBbcmFzdGk9bXVsdGldIFthZGRdOmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6ICfijKonO1xuICAgICAgICBwYWRkaW5nLXRvcDogMnB4O1xuICAgICAgICBwYWRkaW5nLWxlZnQ6IDZweDtcbiAgICB9XG4gICAgW3Jhc3RpPW11bHRpXS5vcGVuIFthZGRdIHtcbiAgICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDJweCAjMDAwO1xuICAgIH1cbiAgICBbcmFzdGk9bXVsdGldLmZ1bGwge1xuICAgICAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XG4gICAgfVxuICAgIFtyYXN0aT1tdWx0aV0uZnVsbCBbYWRkXSB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICAgIFtyYXN0aT1tdWx0aV0gb3B0aW9uIHtcbiAgICAgICAgcGFkZGluZzogMnB4IDA7XG4gICAgfVxuICAgIFtyYXN0aT1tdWx0aV0gb3B0aW9uOmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6ICfinJUnO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIG1hcmdpbi1yaWdodDogNXB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICB9XG4gICAgW3Jhc3RpPW11bHRpXSBbc2VsZWN0ZWRdIHtcbiAgICAgICAgbWF4LWhlaWdodDogMTAwcHg7XG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgfVxuICAgIFtyYXN0aT1tdWx0aV0gW3NlbGVjdGVkXT5vcHRpb246aG92ZXI6YmVmb3JlIHtcbiAgICAgICAgY29sb3I6ICNkOTAwMDA7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjUpO1xuICAgIH1cbiAgICBbcmFzdGk9bXVsdGldW29wdGlvbnNdIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIHdpZHRoOiAyNTBweDtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiA1cHggMTBweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQ7XG4gICAgICAgIHotaW5kZXg6IDEwO1xuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIH1cbiAgICBbcmFzdGk9bXVsdGldW29wdGlvbnNdPm9wdGlvbjpiZWZvcmUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XG4gICAgfVxuICAgIFtyYXN0aT1tdWx0aV1bb3B0aW9uc10+b3B0aW9uOmhvdmVyOmJlZm9yZSB7XG4gICAgICAgIGNvbG9yOiAjMDA4MDAwO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDEyOCwgMCwgMC41KTtcbiAgICB9XG4gICAgW3Jhc3RpPW11bHRpXVtvcHRpb25zXSBpbnB1dCB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7XG4gICAgICAgIG1hcmdpbjogMTBweCAwO1xuICAgIH1cblxuYFxuXG59IiwiY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG50ZW1wbGF0ZSA6IGZ1bmN0aW9uKGRhdGEsICRlbCkge1xuICAgIHZhciB1aWQgPSB1dGlscy5yYW5kb20oKVxuICAgIHZhciByZXQgPSAnJ1xuICAgIGZvciAodmFyIGQgb2YgZGF0YSkge1xuICAgICAgICBkID0gdXRpbHMuY2hlY2tEYXRhKGQpXG4gICAgICAgIHJldCArPSBgPGRpdj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiJHt1aWR9W11cIiB2YWx1ZT1cIiR7ZC52YWx1ZX1cIj5cbiAgICAgICAgICAgIDxsYWJlbD4ke2QubGFiZWx9PC9sYWJlbD5cbiAgICAgICAgPC9kaXY+YFxuICAgIH1cbiAgICByZXR1cm4gcmV0XG59LFxuXG5pbml0IDogZnVuY3Rpb24oJGVsKSB7XG4gICAgJGVsLmZpbmQoJ2lucHV0JykuY2hhbmdlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcylcbiAgICAgICAgJGVsLmNsb3Nlc3QoJ1tyYXN0aT1yYWRpb3NdJykudmFsKCRlbC5hdHRyKCd2YWx1ZScpKVxuICAgIH0pXG4gICAgJGVsLmZpbmQoJ2lucHV0ICtsYWJlbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcylcbiAgICAgICAgJGVsLnByZXYoKS5jbGljaygpXG4gICAgfSlcbiAgICAkZWwuY2hhbmdlKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcylcbiAgICAgICAgJGVsLmZpbmQoJ1t2YWx1ZT1cIicrICRlbC52YWwoKSArJ1wiXScpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKVxuICAgIH0pXG59LFxuXG5zdHlsZSA6IGBcbiAgICBbcmFzdGk9cmFkaW9zXT5kaXYge1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHBhZGRpbmctdG9wOiA1cHhcbiAgICB9XG5gXG5cbn0iLCJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbnRlbXBsYXRlIDogZnVuY3Rpb24oZGF0YSwgJGVsKSB7XG4gICAgdmFyIHJldCA9ICcnXG4gICAgZm9yICh2YXIgZCBvZiBkYXRhKSB7XG4gICAgICAgIGQgPSB1dGlscy5jaGVja0RhdGEoZClcbiAgICAgICAgcmV0ICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtkLnZhbHVlfVwiPiR7ZC5sYWJlbH08L29wdGlvbj5gXG4gICAgfVxuICAgIHJldHVybiByZXRcbn0sXG5cbmluaXQgOiBmdW5jdGlvbigkZWwpIHtcbiAgICB2YXIgaW1ncGF0aCA9ICRlbC5hdHRyKCdpbWcnKVxuICAgIGlmICghaW1ncGF0aCkgcmV0dXJuXG5cbiAgICB2YXIgJHNlbGVjdGVkID0gJGVsLmZpbmQoJ1tzZWxlY3RlZF0nKSxcbiAgICAgICAgJHdyYXBwZXIgPSAkKCc8ZGl2IHNlbGVjdD4nKSxcbiAgICAgICAgJG9wdGlvbnMgPSAkKCc8ZGl2IG9wdGlvbnM+JylcblxuICAgIC8vIGNsb25lIG9yaWdpbmFsIHNlbGVjdFxuICAgICQuZWFjaCgkZWxbMF0uYXR0cmlidXRlcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICR3cmFwcGVyLmF0dHIodGhpcy5uYW1lLCB0aGlzLnZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIHdyYXAgd2l0aCBjbG9uZVxuICAgICRlbC53cmFwKCR3cmFwcGVyKVxuICAgIC8vIHJlZ2FpbiB3cmFwcGVyIHJlZiAoaXQgaXMgbG9zdCB3aGVuIHdyYXBwaW5nKVxuICAgICR3cmFwcGVyID0gJGVsLnBhcmVudCgpXG4gICAgLy8gYWRkIGNhcmV0XG4gICAgJHdyYXBwZXIuYXBwZW5kKCc8ZGl2IGNhcmV0PiYjOTY2MDwvZGl2PicpXG5cbiAgICBpZiAoISRlbC5hdHRyKCdkYXRhJykpIHtcbiAgICAgICAgLy8gY2xvbmUgb3JpZ2luYWwgb3B0aW9uc1xuICAgICAgICAkZWwuZmluZCgnb3B0aW9uJykuZWFjaChmdW5jdGlvbihvcHQsIGkpIHtcbiAgICAgICAgICAgICRvcHRpb25zLmFwcGVuZChgPGRpdiB2YWx1ZT1cIiR7b3B0LnZhbHVlfVwiPiR7b3B0LmlubmVySFRNTH08L2Rpdj5gKVxuICAgICAgICB9KVxuICAgIH1cbiAgICAvLyBhZGQgb3B0aW9uc1xuICAgICR3cmFwcGVyLmFwcGVuZCgkb3B0aW9ucylcbiAgICAvLyByZXBsYWNlIHJlZiB3aXRoIGRpdnNcbiAgICAkb3B0aW9ucyA9ICRvcHRpb25zLmNoaWxkcmVuKClcblxuICAgIC8vIHJlY3JlYXRlIHNlbGVjdGVkIG9wdGlvbiwgaWYgbm9uZSBzZWxlY3QgZmlyc3Qgb25lXG4gICAgdmFyIGkgPSAkc2VsZWN0ZWQubGVuZ3RoID8gJHNlbGVjdGVkLmluZGV4KCkgOiAwXG4gICAgJG9wdGlvbnNbaV0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICAgIC8vIHJlY3JlYXRlIHNlbGVjdCB2YWx1ZVxuICAgICR3cmFwcGVyLnZhbCgkZWwudmFsKCkgfHwgJG9wdGlvbnNbaV0uZ2V0QXR0cmlidXRlKCd2YWx1ZScpKVxuXG4gICAgLy8gYWRkIGltYWdlc1xuICAgIHNldEltZygkd3JhcHBlciwgaW1ncGF0aClcbiAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgIHNldEltZygkKGVsKSwgaW1ncGF0aClcbiAgICB9KVxuXG4gICAgLy8gYmluZCBjbGlja3NcbiAgICAkb3B0aW9ucy5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciAkb3B0ID0gJCh0aGlzKVxuICAgICAgICAkb3B0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcbiAgICAgICAgJG9wdC5hZGRDbGFzcygnc2VsZWN0ZWQnKVxuICAgICAgICB2YXIgJHdyYXBwZXIgPSAkb3B0LmNsb3Nlc3QoJ1tzZWxlY3RdJylcbiAgICAgICAgJHdyYXBwZXIudmFsKCRvcHQuYXR0cigndmFsdWUnKSlcbiAgICAgICAgdmFyIGltZ3BhdGggPSAkd3JhcHBlci5hdHRyKCdpbWcnKVxuICAgICAgICBpZiAoaW1ncGF0aCkgc2V0SW1nKCR3cmFwcGVyLCBpbWdwYXRoKVxuICAgIH0pXG5cbiAgICAvLyByZW1vdmUgb3JpZ2luYWwgc2VsZWN0XG4gICAgJGVsLnJlbW92ZSgpXG5cbn0sXG5cbnN0eWxlIDogYFxuICAgIFtzZWxlY3RdIHNlbGVjdCB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICAgIFtzZWxlY3RdIHtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgfVxuICAgIFtzZWxlY3RdOmhvdmVyIFtvcHRpb25zXSB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cbiAgICBbc2VsZWN0XSBbb3B0aW9uc10ge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIG1hcmdpbi10b3A6IDQycHg7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAtNHB4O1xuICAgICAgICBib3JkZXI6IDRweCBzb2xpZCAjYjliOWI5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgfVxuICAgIFtzZWxlY3RdIFtvcHRpb25zXSBkaXY6aG92ZXIge1xuICAgICAgICBib3JkZXI6IDRweCBzb2xpZCAjZmZmO1xuICAgIH1cbiAgICBbc2VsZWN0XSBbb3B0aW9uc10gZGl2LnNlbGVjdGVkIHtcbiAgICAgICAgYm9yZGVyOiAycHggc29saWQgIzBmOTdiZDtcbiAgICB9XG4gICAgW3NlbGVjdF0gW2NhcmV0XSB7XG4gICAgICAgIGZsb2F0OiByaWdodDtcbiAgICAgICAgbWFyZ2luLXRvcDogMTVweDtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gICAgICAgIGZvbnQtc2l6ZTogc21hbGw7XG4gICAgfVxuICAgIFtzZWxlY3RdW2ltZ10ge1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgIH1cbmBcblxufVxuIiwiY29uc3QgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJylcbmNvbnN0IGlzID0gdXRpbHMuaXMsXG4gICAgdHlwZSA9IHV0aWxzLnR5cGUsXG4gICAgc2FtZVR5cGUgPSB1dGlscy5zYW1lVHlwZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmFzdGkoKSB7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcblxuICAgIHZhciBpbnZhbGlkRGF0YSA9IDBcblxuICAgIC8vIGludGVybmFsIHByb3BlcnRpZXNcblxuICAgIHRoaXMuYWN0aXZlUGFnZSA9IG51bGxcblxuICAgIHRoaXMuYWN0aXZlVGhlbWUgPSAnJ1xuXG4gICAgdGhpcy5hY3RpdmVMYW5nID0gJydcblxuICAgIHRoaXMucGFnZXJzID0gbmV3IE1hcCgpXG5cbiAgICAvLyBjb25maWcgb2JqZWN0c1xuXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICByb290ICA6ICcnLFxuICAgICAgICBsYW5nICA6ICcnLFxuICAgICAgICBsb2cgICA6IHRydWUsXG4gICAgICAgIHRoZW1lIDogJ2Jhc2UnLFxuICAgICAgICBzdGF0cyA6ICclbiByZXN1bHRzIGluICV0IHNlY29uZHMnLFxuICAgIH1cblxuICAgIHRoaXMucGFnZXMgPSB7fVxuXG4gICAgdGhpcy5kYXRhID0ge31cblxuICAgIHRoaXMuYWpheCA9IHt9XG5cbiAgICB0aGlzLnV0aWxzID0ge1xuICAgICAgICBpcyA6IGlzLFxuICAgICAgICB0eXBlIDogdHlwZSxcbiAgICAgICAgc2FtZVR5cGUgOiBzYW1lVHlwZSxcbiAgICB9XG5cbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9XG5cbiAgICB0aGlzLmxhbmdzID0ge31cblxuXG4gICAgdGhpcy50aGVtZXMgPSB7XG5cbiAgICAgICAgYmFzZSA6IHtcbiAgICAgICAgICAgIGZvbnQgOiAnbm9ybWFsIDE0cHggc2Fucy1zZXJpZicsXG4gICAgICAgICAgICBwYWxldHRlIDoge1xuICAgICAgICAgICAgICAgIHdoaXRlICAgOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgbGlnaHRlciA6ICcjZGRkJyxcbiAgICAgICAgICAgICAgICBsaWdodCAgIDogJyNiYmInLFxuICAgICAgICAgICAgICAgIG1pZCAgICAgOiAnIzg4OCcsXG4gICAgICAgICAgICAgICAgZGFyayAgICA6ICcjNDQ0JyxcbiAgICAgICAgICAgICAgICBkYXJrZXIgIDogJyMyMjInLFxuICAgICAgICAgICAgICAgIGJsYWNrICAgOiAnIzAwMCcsXG4gICAgICAgICAgICAgICAgZGV0YWlsICA6ICdkYXJrY3lhbicsXG4gICAgICAgICAgICAgICAgbGlnaHRlbiA6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMSknLFxuICAgICAgICAgICAgICAgIGRhcmtlbiAgOiAncmdiYSgwLDAsMCwwLjEpJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICB9XG5cblxuICAgIHRoaXMudGhlbWVNYXBzID0ge1xuXG4gICAgICAgIGRhcmsgOiB7XG4gICAgICAgICAgICBwYWdlICAgIDogJ2RhcmtlciBsaWdodGVuJywgICAvLyBiZywgaGVhZGVyIGJnXG4gICAgICAgICAgICBwYW5lbCAgIDogJ2RhcmsgbGlnaHRlbicsIC8vIGJnLCBoZWFkZXIgYmdcbiAgICAgICAgICAgIHNlY3Rpb24gOiAnbWlkIGxpZ2h0ZW4nLCAgIC8vIGJnLCBoZWFkZXIgYmdcbiAgICAgICAgICAgIGZpZWxkICAgOiAnbGlnaHQgZGFya2VyJywgIC8vIGJnLCB0ZXh0XG4gICAgICAgICAgICBidG4gICAgIDogJ2RldGFpbCBkYXJrZXInLCAvLyBiZywgdGV4dFxuICAgICAgICAgICAgaGVhZGVyICA6ICdkYXJrZXInLCAgICAgICAgLy8gdGV4dFxuICAgICAgICAgICAgbGFiZWwgICA6ICdkYXJrZXInLCAgICAgICAgLy8gdGV4dFxuICAgICAgICAgICAgdGV4dCAgICA6ICdkYXJrZXInLCAgICAgICAgLy8gdGV4dFxuICAgICAgICB9LFxuXG4gICAgICAgIGxpZ2h0IDoge1xuICAgICAgICAgICAgcGFnZSAgICA6ICdsaWdodGVyIGRhcmtlbicsXG4gICAgICAgICAgICBwYW5lbCAgIDogJ21pZCBsaWdodGVuJyxcbiAgICAgICAgICAgIHNlY3Rpb24gOiAnbGlnaHQgZGFya2VuJyxcbiAgICAgICAgICAgIGZpZWxkICAgOiAnbGlnaHRlciBkYXJrJyxcbiAgICAgICAgICAgIGJ0biAgICAgOiAnZGV0YWlsIGxpZ2h0JyxcbiAgICAgICAgICAgIGhlYWRlciAgOiAnZGFyaycsXG4gICAgICAgICAgICBsYWJlbCAgIDogJ21pZCcsXG4gICAgICAgICAgICB0ZXh0ICAgIDogJ2RhcmsnLFxuICAgICAgICB9LFxuICAgICAgICBcbiAgICB9XG5cblxuICAgIHRoaXMuZnggPSB7XG5cbiAgICAgICAgc3RhY2sgOiBmdW5jdGlvbigkZWwpIHtcbiAgICAgICAgICAgICRlbC5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDFcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUubWFyZ2luVG9wID0gJzE1cHgnXG4gICAgICAgICAgICAgICAgfSwgaSAqIDUwKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG5cbiAgICB9XG5cblxuICAgIHRoaXMuYmxvY2tzID0gcmVxdWlyZSgnLi9ibG9ja3MvYWxsJylcblxuXG4gICAgLy8gbWV0aG9kc1xuXG4gICAgZnVuY3Rpb24gY29uZmlnKGNvbmZpZykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2VsZikge1xuICAgICAgICAgICAgaWYgKCQudHlwZShzZWxmW2tleV0pID09PSAnb2JqZWN0JyAmJiAkLnR5cGUoY29uZmlnW2tleV0pID09PSAnb2JqZWN0JylcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHNlbGZba2V5XSwgY29uZmlnW2tleV0pXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGluaXQob3B0aW9ucykge1xuXG4gICAgICAgIC8vIGNhY2hlIG9wdGlvbnMgKGlmIGFwcGxpY2FibGUpXG4gICAgICAgIGlmIChpcy5vYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHNlbGYub3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcbiAgICAgICAgICAgICAgICBpZiAoIHNhbWVUeXBlKHNlbGYub3B0aW9uc1tuYW1lXSwgb3B0aW9uc1tuYW1lXSkgKSBzZWxmLm9wdGlvbnNbbmFtZV0gPSBvcHRpb25zW25hbWVdXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIC8vIGRlZmluZSBsYW5nIChpZiBub3QgYWxyZWFkeSBkZWZpbmVkKVxuICAgICAgICBpZiAoIXNlbGYub3B0aW9ucy5sYW5nKSB7XG4gICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXMoc2VsZi5sYW5ncylcbiAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCkgc2VsZi5vcHRpb25zLmxhbmcgPSBrZXlzWzBdXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIGFwcGVuZCBibG9ja3Mgc3R5bGVzXG4gICAgICAgIHZhciBzdHlsZXMgPSAnPHN0eWxlIGJsb2Nrcz4nXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzZWxmLmJsb2Nrcykge1xuICAgICAgICAgICAgc3R5bGVzICs9IHNlbGYuYmxvY2tzW2tleV0uc3R5bGVcbiAgICAgICAgfVxuICAgICAgICBzdHlsZXMgKz0gJzwvc3R5bGU+J1xuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHN0eWxlcylcblxuXG4gICAgICAgIC8vIGFwcGVuZCB0aGVtZSBzdHlsZSBjb250YWluZXJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZCgnPHN0eWxlIHRoZW1lPicpXG5cblxuICAgICAgICAvLyBhcHBlbmQgcGFnZS1vcHRpb25zIGNvbnRhaW5lcnNcbiAgICAgICAgJCgnW3BhZ2VdJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgJChlbCkuYXBwZW5kKCc8ZGl2IGNsYXNzPVwicGFnZS1vcHRpb25zXCI+JylcbiAgICAgICAgfSlcblxuXG4gICAgICAgIC8vIGluaXQgcmFzdGkgYmxvY2tzXG4gICAgICAgICQoJ1tyYXN0aV0nKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICBpbml0QmxvY2soJChlbCkpXG4gICAgICAgIH0pXG5cblxuICAgICAgICAvLyBjcmVhdGUgb3B0aW9ucyBmb3Igc2VsZWN0cyB3aXRoIGRhdGEgc291cmNlXG4gICAgICAgICQoJ3NlbGVjdFtkYXRhXScpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgIHVwZGF0ZUJsb2NrKCQoZWwpKVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgLy8gY3JlYXRlIHRhYnNcbiAgICAgICAgJCgnW3RhYnNdJykuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAgICAgY3JlYXRlVGFicygkKGVsKSlcbiAgICAgICAgfSlcblxuXG4gICAgICAgIC8vIGluaXQgbmF2XG4gICAgICAgICQoJ1tuYXZdJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyICRlbCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgcGFnZSA9ICRlbC5hdHRyKCduYXYnKSxcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fVxuXG4gICAgICAgICAgICBpZiAoIXBhZ2UpIHJldHVybiBlcnJvcignUGxlYXNlIHByb3ZpZGUgYSBwYWdlIG5hbWUgaW4gW25hdl0gYXR0cmlidXRlIG9mIGVsZW1lbnQ6JywgZWwpXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0F0dHJpYnV0ZSgncGFyYW1zJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHBhZ2UgPSBzZWxmLmFjdGl2ZVBhZ2VcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1rZXlzID0gJGVsLmF0dHIoJ3BhcmFtcycpXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFta2V5cykge1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgc3BlY2lmaWVkIHBhcmFtc1xuICAgICAgICAgICAgICAgICAgICBwYXJhbWtleXMgPSBwYXJhbWtleXMuc3BsaXQoJyAnKVxuICAgICAgICAgICAgICAgICAgICBwYXJhbWtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1trZXldID0gJHBhZ2UuZmluZCgnW25hdnBhcmFtPScrIGtleSArJ10nKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IGFsbCBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2UuZmluZCgnW25hdnBhcmFtXScpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJGVsID0gJChlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9ICRlbC5hdHRyKCduYXZwYXJhbScpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWtleSkgcmV0dXJuIGVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIHBhcmFtIG5hbWUgaW4gW25hdnBhcmFtXSBhdHRyaWJ1dGUgb2YgZWxlbWVudDonLCBlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1trZXldID0gJGVsLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2VG8ocGFnZSwgcGFyYW1zKVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgLy8gaW5pdCBzdWJtaXRcbiAgICAgICAgJCgnW3N1Ym1pdF0nKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBtZXRob2QgPSAkZWwuYXR0cignc3VibWl0JyksXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSAkZWwuYXR0cigndGhlbicpLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gJGVsLmF0dHIoJ3JlbmRlcicpLFxuICAgICAgICAgICAgICAgIGlzVmFsaWRDQiA9IGNhbGxiYWNrICYmIGlzLmZ1bmN0aW9uKHNlbGYudXRpbHNbY2FsbGJhY2tdKSxcbiAgICAgICAgICAgICAgICBzdGFydCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSwgZW5kXG5cbiAgICAgICAgICAgIGlmICghbWV0aG9kKSByZXR1cm4gZXJyb3IoJ1BsYXNlIHByb3ZpZGUgYW4gYWpheCBtZXRob2QgaW4gW3N1Ym1pdF0gYXR0cmlidXRlJylcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICYmICFpc1ZhbGlkQ0IpIGVycm9yKCdVdGlsaXR5IG1ldGhvZCBbJXNdIHByb3ZpZGVkIGluIFt0aGVuXSBhdHRyaWJ1dGUgaXMgbm90IGRlZmluZWQnLCBjYWxsYmFjaylcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGVsLmFkZENsYXNzKCdsb2FkaW5nJykuYXR0cignZGlzYWJsZWQnLCB0cnVlKVxuXG4gICAgICAgICAgICBzdWJtaXRBamF4KG1ldGhvZCwgZnVuY3Rpb24ocmVzZGF0YSl7XG4gICAgICAgICAgICAgICAgZW5kID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBNYXRoLmZsb29yKGVuZCAtIHN0YXJ0KSAvIDEwMDBcbiAgICAgICAgICAgICAgICBsb2coJ0FqYXggbWV0aG9kIFslc10gdG9vayAlcyBzZWNvbmRzJywgbWV0aG9kLCB0aW1lKVxuXG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsaWRDQikgc2VsZi51dGlsc1tjYWxsYmFja10ocmVzZGF0YSlcbiAgICAgICAgICAgICAgICBpZiAodGVtcGxhdGUpIHJlbmRlcih0ZW1wbGF0ZSwgcmVzZGF0YSwgdGltZSlcblxuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcygnbG9hZGluZycpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cblxuICAgICAgICAvLyBpbml0IHJlbmRlclxuICAgICAgICAkKCdbcmVuZGVyXScpLm5vdCgnW3N1Ym1pdF0nKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9ICRlbC5hdHRyKCdyZW5kZXInKVxuICAgICAgICAgICAgaWYgKCF0ZW1wbGF0ZSkgcmV0dXJuIGVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIHRlbXBsYXRlIG5hbWUgaW4gW3JlbmRlcl0gYXR0cmlidXRlIG9mIGVsZW1lbnQ6JywgZWwpXG4gICAgICAgICAgICByZW5kZXIodGVtcGxhdGUpXG4gICAgICAgIH0pXG5cblxuICAgICAgICAvLyBpbml0IGFjdGlvbnNcbiAgICAgICAgZm9yICh2YXIgYWN0aW9uIG9mICdjbGljayBjaGFuZ2UnLnNwbGl0KCcgJykpIHtcbiAgICAgICAgICAgICQoJ1snKyBhY3Rpb24gKyddJykuZWFjaChmdW5jdGlvbihpLCBlbCl7XG4gICAgICAgICAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2QgPSAkZWwuYXR0ciggYWN0aW9uIClcbiAgICAgICAgICAgICAgICBpZiAoICFhcHAudXRpbHNbIG1ldGhvZCBdICkgcmV0dXJuIGVycm9yKCdVbmRlZmluZWQgdXRpbGl0eSBtZXRob2QgXCIlc1wiIGRlY2xhcmVkIGluIFslc10gYXR0cmlidXRlIG9mIGVsZW1lbnQ6JywgbWV0aG9kLCBhY3Rpb24sIGVsKVxuICAgICAgICAgICAgICAgICQodGhpcykub24oIGFjdGlvbiAsIGFwcC51dGlsc1sgbWV0aG9kIF0gKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gaW5pdCBwYWdlc1xuICAgICAgICB2YXIgcGFnZSwgJHBhZ2VcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBzZWxmLnBhZ2VzKSB7XG4gICAgICAgICAgICBwYWdlID0gc2VsZi5wYWdlc1tuYW1lXVxuICAgICAgICAgICAgaWYgKCAhaXMub2JqZWN0KHBhZ2UpICkgcmV0dXJuIGVycm9yKCdQYWdlIFslc10gbXVzdCBiZSBhbiBvYmplY3QhJywgbmFtZSlcbiAgICAgICAgICAgICRwYWdlID0gJCgnW3BhZ2U9JysgbmFtZSArJ10nKVxuICAgICAgICAgICAgaWYgKCAhJHBhZ2UubGVuZ3RoICkgcmV0dXJuIGVycm9yKCdObyBjb250YWluZXIgZWxlbWVudCBib3VuZCB0byBwYWdlIFslc10uIFBsZWFzZSBiaW5kIG9uZSB2aWEgW3BhZ2VdIGF0dHJpYnV0ZScsIG5hbWUpXG4gICAgICAgICAgICBpZiAocGFnZS5pbml0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhaXMuZnVuY3Rpb24ocGFnZS5pbml0KSApIHJldHVybiBlcnJvcignUGFnZSBbJXNdIGluaXQgcHJvcGVydHkgbXVzdCBiZSBhIGZ1bmN0aW9uIScsIG5hbWUpXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZygnSW5pdGlhbGl6aW5nIHBhZ2UgWyVzXScsIG5hbWUpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWN0aXZlUGFnZSA9ICRwYWdlXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UuaW5pdCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBzZXQgbGFuZyAoaWYgYXBwbGljYWJsZSBhbmQgbm90IGFscmVhZHkgc2V0KVxuICAgICAgICBpZiAoIHNlbGYub3B0aW9ucy5sYW5nICYmICFzZWxmLmFjdGl2ZUxhbmcgKSBzZXRMYW5nKHNlbGYub3B0aW9ucy5sYW5nKVxuICAgICAgICAvLyBpZiBubyBsYW5nLCBnZW5lcmF0ZSB0ZXh0c1xuICAgICAgICBpZiAoICFzZWxmLm9wdGlvbnMubGFuZyApIHtcbiAgICAgICAgICAgICQoJ1t0ZXh0XScpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgICAgICAkKGVsKS50ZXh0KCAkKGVsKS5hdHRyKCd0ZXh0JykgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gZml4IGxhYmVsc1xuICAgICAgICAnaW5wdXQgc2VsZWN0IHRleHRhcmVhJy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24odGFnKXtcbiAgICAgICAgICAgICQodGFnICsgJ1tsYWJlbF0nKS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgZml4TGFiZWwoJChlbCkpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgLy8gc2V0IHRoZW1lIChpZiBub3QgYWxyZWFkeSBzZXQpXG4gICAgICAgIGlmICggIXNlbGYuYWN0aXZlVGhlbWUgKSBzZXRUaGVtZShzZWxmLm9wdGlvbnMudGhlbWUpXG5cblxuICAgICAgICAvLyBiaW5kIG5hdiBoYW5kbGVyIHRvIHBvcHN0YXRlIGV2ZW50XG4gICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSBlLnN0YXRlIHx8IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpXG4gICAgICAgICAgICBwYWdlXG4gICAgICAgICAgICAgICAgPyBlLnN0YXRlID8gbmF2VG8ocGFnZSwgbnVsbCwgdHJ1ZSkgOiBuYXZUbyhwYWdlKVxuICAgICAgICAgICAgICAgIDogbmF2VG8oc2VsZi5vcHRpb25zLnJvb3QpXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIG5hdiB0byBwYWdlIGluIGhhc2ggb3IgdG8gcm9vdCBvciB0byBmaXJzdCBwYWdlIGNvbnRhaW5lclxuICAgICAgICB2YXIgcGFnZSA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpIHx8IHNlbGYub3B0aW9ucy5yb290XG4gICAgICAgIG5hdlRvKHBhZ2UgJiYgc2VsZi5wYWdlc1twYWdlXSA/IHBhZ2UgOiAkKCdbcGFnZV0nKS5maXJzdCgpLmF0dHIoJ3BhZ2UnKSlcblxuXG4gICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoJ3Jhc3RpLXJlYWR5JylcblxuXG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBnZXQoc2VsZWN0b3IpIHtcbiAgICAgICAgaWYgKCAhc2VsZi5hY3RpdmVQYWdlIHx8ICFzZWxmLmFjdGl2ZVBhZ2UubGVuZ3RoICkgcmV0dXJuIGVycm9yKCdDYW5ub3QgZ2V0KCVzKSwgYWN0aXZlIHBhZ2UgaXMgbm90IGRlZmluZWQnLCBzZWxlY3RvcilcbiAgICAgICAgdmFyICRlbHMgPSBzZWxmLmFjdGl2ZVBhZ2UuZmluZCgnWycrIHNlbGVjdG9yICsnXScpXG4gICAgICAgIGlmICghJGVscy5sZW5ndGgpIGVycm9yKCdDYW5ub3QgZ2V0KCVzKSwgZWxlbWVudCBub3QgZm91bmQgaW4gcGFnZSBbJXNdJywgc2VsZWN0b3IsIHNlbGYuYWN0aXZlUGFnZS5hdHRyKCdwYWdlJykpXG4gICAgICAgIHJldHVybiAkZWxzXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0KHNlbGVjdG9yLCB2YWx1ZSkgeyAgICAgICAgXG4gICAgICAgIGlmICggIXNlbGYuYWN0aXZlUGFnZSB8fCAhc2VsZi5hY3RpdmVQYWdlLmxlbmd0aCApIHJldHVybiBlcnJvcignQ2Fubm90IHNldCglcyksIGFjdGl2ZSBwYWdlIGlzIG5vdCBkZWZpbmVkJywgc2VsZWN0b3IpXG4gICAgICAgIHZhciAkZWxzID0gc2VsZi5hY3RpdmVQYWdlLmZpbmQoJ1snKyBzZWxlY3RvciArJ10nKVxuICAgICAgICBpZiAoISRlbHMubGVuZ3RoKSBlcnJvcignQ2Fubm90IHNldCglcyksIGVsZW1lbnQgbm90IGZvdW5kIGluIHBhZ2UgWyVzXScsIHNlbGVjdG9yLCBzZWxmLmFjdGl2ZVBhZ2UuYXR0cigncGFnZScpKVxuICAgICAgICAkZWxzLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuICAgICAgICAgICAgZWwudmFsdWUgPSB2YWx1ZVxuICAgICAgICAgICAgJChlbCkuY2hhbmdlKClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGQoc2VsZWN0b3IsIC4uLnZhbHVlcykge1xuICAgICAgICBpZiAoICFzZWxmLmFjdGl2ZVBhZ2UgfHwgIXNlbGYuYWN0aXZlUGFnZS5sZW5ndGggKSByZXR1cm4gZXJyb3IoJ0Nhbm5vdCBhZGQoJXMpLCBhY3RpdmUgcGFnZSBpcyBub3QgZGVmaW5lZCcsIHNlbGVjdG9yKVxuICAgICAgICB2YXIgJGVscyA9IHNlbGYuYWN0aXZlUGFnZS5maW5kKCdbJysgc2VsZWN0b3IgKyddJylcbiAgICAgICAgaWYgKCEkZWxzLmxlbmd0aCkgZXJyb3IoJ0Nhbm5vdCBhZGQoJXMpLCBlbGVtZW50IG5vdCBmb3VuZCBpbiBwYWdlIFslc10nLCBzZWxlY3Rvciwgc2VsZi5hY3RpdmVQYWdlLmF0dHIoJ3BhZ2UnKSlcbiAgICAgICAgJGVscy5lYWNoKGZ1bmN0aW9uKGksIGVsKXtcbiAgICAgICAgICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCl7XG4gICAgICAgICAgICAgICAgaWYgKGlzLmFycmF5KHZhbCkpIGVsLnZhbHVlID0gZWwudmFsdWUuY29uY2F0KHZhbClcbiAgICAgICAgICAgICAgICBlbHNlIGVsLnZhbHVlLnB1c2godmFsKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICQoZWwpLmNoYW5nZSgpXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBuYXZUbyhwYWdlbmFtZSwgcGFyYW1zLCBza2lwUHVzaFN0YXRlKSB7XG5cbiAgICAgICAgdmFyIHBhZ2UgPSBzZWxmLnBhZ2VzW3BhZ2VuYW1lXSxcbiAgICAgICAgICAgICRwYWdlID0gJCgnW3BhZ2U9JysgcGFnZW5hbWUgKyddJylcblxuICAgICAgICBpZiAoISRwYWdlKSByZXR1cm4gZXJyb3IoJ1BhZ2UgWyVzXSBjb250YWluZXIgbm90IGZvdW5kJywgcGFnZW5hbWUpXG4gICAgICAgIFxuICAgICAgICBzZWxmLmFjdGl2ZVBhZ2UgPSAkcGFnZVxuXG4gICAgICAgIGlmICggcGFyYW1zICYmICFpcy5vYmplY3QocGFyYW1zKSApIGVycm9yKCdQYWdlIFslc10gbmF2IHBhcmFtcyBtdXN0IGJlIGFuIG9iamVjdCEnLCBwYWdlbmFtZSlcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAocGFnZSAmJiBwYWdlLm5hdikge1xuICAgICAgICAgICAgIWlzLmZ1bmN0aW9uKHBhZ2UubmF2KVxuICAgICAgICAgICAgICAgID8gZXJyb3IoJ1BhZ2UgWyVzXSBuYXYgcHJvcGVydHkgbXVzdCBiZSBhIGZ1bmN0aW9uIScsIHBhZ2VuYW1lKVxuICAgICAgICAgICAgICAgIDogcGFnZS5uYXYocGFyYW1zKVxuICAgICAgICB9XG5cbiAgICAgICAgJCgnW3BhZ2VdLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICBzZWxmLmFjdGl2ZVBhZ2UuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcigncmFzdGktbmF2JylcblxuICAgICAgICBpZiAoc2tpcFB1c2hTdGF0ZSkgcmV0dXJuXG4gICAgICAgIGlmIChwYWdlICYmIHBhZ2UudXJsKSB7XG4gICAgICAgICAgICAhaXMuc3RyaW5nKHBhZ2UudXJsKVxuICAgICAgICAgICAgICAgID8gbG9nKCdQYWdlIFslc10gdXJsIHByb3BlcnR5IG11c3QgYmUgYSBzdHJpbmchJywgcGFnZW5hbWUpXG4gICAgICAgICAgICAgICAgOiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUocGFnZW5hbWUsIG51bGwsICcjJytwYWdlLnVybClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShwYWdlbmFtZSwgbnVsbClcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcmVuZGVyKG5hbWUsIGRhdGEsIHRpbWUpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gc2VsZi50ZW1wbGF0ZXNbbmFtZV1cbiAgICAgICAgaWYgKCF0ZW1wbGF0ZSkgcmV0dXJuIGVycm9yKCdUZW1wbGF0ZSBbJXNdIGlzIG5vdCBkZWZpbmVkJywgbmFtZSlcblxuICAgICAgICB2YXIgJGVsID0gJCgnW3RlbXBsYXRlPScrIG5hbWUgKyddJylcbiAgICAgICAgaWYgKCEkZWwubGVuZ3RoKSByZXR1cm4gZXJyb3IoJ05vIGVsZW1lbnQgYm91bmQgdG8gdGVtcGxhdGUgWyVzXS4gUGxlYXNlIGJpbmQgb25lIHZpYSBbdGVtcGxhdGVdIGF0dHJpYnV0ZS4nLCBuYW1lKVxuICAgICAgICB2YXIgZWwgPSAkZWxbMF1cblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRha2V5ID0gJGVsLmF0dHIoJ2RhdGEnKVxuICAgICAgICAgICAgaWYgKCFkYXRha2V5KSByZXR1cm4gZXJyb3IoJ05vIGRhdGEgZm91bmQgZm9yIHRlbXBsYXRlIFslc10uIFBsZWFzZSBwcm92aWRlIGluIGFqYXggcmVzcG9uc2Ugb3IgdmlhIFtkYXRhXSBhdHRyaWJ1dGUgaW4gZWxlbWVudDonLCBuYW1lLCBlbClcbiAgICAgICAgICAgIGRhdGEgPSBzZWxmLmRhdGFbZGF0YWtleV1cbiAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuIGVycm9yKCdVbmRlZmluZWQgZGF0YSBzb3VyY2UgXCIlc1wiIGluIFtkYXRhXSBhdHRyaWJ1dGUgb2YgZWxlbWVudDonLCBkYXRha2V5LCBlbClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZGF0YS5sZW5ndGgpIHJldHVybiAkZWwuaHRtbCgnPGRpdiBtc2cgY2VudGVyIHRleHRjPk5PIFJFU1VMVFM8L2Rpdj4nKVxuXG4gICAgICAgIHZhciBwYWdpbmcgPSAkZWwuYXR0cigncGFnaW5nJylcbiAgICAgICAgcGFnaW5nID8gaW5pdFBhZ2VyKCRlbCwgZGF0YSkgOiAkZWwuaHRtbCggdGVtcGxhdGUoZGF0YSkgKVxuICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdzdGF0cycpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdHMgPSAkKCc8ZGl2IHNlY3Rpb24gY2xhc3M9XCJzdGF0c1wiPicpXG4gICAgICAgICAgICBzdGF0cy5odG1sKCBhcHAub3B0aW9ucy5zdGF0cy5yZXBsYWNlKCclbicsIGRhdGEubGVuZ3RoKS5yZXBsYWNlKCcldCcsIHRpbWUpIClcbiAgICAgICAgICAgICRlbC5wcmVwZW5kKHN0YXRzKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZ4a2V5ID0gJGVsLmF0dHIoJ2Z4JylcbiAgICAgICAgaWYgKGZ4a2V5KSB7XG4gICAgICAgICAgICB2YXIgZnggPSBzZWxmLmZ4W2Z4a2V5XVxuICAgICAgICAgICAgaWYgKCFmeCkgcmV0dXJuIGVycm9yKCdVbmRlZmluZWQgZnggXCIlc1wiIGluIFtmeF0gYXR0cmlidXRlIG9mIGVsZW1lbnQnLCBmeGtleSwgZWwpXG4gICAgICAgICAgICBwYWdpbmcgPyBmeCgkZWwuZmluZCgnLnJlc3VsdHMnKSkgOiBmeCgkZWwpXG4gICAgICAgIH1cblxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc2V0VGhlbWUodGhlbWVTdHJpbmcpIHtcbiAgICAgICAgdmFyIHRoZW1lTmFtZSA9IHRoZW1lU3RyaW5nLnNwbGl0KCcgJylbMF0sXG4gICAgICAgICAgICB0aGVtZSA9IHNlbGYudGhlbWVzW3RoZW1lTmFtZV1cblxuICAgICAgICBpZiAoIXRoZW1lKSByZXR1cm4gZXJyb3IoJ1RoZW1lIFslc10gbm90IGZvdW5kJywgdGhlbWVOYW1lKVxuXG4gICAgICAgIHZhciBtYXBOYW1lID0gdGhlbWVTdHJpbmcuc3BsaXQoJyAnKVsxXSB8fCAoIGlzLm9iamVjdCh0aGVtZS5tYXBzKSAmJiBPYmplY3Qua2V5cyh0aGVtZS5tYXBzKVswXSApIHx8ICdkYXJrJyxcbiAgICAgICAgICAgIHRoZW1lTWFwID0gKCBpcy5vYmplY3QodGhlbWUubWFwcykgJiYgdGhlbWUubWFwc1ttYXBOYW1lXSApIHx8IHNlbGYudGhlbWVNYXBzW21hcE5hbWVdXG5cbiAgICAgICAgaWYgKCF0aGVtZU1hcCkgcmV0dXJuIGVycm9yKCdUaGVtZSBtYXAgWyVzXSBub3QgZm91bmQnLCBtYXBOYW1lKVxuXG4gICAgICAgIGxvZygnU2V0dGluZyB0aGVtZSBbJXM6JXNdJywgdGhlbWVOYW1lLCBtYXBOYW1lKVxuICAgICAgICBzZWxmLmFjdGl2ZVRoZW1lID0gdGhlbWVcbiAgICAgICAgXG4gICAgICAgIHZhciB2YWx1ZXMgPSB7XG4gICAgICAgICAgICBmb250IDogdGhlbWUuZm9udCB8fCBzZWxmLnRoZW1lcy5iYXNlLmZvbnQsXG4gICAgICAgIH0sIGNvbG9yTmFtZXMsIGNvbG9ycywgYzEsIGMyLCBkZWZhdWx0Q29sb3JOYW1lXG5cbiAgICAgICAgLy8gbWFwIHBhbGV0dGUgY29sb3JzIHRvIGF0dHJpYnV0ZXNcbiAgICAgICAgZm9yICh2YXIgYXR0ciBvZiBPYmplY3Qua2V5cyh0aGVtZU1hcCkpIHtcbiAgICAgICAgICAgIGlmICghc2VsZi50aGVtZU1hcHMuZGFya1thdHRyXSkgcmV0dXJuIGVycm9yKCdNYXBwaW5nIGVycm9yIGluIHRoZW1lIFslc10uIEluY29ycmVjdCB0aGVtZSBtYXAgcHJvcGVydHkgWyVzXScsIHRoZW1lTmFtZSwgYXR0cilcblxuICAgICAgICAgICAgY29sb3JOYW1lcyA9IFtjMSwgYzJdID0gdGhlbWVNYXBbYXR0cl0uc3BsaXQoJyAnKVxuICAgICAgICAgICAgY29sb3JzID0gW3RoZW1lLnBhbGV0dGVbIGMxIF0sIHRoZW1lLnBhbGV0dGVbIGMyIF1dXG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgaW4gY29sb3JzKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdENvbG9yTmFtZSA9IHNlbGYudGhlbWVNYXBzLmRhcmtbYXR0cl0uc3BsaXQoJyAnKVtpXVxuICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0Q29sb3JOYW1lICYmICFjb2xvcnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzW2ldID0gc2VsZi50aGVtZXMuYmFzZS5wYWxldHRlWyBjb2xvck5hbWVzW2ldIF1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb2xvcnNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm4oJ01hcHBpbmcgZXJyb3IgaW4gdGhlbWUgWyVzXSBmb3IgYXR0cmlidXRlIFslc10uIENvbG9yIFslc10gbm90IGZvdW5kLiBGYWxsaW5nIGJhY2sgdG8gZGVmYXVsdCBjb2xvciBbJXNdLicsIHRoZW1lTmFtZSwgYXR0ciwgY29sb3JOYW1lc1tpXSwgZGVmYXVsdENvbG9yTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yc1tpXSA9IHNlbGYudGhlbWVzLmJhc2UucGFsZXR0ZVsgZGVmYXVsdENvbG9yTmFtZSBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXNbYXR0cl0gPSBjb2xvcnNcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdlbmVyYXRlIHRoZW1lIHN0eWxlIGFuZCBhcHBseSBpdFxuICAgICAgICAkKCdzdHlsZVt0aGVtZV0nKS5odG1sKCBnZXRUaGVtZVN0eWxlKHZhbHVlcykgKVxuXG4gICAgICAgIC8vIGFwcGx5IGFueSBzdHlsZXMgZGVmaW5lZCBieSBjbGFzc1xuICAgICAgICBmb3IgKHZhciBrZXkgb2YgT2JqZWN0LmtleXModGhlbWUucGFsZXR0ZSkpIHtcbiAgICAgICAgICAgIHZhciBjb2xvciA9IHRoZW1lLnBhbGV0dGVba2V5XVxuICAgICAgICAgICAgJCgnLicgKyBrZXkpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIGNvbG9yKVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzZXRMYW5nKGxhbmdOYW1lKSB7XG4gICAgICAgIHZhciBsYW5nID0gc2VsZi5sYW5nc1sgbGFuZ05hbWUgXVxuICAgICAgICBpZiAoIWxhbmcpIHJldHVybiBlcnJvcignTGFuZyBbJXNdIG5vdCBmb3VuZCcsIGxhbmdOYW1lKVxuICAgICAgICBpZiAoICFpcy5vYmplY3QobGFuZykgKSByZXR1cm4gZXJyb3IoJ0xhbmcgWyVzXSBtdXN0IGJlIGFuIG9iamVjdCEnLCBsYW5nTmFtZSlcbiAgICAgICAgbG9nKCdTZXR0aW5nIGxhbmcgWyVzXScsIGxhbmdOYW1lKVxuICAgICAgICBzZWxmLmFjdGl2ZUxhbmcgPSBsYW5nTmFtZVxuXG4gICAgICAgIHZhciAkZWxlbXMgPSAkKCksICRlbCwga2V5cywgc3RyaW5nXG4gICAgICAgIHZhciBhdHRyaWJ1dGVzID0gJ2xhYmVsIGhlYWRlciB0ZXh0IHBsYWNlaG9sZGVyJy5zcGxpdCgnICcpXG5cbiAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uKGF0dHIpe1xuICAgICAgICAgICAgJGVsZW1zID0gJGVsZW1zLmFkZCgnWycrYXR0cisnXScpXG4gICAgICAgIH0pXG5cbiAgICAgICAgJGVsZW1zLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2ZpeGVkJykpIGVsID0gZWwuY2hpbGRyZW5bMF1cbiAgICAgICAgICAgICRlbCA9ICQoZWwpICAgXG4gICAgICAgICAgICBrZXlzID0gZWwubGFuZ2tleXNcblxuICAgICAgICAgICAgaWYgKCFrZXlzKSB7XG4gICAgICAgICAgICAgICAga2V5cyA9IHt9XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uKGF0dHIpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsLmF0dHIoYXR0cikpIGtleXNbYXR0cl0gPSAkZWwuYXR0cihhdHRyKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgZWwubGFuZ2tleXMgPSBrZXlzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGF0dHIgaW4ga2V5cykge1xuICAgICAgICAgICAgICAgIHN0cmluZyA9IGdldFN0cmluZyhsYW5nTmFtZSwga2V5c1thdHRyXSlcbiAgICAgICAgICAgICAgICBhdHRyID09PSAndGV4dCdcbiAgICAgICAgICAgICAgICAgICAgPyAkZWwudGV4dChzdHJpbmcgfHwga2V5c1thdHRyXSlcbiAgICAgICAgICAgICAgICAgICAgOiBzdHJpbmcgPyAkZWwuYXR0cihhdHRyLCBzdHJpbmcpIDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQmxvY2soJGVsLCBkYXRhKSB7XG4gICAgICAgIHZhciBlbCA9ICRlbFswXVxuICAgICAgICB2YXIgdHlwZSA9IGVsLm5vZGVOYW1lID09ICdTRUxFQ1QnID8gJ3NlbGVjdCcgOiAkZWwuYXR0cigncmFzdGknKVxuICAgICAgICBpZiAoIXR5cGUpIHJldHVybiBlcnJvcignTWlzc2luZyBibG9jayB0eXBlLCBwbGVhc2UgcHJvdmlkZSB2aWEgW3Jhc3RpXSBhdHRyaWJ1dGUgaW4gZWxlbWVudDonLCBlbClcbiAgICAgICAgXG4gICAgICAgIHZhciBibG9jayA9IHNlbGYuYmxvY2tzW3R5cGVdXG4gICAgICAgIGlmICghYmxvY2spIHJldHVybiBlcnJvcignVW5kZWZpbmVkIGJsb2NrIHR5cGUgXCIlc1wiIGluIFtyYXN0aV0gYXR0cmlidXRlIG9mIGVsZW1lbnQ6JywgdHlwZSwgZWwpXG4gICAgICAgIFxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHZhciBkYXRha2V5ID0gJGVsLmF0dHIoJ2RhdGEnKVxuICAgICAgICAgICAgaWYgKCFkYXRha2V5KSByZXR1cm4gZXJyb3IoJ01pc3NpbmcgZGF0YWtleSwgcGxlYXNlIHByb3ZpZGUgdmlhIFtkYXRhXSBhdHRyaWJ1dGUgaW4gZWxlbWVudDonLCBlbClcblxuICAgICAgICAgICAgZGF0YSA9IHNlbGYuZGF0YVtkYXRha2V5XVxuICAgICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gZXJyb3IoJ1VuZGVmaW5lZCBkYXRhIHNvdXJjZSBcIiVzXCIgaW4gW2RhdGFdIGF0dHJpYnV0ZSBvZiBlbGVtZW50OicsIGRhdGFrZXksIGVsKVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRvcHRpb25zLCBmaWVsZCwgYWxpYXNcblxuICAgICAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBpbiB0aGUgYmxvY2ssIG5vdCBoZXJlXG4gICAgICAgIGlmICh0eXBlID09PSAnbXVsdGknKSB7XG4gICAgICAgICAgICB2YXIgZmllbGQgPSAkZWwuYXR0cignZmllbGQnKVxuICAgICAgICAgICAgaWYgKCFmaWVsZCkgcmV0dXJuIGVycm9yKCdNaXNzaW5nIFtmaWVsZF0gYXR0cmlidXRlIHZhbHVlIGluIGVsZW1lbnQ6JywgZWwpXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBvcHRpb25zIGRpdiBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAgICAgJG9wdGlvbnMgPSAkZWwuY2xvc2VzdCgnW3BhZ2VdJykuZmluZCgnW29wdGlvbnM9JysgZmllbGQgKyddJylcbiAgICAgICAgICAgIGlmICghJG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgbm90IGNyZWF0ZSBpdCBhbmQgYXBwZW5kIGl0IHRvIHBhZ2VcbiAgICAgICAgICAgICAgICAkb3B0aW9ucyA9ICQoJzxkaXYgZmllbGQgcmFzdGk9JysgdHlwZSArJyBvcHRpb25zPScrIGZpZWxkICsnPicpXG4gICAgICAgICAgICAgICAgJGVsLmNsb3Nlc3QoJ1twYWdlXScpLmNoaWxkcmVuKCcucGFnZS1vcHRpb25zJykuYXBwZW5kKCRvcHRpb25zKVxuICAgICAgICAgICAgfSAgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJG9wdGlvbnMgPSAkZWxcbiAgICAgICAgfVxuXG4gICAgICAgIGlzLmZ1bmN0aW9uKGRhdGEpXG4gICAgICAgICAgICA/IGRhdGEoYXBwbHlUZW1wbGF0ZSlcbiAgICAgICAgICAgIDogYXBwbHlUZW1wbGF0ZShkYXRhKVxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gYXBwbHlUZW1wbGF0ZShkYXRhKSB7XG4gICAgICAgICAgICAkb3B0aW9ucy5odG1sKCBibG9jay50ZW1wbGF0ZShkYXRhLCAkZWwpIClcblxuICAgICAgICAgICAgaWYgKGludmFsaWREYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gJGVsLmF0dHIoJ2ZpZWxkJyksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UgPSAkZWwuY2xvc2VzdCgnW3BhZ2VdJykuYXR0cigncGFnZScpXG4gICAgICAgICAgICAgICAgd2FybignRGV0ZWN0ZWQgJXMgaW52YWxpZCBkYXRhIGVudHJpZXMgZm9yIGZpZWxkIFslc10gaW4gcGFnZSBbJXNdJywgaW52YWxpZERhdGEsIGZpZWxkLCBwYWdlKVxuICAgICAgICAgICAgICAgIGludmFsaWREYXRhID0gMFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlRnVsbFNjcmVlbihlKSB7XG4gICAgICAgIHZhciBwcmVmaXhlcyA9ICdtb3ogd2Via2l0Jy5zcGxpdCgnICcpXG4gICAgICAgIHByZWZpeGVzLmZvckVhY2goZnVuY3Rpb24ocCl7XG4gICAgICAgICAgICBpZiAoICEgKHAgKyAnRnVsbHNjcmVlbkVsZW1lbnQnIGluIGRvY3VtZW50KSApIHJldHVyblxuICAgICAgICAgICAgaWYgKCAhZG9jdW1lbnRbIHAgKyAnRnVsbHNjcmVlbkVsZW1lbnQnIF0pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbIHAgKyAnUmVxdWVzdEZ1bGxTY3JlZW4nIF0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRvY3VtZW50WyBwICsgJ0NhbmNlbEZ1bGxTY3JlZW4nIF0pIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudFsgcCArICdDYW5jZWxGdWxsU2NyZWVuJyBdKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICAvLyBpbnRlcm5hbCB1dGlsc1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlVGFicygkZWwpIHtcbiAgICAgICAgdmFyIGVsID0gJGVsWzBdLFxuICAgICAgICAgICAgJHRhYnMgPSAkZWwuY2hpbGRyZW4oJzpub3QoLnBhZ2Utb3B0aW9ucyknKSxcbiAgICAgICAgICAgICRsYWJlbHMgPSAkKCc8ZGl2IGNsYXNzPVwidGFiLWxhYmVsc1wiPicpLFxuICAgICAgICAgICAgJGJhciA9ICQoJzxkaXYgY2xhc3M9XCJiYXJcIj4nKSxcbiAgICAgICAgICAgICR0YWIsIGxhYmVsLCBwb3NpdGlvblxuXG4gICAgICAgICR0YWJzLmVhY2goZnVuY3Rpb24oaSwgdGFiKXtcbiAgICAgICAgICAgICR0YWIgPSAkKHRhYilcbiAgICAgICAgICAgICR0YWIuYXR0cigndGFiJywgaSlcbiAgICAgICAgICAgIGxhYmVsID0gJHRhYi5hdHRyKCdsYWJlbCcpIHx8ICR0YWIuYXR0cignaGVhZGVyJykgfHwgJHRhYi5hdHRyKCduYW1lJykgfHwgJ1RBQiAnICsgKGkrMSlcblxuICAgICAgICAgICAgJGxhYmVscy5hcHBlbmQoJChgPGRpdiB0YWItbGFiZWw9JHtpfSB0ZXh0PVwiJHsgbGFiZWwgfVwiPmApKVxuICAgICAgICB9KVxuXG4gICAgICAgICRsYWJlbHMuYXBwZW5kKCRiYXIpLmFwcGVuZFRvKCRlbClcblxuICAgICAgICAkbGFiZWxzLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyICRsYWJlbCA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgIHRhYm5yID0gJGxhYmVsLmF0dHIoJ3RhYi1sYWJlbCcpLFxuICAgICAgICAgICAgICAgICR0YWIgPSAkdGFicy5maWx0ZXIoYFt0YWI9XCIkeyB0YWJuciB9XCJdYClcblxuICAgICAgICAgICAgJHRhYnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICAkdGFiLmFkZENsYXNzKCdhY3RpdmUnKVswXS5zY3JvbGxJbnRvVmlldygpXG5cbiAgICAgICAgICAgICRsYWJlbHMuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgICRsYWJlbC5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgICAgIFxuICAgICAgICB9KVxuXG4gICAgICAgICRlbC5vbignc2Nyb2xsJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGVsLnNjcm9sbExlZnQgLyBlbC5zY3JvbGxXaWR0aFxuICAgICAgICAgICAgJGJhci5jc3MoeyBsZWZ0IDogcG9zaXRpb24gKiBlbC5vZmZzZXRXaWR0aCB9KVxuICAgICAgICB9KVxuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdyYXN0aS1uYXYnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGlmICghaXNJbkFjdGl2ZVBhZ2UoJGVsKSkgcmV0dXJuXG4gICAgICAgICAgICAkYmFyLmNzcyh7IHdpZHRoIDogZWwub2Zmc2V0V2lkdGggLyAkdGFicy5sZW5ndGggfSlcbiAgICAgICAgICAgIGlmICghJGxhYmVscy5jaGlsZHJlbignLmFjdGl2ZScpLmxlbmd0aCkgJGxhYmVscy5jaGlsZHJlbigpLmZpcnN0KCkuY2xpY2soKVxuICAgICAgICB9KVxuXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmICghaXNJbkFjdGl2ZVBhZ2UoJGVsKSkgcmV0dXJuXG4gICAgICAgICAgICAkbGFiZWxzLmZpbmQoJy5hY3RpdmUnKS5jbGljaygpXG4gICAgICAgICAgICAkYmFyLmNzcyh7IHdpZHRoIDogZWwub2Zmc2V0V2lkdGggLyAkdGFicy5sZW5ndGggfSlcbiAgICAgICAgfSlcblxuICAgICAgICBmdW5jdGlvbiBpc0luQWN0aXZlUGFnZSgkZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmFjdGl2ZVBhZ2UuZmluZCgkZWwpLmxlbmd0aFxuICAgICAgICAgICAgICAgIHx8IHNlbGYuYWN0aXZlUGFnZS5hdHRyKCdwYWdlJykgPT09ICRlbC5hdHRyKCdwYWdlJylcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIFxuXG4gICAgZnVuY3Rpb24gaW5pdEJsb2NrKCRlbCkge1xuICAgICAgICB2YXIgZWwgPSAkZWxbMF1cbiAgICAgICAgdmFyIHR5cGUgPSBlbC5ub2RlTmFtZSA9PSAnU0VMRUNUJyA/ICdzZWxlY3QnIDogJGVsLmF0dHIoJ3Jhc3RpJylcbiAgICAgICAgaWYgKCF0eXBlKSByZXR1cm4gZXJyb3IoJ01pc3NpbmcgYmxvY2sgdHlwZSwgcGxlYXNlIHByb3ZpZGUgdmlhIFtyYXN0aV0gYXR0cmlidXRlIGluIGVsZW1lbnQ6JywgZWwpXG4gICAgICAgIFxuICAgICAgICB2YXIgYmxvY2sgPSBzZWxmLmJsb2Nrc1t0eXBlXVxuICAgICAgICBpZiAoIWJsb2NrKSByZXR1cm4gZXJyb3IoJ1VuZGVmaW5lZCBibG9jayB0eXBlIFwiJXNcIiBpbiBbcmFzdGldIGF0dHJpYnV0ZSBvZiBlbGVtZW50OicsIHR5cGUsIGVsKVxuXG4gICAgICAgIC8vIGlmIGFwcGxpY2FibGUsIGNyZWF0ZSBvcHRpb25zIGZyb20gZGF0YSBzb3VyY2VcbiAgICAgICAgaWYgKCRlbC5hdHRyKCdkYXRhJykpIHVwZGF0ZUJsb2NrKCRlbClcblxuICAgICAgICBibG9jay5pbml0KCRlbClcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGluaXRQYWdlcigkZWwsIGRhdGEpIHtcbiAgICAgICAgdmFyIG5hbWUgPSAkZWwuYXR0cigndGVtcGxhdGUnKSxcbiAgICAgICAgICAgIHRlbXBsYXRlID0gc2VsZi50ZW1wbGF0ZXNbbmFtZV0sXG4gICAgICAgICAgICBmeCA9ICRlbC5hdHRyKCdmeCcpICYmIHNlbGYuZnhbJGVsLmF0dHIoJ2Z4JyldLFxuICAgICAgICAgICAgcGFnZV9zaXplID0gcGFyc2VJbnQoJGVsLmF0dHIoJ3BhZ2luZycpKSxcbiAgICAgICAgICAgIHBhZ2VyID0gbmV3UGFnZXIobmFtZSwgZGF0YSwgcGFnZV9zaXplKSxcbiAgICAgICAgICAgIHBhZ2luZywgY29sdW1ucywgc2l6ZXNcblxuICAgICAgICBpZiAoJGVsWzBdLmhhc0F0dHJpYnV0ZSgnY29sdW1ucycpKSBjb2x1bW5zID0gYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbHVtbnMgZmxvYXRsIGliX1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbD5Db2x1bW5zOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBidG4+MTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gYnRuIHZhbHVlPTI+MjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gYnRuIHZhbHVlPTM+MzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+YFxuXG4gICAgICAgIGlmIChwYWdlci50b3RhbCA+IDEpIHBhZ2luZyA9IGA8ZGl2IGNsYXNzPVwicGFnaW5nIGliX1wiPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gcHJldlwiPiZsdDs8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBhZ2VcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBuZXh0XCI+Jmd0OzwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+YFxuXG4gICAgICAgIHNpemVzID0gYDxkaXYgY2xhc3M9XCJzaXplcyBmbG9hdHIgaWJfXCI+XG4gICAgICAgICAgICAgICAgPGxhYmVsPlBhZ2Ugc2l6ZTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxidXR0b24gYnRuIHZhbHVlPTU+NTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gYnRuIHZhbHVlPTEwPjEwPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBidG4gdmFsdWU9MjA+MjA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PmBcblxuICAgICAgICAkZWwuaHRtbChgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmVzdWx0cyBzY3JvbGx5XCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udHJvbHMgc21hbGwgYm90dG9tIGNlbnRlcnggaWJfXCI+XG4gICAgICAgICAgICAgICAgJHsgY29sdW1ucyB8fCAnJyB9XG4gICAgICAgICAgICAgICAgJHsgcGFnaW5nIHx8ICcnIH1cbiAgICAgICAgICAgICAgICAkeyBzaXplcyB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYClcblxuICAgICAgICAkY29udHJvbHMgPSAkZWwuY2hpbGRyZW4oJy5jb250cm9scycpXG4gICAgICAgICRyZXN1bHRzID0gJGVsLmNoaWxkcmVuKCcucmVzdWx0cycpXG5cbiAgICAgICAgJGNvbnRyb2xzLm9uKCdjbGljaycsICcubmV4dCcsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdXBkYXRlKCBwYWdlci5uZXh0KCkgKVxuICAgICAgICB9KVxuXG4gICAgICAgICRjb250cm9scy5vbignY2xpY2snLCAnLnByZXYnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHVwZGF0ZSggcGFnZXIucHJldigpIClcbiAgICAgICAgfSlcblxuICAgICAgICAkY29udHJvbHMub24oJ2NsaWNrJywgJy5zaXplcyBidXR0b24nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHBhZ2VyLnNldFBhZ2VTaXplKHRoaXMudmFsdWUpXG4gICAgICAgICAgICB1cGRhdGUoIHBhZ2VyLm5leHQoKSApXG4gICAgICAgICAgICBwYWdlci50b3RhbCA+IDFcbiAgICAgICAgICAgICAgICA/ICRjb250cm9scy5maW5kKCcucGFnaW5nJykuc2hvdygpXG4gICAgICAgICAgICAgICAgOiAkY29udHJvbHMuZmluZCgnLnBhZ2luZycpLmhpZGUoKVxuICAgICAgICB9KVxuXG4gICAgICAgICRjb250cm9scy5vbignY2xpY2snLCAnLmNvbHVtbnMgYnV0dG9uJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAkcmVzdWx0cy5yZW1vdmVDbGFzcygnY29sdW1ucy0yIGNvbHVtbnMtMycpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKHRoaXMudmFsdWUgPyAnY29sdW1ucy0nICsgdGhpcy52YWx1ZSA6ICcnKVxuICAgICAgICB9KVxuXG4gICAgICAgICRyZXN1bHRzLmh0bWwodGVtcGxhdGUoIHBhZ2VyLm5leHQoKSApKVxuICAgICAgICAkY29udHJvbHMuZmluZCgnLnBhZ2UnKS5odG1sKHBhZ2VyLnBhZ2UgKyAnLycgKyBwYWdlci50b3RhbClcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoZGF0YSl7XG4gICAgICAgICAgICAkcmVzdWx0cy5odG1sKCB0ZW1wbGF0ZShkYXRhKSApXG4gICAgICAgICAgICAkY29udHJvbHMuZmluZCgnLnBhZ2UnKS5odG1sKHBhZ2VyLnBhZ2UgKyAnLycgKyBwYWdlci50b3RhbClcbiAgICAgICAgICAgIGlmICggaXMuZnVuY3Rpb24oZngpICkgZngoJHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYWdlcihpZCkge1xuICAgICAgICBsZXQgcGFnZXIgPSBzZWxmLnBhZ2Vycy5nZXQoaWQpXG4gICAgICAgIGlmICghcGFnZXIpIGVycm9yKCdObyBwYWdlciBmb3IgdGVtcGxhdGUgWyVzXScsIGlkKVxuICAgICAgICByZXR1cm4gcGFnZXJcbiAgICB9XG4gICAgZnVuY3Rpb24gbmV3UGFnZXIoaWQsIHJlc3VsdHMsIHBhZ2Vfc2l6ZSkge1xuICAgICAgICBsZXQgcGFnZXIgPSBuZXcgUGFnZXIoaWQsIHJlc3VsdHMsIHBhZ2Vfc2l6ZSlcbiAgICAgICAgc2VsZi5wYWdlcnMuc2V0KGlkLCBwYWdlcilcbiAgICAgICAgcmV0dXJuIHBhZ2VyXG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlbGV0ZVBhZ2VyKHBhZ2VyKSB7XG4gICAgICAgIGlmICghcGFnZXIgfHwgIXBhZ2VyLmlkKSByZXR1cm5cbiAgICAgICAgc2VsZi5wYWdlcnMuZGVsZXRlKHBhZ2VyLmlkKVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc3VibWl0QWpheChtZXRob2QsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBhamF4ID0gc2VsZi5hamF4WyBtZXRob2QgXVxuICAgICAgICBpZiAoICFpcy5mdW5jdGlvbihhamF4KSApIHJldHVybiBlcnJvcignQWpheCBtZXRob2QgWycrIG1ldGhvZCArJ10gaXMgbm90IGRlZmluZWQnKVxuXG4gICAgICAgIHZhciAkZm9ybSA9ICQoJ1thamF4PScrIG1ldGhvZCArJ10nKVxuICAgICAgICBpZiAoISRmb3JtLmxlbmd0aCkgcmV0dXJuIGVycm9yKCdObyBjb250YWluZXIgZWxlbWVudCBib3VuZCB0byBhamF4IG1ldGhvZCBbJXNdLiBQbGVhc2UgYmluZCBvbmUgdmlhIFthamF4XSBhdHRyaWJ1dGUnLCBtZXRob2QpXG5cbiAgICAgICAgdmFyIHJlcWRhdGEgPSB7fSwgZmllbGRcbiAgICAgICAgJGZvcm0uZmluZCgnW2ZpZWxkXScpLmVhY2goZnVuY3Rpb24oaSwgZWwpe1xuICAgICAgICAgICAgJGVsID0gJChlbClcbiAgICAgICAgICAgIGZpZWxkID0gJGVsLmF0dHIoJ2ZpZWxkJylcbiAgICAgICAgICAgIGlmIChmaWVsZCkge1xuICAgICAgICAgICAgICAgIHJlcWRhdGFbZmllbGRdID0gJGVsLnZhbCgpIHx8ICRlbC5hdHRyKCd2YWx1ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgYWpheChyZXFkYXRhLCBjYWxsYmFjaylcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGdldFRoZW1lU3R5bGUodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICBib2R5IHtcbiAgICAgICAgICAgICAgICBmb250OiAkeyB2YWx1ZXMuZm9udCB9O1xuICAgICAgICAgICAgICAgIGNvbG9yOiAkeyB2YWx1ZXMudGV4dFswXSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgW3BhZ2VdICAgIHsgYmFja2dyb3VuZC1jb2xvcjogJHsgdmFsdWVzLnBhZ2VbMF0gfTsgfVxuICAgICAgICAgICAgW3BhbmVsXSAgIHsgYmFja2dyb3VuZC1jb2xvcjogJHsgdmFsdWVzLnBhbmVsWzBdIH07IH1cbiAgICAgICAgICAgIFtzZWN0aW9uXSB7IGJhY2tncm91bmQtY29sb3I6ICR7IHZhbHVlcy5zZWN0aW9uWzBdIH07IH1cblxuICAgICAgICAgICAgW3BhZ2VdW2hlYWRlcl06YmVmb3JlICAgIHsgYmFja2dyb3VuZC1jb2xvcjogJHsgdmFsdWVzLnBhZ2VbMV0gfTsgfVxuICAgICAgICAgICAgW3BhbmVsXVtoZWFkZXJdOmJlZm9yZSAgIHsgYmFja2dyb3VuZC1jb2xvcjogJHsgdmFsdWVzLnBhbmVsWzFdIH07IH1cbiAgICAgICAgICAgIFtzZWN0aW9uXVtoZWFkZXJdOmJlZm9yZSB7IGJhY2tncm91bmQtY29sb3I6ICR7IHZhbHVlcy5zZWN0aW9uWzFdIH07IH1cblxuICAgICAgICAgICAgW3RhYnNdID4gLnRhYi1sYWJlbHMgICAgICAgIHsgYmFja2dyb3VuZC1jb2xvcjogJHsgdmFsdWVzLnBhbmVsWzBdIH07IH1cbiAgICAgICAgICAgIFt0YWJzXSA+IC50YWItbGFiZWxzID4gLmJhciB7IGJhY2tncm91bmQtY29sb3I6ICR7IHZhbHVlcy5idG5bMF0gfTsgfVxuXG4gICAgICAgICAgICBbZmllbGRdIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkeyB2YWx1ZXMuZmllbGRbMF0gfTtcbiAgICAgICAgICAgICAgICBjb2xvcjogJHsgdmFsdWVzLmZpZWxkWzFdIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFtidG5dLCAuYnRuLCBbcmFzdGk9YnV0dG9uc10gPiBkaXYge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR7IHZhbHVlcy5idG5bMF0gfTtcbiAgICAgICAgICAgICAgICBjb2xvcjogJHsgdmFsdWVzLmJ0blsxXSB9OyBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgW2hlYWRlcl06YmVmb3JlIHsgY29sb3I6ICR7IHZhbHVlcy5oZWFkZXJbMF0gfTsgfVxuICAgICAgICAgICAgW2xhYmVsXTpub3QoW2hlYWRlcl0pOmJlZm9yZSAgeyBjb2xvcjogJHsgdmFsdWVzLmxhYmVsWzBdIH07IH1cbiAgICAgICAgICAgIGBcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGdldFN0cmluZyhsYW5nLCBrZXkpIHtcbiAgICAgICAgaWYgKCAhaXMub2JqZWN0KHNlbGYubGFuZ3NbbGFuZ10pICkge1xuICAgICAgICAgICAgZXJyb3IoJ0xhbmcgWyVzXSBpcyBub3QgZGVmaW5lZCcsIGxhbmcpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyaW5nID0gc2VsZi5sYW5nc1tsYW5nXVtrZXldXG4gICAgICAgIGlmICggIWlzLnN0cmluZyhzdHJpbmcpICkgd2FybignTGFuZyBbJXNdIGRvZXMgbm90IGNvbnRhaW4ga2V5IFslc10nLCBsYW5nLCBrZXkpXG4gICAgICAgIGVsc2UgcmV0dXJuIHN0cmluZ1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gZml4TGFiZWwoJGVsKSB7XG4gICAgICAgIHZhciAkZGl2ID0gJChgPGRpdiBmaXhlZCBsYWJlbD1cIiR7ICRlbC5hdHRyKCdsYWJlbCcpIH1cIiA+YClcbiAgICAgICAgJGVsLndyYXAoJGRpdilcbiAgICAgICAgJGVsWzBdLnJlbW92ZUF0dHJpYnV0ZSgnbGFiZWwnKVxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gc2V0SW1nKCRlbCwgYmFzZXBhdGgpIHtcbiAgICAgICAgJGVsLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJysgYmFzZXBhdGggKyAoJGVsLnZhbCgpIHx8ICRlbC5hdHRyKCd2YWx1ZScpKSArJy5wbmcpJylcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGxvZyguLi5wYXJhbXMpIHtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5sb2cpIGNvbnNvbGUubG9nLmNhbGwodGhpcywgLi4ucGFyYW1zKVxuICAgIH1cbiAgICBmdW5jdGlvbiB3YXJuKC4uLnBhcmFtcykge1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmxvZykgY29uc29sZS53YXJuLmNhbGwodGhpcywgLi4ucGFyYW1zKVxuICAgIH1cbiAgICBmdW5jdGlvbiBlcnJvciguLi5wYXJhbXMpIHtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5sb2cpIGNvbnNvbGUuZXJyb3IuY2FsbCh0aGlzLCAuLi5wYXJhbXMpXG4gICAgfVxuXG5cbiAgICBjbGFzcyBQYWdlciB7XG5cbiAgICAgIGNvbnN0cnVjdG9yKGlkLCByZXN1bHRzLCBwYWdlX3NpemUpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkXG4gICAgICAgIGlmICggIWlzLnN0cmluZyhpZCkgKSByZXR1cm4gZXJyb3IoJ1BhZ2VyIGlkIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgICB0aGlzLmxvZ2lkID0gYFBhZ2VyIGZvciB0ZW1wbGF0ZSBbJHsgdGhpcy5pZCB9XTpgXG4gICAgICAgIGlmICggIWlzLmFycmF5KHJlc3VsdHMpICkgcmV0dXJuIGVycm9yKCclcyBSZXN1bHRzIG11c3QgYmUgYW4gYXJyYXknLCB0aGlzLmxvZ2lkKVxuICAgICAgICBpZiAoICFpcy5udW1iZXIocGFnZV9zaXplKSApIHJldHVybiBlcnJvcignJXMgUGFnZSBzaXplIG11c3QgYmUgYSBudW1iZXInLCB0aGlzLmxvZ2lkKVxuICAgICAgICB0aGlzLnJlc3VsdHMgPSByZXN1bHRzXG4gICAgICAgIHRoaXMucGFnZV9zaXplID0gcGFnZV9zaXplXG4gICAgICAgIHRoaXMucGFnZSA9IDBcbiAgICAgICAgdGhpcy50b3RhbCA9IE1hdGguY2VpbCh0aGlzLnJlc3VsdHMubGVuZ3RoIC8gdGhpcy5wYWdlX3NpemUpXG4gICAgICAgIFxuICAgICAgfVxuXG4gICAgICBuZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5oYXNOZXh0KCkpIHRoaXMucGFnZSsrXG4gICAgICAgIGVsc2Ugd2FybignJXMgTm8gbmV4dCBwYWdlJywgdGhpcy5sb2dpZClcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZVJlc3VsdHModGhpcy5wYWdlKVxuICAgICAgfVxuXG4gICAgICBwcmV2KCkge1xuICAgICAgICBpZiAodGhpcy5oYXNQcmV2KCkpIHRoaXMucGFnZS0tXG4gICAgICAgIGVsc2Ugd2FybignJXMgTm8gcHJldmlvdXMgcGFnZScsIHRoaXMubG9naWQpXG4gICAgICAgIHJldHVybiB0aGlzLmdldFBhZ2VSZXN1bHRzKHRoaXMucGFnZSlcbiAgICAgIH1cblxuICAgICAgaGFzTmV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0cy5sZW5ndGggPiB0aGlzLnBhZ2UgKiB0aGlzLnBhZ2Vfc2l6ZVxuICAgICAgfVxuXG4gICAgICBoYXNQcmV2KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWdlID4gMVxuICAgICAgfVxuXG4gICAgICBzZXRQYWdlU2l6ZShzaXplKSB7XG4gICAgICAgIHNpemUgPSBwYXJzZUludChzaXplKVxuICAgICAgICBpZiAoICFpcy5udW1iZXIoc2l6ZSkgKSByZXR1cm4gZXJyb3IoJyVzIE11c3Qgc3BlY2lmeSBhIG51bWJlciBhcyB0aGUgcGFnZSBzaXplJywgdGhpcy5sb2dpZClcbiAgICAgICAgdGhpcy5wYWdlX3NpemUgPSBzaXplXG4gICAgICAgIHRoaXMucGFnZSA9IDBcbiAgICAgICAgdGhpcy50b3RhbCA9IE1hdGguY2VpbCh0aGlzLnJlc3VsdHMubGVuZ3RoIC8gdGhpcy5wYWdlX3NpemUpXG4gICAgICB9XG5cbiAgICAgIGdldFBhZ2VSZXN1bHRzKHBhZ2UpIHtcbiAgICAgICAgaWYgKCAhaXMubnVtYmVyKHBhZ2UpICkge1xuICAgICAgICAgICAgZXJyb3IoJyVzIE11c3Qgc3BlY2lmeSBhIHBhZ2UgbnVtYmVyIHRvIGdldCByZXN1bHRzIGZyb20nLCB0aGlzLmxvZ2lkKVxuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBpID0gKHBhZ2UgLTEpICogdGhpcy5wYWdlX3NpemVcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdHMuc2xpY2UoaSwgaSArIHRoaXMucGFnZV9zaXplKVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycikge1xuICAgICAgICAgICAgZXJyb3IoJyVzIENvdWxkIG5vdCBnZXQgcmVzdWx0cyBvZiBwYWdlICVzLCBlcnJvcjonLCB0aGlzLmxvZ2lkLCBwYWdlLCBlcnIpXG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvLyBwcm90b3R5cGUgZXh0ZW5zaW9uc1xuXG4gICAgKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHRoaXMuaW5kZXhPZihlbCk7XG4gICAgICAgICAgICBpZiAoaSA+PSAwKSB0aGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoICYmIHRoaXNbMF0udG9VcHBlckNhc2UoKSArIHRoaXMuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICB9XG5cbiAgICB9KSgpXG5cblxuICAgIC8vIGFwaVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gdmFsdWVzXG4gICAgICAgIGFjdGl2ZVBhZ2UgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYuYWN0aXZlUGFnZSB9LFxuICAgICAgICBhY3RpdmVMYW5nIDogZnVuY3Rpb24oKSB7IHJldHVybiBzZWxmLmFjdGl2ZUxhbmcgfSxcbiAgICAgICAgYWN0aXZlVGhlbWUgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYuYWN0aXZlVGhlbWUgfSxcbiAgICAgICAgXG4gICAgICAgIC8vIG9iamVjdHNcbiAgICAgICAgcGFnZXMgOiB0aGlzLnBhZ2VzLFxuICAgICAgICBkYXRhIDogdGhpcy5kYXRhLFxuICAgICAgICBhamF4IDogdGhpcy5hamF4LFxuICAgICAgICB1dGlscyA6IHRoaXMudXRpbHMsXG4gICAgICAgIGxhbmdzIDogdGhpcy5sYW5ncyxcbiAgICAgICAgdGhlbWVzIDogdGhpcy50aGVtZXMsXG4gICAgICAgIHRoZW1lTWFwcyA6IHRoaXMudGhlbWVNYXBzLFxuICAgICAgICBibG9ja3MgOiB0aGlzLmJsb2NrcyxcbiAgICAgICAgdGVtcGxhdGVzIDogdGhpcy50ZW1wbGF0ZXMsXG4gICAgICAgIGZ4IDogdGhpcy5meCxcbiAgICAgICAgb3B0aW9ucyA6IHRoaXMub3B0aW9ucyxcblxuICAgICAgICAvLyBtZXRob2RzXG4gICAgICAgIGNvbmZpZyA6IGNvbmZpZyxcbiAgICAgICAgaW5pdCA6IGluaXQsXG4gICAgICAgIGdldCA6IGdldCxcbiAgICAgICAgc2V0IDogc2V0LFxuICAgICAgICBhZGQgOiBhZGQsXG4gICAgICAgIG5hdlRvIDogbmF2VG8sXG4gICAgICAgIHJlbmRlciA6IHJlbmRlcixcbiAgICAgICAgc2V0TGFuZyA6IHNldExhbmcsXG4gICAgICAgIHNldFRoZW1lIDogc2V0VGhlbWUsXG4gICAgICAgIHVwZGF0ZUJsb2NrIDogdXBkYXRlQmxvY2ssXG4gICAgICAgIHRvZ2dsZUZ1bGxTY3JlZW4gOiB0b2dnbGVGdWxsU2NyZWVuLFxuICAgIH1cblxufVxuIiwiY29uc3QgaXMgPSB7fVxuJ29iamVjdCBmdW5jdGlvbiBhcnJheSBzdHJpbmcgbnVtYmVyIHJlZ2V4IGJvb2xlYW4nLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbih0KXtcbiAgICBpc1t0XSA9IGZ1bmN0aW9uKGV4cCl7IHJldHVybiB0eXBlKGV4cCkgPT09IHQgfVxufSlcbmZ1bmN0aW9uIHR5cGUoZXhwKSB7XG4gICAgICAgIHZhciBjbGF6eiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHApXG4gICAgICAgIHJldHVybiBjbGF6ei5zdWJzdHJpbmcoOCwgY2xhenoubGVuZ3RoLTEpLnRvTG93ZXJDYXNlKClcbn1cbmZ1bmN0aW9uIHNhbWVUeXBlKGV4cDEsIGV4cDIpIHtcbiAgICByZXR1cm4gdHlwZShleHAxKSA9PT0gdHlwZShleHAyKVxufVxuXG5cbmZ1bmN0aW9uIGNoZWNrRGF0YShkYXRhKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgZGF0YSkge1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGRhdGEgPSB7dmFsdWU6IGRhdGEsIGxhYmVsOiBkYXRhLCBhbGlhczogZGF0YS50b0xvd2VyQ2FzZSgpfVxuICAgICAgICBicmVha1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmICggIWlzLnN0cmluZyhkYXRhLnZhbHVlKSB8fCAhaXMuc3RyaW5nKGRhdGEubGFiZWwpICkge1xuICAgICAgICAgICAgZXJyb3IoJ0ludmFsaWQgZGF0YSBvYmplY3QgKG11c3QgaGF2ZSBzdHJpbmcgcHJvcGVydGllcyBcInZhbHVlXCIgYW5kIFwibGFiZWxcIik6JywgZGF0YSlcbiAgICAgICAgICAgIGludmFsaWREYXRhKytcbiAgICAgICAgICAgIGRhdGEgPSB7dmFsdWU6ICcnLCBsYWJlbDogJ0lOVkFMSUQgREFUQScsIGFsaWFzOiAnJ31cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggIWlzLnN0cmluZyhkYXRhLmFsaWFzKSApIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmFsaWFzKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IoJ0ludmFsaWQgZGF0YSBwcm9wZXJ0eSBcImFsaWFzXCIgKG11c3QgYmUgYSBzdHJpbmcpOicsIGRhdGEpXG4gICAgICAgICAgICAgICAgaW52YWxpZERhdGErK1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YS5hbGlhcyA9IGRhdGEudmFsdWUudG9Mb3dlckNhc2UoKVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgZGF0YS5hbGlhcyA9IGRhdGEuYWxpYXMudG9Mb3dlckNhc2UoKSArJyAnKyBkYXRhLnZhbHVlLnRvTG93ZXJDYXNlKClcbiAgICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgICBlcnJvcignSW52YWxpZCBkYXRhIChtdXN0IGJlIGEgc3RyaW5nIG9yIGFuIG9iamVjdCk6JywgZGF0YSlcbiAgICAgICAgaW52YWxpZERhdGErK1xuICAgICAgICBkYXRhID0ge3ZhbHVlOiAnJywgbGFiZWw6ICdJTlZBTElEIERBVEEnLCBhbGlhczogJyd9XG4gICAgfVxuICAgIHJldHVybiBkYXRhXG59XG5cblxuZnVuY3Rpb24gcmFuZG9tKCkge1xuICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIDYgfCAwKSArIDFcbn1cblxuXG5mdW5jdGlvbiBvbk1vYmlsZSgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggPCA1MDBcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aXMgOiBpcyxcblx0dHlwZSA6IHR5cGUsXG5cdHNhbWVUeXBlIDogc2FtZVR5cGUsXG5cdGNoZWNrRGF0YSA6IGNoZWNrRGF0YSxcblx0cmFuZG9tIDogcmFuZG9tLFxuXHRvbk1vYmlsZSA6IG9uTW9iaWxlLFxufSJdfQ==
