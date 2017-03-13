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
        select : function(data) {
            var ret = ''
            for (var d of data) {
                d = checkData(d)
                ret += `<option value="${d.value}">${d.label}</option>`
            }
            return ret
        },

        multi : function(data, filter) {
            var ret = ''
            for (var d of data) {
                d = checkData(d)
                ret += `<option value="${d.value}">${d.label}</option>`
            }
            return ret
        },

        buttons : function(data) {
            var ret = ''
            for (var d of data) {
                d = checkData(d)
                ret += `<div value="${d.value}">${d.label}</div>`
            }
            return ret
        },

        radios : function(data) {
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

        checks : function(data) {
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

        theme : function(values) {
            return `<style theme>
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
            </style>`
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
        }
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

        var $el, type, datakey, data, field, filter, $options, template

        // create options from data sources
        $('[data]').each(function(i, el) {
            if (el.hasAttribute('img')) return // skip element
            $el = $(el)
            type = $el.attr('rasti') || 'select' // if no type assume select
            datakey = $el.attr('data')
            data = self.data[datakey]
            template = self.templates[type]
            
            if (!data || !data.length) return log('No data for datakey [%s]', datakey)
            if (!template) return log('Template for element [%s] not defined', type)

            if (type === 'multi') {
                // create options in page
                field = $el.attr('field')
                if (!field) return log('Element of type [%s] must have a [field] value', type)
                $options = $('<div field rasti='+ type +' options='+ field +'>')
                if (el.hasAttribute('filter')) {
                    $options[0].innerHTML += `<div class="filter">
                            <input field type="text" placeholder="${ $el.attr('filter') || 'type here to filter options' }">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </div>`
                }
                $el.closest('[page]').append($options)
            }
            else {
                $options = $el
            }

            $options[0].innerHTML += template(data)

        })

        // init multiselects
        $('[rasti=multi]').not('[options]').each(function(i, el) {
            var $multi = $(el)
            var $options = $multi.closest('[page]').find('[options='+ $multi.attr('field') +']')
            el.value = []
            el.total = $options.children().length
            el.max = parseInt($multi.attr('max'))

            $multi.prepend('<div add>')
            $multi.append('<div selected>')

            $multi.find('[add]').click(function(e) {
                $options.siblings('[options]').hide() // hide other options popups
                $options.css('left', this.getBoundingClientRect().right).toggle()
                if ($options.css('display') === 'block') $options.find('input').focus()
            })

            $options.find('option').click(function(e) {
                var $opt = $(this),
                    val = $opt.attr('value'),
                    values = $multi[0].value

                if ($opt.parent().attr('options')) {
                    // select option
                    $multi.find('[selected]').append($opt)
                    values.push(val)
                }
                else {
                    // unselect option
                    $options.append($opt)
                    values.remove(val)
                }

                checkFull($multi)            
            })

            $options.find('input').on('input', function(e) {
                var searchTerm = $(this).val().toLowerCase()
                $options.find('option').each(function(i, el) {
                    if ($(el).text().toLowerCase().includes(searchTerm)) {
                        $(el).show()
                    }
                    else {
                        $(el).hide()
                    }
                })
            })

            $multi.change(function(){
                var $selected = $multi.find('[selected]')
                $selected.empty()
                for (var val of $multi[0].value) {
                    $selected.append($options.find('[value='+ val +']'))
                    if (checkFull($multi)) break
                }
            })

            function checkFull($multi) {
                var multi = $multi[0]
                var isFull = multi.value.length === (multi.max || multi.total)
                if (isFull) {
                    $multi.addClass('full')
                    $options.hide()
                }
                else {
                    $multi.removeClass('full')
                }
                return isFull
            }

        })


        // init img selects
        var imgpath, $wrapper, $selected

        $('select[img]').each(function(i, el) {
            $el = $(el)
            $selected = $el.find('[selected]')
            datakey = $el.attr('data')
            imgpath = $el.attr('img')

            // clone original select
            $wrapper = $('<div select>')
            $.each(el.attributes, function() {
                $wrapper.attr(this.name, this.value);
            });

            // wrap with clone
            $el.wrap($wrapper)
            // regain wrapper ref (it is lost when wrapping)
            $wrapper = $el.parent()
            // add caret
            $wrapper.append('<div caret>&#9660</div>')

            $options = $('<div options>')
            if (datakey && self.data[datakey]) {
                // create options from data source
                self.data[datakey].forEach(function(dat, i) {
                    $options.append('<div value="'+ dat +'">')
                })
            }
            else {
                // clone original options
                $el.find('option').each(function(opt, i) {
                    $options.append('<div value="'+ opt.value +'">')
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

        // init buttons
        $('[rasti=buttons]').each(function(i, el) {
            $el = $(el)
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
        })

        // init radios
        $('[rasti=radios]').each(function(i, el) {
            $el = $(el)
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
        })
        
        // init checks
        $('[rasti=checks]').each(function(i, el) {
            el.value = []
            $el = $(el)
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
            if (!$form.length) return log('No container element defined for ajax method [%s]. Please define one via ajax attribute', ajaxkey)

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
                $(this).click( app.utils[ method ] )
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


    // internal utils

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

        // methods
        config : config,
        init : init,
        get : get,
        set : set,
        add : add,
        navTo : navTo,
        setTheme : setTheme,
    }

}


