require('./js/extensions')
const { History, Pager, state, crud } = require('./js/components')
const utils = require('./js/utils')
const { is, sameType, resolveAttr, chain, safe, compose, $ify, $check, html } = utils
const { themes, themeMaps } = require('./js/themes')
let media

let default_options = {
    history : true,
    persist : true,
    root    : '',
    theme   : 'base',
    lang    : '',
    separator : ';',
    imgPath : 'img/',
    imgExt  : '.png',
    page_sizes : [5, 10, 20, 50],
    media   : {
        phone : 500,
        tablet : 800,
    },
}

const default_texts = {
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
    newEl   : 'New element',
}

default_options = {...default_options, ...default_texts}

const TEXT_ATTRS = 'label header text placeholder'.split(' ')
const EVENT_ATTRS = 'hover focus blur click change input keydown submit load error'.split(' ')
const ACTION_ATTRS = 'show hide toggle'.split(' ')
const NOCHILD_TAGS = 'input select textarea img'.split(' ')

const log = (...params) => {
    if (rasti.options.log.search(/debug/i) > -1) console.log.call(this, ...params)
}
const warn = (...params) => {
    if (rasti.options.log.search(/(warn)|(debug)/i) > -1) console.warn.call(this, ...params)
}
const error = (...params) => {
    console.error.call(this, ...params)
}


