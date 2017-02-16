var rasti = function() {

    var self = this

    this.activePage = ''

    this.pages = {}

    this.data = {}

    this.ajax = {}

    this.utils = {}


    this.templates = {
        select : function(value, label) {
            return '<option value="'+ value +'">'+ label +'</option>'
        },

        multi : function(value, label) {
            return '<option value="'+ value +'">'+ label +'</option>'
        },

        buttons : function(value, label) {
            return '<div value="'+ value +'">'+ label +'</div>'
        },

        radios : function(value, label) {
            return '<div>'
                +   '<input type="radio" name="serv[]" value="'+ value +'">'
                +   '<label>'+ label +'</label>'
                + '</div>'
        },
    }


    this.fx = {
        stack : function($el) {
            $el.children().each(function(i, el){
                setTimeout(function(){
                    el.style.opacity = 1
                    el.style.margin = '15px 0'
                }, i * 50);
            })
        }
    }


    config = function(config) {
        self.pages = config.pages || {}
        self.data = config.data || {}
        self.ajax = config.ajax || {}
        self.utils = config.utils || {}
        Object.assign(self.fx, config.fx || {})
        Object.assign(self.templates, config.templates || {})
    }


    init = function(config) {

        // set root page
        navTo(config.root)

        // create options from data sources
        var $el, type, datakey, $options, value, label

        $('[data]').each(function(i, el) {
            if (el.hasAttribute('img')) return // skip element
            $el = $(el)
            type = $el.attr('rasti') || 'select' // if no type assume select
            datakey = $el.attr('data')
            if (!self.data[datakey] || !self.data[datakey].length) return log('No data for datakey ['+ datakey +']')

            if (type === 'multi') {
                $options = $('<div options>')
                $el.append($options)
            }
            else {
                $options = $el
            }

            self.data[datakey].forEach(function(dat, i) {
                if (typeof dat === 'string') {
                    value = label = dat
                }
                else if (typeof dat === 'object') {
                    value = dat.value
                    label = dat.label
                    if (!value || !label) return log('Invalid data object, must have value and label')
                }
                else return log('Invalid data, must be string or object')

                if (!self.templates[type]) return log('Template ['+ type +'] not defined')

                $options.append(self.templates[type](value, label))
            })

        })


        // init multiselects
        $('[rasti=multi]').each(function(i, el) {
            el.value = []
            $el = $(el)
            $el.prepend('<div add>〉</div>')
            $el.append('<div selected>')

            $el.find('[add]').click(function(e) {
                $(this).parent().toggleClass('open')
            })

            // FIXME
            $el.focusout(function(e) {
                $(this).removeClass('open')
            })

            $el.find('option').click(function(e) {
                var $opt = $(this),
                    val = $opt.attr('value'),
                    $multi = $opt.closest('[rasti=multi]'),
                    values = $multi[0].value

                if ($opt.parent()[0].hasAttribute('options')) {
                    // select option
                    $multi.find('[selected]').append($opt)
                    values.push(val)
                }
                else {
                    // unselect option
                    $multi.find('[options]').append($opt)
                    values.pop(val)
                }

                if ($multi.find('[options]').children().length) {
                    $multi.removeClass('full')
                }
                else {
                    $multi.removeClass('open').addClass('full')
                }
            })

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
            $wrapper.attr('value', $el.val() || $options[i].getAttribute('value'))

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
                $wrapper.attr('value', $opt.attr('value'))
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
                var $page = $('[page='+ self.activePage +']')
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
        $('[rasti=buttons] div').click(function(e) {
            $el = $(this)
            $el.parent().val($el.attr('value'))
            $el.siblings().removeClass('active')
            $el.addClass('active')
        })

        // init radios
        $('[rasti=radios] input').change(function(e) {
            $el = $(this)
            $el.closest('[type=radios]').val($el.attr('value'))
        })
        $('[rasti=radios] input +label').click(function(e) {
            $el = $(this)
            $el.prev().prop('checked', true).change()
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
            if (!$form.length) return log('No container element defined for ajax method ['+ ajaxkey
                + ']. Please define one via ajax attribute')

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



    }


    // utils

    function fixLabel($el) {
        var $div = $('<div>').attr('label', $el.attr('label'))
        $el.wrap($div)
        $el[0].removeAttribute('label')
    }

    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + $el.attr('value') +'.png)')
    }

    function navTo(pagename, params) {
        self.activePage = pagename
        if (params) {
            if (typeof params !== 'object') log('Page params must be an object')
            else {
                // TODO sanity checks
                self.pages[pagename].init(params)
            }
        }
        $('[page].active').removeClass('active')
        $('[page='+ pagename +']').addClass('active')
    }

    function render(name, data) {
        var template = self.templates[name]
        if (!template) return log('No template [' + name +']')

        var $el = $('[template='+ name +']')
        if (!$el.length) return log('No element for template [' + name  +']')

        if (!data) {
            var datakey = $el.attr('data')
            if (!datakey) return log('No data for template [' + name
                + ']. Please provide in ajax response or via data attribute.')
            data = self.data[datakey]
            if (!data) return log('No data for datakey [' + datakey +']')
        }

        $el.html( template(data) )

        var fxkey = $el.attr('fx')
        if (fxkey) {
            var fx = self.fx[fxkey]
            if (!fx) return log('Fx [' + fxkey  +'] not defined')
            fx($el)
        }
    }

    function log(text) {
        console.log(text)
    }


    // api

    return {
        pages : this.pages,
        data : this.data,
        ajax : this.ajax,
        utils : this.utils,
        templates : this.templates,
        fx : this.fx,
        config : config,
        init : init,
    }

}


