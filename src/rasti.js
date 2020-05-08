require('./extensions')
const { History, Pager, state, crud } = require('./components')
const utils = require('./utils')
const { is, sameType, exists, resolveAttr, html } = utils
const { themes, themeMaps } = require('./themes')
let media

const options = {
    history : true,
    persist : true,
    root    : '',
    theme   : 'base',
    lang    : '',
    separator : ';',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
    newEl   : 'New element',
    imgPath : 'img/',
    imgExt  : '.png',
    page_sizes : [5, 10, 20, 50],
    media   : {
        phone : 500,
        tablet : 800,
    },
}

const TEXT_ATTRS = 'label header text placeholder'.split(' ')
const EVENT_ATTRS = 'click change hover input keydown submit load'.split(' ')
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
    if ( !is.string(name) ) return error(errPrefix + 'app must have a name!')
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

    this.options = Object.assign({}, options)
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


    // public methods

    this.config = config
    this.init = init
    this.navTo = navTo
    this.render = render
    this.setLang = setLang
    this.setTheme = setTheme
    this.updateBlock = updateBlock
    this.toggleFullScreen = toggleFullScreen


    function config(props) {
        if (!props || !is.object(props)) return error('Cannot configure app [%s]: no properties found', __name)
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
                    if (key == 'methods' && !is.function(value))
                        warn('Invalid method [%s], must be a function', name)
                    else
                        self[key][name] = is.function(value) ? value.bind(self) : value
                }
            }
            else Object.assign(self[key], props[key])
        }
        return self
    }


    function init(options) {
        const initStart = window.performance.now()
        log('Initializing app [%s]...', __name)

        container
            .addClass('big loading backdrop')
            .removeAttr('hidden')

        // cache options
        if (options) {
            if ( !is.object(options) ) warn('Init options must be an object!')
            else Object.keys(self.options).forEach( key => {
                if ( exists(options[key]) ) {
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
        container.find('[page]').each( (i, el) => {
            $(el).append('<div class="page-options">')
        })


        // fix labels
        NOCHILD_TAGS.forEach( tag => {
            container.find(tag + '[label]').each( (i, el) => {
                fixLabel($(el))
            })
        })


        // fix input icons
        container.find('input[icon]').each( (i, el) => {
            fixIcon($(el))
        })


        // init blocks
        container.find('[data]:not([template])').each( (i, el) => {
            updateBlock($(el))
        })


        initSideMenu()


        initModals()
        
        
        // init tabs
        function initTabs(selector) {
            container.find(selector).each( (i, el) => { createTabs(el) })
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
            if (!template) return error('Missing template name in [render] attribute of element:', el)
            render(template)
        })


        // init element dependencies
        container.find('[bind]').each( (i, el) => {
            const $el = $(el)
            const deps = $el.attr('bind')
            if (deps) deps.split(' ').forEach( dep => {
                $el.closest('[page]').find('[prop='+ dep +']')
                    .change( e => { updateBlock($el) })
            })
        })


        initPages()


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

        
        bindProps(container, self.props)

        
        initState()


        // render data templates
        container.find('[data][template]').each( (i, el) => {
            render(el)
        })


        // init prop-bound templates
        container.find('[prop][template]').each( (i, el) => {
            const $el = $(el)
            const prop = $el.attr('prop')
            bindElement($el, {prop}, self.props)
        })


        // init crud templates
        initCrud()

        
        initEvents()


        initActions()


        initFieldValidations()


        // init movable elements
        container.find('[movable]').each( (i, el) => {
            $(el).move()
        })


        // cache height of foldable elements
        container.find('[foldable]').add('[menu]').each( (i, el) => {
            el.orig_h = el.clientHeight + 'px'
        })


        container
            .on('click', '[foldable]', e => {
                const el = e.target
                if (!el.hasAttribute('foldable')) return
                const isOpen = el.clientHeight > 30
                document.body.style.setProperty("--elem-h", el.orig_h)
                if (isOpen) {
                    el.classList.remove('open')
                    el.classList.add('folded')
                }
                else {
                    el.classList.remove('folded')
                    el.classList.add('open')
                }
            })
            .on('click', '.backdrop', e => {
                container.find('[menu].open').hide()
                container.find('[modal].open').hide()
                if (self.sidemenu && self.sidemenu.visible) self.sidemenu.hide()
            })
            .removeClass('big loading backdrop')

        const initTime = Math.floor(window.performance.now() - initStart) / 1000
        log('App [%s] initialized in %ss', __name, initTime)

        return self
    }


    function navTo(pagename, params = {}, skipPushState) {

        if (!pagename) return error('Cannot navigate, page undefined')

        var $prevPage = self.active.page,
            prevPagename = $prevPage && $prevPage.attr('page'),
            prevPage = prevPagename && self.pages[prevPagename]

        if (pagename == prevPagename) return

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) return error('Cannot navigate to page [%s]: page container not found', pagename)

        container.find('[menu]').hide()
        container.find('.rs-backdrop').removeClass('backdrop')

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

        $page.hasClass('hide-nav')
            ? container.find('nav').hide()
            : container.find('nav').show()

        $page.addClass('active')

        container
            .find('nav [nav]').removeClass('active')
            .filter('[nav='+ pagename +']').addClass('active')

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

        return self
    }


    function render(el, data, time) {
        let $el, name
        let errPrefix = 'Cannot render template'
        if ( is.string(el) ) {
            name = el
            errPrefix += ' ['+ name +']: '
            $el = container.find('[template='+ name +']')
            if (!$el.length) return error(errPrefix + 'no element bound to template. Please bind one via [template] attribute.')
        }
        else {
            $el = el.nodeName ? $(el) : el
            name = $el.attr('template')
            if (!name) {
                // assign hashed name
                name = ($el.attr('data') || $el.attr('prop')) + '-' + Date.now()
                $el.attr('template', name)
            }
        }
        
        if ( !data && $el.hasAttr('data') ) {
            const datakey = resolveAttr($el, 'data')
            data = self.data[datakey]
            if (!data) return error(errPrefix + 'undefined data source "%s" resolved for element:', datakey, el)
        }
        if ( is.string(data) ) data = data.split( $el.attr('separator') || self.options.separator )
        if ( !is.array(data) ) data = [data]

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
            return error(errPrefix + 'parsing error: ' + err)
        }
        if ( !is.function(template) ) return error(errPrefix + 'template must be a string or a function')

        if ( data && !data.length ) return $el.html(`<div class="nodata">${ self.options.noData }</div>`).addClass('rendered')

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
            : $el.html( template(data) )[0].scrollTo(0,0)

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

        $el.addClass('rendered')
        if (!isPaged) applyFX($el)

        return self
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

        Object.keys(self.defaults).forEach( key => {
            self.options[key] = lang['rasti_'+key] || self.defaults[key]
        })

        return self
    }


    function setTheme(themeString) {
        if (!themeString) return warn('Call to setTheme() with no argument')

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
        themeMap = {...themeMap}

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
        container.find('.rs-theme').html( getThemeStyle(values) )

        // apply bg colors
        var colorName, color
        container.find('[bg]').each( (i, el) => {
            colorName = el.getAttribute('bg')
            color = theme.palette[colorName] || baseTheme.palette[colorName]
            if (!color) warn('Color [%s] not found in theme palette, using it as is', colorName, el)
            el.style['background-color'] = color || colorName
        })

        return self
    }


    function updateBlock($el, data) {
        const el = $el[0]
        let type = $el.attr('block') || el.nodeName.toLowerCase()
        if ('ol ul'.includes(type)) type = 'list'
        if (!type) return error('Missing block type in [block] attribute of element:', el)

        const block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        if (!el.initialized) {
            if (exists(block.init) && !is.function(block.init))
                return error('Invalid "init" prop defined in block type "%s", must be a function', type)
            if (is.function(block.init))
                block.init($el)
            el.initialized = true
        }

        if (!data) {
            const datakey = resolveAttr($el, 'data')
            if (!datakey) return

            data = self.data[datakey]
            if (!exists(data)) return warn('Detected non-existant data ref in data source "%s" declared in [data] attribute of element:', datakey, el)
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
            if (!exists(data)) warn('Detected non-existant data ref when trying to render element', el)
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

        return self
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
        return self
    }


    // internal utils

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
            return tmp_data
                ? tmp_data.map(el => eval('html`'+tmp_string+'`'))
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
        if ( !is.function(fx) ) return error('fx.%s must be a function!', fxkey)
        if ( selector && !is.string(selector) ) return error('Cannot apply fx, invalid selector provided for el', el)
        const $target = selector ? $el.find(selector) : $el
        if (!$target.length) return warn('Cannot apply fx, cannot find target "%s" in el', target, el)
        fx($target)
    }

    function getActiveLang() {
        return self.langs && self.langs[self.active.lang]
    }

    
    function bindProps($container, state) {
        $container.children().each( (i, el) => {
            const $el = $(el)
            const prop = $el.attr('prop')
            let trans

            if (prop && !$el.hasAttr('template')) {
                if ( $el.hasAttr('transient') ) trans = true
                
                if ( exists(el.value) ) {
                    // it's an element, so bind it
                    bindElement($el, {prop, trans}, state)
                }
                else {
                    // it's a container prop
                    const defobjval = {}
                    if (trans) defobjval.__trans = true
                    // go down one level in the state tree
                    state[prop] = state[prop] || defobjval
                    const newroot = state[prop]
                    // and keep looking
                    bindProps($el, newroot)
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
        $el.on('change', (e, params) => {
            if ( !(params && params._setter) )
                state[prop] = $el.is('[type=checkbox]') ? $el[0].checked : $el.val()
        })

        // update dom on state change
        Object.defineProperty(state, prop, {
            get : function() { return __state[prop] },
            set : function(value) {
                if (trans) {
                    const val = is.string(value) ? new String(value) : value
                    val.__trans = true
                    __state[prop] = val
                }
                else __state[prop] = value
                updateElement($el, value, true)
            }
        })

    }

    function updateElement($el, value, _setter) {
        if ( $el.is('[template]') )
            render($el, value)
        else {
            $el.is('textarea')
                ? $el.text( value )
            : $el.is('[type=checkbox]')
                ? $el[0].checked = !!value
            : $el.val( value )

            $el.trigger('change', {_setter})
        }
    }


    function initPages() {
        let page, $page
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
            container.find('[text]').each((i, el) => {
                $(el).text($(el).attr('text'))
            })
        }
        if (prev_state)
            navTo(prev_state.page)
        else {
            // nav to page in hash or to root or to first page container
            const page = location.hash.substring(1) || self.options.root
            navTo(page && self.pages[page]
                ? page
                : container.find('[page]').first().attr('page'))
        }
    }


    function initNav() {
        container.on('click', '[nav]', e => {
            const el = e.currentTarget
            const $el = $(el)
            const page = $el.attr('nav')
            let params = {}
            if (!page)
                return error('Missing page name in [nav] attribute of element:', el)
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
                    $page.find('[navparam]').each((i, el) => {
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
            const start = window.performance.now()
            if (!method)
                return error('Missing method in [submit] attribute of el:', this)
            if (callback && !isValidCB)
                error('Undefined method [%s] declared in [then] attribute of el:', callback, this)
            $el.addClass('loading').attr('disabled', true)
            submitAjax(method, resdata => {
                const time = Math.floor(window.performance.now() - start) / 1000
                log('Ajax method [%s] took %s seconds', method, time)
                if (isValidCB)
                    self.methods[callback](resdata)
                if (template)
                    render(template, resdata, time)
                $el.removeClass('loading').removeAttr('disabled')
            })
        })
    }


    function initEvents() {
        for (let action of EVENT_ATTRS) {
            container.find('[on-'+ action +']').each( (i, el) => {
                const $el = $(el)
                const methodName = $el.attr('on-' + action)
                if ( !methodName ) return error('Missing method in [on-%s] attribute of element:', action, el)
                const method = self.methods[methodName]
                if ( !method ) return error('Undefined method "%s" declared in [on-%s] attribute of element:', methodName, action, el)
                const $template = $el.closest('[template]')
                $template.length && !$el.hasAttr('template')
                    ? $template.on(action, `[on-${action}=${methodName}]`, method)
                    : $el.on(action, method)
                if (action == 'click') $el.addClass('clickable')
            })
        }
    }


    function initActions() {
        for (let action of ACTION_ATTRS) {
            container.find('['+ action +']').each( (i, el) => {
                const $el = $(el)
                const $page = $el.closest('[page]')
                const targetSelector = $el.attr(action)

                if ( !targetSelector ) return error('Missing target selector in [%s] attribute of element:', action, el)
                let $target = $page.find('['+targetSelector+']')
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)

                const target = $target[0]

                $el.on('click', e => {
                    e.stopPropagation()
                    $target.addClass('target')
                    container.find('[menu]:not(.target)').hide()
                    $target.removeClass('target')
                    is.function(target[action]) ? target[action]() : $target[action]()
                    const isVisible = target.style.display != 'none'
                    isVisible ? $target.focus() : $target.blur()
                })
            })
        }
    }


    function initFieldValidations() {
        container.find('button[validate]').each( (i, btn) => {
            const $fields = $(btn).parent().find('input[required]')
            btn.disabled = isAnyFieldInvalid($fields)
            $fields.each( (i, field) => {
                $(field).on('keydown', e => {
                    btn.disabled = isAnyFieldInvalid($fields)
                    if (e.key == 'Enter' && !btn.disabled) btn.click()
                })
            })
        })

        function isAnyFieldInvalid($fields) {
            let valid = true
            $fields.each( (i, field) => {
                valid = valid && field.validity.valid
                return valid
            })
            return !valid
        }
    }
   

    function initModals() {
        container.find('[modal]').each((i, el) => {
            // add close btn
            $('<div icon=close class="top right clickable" />')
                .on('click', e => {
                    $(el).hide()
                })
                .appendTo(el)
        })
    }


    function initSideMenu() {
        self.sidemenu = (function (el) {
            
            if (!el) return

            el.enabled = false
            el.visible = false

            el.show = () => {
                if (!el.enabled) return
                $(el).show()
                el.visible = true
            }
            el.hide = () => {
                if (!el.enabled) return
                $(el).hide()
                el.visible = false
            }
            el.toggle = () => {
                if (!el.enabled) return
                el.visible ? el.hide() : el.show()
            }

            el.enable = () => {
                el.classList.add('enabled')
                el.enabled = true
            }
            el.disable = () => {
                el.classList.remove('enabled')
                el.enabled = false
            }
            el.switch = () => {
                el.enabled ? el.disable() : el.enable()
            }

            return el

        })( container.find('[sidemenu]')[0] )

        if (self.sidemenu) {
            if (media.phone) self.sidemenu.enable()
            media.on.phone(() => { self.sidemenu.switch() })
        }
    }


    function createTabs(el) {
        var $el = $(el),
            $tabs = $el.hasAttr('page')
                ? $el.children('[panel]:not([modal])')
                : $el.hasAttr('panel')
                    ? $el.children('[section]:not([modal])')
                    : undefined
        if (!$tabs) return error('Cannot create tabs: container must be a [page] or a [panel]', el)

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
            position = e.target.scrollLeft / e.target.scrollWidth
            $bar.css({ left : position * e.target.offsetWidth })
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


    function initCrud() {
        container.find('[crud][template]').each((i, el) => {
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
            $el.on('click', '.rasti-crud-update', e => {
                // TODO: add update logic
            })
            $el.on('click', '.rasti-crud-create', e => {
                __crud.showInputEl($el)
                $el.addClass('active')
            })
            $el.on('click', '.rasti-crud-accept', e => {
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
            $el.on('click', '.rasti-crud-cancel', e => {
                __crud.hideInputEl($el)
                $el.removeClass('active')
            })
        })
    }


    function initPager($el, template, data, lang) {
        const name = $el.attr('template'),
            pager = newPager(name, data, self.options.page_sizes)
        let paging, sizes, columns, size=0, col=1

        if (pager.total > 1) {
            paging = `<div class="paging fcenter small_ inline_">
                <button icon=left3 />
                <span class=page />
                <button icon=right3 />
            </div>`

            sizes = `<button icon=rows>${ self.options.page_sizes[0] }</button>`
        }

        if ( $el.hasAttr('columns') )
            columns = `<button icon=columns>1</button>`

        $el.html(`
            <div class="results scrolly rigid"></div>
            <div class="controls fcenter small_ inline_">
                ${ columns || '' }
                ${ paging || '' }
                ${ sizes || '' }
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
        if ( !is.function(ajax) ) return error('Ajax method ['+ method +'] is not defined')

        var $form = container.find('[ajax='+ method +']')
        if (!$form.length) return error('No container element bound to ajax method [%s]. Please bind one via [ajax] attribute', method)

        var reqdata = {}, prop
        $form.find('[prop]:not([private])').each( (i, el) => {
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

            ${ns} .tab-labels        { background-color: ${ values.panel[0] }; }
            ${ns} .tab-labels > .bar { background-color: ${ values.btn[0] }; }

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
            ${ns} input[type=radio]:checked,
            ${ns} input[type=checkbox]:checked {
                background-color: ${ values.btn[0] };
            }

            ${ns} button,
            ${ns} [block=buttons] > div.active,
            ${ns} nav > div.active,
            ${ns} nav > a.active,
            ${ns} .list > div.active {
                background-color: ${ values.btn[0] };
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
        if ( !is.object(self.langs[lang]) ) {
            error('Lang [%s] is not defined', lang)
            return
        }
        var string = self.langs[lang][key]
        if ( !is.string(string) ) warn('Lang [%s] does not contain key [%s]', lang, key)
        else return string
    }


    function setMedia(breakpoints) {
        const err = 'Cannot create media matcher: '
        if (!is.object(breakpoints) || is.empty(breakpoints)) throw err + `no media breakpoints supplied`
        media = {on:{}}
        const queries = {}
        for (let device in breakpoints) {
            const bp = breakpoints[device]
            if (!is.number(bp)) throw err + `invalid breakpoint declared for device "${device}", must be a number`
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


    return this

}


// static properties and methods

rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils.public
rasti.blocks = require('./blocks/all')
rasti.icons = require('./icons')
rasti.fx = require('./fx')
rasti.options = {log : 'debug'}

module.exports = global.rasti = Object.freeze(rasti)



/*
 * instantiates any apps declared via [rasti] attribute
 */
function bootstrap() {
    const appContainers = $(document).find('[rasti]')
    let appName, app

    appContainers.forEach( container => {
        appName = container.getAttribute('rasti')
        if (!appName) error('Missing app name in [rasti] attribute of app container:', container)
        else if (global[appName]) error('Name [%s] already taken, please choose another name for app in container:', appName, container)
        else {
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
        [`=error =sync =reload =remove =restore =stereo =img-file
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