function rasti(name, container) {

    const self = this
    const errPrefix = 'Cannot create rasti app: '
    if ( is.not.string(name) ) return error(errPrefix + 'app must have a name!')
    name = name.replace(' ', '')

    if ( !container ) container = $('body')
    else if ( !(container.selector) ) {
        if ( is.string(container) || (container.tagName && 'BODY DIV'.search(container.tagName) > -1) ) container = $(container)
        else return error(errPrefix + 'app container is invalid. Please provide a selector string, a jQuery object ref or a DOM element ref')
    }
    container.attr('rasti', name)


    // private properties

    const __name = name
    const __pagers = new Map()
    const __crud = crud(this)
    const __state = {}
    const __templates = {}
    let __history
    let __invalid_data_count = 0


    // public properties

    this.options = {...default_options}
    this.active = {
        page  : null,
        theme : '',
        lang  : '',
    }
    this.state = state(this, __name)
    this.data = {}
    this.props = {}
    this.methods = {}
    this.pages = {}
    this.langs = {}
    this.themes = themes
    this.themeMaps = themeMaps
    this.sidemenu = null
    this.media = {}


    // decorators

    const api = compose(safe(error), chain(this))
    

    // public methods

    const config = api(props => {

        if ( is.nil(props) ) return warn('Called config() on app [%s] with no arguments', __name)

        if ( is.not.object(props) ) throw ['Cannot config app [%s]: invalid config object', __name]

        for (let key in props) {
            const known = is.object(self[key])
            const valid = is.object(props[key])
            if (!known) {
                warn('Unknown config prop [%s]', key)
                continue
            }
            if (!valid) {
                warn('Invalid config prop [%s], must be an object', key)
                continue
            }
            if ('data methods'.includes(key)) {
                for (let name in props[key]) {
                    const value = props[key][name]
                    if (key == 'methods' && is.not.function(value))
                        warn('Invalid method [%s], must be a function', name)
                    else
                        self[key][name] = is.function(value) ? value.bind(self) : value
                }
            }
            else Object.assign(self[key], props[key])
        }

    })


    const init = api(options => {

        const initStart = window.performance.now()
        log('Initializing app [%s]...', __name)

        container
            .addClass('big loading backdrop')
            [0].removeAttribute('hidden')

        // cache options
        if (options) {
            if ( is.not.object(options) ) warn('Init options must be an object!')
            else Object.keys(self.options).forEach( key => {
                if ( is.def(options[key]) ) {
                    if ( !sameType(self.options[key], options[key])  ) warn('Init option [%s] is invalid', key)
                    else self.options[key] = options[key]
                }
            })
        }


        setMedia(self.options.media)


        // define lang (if applicable)
        if (!self.options.lang) {
            const keys = Object.keys(self.langs)
            if (keys.length) self.options.lang = keys[0]
        }


        // append theme style container
        container.append('<style class=rs-theme>')

        // append backdrop container
        container.append('<div class=rs-backdrop>')

        // append page-options containers
        container.find('[page]').each( el => {
            $(el).append('<div class="page-options">')
        })


        // fix labels
        NOCHILD_TAGS.forEach( tag => {
            container.find(tag + '[label]').each($ify(fixLabel))
        })


        // fix input icons
        container.find('input[icon]').each($ify(fixIcon))


        // init blocks and data templates
        container.find('[data]').each( el => {
            el.hasAttribute('template')
                ? render(el)
                : updateBlock(el)
        })


        initSideMenu()


        //initModals()
        
        
        // init tabs
        function initTabs(selector) {
            container.find(selector).each(createTabs)
        }
        initTabs('.tabs')
        if (media.tablet || media.phone) initTabs('.tabs-tablet')
        if (media.phone) initTabs('.tabs-phone')


        // init [nav] bindings
        initNav()


        // init [submit] bindings
        initSubmit()


        // init [render] bindings
        container.on('click change', '[render]:not([submit])', e => {
            const el = e.currentTarget
            const template = el.getAttribute('render')
            template
                ? render(template)
                : error('Missing template name in [render] attribute of element:', el)
        })


        // init element dependencies
        container.find('[bind]').each( el => {
            const $el = $(el)
            const deps = $el.attr('bind')
            if (deps) deps.split(' ').forEach( dep => {
                $el.closest('[page]').find('[prop='+ dep +']')
                    .on('change', e => { updateBlock($el) })
            })
        })


        initPages()


        // resolve empty attributes
        TEXT_ATTRS.forEach( attr => {
            let $el
            container.find('['+attr+'=""]').each( el => {
                $el = $(el)
                $el.attr( attr, resolveAttr($el, attr) )
            })
        })


        // resolve bg images
        container.find('[img]').each( el => {
            let path = resolveAttr($(el), 'img')
            if (path.indexOf('/')==-1) path = self.options.imgPath + path
            if (path.charAt(path.length-4)!='.') path += self.options.imgExt
            el.style['background-image'] = `url(${path})`
        })


        // init internal history (if applicable)
        if (self.options.history) {
            __history = new History(self)
            // bind nav handler to popstate event
            window.onpopstate = e => {
                var page = e.state || location.hash.substring(1)
                page
                    ? e.state ? navTo(page, null, true) : navTo(page)
                    : navTo(self.options.root)
            }
        }

        // init keyboard-navigatable elements
        container.find('[key-nav]').each(utils.keyNav)

        
        bindProps(container, self.props)

        
        initState()


        // init crud templates
        initCrud()

        
        initEvents()


        initActions()


        initFieldValidations()


        // init movable elements
        container.find('[movable]').each( el => {
            $(el).move()
        })


        // cache height of foldable elements
        container.find('[foldable]').add('[menu]').each( el => {
            el._height = el.clientHeight + 'px'
        })


        container
            .on('click', '[foldable]', toggleFoldable)
            .on('click', '.backdrop', hideDialogs)
            .on('keydown', hideDialogs)
            .removeClass('big loading backdrop')

        const initTime = Math.floor(window.performance.now() - initStart) / 1000
        log('App [%s] initialized in %ss', __name, initTime)

    })


    const navTo = api((pagename, params = {}, skipPushState) => {

        if (!pagename) throw ['Cannot navigate, page undefined']

        const $prevPage = self.active.page,
            prevPagename = $prevPage && $prevPage.attr('page'),
            prevPageConfig = prevPagename && self.pages[prevPagename]

        if (pagename == prevPagename) return

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) throw ['Cannot navigate to page [%s]: page container not found', pagename]

        container.find('[menu]').hide()
        container.find('.rs-backdrop').removeClass('backdrop')

        if ($prevPage) $prevPage.removeClass('active')

        if (prevPageConfig && prevPageConfig.out) {
            is.not.function(prevPageConfig.out)
                ? warn('Page [%s] {out} property must be a function!', prevPagename)
                : prevPageConfig.out(params)
        }

        self.active.page = $page.addClass('active')

        if (page && page.in) {
            is.not.function(page.in) ? warn('Page [%s] {in} property must be a function!', pagename)
            : params && is.not.object(params) ? warn('Page [%s] nav params must be an object!', pagename)
            : page.in(is.object(params) && params)
        }

        const $nav = container.find('nav')
        if ($nav.length) {
            $page.hasClass('hide-nav')
                ? $nav.hide()
                : $nav.show()
                    .find('[nav]').removeClass('active')
                    .filter('[nav='+ pagename +']').addClass('active')
        }

        container.trigger('rasti-nav')

        if (skipPushState) return

        if (self.options.history)
            __history.push(pagename)
        
        let hash
        if (page && page.url)
            is.string(page.url)
                ? hash = '#' + page.url
                : warn('Page [%s] {url} property must be a string!', pagename)
        
        window.history.pushState(pagename, null, hash)

    })


    const render = api((el, data, {time, scroll}={}) => {

        let $el, name
        let errPrefix = 'Cannot render template [$],'

        if ( is.string(el) ) {
            name = el
            errPrefix = errPrefix.replace('$', name)
            $el = container.find('[template='+ name +']')
            if ( !$el.length ) throw errPrefix + 'no element bound to template. Please bind one via [template] attribute.'
        }
        else {
            $el = $check(el)
            el = $el[0]

            if ( $el.is('[block]') || $el.is('select') || $el.is('table') || $el.is('ol') || $el.is('ul') )
                return updateBlock($el, data)

            else if ( !$el.is('[template]') ) throw 'Cannot render element, must be a [template], a [block] or a <selec>, <table>, <ol> or <ul>'

            name = $el.attr('template')
            if (!name) {
                // assign hashed name
                name = ($el.attr('data') || $el.attr('prop')) + '-' + Date.now()
                $el.attr('template', name)
            }
            errPrefix = errPrefix.replace('$', name)
        }
        
        if ( is.nil(data) && $el.hasAttr('data') ) {
            const datakey = resolveAttr($el, 'data')
            data = self.data[datakey]
            if ( is.nil(data) ) throw errPrefix + `declared data source "${datakey}" is undefined`
        }
        
        if ( is.string(data) ) {
            let separator = $el.attr('separator') || self.options.separator
            if (!separator.trim()) separator = '\\s'
            data = data.split( new RegExp(`[\n${separator}]+`) ).filter(is.not.empty)
        }
        if ( is.not.array(data) ) data = [data]

        let template = __templates[name]
        let html
        if ( !template || is.string(template) ) try {
            html = template || $el.html()
            html = html.trim()
            template = genTemplate(html)
            template.html = html
            __templates[name] = template
        }
        catch(err) {
            throw errPrefix + 'parsing error: ' + err
        }
        if ( is.not.function(template) ) throw errPrefix + 'template must be a string or a function'

        if ( is.empty(data) ) {
            $el.html(`<div class="nodata">${ self.options.noData }</div>`)
                .addClass('rendered')
                .trigger('rendered')
            return
        }

        const isCrud = $el.hasAttr('crud')
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

        const isPaged = $el.hasAttr('paged')
        isPaged
            ? initPager($el, template, data, getActiveLang())
            : $el.html( template(data) )
        
        if (isPaged || scroll) $el[0].scrollTo(0,0)

        if ( $el.hasAttr('stats') ) {
            const stats = '<div section class="stats">'
                + self.options.stats.replace('%n', data.length).replace('%t', time)
                + '</div>'
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
            __crud.genInputEl($el)
        }

        $el.addClass('rendered').trigger('rendered')
        if (!isPaged) applyFX($el)

    })


    const setLang = api(langName => {

        var lang = self.langs[ langName ],
            errPrefix = 'Cannot set lang [%s]: '

        if (!lang) throw [errPrefix + 'lang not found', langName]
        if ( is.not.object(lang) ) throw [errPrefix + 'lang must be an object!', langName]

        log('Setting lang [%s]', langName)
        self.active.lang = langName

        var $elems = $(), $el, keys, string

        TEXT_ATTRS.forEach( attr => {
            $elems = $elems.add('['+attr+']')
        })

        $elems.each( el => {
            if (el.hasAttribute('fixed')) el = el.children[0]
            $el = $(el)
            keys = el.langkeys

            if (!keys) {
                keys = {}
                TEXT_ATTRS.forEach( attr => {
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

        Object.keys(default_texts).forEach( key => {
            self.options[key] = lang['rasti_'+key] || default_texts[key]
        })

    })


    const setTheme = api(themeString => {

        if (!themeString) return warn('Call to setTheme() with no argument')

        const themeName = themeString.split(' ')[0],
            theme = self.themes[themeName],
            baseTheme = self.themes.base,
            baseMap = self.themeMaps.dark

        if (!theme) throw ['Cannot set theme [%s]: theme not found', themeName]

        let mapName = themeString.split(' ')[1] || ( is.object(theme.maps) && Object.keys(theme.maps)[0] ) || 'dark',
            themeMap = is.object(theme.maps) ? theme.maps[mapName] : self.themeMaps[mapName]

        if (!themeMap) {
            warn('Theme map [%s] not found, using default theme map [dark]', mapName)
            themeMap = baseMap
            mapName = 'dark'
        }

        log('Setting theme [%s:%s]', themeName, mapName)
        self.active.theme = themeName

        // clone themeMap
        themeMap = {...themeMap}

        const values = { font : theme.font || baseTheme.font, }
        let colorNames, colors, c1, c2, defaultColorName

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
                    }
                }
            }

            values[attr] = colors
            if (themeMap[attr]) delete themeMap[attr]
        }

        const invalidKeys = Object.keys(themeMap)
        if (invalidKeys.length) warn('Ignored %s invalid theme map keys:', invalidKeys.length, invalidKeys)

        // set base theme colors as css properties (use user-defined values if given)
        for (let prop in baseTheme.palette) {
            container[0].style.setProperty("--" + prop, theme.palette[prop] || baseTheme.palette[prop])
        }

        // generate theme style and apply it
        container.find('.rs-theme').html( getThemeStyle(values) )

        // apply bg colors
        let colorName, color
        container.find('[bg]').each( el => {
            colorName = el.getAttribute('bg')
            color = theme.palette[colorName] || baseTheme.palette[colorName]
            if (!color) warn('Color [%s] not found in theme palette, using it as is', colorName, el)
            el.style['background-color'] = color || colorName
        })

    })


    const updateBlock = api($ify(($el, data) => {

        const el = $el[0]
        let type = $el.attr('block') || el.nodeName.toLowerCase()

        if ('ol ul'.includes(type)) type = 'list'
        if (!type) throw ['Missing block type in [block] attribute of element:', el]

        const block = rasti.blocks[type]
        if (!block) throw ['Undefined block type "%s" declared in [block] attribute of element:', type, el]

        if (!el.initialized) {
            if (is.def(block.init) && is.not.function(block.init))
                throw ['Invalid "init" prop defined in block type "%s", must be a function', type]
            if (is.function(block.init)) try {
                block.init($el)
            }
            catch(err) {
                error('Cannot init block [%s],', type, err)
            }
            el.initialized = true
        }

        if (!data) {
            const datakey = resolveAttr($el, 'data')
            if (!datakey) return

            data = self.data[datakey]
            if (is.nil(data)) return warn('Detected non-existant data ref in data source "%s" declared in [data] attribute of element:', datakey, el)
            if (is.empty(data)) return
        }

        const deps = $el.attr('bind')
        const depValues = {}
        if (deps) deps.split(' ').forEach( prop => {
            depValues[prop] = $('[prop='+ prop +']').val()
        })

        is.function(data)
            ? data(render, depValues)
            : render(data)

        function render(data) {
            if (is.nil(data)) warn('Detected non-existant data ref when trying to render element', el)
            if (is.empty(data)) return
            else try {
                block.render(data, $el)
            } catch(err) {
                error('Cannot render block: ' + err, el)
            }
            // TODO : handle invalid data count side-effect
            /*
            if (invalidData) {
                var prop = $el.attr('prop'),
                    page = $el.closest('[page]').attr('page')
                warn('Detected %s invalid data entries for prop [%s] in page [%s]', invalidData, prop, page)
                invalidData = 0
            }
            */
        }

    }))


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

    // expose api
    Object.assign(this, {config, init, navTo, render, setLang, setTheme})

    return this


    // internal helpers

    function genTemplate(tmp_string) {
        return tmp_data => evalTemplate(
            tmp_string,
            tmp_data,
            self.data,
            self.props,
            self.methods,
            getActiveLang(),
        )
    }

    function evalTemplate(tmp_string, tmp_data, data, props, methods, lang) {
        try {
            return is.array(tmp_data)
                ? tmp_data.map(el => eval('html`'+tmp_string+'`')).join('')
                : eval('html`'+tmp_string+'`')
        } catch (err) {
            error('Error evaluating template string\n%s:', tmp_string, err.message)
        }
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
        if ( is.not.function(fx) ) throw ['fx.%s must be a function!', fxkey]
        if ( selector && is.not.string(selector) ) throw ['Cannot apply fx, invalid selector provided for el', el]
        const $target = selector ? $el.find(selector) : $el
        if (!$target.length) return warn('Cannot apply fx, cannot find target "%s" in el', target, el)
        fx($target)
    }

    function getActiveLang() {
        return self.langs && self.langs[self.active.lang]
    }

    
    function bindProps($container, state) {
        $container.children().each( el => {
            const $el = $(el)
            const prop = $el.attr('prop')
            let trans

            if (prop) {
                if ( $el.hasAttr('transient') ) trans = true
                
                if ( $el.hasAttr('template') || is.def(el.value) ) {
                    // it's an element, so bind it
                    bindElement($el, {prop, trans}, state)
                }
                else {
                    // it's a container prop, initialize value if applicable
                    state[prop] = state[prop] || {}
                    // set transient flag if applicable
                    if (trans) state[prop].__trans = true
                    // keep looking using the prop as root
                    bindProps($el, state[prop])
                }
            }
            // else keep looking
            else if (el.children.length) bindProps($el, state)
        })
    }

    function bindElement($el, {prop, trans}, state){
        if ( state[prop] ) {
            // then update dom with it
            updateElement($el, state[prop])
        }
        else {
            // create empty state
            const defstrval = new String('')
            if (trans) defstrval.__trans = true
            state[prop] = defstrval
        }

        // update state on dom change
        // (unless triggered from state _setter)
        $el.is('[template]') || $el.on('change', (e, params) => {
            if ( !(params && params._setter) )
                state[prop] = $el.is('textarea') ? $el.text()
                    : $el.is('input[type=checkbox]') ? $el[0].checked
                    : $el.is('input[type=range]') ? parseInt($el.val())
                    : $el.val()
        })

        if ( is.nil(__state[prop]) ) {
            // initialize internal register for prop
            __state[prop] = {val: null, reg: [$el]}
            // update dom on state change
            Object.defineProperty(state, prop, {
                get : function() { return __state[prop].val },
                set : function(value) {
                    if (trans) {
                        // cast primitive values to objects to allow flagging
                        const val = is.primitive(value) || is.nil(value) ? new Object(value) : value
                        val.__trans = true
                        __state[prop].val = val
                    }
                    else __state[prop].val = value
                    // update all registered elements
                    __state[prop].reg.forEach($el => updateElement($el, value, true))
                }
            })
        } else {
            // register el to prop 
            __state[prop].reg.push($el)
        }

    }

    function updateElement($el, value, _setter) {
        $el.is('[data]') ? render($el)
        : $el.is('[template]') ? render($el, value) 
        : $el.is('textarea') ? $el.text( value )
        : $el.is('[type=checkbox]') ? $el[0].checked = !!value
        : $el.val( value )

        $el.trigger('change', {_setter})
    }


    function initPages() {
        let page, $page
        for (let name in self.pages) {
            page = self.pages[name]
            if ( is.not.object(page) ) throw ['pages.%s must be an object!', name]
            $page = container.find('[page='+ name +']')
            if ( !$page.length ) throw ['No container found for page "%s". Please bind one via [page] attribute', name]
            if (page.init) {
                if ( is.not.function(page.init) ) throw ['pages.%s.init must be a function!', name]
                else {
                    log('Initializing page [%s]', name)
                    self.active.page = $page
                    page.init()
                }
            }
        }
        self.active.page = null // must clear it in case it was assigned
    }


    function initState() {
        // persist state (if applicable)
        let prev_state
        if (self.options.persist) {
            $(window).on('beforeunload', e => { self.state.save() })
            prev_state = self.state.restore()
        }
        // set theme (if not already set)
        if (!self.active.theme)
            setTheme(self.options.theme)
        // set lang (if applicable and not already set)
        if (self.options.lang && !self.active.lang)
            setLang(self.options.lang)
        // if no lang, generate texts
        if (!self.options.lang) {
            container.find('[text]').each( el => {
                $(el).text($(el).attr('text'))
            })
        }
        if (prev_state)
            navTo(prev_state.page)
        else {
            // nav to page in hash or to root or to first page container
            let page = location.hash.substring(1) || self.options.root
            !page && (page = container.find('[page]')[0]) && (page = page.getAttribute('page'))
            !page ? warn('No pages found, please create at least one page for your app')
            : navTo(page)
        }
    }


    function initNav() {
        container.on('click', '[nav]', e => {
            const el = e.currentTarget
            const $el = $(el)
            const page = $el.attr('nav')
            let params = {}
            if (!page)
                throw ['Missing page name in [nav] attribute of element:', el]
            if ($el.hasAttr('params')) {
                const $page = self.active.page
                let navparams = $el.attr('params')
                let $paramEl
                if (navparams) {
                    // check to see if params is an object
                    if (navparams[0] == '{') {
                        try {
                            params = JSON.parse(navparams)
                        }
                        catch (err) {
                            error('Invalid JSON in [params] attribute of element:', el)
                            error('Tip: be sure to use double quotes ("") for both keys and values')
                            return
                        }
                    }
                    else {
                        // get values of specified navparams
                        navparams = params.split(' ')
                        navparams.forEach(key => {
                            $paramEl = $page.find('[navparam=' + key + ']')
                            if ($paramEl.length)
                                params[key] = $paramEl.val()
                            else
                                warn('Could not find navparam element [%s]', key)
                        })
                    }
                }
                else {
                    // get values of all navparams in page
                    $page.find('[navparam]').each( el => {
                        const $el = $(el)
                        const key = resolveAttr($el, 'navparam')
                        if (key)
                            params[key] = $el.val()
                    })
                }
            }
            navTo(page, params)
        })
    }


    function initSubmit() {
        container.on('click', '[submit]', e => {
            const $el = $(e.target)
            const method = $el.attr('submit')
            const callback = $el.attr('then')
            const template = $el.attr('render')
            const isValidCB = callback && is.function(self.methods[callback])
            
            if (!method)
                throw ['Missing method in [submit] attribute of el:', this]
            
            if (callback && !isValidCB)
                error('Undefined method [%s] declared in [then] attribute of el:', callback, this)
            
            $el.addClass('loading').attr('disabled', true)
            const start = window.performance.now()
            submitAjax(method, resdata => {
                const time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)
                if (isValidCB)
                    self.methods[callback](resdata)
                if (template)
                    render(template, resdata, {time})
                $el.removeClass('loading')[0].removeAttribute('disabled')
            })
        })
    }


    function initEvents() {
        for (let action of EVENT_ATTRS) {
            container.find('[on-'+ action +']').each( el => {
                const $el = $(el)
                const methodName = $el.attr('on-' + action)
                if ( !methodName ) throw ['Missing method in [on-%s] attribute of element:', action, el]
                const method = self.methods[methodName]
                if ( !method ) throw ['Undefined method "%s" declared in [on-%s] attribute of element:', methodName, action, el]
                const $template = $el.closest('[template]')
                if ($template.length && !$el.hasAttr('template')) {
                    if (!$template[0].events) $template[0].events = []
                    const selector = `[on-${action}=${methodName}]`
                    const shouldRegister = !$template[0].events.includes(selector)
                    if (shouldRegister) {
                        $template.on(action, selector, method)
                            [0].events.push(selector)
                    }
                }
                else $el.on(action, method)
            })
        }
    }


    function initActions() {
        for (let action of ACTION_ATTRS) {
            container.find('['+ action +']').each( el => {
                const $el = $(el)
                const $page = $el.closest('[page]')
                const targetSelector = $el.attr(action)

                if ( !targetSelector ) throw ['Missing target selector in [%s] attribute of element:', action, el]
                let $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) throw ['Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el]

                const target = $target[0]

                $el.on('click', e => {
                    e.stopPropagation()
                    $target.addClass('target')
                    //container.find('[menu]:not(.target)').hide()
                    $target.removeClass('target')
                    is.function(target[action]) ? target[action]() : $target[action]()
                    const isVisible = target.style.display != 'none'
                    isVisible ? $target.focus() : $target.blur()
                })
            })
        }
    }


    function initFieldValidations() {
        container.find('button[validate]').each( btn => {
            const $fields = $(btn).parent().find('input[required]')
            btn.disabled = isAnyFieldInvalid($fields)
            $fields.each( field => {
                $(field).on('keydown', e => {
                    btn.disabled = isAnyFieldInvalid($fields)
                    if (e.key == 'Enter' && !btn.disabled) btn.click()
                })
            })
        })

        function isAnyFieldInvalid($fields) {
            let valid = true
            $fields.each( field => {
                valid = valid && field.validity.valid
            })
            return !valid
        }
    }
   

    function initModals() {
        container.find('[modal]').each( el => {
            // add close btn
            $('<div icon=close class="top right clickable" />')
                .on('click', e => {
                    $(el).hide()
                })
                .appendTo(el)
        })
    }


    function initSideMenu() {
        self.sidemenu = (el => el &&
            Object.assign(el, {
                enabled : false,
                visible : false,
                show() {
                    $(el).show()
                },
                hide() {
                    $(el).hide()
                },
                toggle() {
                    $(el).toggle()
                },
                enable() {
                    el.classList.add('enabled')
                    el.enabled = true
                },
                disable() {
                    el.classList.remove('enabled')
                    el.enabled = false
                },
                switch() {
                    el.enabled ? el.disable() : el.enable()
                },
            })
        )( container.find('[sidemenu]')[0] )

        if (self.sidemenu) {
            media.phone && self.sidemenu.enable()
            media.on.phone(self.sidemenu.switch)
        }
    }


    function createTabs(el) {
        const $el = $(el),
            $tabs = $el.children(),
            $labels = $('<div class="tab-labels">'),
            $bar = $('<div class="bar">')
        
        let $tab, label, position

        $tabs.each( (tab, i) => {
            $tab = $(tab)
            $tab.attr('tab', i)
            label = resolveAttr($tab, 'tab-label') || 'TAB ' + (i+1)

            $labels.append(`<div tab-label=${i} text="${ label }">`)
        })

        $el.addClass('tab-group')
            .before( $labels.append($bar) )

        $labels.on('click', e => {
            const $label = $(e.target),
                tabnr = $label.attr('tab-label'),
                $tab = $tabs.filter(`[tab="${ tabnr }"]`)

            $tabs.removeClass('active')
            $tab.addClass('active')
            $tab[0].scrollIntoView()

            $labels.children().removeClass('active')
            $label.addClass('active')
        })

        $el.on('scroll', e => {
            position = e.target.scrollLeft / e.target.scrollWidth
            $bar[0].style.left = position * e.target.offsetWidth +'px'
        })

        container.on('rasti-nav', e => {
            if (!isInActivePage($el)) return
            if (!$labels.children('.active').length) $labels.children().first().click()
            updateBarWidth()
        })

        window.addEventListener('resize', ev => {
            if (!isInActivePage($el)) return
            $labels.find('.active').click()
            updateBarWidth()
        })

        function updateBarWidth() {
            $bar[0].style.width = $labels.find('.active')[0].offsetWidth +'px'
        }

        function isInActivePage($el) {
            return self.active.page.find($el).length
                || self.active.page.attr('page') === $el.attr('page')
        }

    }


    function initCrud() {
        container.find('[crud][template]').each( el => {
            const $el = $(el)
            const template = resolveAttr($el, 'template')
            const datakey = resolveAttr($el, 'data')
            const crudkey = resolveAttr($el, 'crud')

            render(el)

            $el.on('click', '.rasti-crud-delete', e => {
                const $controls = $(e.currentTarget).closest('[data-id]')
                const id = $controls.attr('data-id')
                try {
                    __crud.delete({ datakey, crudkey }, id)
                        .then(ok => {
                            $controls.parent().detach()
                            log('Removed element [%s] from template [%s]', id, template)
                        }, err => {
                            __crud.hideInputEl($el)
                            $el.removeClass('active')
                        })
                }
                catch (err) {
                    rasti.error(err)
                }
            })
            .on('click', '.rasti-crud-update', e => {
                // TODO: add update logic
            })
            .on('click', '.rasti-crud-create', e => {
                __crud.showInputEl($el)
                $el.addClass('active')
            })
            .on('click', '.rasti-crud-accept', e => {
                // TODO: finish this
                let newel
                try {
                    newel = __crud.genDataEl($el)
                    __crud.create({ datakey, crudkey }, newel)
                        .then(ok => {
                            __crud.persistNewEl($el)
                            $el.removeClass('active')
                        }, err => {
                            __crud.hideInputEl($el)
                            $el.removeClass('active')
                        })
                }
                catch (err) {
                    rasti.error(err)
                }
            })
            .on('click', '.rasti-crud-cancel', e => {
                __crud.hideInputEl($el)
                $el.removeClass('active')
            })
        })
    }


    function initPager($el, template, data, lang) {
        const psizes = self.options.page_sizes
        if ( Math.ceil(data.length / psizes[0]) < 2 ) {
            // just one page, render as usual
            $el.html( template(data).join('') )
            return
        }

        const name = $el.attr('template')
        const pager = newPager(name, data, psizes)
        let columns, size=0, col=1

        if ( $el.hasAttr('columns') )
            columns = `<button icon=columns>1</button>`

        $el.html(`
            <div class="results scrolly rigid"></div>
            <div class="controls flex center small_ inline_">
                ${ columns || '' }
                <div class="paging flex center small_ inline_">
                    <button icon=left3></button>
                    <span class=page></span>
                    <button icon=right3></button>
                </div>
                <button icon=rows>${ psizes[0] }</button>
            </div>
        `)

        const $results = $el.find('.results'),
            $controls = $el.find('.controls'),
            $page = $controls.find('.page'),
            $prev = $controls.find('[icon=left3]'),
            $next = $controls.find('[icon=right3]')

        $controls
            .on('click', '[icon=right3]', e => {
                update( pager.next() )
            })
            .on('click', '[icon=left3]', e => {
                update( pager.prev() )
            })
            .on('click', '[icon=rows]', e => {
                size += 1
                var newSize = pager.sizes[size % pager.sizes.length]
                pager.setPageSize(newSize)
                $(e.target).html(newSize)
                update( pager.next() )
                pager.total > 1
                    ? $controls.find('.paging').show()
                    : $controls.find('.paging').hide()
            })
            .on('click', '[icon=columns]', e => {
                col = col+1 > 3 ? 1 : col+1
                $(e.target).html(col)
                $results.removeClass('columns-1 columns-2 columns-3')
                    .addClass('columns-' + col)
            })

        update( pager.next() )

        function update(data){
            $results.html( template(data).join('') )
                [0].scrollTo(0,0)
            $page.html(pager.page + '/' + pager.total)
            $prev[0].disabled = !pager.hasPrev()
            $next[0].disabled = !pager.hasNext()
            applyFX($el, '.results')
        }
    }

    function getPager(id) {
        let pager = __pagers.get(id)
        if (!pager) error('No pager found for template [%s]', id)
        return pager
    }
    function newPager(id, results, page_size) {
        let pager = new Pager(id, results, page_size)
        __pagers.set(id, pager)
        return pager
    }
    function deletePager(pager) {
        if (!pager || !pager.id) return
        __pagers.delete(pager.id)
    }


    function submitAjax(method, callback) {
        var ajax = self.methods[ method ]
        if ( is.not.function(ajax) ) throw ['Ajax method ['+ method +'] is not defined']

        var $form = container.find('[ajax='+ method +']')
        if (!$form.length) throw ['No container element bound to ajax method [%s]. Please bind one via [ajax] attribute', method]

        var reqdata = {}, prop
        $form.find('[prop]:not([private])').each( el => {
            $el = $(el)
            prop = $el.attr('prop')
            if (prop) {
                reqdata[prop] = $el.val() || $el.attr('value')
            }
        })

        ajax(reqdata, callback)
    }


    function getThemeStyle(values) {
        var ns = `[rasti=${ __name }]`
        return `
            ${ns} {
                font: ${ values.font };
                color: ${ values.text[0] };
                background-color: ${ values.page[0] };
            }
            ${ns} nav       { background-color: ${ values.page[1] }; }
            ${ns} [page]    { background-color: ${ values.page[0] }; }
            ${ns} [panel]   { background-color: ${ values.panel[0] }; }
            ${ns} [section] { background-color: ${ values.section[0] }; }

            ${ns} [page][header]:before,
            ${ns} [page][footer]:after     { background-color: ${ values.page[1] }; }
            ${ns} [panel][header]:before   { background-color: ${ values.panel[1] }; }
            ${ns} [section][header]:before { background-color: ${ values.section[1] }; }

            ${ns} .tab-labels { background-color: ${ values.panel[0] }; }

            ${ns} input:not([type]),
            ${ns} input[type=text],
            ${ns} input[type=password],
            ${ns} input[type=email],
            ${ns} input[type=tel],
            ${ns} select,
            ${ns} textarea,
            ${ns} .field {
                background-color: ${ values.field[0] };
                color: ${ values.field[1] };
            }
            ${ns} input[type=radio],
            ${ns} input[type=checkbox] {
                border: 1px solid ${ values.field[1] };
            }

            ${ns} button,
            ${ns} nav > div.active,
            ${ns} nav > a.active,
            ${ns} [block=buttons] > div.active {
                color: ${ values.btn[1] };
            }
            ${ns} [block=buttons] > div {
                border: 1px solid ${ values.field[1] };
            }
            
            ${ns} [header]:before { color: ${ values.header[0] }; }
            ${ns} [label]:not([header]):before  { color: ${ values.label[0] }; }
        `
    }


    function getString(lang, key) {
        if ( is.not.object(self.langs[lang]) ) {
            error('Lang [%s] is not defined', lang)
            return
        }
        var string = self.langs[lang][key]
        if ( is.not.string(string) ) warn('Lang [%s] does not contain key [%s]', lang, key)
        else return string
    }


    function setMedia(breakpoints) {
        const err = 'Cannot create media matcher: '
        if (is.not.object(breakpoints) || is.empty(breakpoints)) throw err + `no media breakpoints supplied`
        media = {on:{}}
        const queries = {}
        for (let device in breakpoints) {
            const bp = breakpoints[device]
            if (is.not.number(bp)) throw err + `invalid breakpoint declared for device "${device}", must be a number`
            queries[device] = window.matchMedia(`(max-width: ${ bp }px)`)
            Object.defineProperty(media, device, {
                get: () => queries[device].matches
            })
            media.on[device] = handler => queries[device].addListener(handler)
            /** 
             * TODO sync up js and css
             *
             * Ideally I would like to set css environment vars (one per device/bp)
             * and read them via env() function in the media query declarations,
             * but css environment vars are still not fully standardized
             * ( env() is ready, but there is still no definition on how to set the env vars,
             *  see issue #2 in https://drafts.csswg.org/css-env-1/#issues-index )
             * 
             * So I guess for now the most convenient workaround would be to
             * change the media queries declarations via DOM manipulation
             * (it's rasti's way anyways :P).
             *
             * Steps would be:
             * 1. Figure a way to identify each mq declaration, and then for each:
             * 2. Parse the mq declaration string identifying the breakpoint values
             * 3. Create a new string replacing the breakpoint values
             * 4. Replace the mq declaration string with the new one
             * 5. Let the browser do its magic
             * 
             */

        }
        self.media = media
    }


    function toggleFoldable() {
        return e => {
            const el = e.target
            if (!el.hasAttribute('foldable'))
                return
            const isOpen = el.clientHeight > 35 // NOTE this must be kept in sync with the css!
            document.body.style.setProperty("--elem-h", el._height)
            if (isOpen) {
                el.classList.remove('open')
                el.classList.add('folded')
            }
            else {
                el.classList.remove('folded')
                el.classList.add('open')
            }
        }
    }


    function hideDialogs(e) {
        if (e.key && e.key !== 'Escape') return
        container.find('[menu].open').hide()
        container.find('[modal].open').hide()
        if (self.sidemenu && self.sidemenu.visible) self.sidemenu.hide()
    }


    function fixLabel($el) {
        const label = resolveAttr($el, 'label')
        $el.wrap( $(`<div fixed label="${ label }" >`) )
        $el[0].removeAttribute('label')
    }


    function fixIcon($el) {
        const $parent = $el.parent()
        if ($parent.hasAttr('fixed')) {
            $parent.attr(icon, $el.attr('icon')).addClass('floating')
        }
        else {
            $el.wrap( $(`<div fixed icon=${ $el.attr('icon') } class=floating >`) )
        }
        $el[0].removeAttribute('icon')
    }

}


