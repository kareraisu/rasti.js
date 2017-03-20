var rasti = function() {

    var self = this

    this.log = true

    this.activePage = null

    this.activeTheme = {}

    this.themeMap = {
        page : 'light',
        panel : 'dark',
        section : 'mid',
        field : 'light',
        btn : 'detail',
    }

    this.pages = {}

    this.data = {}

    this.ajax = {}

    this.utils = {}


    this.themes = {

        base : {
            font : 'normal 14px sans-serif',
            fontcolor : '#222',
            palette : {
                light: '#ddd',
                mid: '#aaa',
                dark: '#444',
                detail: 'darkcyan',
            },
        },

        oldsk00l : {
            font : 'normal 14px monospace',
            fontcolor : 'green',
            palette : {
                light: '#bbb',
                mid: '#888',
                dark: '#222',
                detail: 'green',
            },
        },

    }


    this.templates = {

        theme : function(values) {
            return `
                body {
                    font: ${ values.font };
                    color: ${ values.fontcolor };
                }
                [page]    { background-color: ${ values.page }; }
                [panel]   { background-color: ${ values.panel }; }
                [section] { background-color: ${ values.section }; }
                [field]   { background-color: ${ values.field }; }
                [btn], .btn, [rasti=buttons] div.active
                    { background-color: ${ values.btn }; }
                [btn][disabled], .btn[disabled], [rasti=buttons] div
                    { background-color: ${ values.section }; }
                `
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


    this.blocks = {

        buttons : {
            template : function(data) {
                var ret = ''
                for (var d of data) {
                    d = checkData(d)
                    ret += `<div value="${d.value}">${d.label}</div>`
                }
                return ret
            },
            init : function($el) {
                $el.find('div').click(function(e) {
                    var $el = $(this)
                    $el.parent().val($el.attr('value'))
                    $el.siblings().removeClass('active')
                    $el.addClass('active')
                })
                $el.change(function(e) {
                    var $el = $(this)
                    $el.children().removeClass('active')
                    $el.find('[value="'+ $el.val() +'"]').addClass('active')
                })
            },
            style : `
                [rasti=buttons]>div {
                    display: inline-block;
                    margin: 5px !important;
                    padding: 5px 10px;
                    border-radius: 6px;
                    border-bottom: 2px solid gray;
                    cursor: pointer;
                }
            `
        },

        radios : {
            template : function(data) {
                var uid = random()
                var ret = ''
                for (var d of data) {
                    d = checkData(d)
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
        },
        
        checks : {
            template : function(data) {
                var uid = random()
                var ret = ''
                for (var d of data) {
                    d = checkData(d)
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
        },

        multi : {
            template : function(data) {
                var ret = ''
                for (var d of data) {
                    d = checkData(d)
                    ret += `<option value="${d.value}">${d.label}</option>`
                }
                return ret
            },
            init : function($el) {
                var el = $el[0]
                var $options = $el.closest('[page]').find('[options='+ $el.attr('field') +']')
                var initialized = $el.find('[add]').length
                
                el.value = []
                el.total = $options.children().length
                el.max = parseInt($el.attr('max'))

                if (initialized) {
                    // empty selected options (and remove full class in case it was full)
                    $el.find('[selected]').empty()
                    $el.removeClass('full')
                    $el.parent().find('.addLocation').css('display', 'block')
                    // then exit (skip all bindings)
                    return
                }
                else {
                    // append add and selected divs
                    $el.prepend('<div add>')
                    $el.append('<div selected>')
                }

                $el.find('[add]').click(function(e) {
                    // $options = self.activePage.find('[options='+ $(this).parent().attr('field') +']')
                    $options.siblings('[options]').hide() // hide other options
                    $options.css('left', this.getBoundingClientRect().right).toggle()
                    $options.find('input').focus()
                })

                $options.click(function(e) {
                    $options.find('input').focus()
                    // if (e.target === this) $(this).hide()
                })

                $options.on('click', 'div i', function(e) {
                    $options.hide()
                })

                $options.on('focusout', 'input', function(e) {
                    setTimeout(function(){
                        if ($options.has(document.activeElement).length == 0) {
                            $options.hide()
                        }
                    }, 300)
                })

                var toggleOption = function(e) {
                    $options.find('input').focus()
                    var $opt = $(e.target),
                        val = $opt.attr('value'),
                        values = $el[0].value

                    if ($opt.parent().attr('options')) {
                        // select option
                        $el.find('[selected]').append('<div class="deleteOption"><i close class="fa fa-times" aria-hidden="true"></i></div>')
                        $("div.deleteOption", $el.find('[selected]')).last().append($opt)
                        values.push(val)
                    }
                    else {
                        // unselect option
                        deleteOption = $opt.parent()
                        $options.append($opt)
                        deleteOption.remove()
                        values.remove(val.capitalize())
                        values.remove(val)
                    }
                    checkFull($el)
                    $el.trigger('change', {ui: true}) 
                }

                $options.on('click', 'option', toggleOption)

                $el.on('click', 'option', toggleOption)

                $el.find('[selected]').on("click", "div > i", function(e) {
                    $(this).next().trigger("click")
                })

                $options.on('input', 'input', function(e) {
                    var searchTerm = $(this).val().toUpperCase()
                    $options.find('option').each(function(i, el) {
                        if (searchTerm === $(el).text().substring(0,searchTerm.length)) {
                            $(el).css('display', 'block')
                        }
                        else {
                            $(el).css('display', 'none')
                        }
                    })
                })

                $el.change(function(e, params){
                    if (params && params.ui) return // triggered from ui, do nothing
                    var $selected = $el.find('[selected]')
                    $selected.each(function(i, el) {
                        // TODO revisar si no pincha
                        $options.append(el)
                    })
                    for (var val of $el[0].value) {
                        $selected.append($options.find('[value='+ val +']'))
                        if (checkFull($el)) break
                    }
                })

                function checkFull($el) {
                    var multi = $el[0]
                    var isFull = multi.value.length >= (multi.max || multi.total)
                    if (isFull) {
                        $el.addClass('full')
                        $options.hide()
                        $el.parent().find('.addLocation').css('display', 'none')

                    }
                    else {
                        $el.removeClass('full')
                        $el.parent().find('.addLocation').css('display', 'block')
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
                }
                [rasti=multi] [add] {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    right: 0;
                    top: 0;
                    height: 100%;
                    width: 20px;
                    cursor: pointer;
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
                [rasti=multi].full [add] {
                    display: none;
                }
                [rasti=multi] option {
                    padding: 2px 0;
                    cursor: pointer;
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
        },

        select : {
            template : function(data) {
                var ret = ''
                for (var d of data) {
                    d = checkData(d)
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
        },

    }


    config = function(config) {
        for (var key in self) {
            if ($.type(self[key]) === 'object')
                Object.assign(self[key], config[key])
        }
    }


    init = function(config) {

        // set log
        if (typeof config.log !== 'undefined') self.log = config.log

        // append blocks styles
        var styles = '<style blocks>'
        for (var key in self.blocks) {
            styles += self.blocks[key].style
        }
        styles += '</style>'
        $('body').append(styles)

        // init rasti blocks
        $('[rasti]').not('[options]').each(function(i, el) {
            initBlock($(el))
        })

        // create options for selects with data source
        $('select[data]').each(function(i, el) {
            updateBlock($(el))
        })

        // fix labels
        $('input[label]').each(function(i, el) {
            fixLabel($(el))
        })
        $('select[label]').each(function(i, el) {
            fixLabel($(el))
        })
        $('textarea[label]').each(function(i, el) {
            fixLabel($(el))
        })


        // init nav
        $('[nav]').click(function(e) {
            // TODO add checks
            var params = {}
            if (this.hasAttribute('params')) {
                var $page = self.activePage
                var paramkeys = $(this).attr('params')
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
                        key = $(el).attr('navparam')
                        if (!key) return log('[navparam] attribute must have a value')
                        params[key] = $(el).val()
                    })
                }
            }
            navTo($(this).attr('nav'), params)
        })


        // init render
        $('[render]').click(function(e) {
            $el = $(this)
            var tempname = $el.attr('render')
            if (!tempname) return log('Please provide a template name in render attribute')

            var ajaxkey = $el.attr('submit')
            if (!ajaxkey) {
                render(tempname)
                return
            }

            // get ajax data
            var ajax = self.ajax[ ajaxkey ]
            if (!ajax || typeof ajax !== 'function') return log('Ajax method ['+ ajaxkey +'] not defined')

            var $form = $('[ajax='+ ajaxkey +']')
            if (!$form.length) return log('No container element defined for ajax method [%s]. Please define one via [ajax] attribute', ajaxkey)

            var reqdata = {}, field
            $form.find('[field]').each(function(i, el){
                $el = $(el)
                field = $el.attr('field')
                if (field) {
                    reqdata[field] = $el.val() || $el.attr('value')
                }
            })

            ajax(reqdata, function(resdata){
                render(tempname, resdata)
            })

        })


        // init actions
        for (var action of 'click change'.split(' ')) {
            $('['+ action +']').each(function(i, el){
                $el = $(el)
                method = $el.attr( action )
                if ( !app.utils[ method ] ) return log('Utility method [%s] not found', method)
                $(this).on( action , app.utils[ method ] )
            })
        }


        // create theme style tag and set theme
        $('body').append('<style theme>')
        setTheme(config.theme || 'base')


        // show root page
        navTo(config.root || Object.keys(self.pages)[0])

    }


    get = function (selector) {
        var $els = self.activePage.find('['+ selector +']')
        if (!$els.length) log('Element(s) ['+ selector +'] not found in page ['+ self.activePage.attr('page') +']')
        return $els
    }

    set = function (selector, value) {
        // TODO checks
        var $els = self.activePage.find('['+ selector +']')
        if (!$els.length) log('Element(s) ['+ selector +'] not found in page ['+ self.activePage.attr('page') +']')
        $els.each(function(i, el){
            el.value = value
            $(el).change()
        })
    }

    add = function (selector, value) {
        // TODO checks
        var $els = self.activePage.find('['+ selector +']')
        if (!$els.length) log('Element(s) ['+ selector +'] not found in page ['+ self.activePage.attr('page') +']')
        $els.each(function(i, el){
            el.value.push(value)
            $(el).change()
        })
    }


    navTo = function (pagename, params) {
        var $page = $('[page='+ pagename +']')
        if (!$page) return log('Page [%s] container not found', pagename)
        self.activePage = $page
        if (params) {
            if (typeof params !== 'object') log('Page params must be an object')
            else {
                // TODO sanity checks
                self.pages[pagename].init(params)
            }
        }
        $('[page].active').removeClass('active')
        self.activePage.addClass('active')
    }


    setTheme = function (themeName) {
        var theme = self.themes[themeName], themeMap
        if (!theme) return log('Theme [%s] not found', themeName)
        log('Setting theme [%s]', themeName)
        self.activeTheme = theme
        themeMap = theme.map || self.themeMap

        var values = {
            font : theme.font,
            fontcolor : theme.fontcolor
        }, color
        // map palette colors to attributes
        for (var attr of Object.keys(themeMap)) {
            color = theme.palette[themeMap[attr]]
            if (!color) log('Mapping error in theme [%s]. Palette does not contain color [%s]', themeName, themeMap[attr])
            else values[attr] = color
        }
        // generate theme style and apply it
        $('style[theme]').html( self.templates.theme(values) )

        // apply any styles defined by class
        for (var key of Object.keys(theme.palette)) {
            var color = theme.palette[key]
            $('.' + key).css('background-color', color)
        }
    }


    updateBlock = function ($el, data) {
        var type = $el[0].nodeName == 'SELECT' ? 'select' : $el.attr('rasti')
        if (!type) return log('Block type is missing, please specify a block type via the [rasti] attribute')
        
        var block = self.blocks[type]
        if (!block) return log('Block of type [%s] is not defined, please define it via the {blocks} config property', type)
        
        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return log('Datakey is missing, please specify a datakey via the [data] attribute')

            data = self.data[datakey]
            if (!data) return log('No data for datakey [%s], please define it via the {data} config property', datakey)
        }

        var $options

        if (type === 'multi') {
            var field = $el.attr('field')
            if (!field) return log('Block of type [%s] must have a [field] value', type)
            // check if options div already exists
            $options = $el.closest('[page]').find('[options='+ field +']')
            if (!$options.length) {
                // if not create it and append it to page
                $options = $('<div field rasti='+ type +' options='+ field +'>')
                $el.closest('[page]').append($options)
            }   
        }
        else {
            $options = $el
        }

        function applyTemplate(data) {
            $options.html( block.template(data) )
        }

        typeof data == 'function'
            ? data(applyTemplate)
            : applyTemplate(data)

    }


    // internal utils
    
    function initBlock($el) {
        var type = $el[0].nodeName == 'SELECT' ? 'select' : $el.attr('rasti')
        if (!type) return log('Block type is missing, please specify a block type via the [rasti] attribute')
        
        var block = self.blocks[type]
        if (!block) return log('Block of type [%s] is not defined, please define it via the {blocks} config property', type)

        // if applicable, create options from data source
        if ($el.attr('data')) updateBlock($el)

        block.init($el)
    }


    function fixLabel($el) {
        var $div = $('<div>').attr('label', $el.attr('label'))
        $el.wrap($div)
        $el[0].removeAttribute('label')
    }


    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }


    function render(name, data) {
        var template = self.templates[name]
        if (!template) return log('No template [' + name +']')

        var $el = $('[template='+ name +']')
        if (!$el.length) return log('No element for template [%s]', name)

        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return log('No data for template [%s]. Please provide in ajax response or via data attribute.', name)
            data = self.data[datakey]
            if (!data) return log('No data for datakey [%s]', datakey)
        }

        $el.html( template(data) )

        var fxkey = $el.attr('fx')
        if (fxkey) {
            var fx = self.fx[fxkey]
            if (!fx) return log('Fx [%s] not defined', fxkey)
            fx($el)
        }
    }


    function checkData(data) {
        switch (typeof data) {
        case 'string':
            data = {value: data, label: data}
            break
        case 'object':
            if (!data.value || !data.label) log('Invalid data object, must have value and label')
            break
        default:
            log('Invalid data, must be string or object')
        }
        return data
    }


    function random() {
        return (Math.random() * 6 | 0) + 1
    }


    function log(...params) {
        if (self.log) console.log.call(this, ...params)
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
        // objects
        pages : this.pages,
        data : this.data,
        ajax : this.ajax,
        utils : this.utils,
        themes : this.themes,
        templates : this.templates,
        fx : this.fx,
        blocks : this.blocks,

        // methods
        config : config,
        init : init,
        get : get,
        set : set,
        add : add,
        navTo : navTo,
        setTheme : setTheme,
        updateBlock : updateBlock,
    }

}
