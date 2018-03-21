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


$('head').prepend(`<style>rasti.css</style>`)

genBlockStyles()

genIconStyles()

bootstrap()
