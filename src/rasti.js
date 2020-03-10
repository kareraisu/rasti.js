require('./extensions')
const { History, Pager, state, crud } = require('./components')
const utils = require('./utils')
const { is, sameType, exists, resolveAttr, html } = utils
const { themes, themeMaps } = require('./themes')

const options = {
    history : false,
    root    : '',
    theme   : 'base',
    lang    : '',
    stats   : '%n results in %t seconds',
    noData  : 'No data available',
    newEl   : 'New element',
    imgPath : 'img/',
    imgExt  : '.png',
    page_sizes : [5, 10, 20, 50],
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
    if (rasti.options.log.search(/debug/i) > -1) console.log.call(this, ...params)
}
const warn = (...params) => {
    if (rasti.options.log.search(/(warn)|(debug)/i) > -1) console.warn.call(this, ...params)
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
        if ( is.string(container) || (container.tagName && 'BODY DIV'.search(container.tagName) > -1) ) container = $(container)
        else return error(errPrefix + 'app container is invalid. Please provide a selector string, a jQuery object ref or a DOM element ref')
    }
    container.attr('rasti', this.name)

    const self = this


    // private properties

    const __pagers = new Map()
    const __crud = crud(this)
    const __state = {}
    let __history
    let __invalid_data_count = 0


    // public properties

    this.options = Object.assign({}, options)
    this.defaults = {
        stats : this.options.stats,
        noData : this.options.noData,
    }
    this.active = {
        page  : null,
        theme : '',
        lang  : '',
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


    // public methods

    this.extend = extend
    this.init = init
    this.navTo = navTo
    this.render = render
    this.setLang = setLang
    this.setTheme = setTheme
    this.updateBlock = updateBlock
    this.toggleFullScreen = toggleFullScreen



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


        // init "incognito" blocks
        container.find('[data]').not('[block]')
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


        // TODO: add modal closure via ESC key


        // init nav
        container.find('[nav]').on('click', e => {
            const el = e.currentTarget
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


        // init element dependencies
        container.find('[bind]').each( (i, el) => {
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
                    e.stopPropagation()
                    $target.addClass('target')
                    container.find('[menu]:not(.target)').hide()
                    $target.removeClass('target')
                    const target = $target[0]
                    if (target.hasAttribute('modal') || $target.hasClass('modal'))
                        $page.find('.page-options').toggleClass('backdrop')
                    $target[action]()
                    target.style.display != 'none'
                        ? $target.focus()
                        : $target.blur()
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


        // fix input icons
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


        // restore and save state
        $(window).on('beforeunload', e => { self.state.save() })
        const prev_state = self.state.restore()
        // set theme (if not already set)
        if ( !self.active.theme ) setTheme(self.options.theme)
        // set lang (if applicable and not already set)
        if ( self.options.lang && !self.active.lang ) setLang(self.options.lang)
        // if no lang, generate texts
        if ( !self.options.lang ) {
            container.find('[text]').each( (i, el) => {
                $(el).text( $(el).attr('text') )
            })
        }
        if (prev_state) navTo(prev_state.page)
        else {
            // nav to page in hash or to root or to first page container
            const page = location.hash.substring(1) || self.options.root
            navTo(
                page && self.pages[page]
                ? page
                : container.find('[page]').first().attr('page')
            )
        }


        // init props
        findProps(container, self.props)


        // init field validations
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


        // render automatic templates
        container.find('[auto][template]').each( (i, el) => {
            render(el)
        })


        // init prop-bound templates
        container.find('[prop][template]').each( (i, el) => {
            const $el = $(el)
            bindElement($el, $el.attr('prop'), self.props)
        })


        // init crud templates
        container.find('[crud][template]').each( (i, el) => {
            const $el = $(el)
            const template = resolveAttr($el, 'template')
            const datakey = resolveAttr($el, 'data')
            const crudkey = resolveAttr($el, 'crud')

            render(el)

            $el.on('click', '.rasti-crud-delete', e => {
                const $controls = $(e.currentTarget).closest('[data-id]')
                const id = $controls.attr('data-id')
                try {
                    __crud.delete({datakey, crudkey}, id)
                        .then(
                            ok => {
                                $controls.parent().detach()
                                log('Removed element [%s] from template [%s]', id, template)
                            },
                            err => {
                                __crud.hideInputEl($el)
                                $el.removeClass('active')
                            }
                        )
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
                    __crud.create({datakey, crudkey}, newel)
                        .then(
                            ok => {
                                __crud.persistNewEl($el)
                                $el.removeClass('active')
                            },
                            err => {
                                __crud.hideInputEl($el)
                                $el.removeClass('active')
                            }
                        )
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


        // init movable elements
        container.find('[movable]').each( (i, el) => {
            $(el).move()
        })


        // init foldable elements (must have a header)
        container.find('[foldable][header]').on('click', e => {
            e.target.classList.toggle('folded')
        })


        container
            .on('click', e => {
                container.find('[menu]').hide()
            })
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


    function findProps($container, state) {
        $container.children().each( (i, el) => {
            const $el = $(el)
            const prop = $el.attr('prop')

            if (prop && !$el.hasAttr('template')) {
                if ( $el.hasAttr('transient') ) prop.__trans = true
                
                if ( exists(el.value) ) {
                    // it's an element, so bind it
                    bindElement($el, prop, state)
                }
                else {
                    // it's a container prop
                    const defobjval = {}
                    if (prop.__trans) defobjval.__trans = true
                    // go down one level in the state tree
                    state[prop] = state[prop] || defobjval
                    const newroot = state[prop]
                    // and keep looking
                    findProps($el, newroot)
                }
            }
            // else keep looking
            else if (el.children.length) findProps($el, state)
        })
    }


    function bindElement($el, prop, state){
        if ( state[prop] ) {
            // restored state present, restore transient flag
            if (prop.__trans) state[prop].__trans = true
            // then update dom with it
            updateElement($el, state[prop])
        }
        else {
            // create empty state
            const defstrval = ''
            defstrval.__trans = prop.__trans
            state[prop] = defstrval
        }

        // update state on dom change
        $el.on('change', (e, params) => {
            // unless triggered from setter
            if (!params || !params.setter)
                state[prop] = $el.val()
        })

        // update dom on state change
        Object.defineProperty(state, prop, {
            get : function() { return __state[prop] },
            set : function(value) {
                __state[prop] = value
                if (prop.__trans) __state[prop].__trans = true
                updateElement($el, value, true)
            }
        })

    }

    function updateElement($el, value, setter) {
        $el.hasAttr('template')
            ? render($el, value)
            : $el[0].nodeName == 'TEXTAREA'
                ? $el.text( value ).trigger('change', {setter})
                : $el.val( value ).trigger('change', {setter})
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

        $page.hasClass('hide-nav')
            ? $('nav').hide()
            : $('nav').show()

        $page.addClass('active')

        container
            .find('nav [nav]').removeClass('active')
            .filter('[nav='+ pagename +']').addClass('active')

        container.trigger('rasti-nav')

        if (skipPushState) return

        if (self.options.history) {
            __history.push(pagename)
        }
        else if (page && page.url) {
            !is.string(page.url)
                ? warn('Page [%s] {url} property must be a string!', pagename)
                : window.history.pushState(pagename, null, '#'+page.url)
        }
        else {
            window.history.pushState(pagename, null)
        }
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
            if (!name) {
                // generate one from bound prop and assign it
                name = $el.attr('prop') + '-' + Date.now()
                $el.attr('template', name)
            }
        }
        const errPrefix = 'Cannot render template ['+ name +']: '
        if (!$el.length) return error(errPrefix + 'no element bound to template. Please bind one via [template] attribute.')

        if (!data) {
            const datakey = resolveAttr($el, 'data')
            if (!datakey) return error(errPrefix + 'no data found for template. Please provide in ajax response or via [data] attribute in element:', el)
            data = self.data[datakey]
            if (!data) return error(errPrefix + 'undefined data source "%s" resolved for element:', datakey, el)
        }
        if ( is.string(data) ) data = data.split(', ')
        if ( !is.array(data) ) return error(errPrefix + 'invalid data provided, must be a string or an array')

        let template = self.templates[name]
        let html
        if ( !template || is.string(template) ) try {
            html = template || $el.html()
            html = html.trim()
            template = genTemplate(html)
            template.html = html
            self.templates[name] = template
        }
        catch(err) {
            return error(errPrefix + 'parsing error: ' + err)
        }
        if ( !is.function(template) ) return error(errPrefix + 'template must be a string or a function')

        if (!data.length) return $el.html(`<div class="nodata">${ self.options.noData }</div>`).addClass('rendered')

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
            : $el.html( template(data).join('') )

        if ( $el.hasAttr('stats') ) {
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
            __crud.genInputEl($el)
        }

        $el.addClass('rendered')
        if (!isPaged) applyFX($el)

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
            if (!color) warn('Color [%s] not found in theme palette, using it as is', colorName, el)
            el.style['background-color'] = color || colorName
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
    }


    function updateBlock($el, data) {
        var el = $el[0]
        var type = $el.attr('block') || el.nodeName.toLowerCase()
        if ('ol ul'.includes(type)) type = 'list'
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

        var deps = $el.attr('bind')
        var depValues = {}
        if (deps) deps.split(' ').forEach( prop => {
            depValues[prop] = $('[prop='+ prop +']').val()
        })

        is.function(data)
            ? data(render, depValues)
            : render(data)

        function render(data) {
            if (!data) warn('Cannot render block: no data available', el)
            else try {
                $options.html( block.template(data, $el) )
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


    function initBlock($el) {
        var el = $el[0]
        var type = $el.attr('block') || el.nodeName.toLowerCase()
        if (!type) return error('Missing block type in [block] attribute of element:', el)

        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        if (!is.function(block.init)) return error('Invalid or missing init function in block type "%s" declared in [block] attribute of element:', type, el)

        block.init($el)

        // if applicable, create options from data source
        if ( resolveAttr($el, 'data') ) updateBlock($el)
    }


    function initHistory() {
        __history = new History(self)
    }


    function initPager($el, template, data, lang) {
        const name = $el.attr('template'),
            pager = newPager(name, data, self.options.page_sizes)
        let paging, sizes, columns, size=0, col=1

        if (pager.total > 1) {
            paging = `<div class="paging inline inline_">
                <button icon=left3 />
                <span class=page />
                <button icon=right3 />
            </div>`

            sizes = `<button icon=rows>${ self.options.page_sizes[0] }</button>`
        }

        if ( $el.hasAttr('columns') )
            columns = `<button icon=columns>1</button>`

        $el.html(`
            <div class="results scrolly"></div>
            <div class="controls centerx bottom inline_">
                ${ columns || '' }
                ${ paging || '' }
                ${ sizes || '' }
            </div>
        `)

        $controls = $el.children('.controls')
        $results = $el.children('.results')

        $controls.on('click', '[icon=right3]', e => {
            update( pager.next() )
        })

        $controls.on('click', '[icon=left3]', e => {
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
            ${ns} textarea,
            ${ns} .field {
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


    return this

}


// static properties and methods
rasti.log = log
rasti.warn = warn
rasti.error = error
rasti.utils = utils
rasti.blocks = require('./blocks/all')
rasti.icons = require('./icons')
rasti.fx = require('./fx')
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
