/* zepto */

require('./extensions')
var { History, Pager, createState } = require('./components')
var utils = require('./utils')
var { is, type, sameType } = utils
var themes = require('./themes')

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


        // create options for selects and lists with data source
        container.find('select[data]')
            .add('ol[data]', container)
            .add('ul[data]', container)
            .each(function(i, el) {
                updateBlock($(el))
            })


        // create tabs
        container.find('.tabs').each(function(i, el) {
            createTabs($(el))
        })
        if (media.tablet || media.phone) container.find('.tabs-tablet').each(function(i, el) {
            createTabs($(el))
        })
        if (media.phone) container.find('.tabs-phone').each(function(i, el) {
            createTabs($(el))
        })


        // add close btn to modals
        container.find('[modal]').each(function(i, el) {
            $('<div class="icon close top right" />')
            .on('click', function(e){
                $(this).parent().hide()
                self.active.page.find('.backdrop').removeClass('backdrop')
            })
            .appendTo(el)
        })


        // init field validations
        container.find('[validate]').each(function(i, btn) {
            btn.disabled = true
            var $container = $(btn).parent()
            var fields = $container.find('[field][required]')
            fields.each(function(i, field){
                var invalid = field.validity && !field.validity.valid
                field.classList.toggle('error', invalid)
                $(field).change(function(e){
                    invalid = field.validity && !field.validity.valid
                    field.classList.toggle('error', invalid)
                    btn.disabled = $container.find('[field].error').length
                })
            })
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


        // init deps
        container.find('[deps]').each(function(i, el) {
            var $el = $(el)
            var deps = $el.attr('deps')
            if (deps) deps.split(' ').forEach(function(field) {
                $el.closest('[page]').find('[field='+ field +']').change(function(e){
                    updateBlock($el)
                })
            })
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
                if ( !$target.length ) $target = container.find('['+targetSelector+']')
                if ( !$target.length ) return error('Could not find target [%s] declared in [%s] attribute of element:', targetSelector, action, el)
                $el.on('click', function(e){
                        if ($target[0].hasAttribute('modal')) $page.find('.page-options').addClass('backdrop')
                        $target[action]()
                    })
                    .removeAttr(action)
            })
        }


        // init move
        container.find('.move').each(function(i, el){
            $(el).move()
        })


        // init collapse
        container.find('.collapse').on('click', function(e){
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


        // init statefull elements
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
                $el.on('change', function(e){
                    // update state on ui change
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
        var $els = self.active.page && self.active.page.find('['+ selector +']')
        if (!$els || !$els.length) $els = container.find('['+ selector +']')
        if (!$els.length) warn('No elements found for selector [%s]', selector)
        return $els
    }

    function set(selector, value) {        
        var $els = get(selector)
        $els.each(function(i, el){
            el.value = value
            $(el).change()
        })
        return $els
    }

    function add(selector, ...values) {
        var $els = get(selector)
        $els.each(function(i, el){
            values.forEach(function(val){
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
        if (deps) deps.split(' ').forEach(function(field) {
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

    function createState() {
        return Object.defineProperties({}, {
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
        if (!type) return error('Missing block type in [block] attribute of element:', el)
        
        var block = rasti.blocks[type]
        if (!block) return error('Undefined block type "%s" declared in [block] attribute of element:', type, el)

        block.init($el)

        // if applicable, create options from data source
        if (el.hasAttribute('data')) updateBlock($el)
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
            paging, columns, sizes, col=1, size=0

        if ($el[0].hasAttribute('columns')) columns = `<button btn class="icon columns" />`

        if (pager.total > 1) paging = `<div class="paging ib ib_">
                <button btn class="icon prev" />
                <span class="page" />
                <button btn class="icon next" />
            </div>`

        sizes = `<button btn class="icon rows" />`

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

        $controls.on('click', '.next', function(e){
            update( pager.next() )
        })

        $controls.on('click', '.prev', function(e){
            update( pager.prev() )
        })

        $controls.on('click', '.rows', function(e){
            size += 1
            var newSize = pager.sizes[size % pager.sizes.length]
            pager.setPageSize(newSize)
            $(e.target).html(newSize)
            update( pager.next() )
            pager.total > 1
                ? $controls.find('.paging').show()
                : $controls.find('.paging').hide()
        })

        $controls.on('click', '.columns', function(e){
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
    $('head').prepend(styles)
}


var rastiCSS

/* rasti CSS */

if (rastiCSS) $('head').prepend('<style>' + rastiCSS + '</style>')

genBlockStyles()

bootstrap()