// static properties and methods

rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils.public
rasti.blocks = require('./js/blocks/all')
rasti.icons = require('./js/icons')
rasti.fx = require('./js/fx')
rasti.options = {log : 'debug'}

module.exports = global.rasti = Object.freeze(rasti)


/*
 * instantiates any apps declared via [rasti] attribute
 */
function bootstrap() {
    const appContainers = $(document).find('[rasti]')
    let appName, app

    appContainers.each( container => {
        const $container = $(container)
        appName = $container.attr('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', container)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, container)
        else {
            global[appName] = app = new rasti(appName, container)
            Object.keys(app.options).forEach( key => {
                if ($container.hasAttr(key)) {
                    value = $container.attr(key)
                    if (is.nil(value)) {
                        // non-value boolean attributes are true
                        if (is.boolean(app.options[key])) app.options[key] = true
                        else warn('Detected empty init option [%s], please provide a value for it', key)
                    }
                    else app.options[key] = value
                }
            })
            // load any declared sources
            var sources = $container.attr('src')
            if (sources) {
                log('Loading sources for app [%s]...', appName)
                utils.inject(sources)
            }
            if ($container.hasAttr('init')) app.init()
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
    return styles.join('')
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
    styles = styles.concat( genIconFixesStyles() )
    styles.push('</style>')
    return styles.join('')
}


function genIconFixesStyles() {
    const fixes = [
        [`=filter =error =sync =reload =remove =restore =stereo =img-file
            =latin2 =celtic =ankh =comunism =health ^=hg-`,
            { base: '2', small: '1.5', big: '3', huge: '4.4' } ],
        [`=close =network =pommee =diamonds`,
            { base: '2.5', small: '1.8', big: '3.3', huge: '4.9' } ],
    ]
    
    const result = []
    let temp, mod
    fixes.forEach(([selectors, sizes]) => {
        Object.entries(sizes).forEach(([modifier, size]) => {
            mod = modifier == 'base' ? null : modifier
            temp = selectors.split(/[\s\n]+/)
                .map(sel =>
                    mod ? `.${mod}[icon${sel}]:before,
                        .${mod}_>[icon${sel}]:before`
                    : `[icon${sel}]:before`
                ).join(',')
            temp += `{ font-size: ${size}rem; }`
            result.push(temp)
        })
    })
    return result
}


$('head').prepend( genBlockStyles() + `<style>rasti.css</style>` + genIconStyles() )

bootstrap()
