(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.rasti = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
	list    : require('./list'),
	table   : require('./table'),
	input   : require('./input'),
	checks  : require('./checks'),
	radios  : require('./radios'),
	buttons : require('./buttons'),
	multi   : require('./multi'),
	select  : require('./select'),
}
},{"./buttons":2,"./checks":3,"./input":4,"./list":5,"./multi":6,"./radios":7,"./select":8,"./table":9}],2:[function(require,module,exports){
const { prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const template = prepTemplate(d => `<div value="${d.value}">${d.label}</div>`)
    $el.html( template(data) )
},

init($el) {
    $el[0].value = ''
    $el.on('click', 'div', function(e) {
        $el.val($(e.target).attr('value'))
            .trigger('change')
    })
    $el.on('change', function(e) {
        $el.children().removeClass('active')
        $el.find('[value="'+ $el.val() +'"]').addClass('active')
    })
},

style : `
    [block=buttons] > div {
        display: inline-block;
        margin: 5px !important;
        padding: 5px 10px;
        border-radius: 4px;
        background-clip: padding-box;
        text-transform: uppercase;
        cursor: pointer;
    }
    [block=buttons] > div.active {
        background-color: var(--primary);
    }
`

}

},{"../utils":15}],3:[function(require,module,exports){
const { random, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const uid = random()
    const template = prepTemplate(d => `<input type="checkbox" name="${uid}[]" value="${d.value}"/><label>${d.label}</label>`)
    $el.html( template(data) )
},

init($el) {
    const values = $el[0].value = []

    $el.on('change', 'input', function(e) {
        // update component value
        const $input = $(e.currentTarget),
            val = $input.attr('value')
        $input.prop('checked')
            ? values.push(val)
            : values.remove(val)
    })
    
    $el.on('change', function(e) {
        // update component ui
        let $input, checked
        $el.find('input').each( input => {
            $input = $(input)
            checked = values.includes( $input.attr('value') )
            $input.prop('checked', checked)
        })
    })
},

}
},{"../utils":15}],4:[function(require,module,exports){
const { is, random } = require('../utils')

module.exports = {

render(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( is.not.array(data) ) throw 'invalid data, must be string or array'
    const html = data
        .map( d => `<option value="${d.trim()}"></option>` )
        .join('')
    $el.next('datalist').html(html)
},

init($el) {
    const id = random()
    $el.attr('list', id)
    $el.after(`<datalist id=${id}>`)

    $el.click(e => $el.val(''))
},

}
},{"../utils":15}],5:[function(require,module,exports){
const { is } = require('../utils')

module.exports = {

render(data, $el) {
    if ( is.string(data) ) {
        const separator = $el.attr('separator') || ','
        data = data.split(separator)
    }
    if ( is.not.array(data) ) throw 'invalid data, must be string or array'
    const html = data
        .map( d => `<li>${d.trim()}</li>` )
        .join('')
    $el.html(html)
},

}
},{"../utils":15}],6:[function(require,module,exports){
const { is, media, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    var el = $el[0]
    var name = $el.attr('prop') || $el.attr('name')

    if (!name) return rasti.error('Could not resolve name of element:', el)

    if ( is.string(data) ) data = data.split(', ')
    if ( is.not.array(data) ) throw 'invalid data, must be string or array'

    $el[0].total = data.length // WARNING : SIDE EFFECTS

    const filter = $el.hasAttr('filter')
        ? `<input field type="text" placeholder="${ $el.attr('filter') }"/>`
        : ''

    const template = prepTemplate(d => `<option value="${d.value}" alias="${d.alias}">${d.label}</option>`)

    $el.closest('[page]').find('[options='+ name +']')
        .html( filter + template(data) )
},

init($el) {
    var el = $el[0]
    var name = $el.attr('prop') || $el.attr('name')

    if (!name) return rasti.error('Could not resolve name of element:', el)
    
    el.value = []
    el.max = parseInt($el.attr('max'))

    if (el.initialized) {
        // empty selected options (and remove full class in case it was full)
        $el.find('[selected]').empty()
        $el.removeClass('full')
        // then exit (skip structure and bindings)
        return
    }

    // structure

    $el.addClass('field')
    $el.html('<div selected/><div add/>')
    $el.closest('[page]').children('.page-options')
        .append('<div block=multi section options='+ name +'>')
    var $selected = $el.find('[selected]')
    var $options = $el.closest('[page]').find('[options='+ name +']')

    // bindings

    $el.on('click', function(e) {
        e.stopPropagation()
        $options.siblings('[options]').hide() // hide other options
        if ( media.phone ) $options.parent().addClass('backdrop')
        $options.css('left', this.getBoundingClientRect().right).show()
        $options.find('input').focus()
    })

    $el.closest('[page]').on('click', '*:not(option)', function(e) {
        if ( $(e.target).attr('name') === name
          || $(e.target).parent().attr('name') === name ) return
        if ( media.phone ) $options.parent().removeClass('backdrop')
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
            $selected.append($opt)
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

    if ( !media.phone )
        $options.on('click', function(e) { $options.find('input').focus() })

    $options.on('input', 'input', function(e) {
        this.value
            ? $options.find('option').hide().filter('[alias*='+ this.value +']').show()
            : $options.find('option').show()
    })

    $el.on('change', function(e, params){
        if (params && params.ui) return // change triggered from ui, do nothing
        $selected.children().each( el => {
            $options.append(el)
        })
        for (var val of el.value) {
            $selected.append($options.find('[value="'+ val +'"]'))
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
            if ( media.phone ) $options.parent().removeClass('backdrop')
            $options.hide()
        }
        else {
            $el.removeClass('full')
        }

        return isFull
    }

    el.initialized = true
},

style : `
    [block=multi]:not([options]) {
        display: flex;
        min-height: 35px;
        padding-right: 0;
        text-shadow: 0 0 0 #000;
        cursor: pointer;
    }
    [block=multi] [add] {
        display: flex;
        align-items: center;
        width: 30px;
        border-left: 1px solid rgba(0,0,0,0.2);
    }
    [block=multi] [add]:before {
        content: '〉';
        padding-left: 10px;
    }
    [block=multi].open [add] {
        box-shadow: inset 0 0 2px #000;
    }
    [block=multi].full {
        padding-right: 5px;
    }
    [block=multi].full [add] {
        display: none;
    }
    [block=multi] option {
        padding: 6px 0;
    }
    [block=multi] option:before {
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
    [block=multi] [selected] {
        flex-basis: 100%;
        max-height: 100px;
        overflow-y: auto;
    }
    [block=multi] [selected] > option:hover:before {
        color: #d90000;
        background-color: rgba(255, 0, 0, 0.5);
    }
    [block=multi][options] {
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
    [block=multi][options] > option:before {
        transform: rotate(45deg);
    }
    [block=multi][options] > option:hover:before {
        color: #008000;
        background-color: rgba(0, 128, 0, 0.5);
    }
    [block=multi][options] input {
        border: 1px solid #000;
        margin: 10px 0;
    }

`

}
},{"../utils":15}],7:[function(require,module,exports){
const { random, prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const uid = random()
    const template = prepTemplate(d => `<div><input type="radio" name="${uid}" value="${d.value}"/><label>${d.label}</label></div>`)
    $el.html( template(data) )
},

init($el) {
    $el[0].value = ''
    $el.on('click', 'label', function(e) {
        // forward clicks to hidden input
        $(e.currentTarget).prev().click()
    })
    $el.on('change', 'input', function(e) {
        // update component value
        $el.val( $(e.currentTarget).attr('value') )
    })
    $el.on('change', function(e) {
        // update component ui
        $el.find('[value="'+ $el.val() +'"]').checked = true
    })
},

}
},{"../utils":15}],8:[function(require,module,exports){
const { prepTemplate } = require('../utils')

module.exports = {

render(data, $el) {
    const template = prepTemplate(d => `<option value="${d.value}">${d.label}</option>`)
    $el.html( template(data) )
},

init($el) {
    var imgpath = $el.attr('img')
    if (!imgpath) return

    var $selected = $el.find('[selected]'),
        $wrapper = $('<div select>'),
        $options = $('<div options>')

    // clone original select
    for (var attr of $el[0].attributes) {
        $wrapper.attr(attr.name, attr.value);
    }
    // wrap with clone
    $el.wrap($wrapper)
    // regain wrapper ref (it is lost when wrapping)
    $wrapper = $el.parent()
    // add caret
    $wrapper.append('<div caret>&#9660</div>')

    if (!$el.attr('data')) {
        // clone original options
        $el.find('option').each( opt => {
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
        $wrapper.val($opt.attr('value'))
        setImg($wrapper, imgpath)
    })

    // remove original select
    $el.remove()

    function setImg($el, basepath) {
        $el.css('background-image', 'url('+ basepath + ($el.val() || $el.attr('value')) +'.png)')
    }

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

},{"../utils":15}],9:[function(require,module,exports){
const { is } = require('../utils')

module.exports = {

render(data, $el) {
    let head, body
    try {
        if (is.array(data)) {
            headers = Object.keys(data[0])
            head = headers.map( h =>`<th>${h}</th>` ).join('')
            body = data.map( obj => '<tr>'
                + headers.map( key => `<td>${obj[key]}</td>` ).join('') 
                + '</tr>' )
        }
        else if (is.string(data)) {
            const separator = $el.attr('separator') || ','
            data = data.split(/[\n]/)
                .map(row => row.split(separator))
            head = data.shift().map( h =>`<th>${h.trim()}</th>` ).join('')
            body = data.map( row => '<tr>'
                + row.map( v => `<td>${v.trim()}</td>` ).join('') 
                + '</tr>' ).join('')
        }
        else throw 'invalid data, must be array or string'
        $el.html(
            '<thead><tr>'
            + head
            + '</tr></thead><tbody>'
            + body
            + '</tbody>'
        )
    } catch(err) {
        throw 'Parsing error: ' + err
    }
        
},

}
},{"../utils":15}],10:[function(require,module,exports){
const { is, exists, resolveAttr } = require('./utils')

class History {

    constructor(app) {
        this.app = app
        this.clear()
        app.history = {}
        Object.defineProperties(app.history, {
            back : { value : this.back.bind(this) },
            forward : { value : this.forward.bind(this) },
            clear : { value : this.clear.bind(this) },
        })
    }

    push(page) {
        this.i += 1
        this.content.splice(this.i, null, page)
    }

    back() {
        if (this.i > 0) {
            this.i -= 1
            this.app.navTo(this.content[this.i], {}, true)
        }
    }

    forward() {
        if (this.i < this.content.length -1) {
            this.i += 1
            this.app.navTo(this.content[this.i], {}, true)
        }
    }

    clear() {
        this.i = -1
        this.content = []
    }
}


class Pager {

    constructor(id, results, sizes) {
        this.id = id
        if ( is.not.string(id) ) return rasti.error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( is.not.array(results) ) return rasti.error('%s Results must be an array', this.logid)
        this.results = results
        if ( is.not.array(sizes) || is.not.number(sizes[0]) ) return rasti.error('%s Page sizes must be an array of numbers', this.logid)
        this.sizes = sizes
        this.setPageSize(this.sizes[0])
    }

    next() {
        if (this.hasNext()) this.page++
        else rasti.warn('%s No next page', this.logid)
        return this.getPageResults(this.page)
    }

    prev() {
        if (this.hasPrev()) this.page--
        else rasti.warn('%s No previous page', this.logid)
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
        if ( is.not.number(size) ) return rasti.error('%s Must specify a number as the page size', this.logid)
        this.page_size = size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)
    }

    getPageResults(page) {
        if ( is.not.number(page) ) {
            rasti.error('%s Must specify a page number to get results from', this.logid)
            return []
        }
        try {
            const i = (page -1) * this.page_size
            return this.results.slice(i, i + this.page_size)
        }
        catch(err) {
            rasti.error('%s Could not get results of page %s, error:', this.logid, page, err)
            return []
        }
    }

}


function state(app, app_id) {
    function invalid() {
        rasti.error('Saved state for app [%s] is invalid', app_id)
    }

    return Object.defineProperties({}, {
        page  : { get : _ => app.active.page.attr('page'), enumerable : true },
        theme : { get : _ => app.active.theme, enumerable : true },
        lang  : { get : _ => app.active.lang, enumerable : true },
        save : { value : _ => {
            app.state.props = Object.filter(app.props, ([k, v]) => !(v && v.__trans))
            localStorage.setItem('rasti.' + app_id, JSON.stringify(app.state))
            rasti.log('State saved')
        } },
        get : { value : _ => {
            let state
            try {
                state = JSON.parse( localStorage.getItem('rasti.' + app_id) )
                if ( !state ) rasti.log('No saved state found for app [%s]', app_id)
                else if ( is.not.object(state) ) invalid()
                else return state
            }
            catch(err) {
                invalid()
            }
        } },
        restore : { value : _ => {
            const state = app.state.get()
            if (state) {
                rasti.log('Restoring state...')
                match(app.props, state.props)
                if (state.theme) app.setTheme(state.theme)
                if (state.lang) app.setLang(state.lang)
                rasti.log('State restored')
            }
            return state

            function match(t1, t2) {
                if ( is.nil(t2) || is.nil(t2) ) return
                for (let name in t1) {
                    is.object(t1[name])
                        ? match(t1[name], t2[name])
                        : t1[name] = t2[name]
                }
            }
        } },
        clear : { value : _ => {
            window.localStorage.removeItem('rasti.' + app_id)
        } },
    })
}


function crud(app) {
    function checkDataSource(fn) {
        return (metadata, ...args) => {
            const data = app.data[metadata.datakey]
            if (!data) {
                rasti.error('Undefined data source "%s"', metadata.datakey)
                return false
            }
            metadata.data = data
            return fn(metadata, ...args)
        }
    }

    function checkCrudMethod(methodname, fn) {
        return (metadata, ...args) => {
            // FIXME: app ns is not available here
            const crudns = app.crud[metadata.crudns]
            const method = crudns && crudns[methodname]
            if (method && is.not.function(method)) {
                rasti.error('Illegal crud method "%s", must be a function!', name)
                return false
            }
            if (!method) method = Promise.resolve
            return method(...args)
                    .then(
                        ok => fn(metadata, ...args),
                        err => rasti.error('Could not %s element in %s', methodname, metadata.datakey)
                    )
        }
    }

    function exists(el, arr) {
        return is.object(el)
            ? arr.find(d => d.id === el.id)
            : arr.indexOf(el) > -1
    }

    return {
        create : checkDataSource(
            checkCrudMethod('create',
            (data, datakey, newel) => {
                const exists = exists(newel, data)
                if (exists) {
                    rasti.warn('Element [%s] already exists in data source [%s]', newel.id || newel, datakey)
                }
                else {
                    if (is.object(newel)) newel.id = newel.id || datakey + '-' + Date.now()
                    data.push(newel)
                }
                return !exists
            }
        )),

        delete : checkDataSource(
            checkCrudMethod('delete',
            (data, datakey, id) => {
                const el = data.length && (is.object(data[0]) ? data.find(el => el.id === id) : id)
                !el
                    ? rasti.warn('Element [%s] not found in data source [%s]', id, datakey)
                    : data.remove(el)
                return el
            }
        )),

        update : checkDataSource(
            checkCrudMethod('update',
            (data, datakey, el, newel) => {
                const exists_el = exists(el, data)
                const exists_newel = exists(newel, data)
                if (!exists_el) rasti.warn('El [%s] not found in data source [%s]', el, datakey)
                if (exists_newel) rasti.warn('El [%s] already exists in data source [%s]', newel, datakey)
                const valid = exists_el && !exists_newel
                if (valid) data.update(el, newel)
                return valid
            }
        )),

        genInputEl : $el => {
            const template = app.templates[ resolveAttr($el, 'template') ]

            if (!template.props) {
                // extract props from the template's html
                // and generate a props object with placeholder values
                const regexp = /data\.([a-z]*)/g
                let props = {}
                let prop
                while (prop = regexp.exec(template.html)) {
                  props[ prop[1] ] = prop[1]
                }
                // if no props are found, assume data are strings
                // hence, replace the empty props object with the newEl string
                if (!Object.keys(props).length) props = app.options.newEl
                // cache the props in the template
                template.props = props
                rasti.log('Props:', props)
            }
            // create a dummy element using the (self-)extracted props
            const inputEl = $('<div class=rasti-crud-input contenteditable>' + template( [template.props] ) +'</div>')

            // TODO: identify prop elements within the inputEl element and apply [contenteditable] only to them

            $el.append(inputEl)
        },

        genDataEl : $el => {
            const template = app.templates[ resolveAttr($el, 'template') ]
            const values = $el.find('.rasti-crud-input')
            let dataEl
            if ( is.object(template.props) ) {
                dataEl = {}
                Object.keys(template.props).forEach( (key, i) => {
                    dataEl[key] = values[i].innerHTML
                })
            }
            else dataEl = values[0].innerHTML
            return dataEl
        },

        showInputEl : $el => {
            $el.find('.rasti-crud-input').show()
        },

        hideInputEl : $el => {
            $el.find('.rasti-crud-input').hide()
        },

        persistNewEl : $el => {
            $el.find('.rasti-crud-input').removeClass('rasti-crud-input')
                .find('[contenteditable]')[0].removeAttribute('contenteditable')
            app.crud.genInputEl($el)
        },
    }
}


module.exports = {
    History,
    Pager,
    state,
    crud,
}

},{"./utils":15}],11:[function(require,module,exports){
const { is } = require('./utils')


// built-in objects extensions

Array.prototype.get = function(i) {
    return i < 0 ? this[this.length + i] : this[i]
}
Array.prototype.new = function(el, i) {
    i = i || this.length
    var isNew = this.indexOf(el) < 0
    if (isNew) this.splice(i, 0, el)
    return isNew
}
Array.prototype.remove = function(el) {
    this.update(el)
}
Array.prototype.update = function(el, newel) {
    var i = this.indexOf(el)
    var found = i > -1
    if (found) this.splice(i, 1, newel)
    return found
}
Array.prototype.capitalize = function() {
    return typeof this == 'string' && this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
}

Object.filter = (obj, predicate) => {
    const traverse = (obj, predicate) => Object.fromEntries(
        Object.entries(obj)
            .filter(predicate)
            .map(([k, v]) => 
                is.object(v) ? [k, traverse(v, predicate)] : [k, v]
            )
    )
    return traverse(obj, predicate)
}


// $ extensions

$.prototype.hasAttr = function(name) {
    return this[0] && this[0].hasAttribute(name)
}

const helper = {
    show() {
        if (!this[0]) return
        this[0].style.display = this[0]._display || helper.initd(this)
    },
    hide() {
        if (!this[0]) return
        this[0]._display = this[0].style.display || helper.initd(this)
        this[0].style.display = 'none'
    },
    initd(ref) {
        const computed = helper.getd(ref)
        return ['','none'].includes(computed) ? 'block' : computed
    },
    getd(ref) {
        return ref[0].computedStyleMap().get('display').value
    }
}
for (let method of ['show', 'hide']) {
    $.prototype[method] = function() {
        const isSpecial = this.hasAttr('menu') || this.hasAttr('modal') || this.hasAttr('sidemenu')
        if (isSpecial) {
            if (this[0].enabled === false) return this
            document.body.style.setProperty("--elem-h", this[0]._height)
            const backdrop = this.closest('[rasti]').find('.rs-backdrop')
            switch(method) {
                case 'show':
                    this.addClass('open')
                    backdrop.addClass('backdrop')
                    this[0].visible = true
                    helper[method].call(this)
                    break
                case 'hide':
                    this.removeClass('open')
                    this.addClass('close')
                    backdrop.removeClass('backdrop')
                    this[0].visible = false
                    setTimeout( () => {
                        this.removeClass('close')
                        helper[method].call(this)
                    }, 500)
            }
        }
        else helper[method].call(this)
        return this
    }
}
$.prototype.toggle = function() {
    if (!this[0]) return this
    !this[0].visible || ['','none'].includes(this[0].style.display) ? this.show() : this.hide()
}

for (let event of 'focus blur click change input keydown submit load error'.split(' ')) {
    $.prototype[event] = function(selector, handler) {
        (selector || handler)
            ? this.on(event, selector, handler)
            : this.trigger(event)
    }
}

$.prototype.prev = function() {
    if (!this[0]) return this
    return $(this[0].previousSibling)
}
$.prototype.next = function() {
    if (!this[0]) return this
    return $(this[0].nextSibling)
}

$.prototype.move = function(options) {
    var options = Object.assign({
            handle: this,
            container: this.parent()
        }, options),
        object = this,
        newX, newY,
        nadir = object.css('z-index'),
        apex = 100000,
        hold = 'mousedown touchstart',
        move = 'mousemove touchmove',
        release = 'mouseup touchend'

    if (!object.hasAttr('move')) object.attr('move', '')

    options.handle.on(hold, function(e) {
        if (e.type == 'mousedown' && e.which != 1) return
        object.css('z-index', apex)
        var marginX = options.container.width() - object.width(),
            marginY = options.container.height() - object.height(),
            oldX = object.position().left,
            oldY = object.position().top,
            touch = e.touches,
            startX = touch ? touch[0].pageX : e.pageX,
            startY = touch ? touch[0].pageY : e.pageY

        $(window)
            .on(move, function(e) {
                var touch = e.touches,
                    endX = touch ? touch[0].pageX : e.pageX,
                    endY = touch ? touch[0].pageY : e.pageY
                newX = Math.max(0, Math.min(oldX + endX - startX, marginX))
                newY = Math.max(0, Math.min(oldY + endY - startY, marginY))

                window.requestAnimationFrame
                    ? requestAnimationFrame(setElement)
                    : setElement()
            })
            .one(release, function(e) {
                e.preventDefault()
                object.css('z-index', nadir)
                $(this).off(move).off(release)
            })

        e.preventDefault()
    })

    return this

    function setElement() {
        object.css({top: newY, left: newX});
    }
}

},{"./utils":15}],12:[function(require,module,exports){
module.exports = {

stack : $el => {
    $el.addClass('fx-stack-container')
    const $children = $el.children()
    $children.each( (el, i) => {
        el.classList.add('fx-stack-el')
        setTimeout( _ => {
            el.classList.remove('fx-stack-el')
        }, i * 50)
    })
    setTimeout( _ => {
        $el.removeClass('fx-stack-container')
    }, $children.length * 50 + 500)
},

stamp : $el => {
    $el.addClass('fx-stamp-container')
    const $children = $el.children()
    $children.each( (el, i) => {
        el.classList.add('fx-stamp-el')
        setTimeout( _ => {
            el.classList.remove('fx-stamp-el')
        }, i * 60)
    })
    setTimeout( _ => {
        $el.removeClass('fx-stamp-container')
    }, $children.length * 60 + 500)
},

toast : $el => {
    $el.addClass('active')
    setTimeout( _ => {
        $el.removeClass('active')
    }, 4000)
},


}
},{}],13:[function(require,module,exports){
module.exports = {

app : {
    gear : '⚙️',
    user : '👤',
    users : '👥',
    lock : '🔒',
    'open-lock' : '🔓',
    key : '🔑',
    home : '🏠',
    exit : '🚪',
    call : '📞',
    search : '🔍',
    add : '✚',
    remove : '🗕',
    filter : '🕨',
    undo : '↶',
    redo : '↷',
    reload : '⟳',
    sync : '🗘',
    minimize : '🗕',
    restore : '🗗',
    maximize : '🗖',
    close : '⨯',
    copy : '🗇',
    accept : '✔️',
    cancel : '✖️',
    play : '▲',
    stop : '■',
    rec : '●',
    select : '⛶',
    select2 : '⬚',
    contrast : '◐',
    contrast2 : '◧',
    contrast3 : '◩',
    bars : '☰',
    'h-dots' : '⋯',
    'v-dots' : '⋮',
    rows : '▤',
    columns : '▥',
    grid : '▦',
    grid2 : '𝍖',
    warning : '⚠',
    error : '⨂',
    ban : '🛇',
    network : '🖧',
    alarm : '🔔',
    'volume-min' : '🔈',
    'volume-mid' : '🔉',
    'volume-max' : '🔊',
    'dim' : '🔅',
    'bright' : '🔆',
    mute : '🔇',
    'alarm-off' : '🔕',
},

office : {
    file : '📄',
    'img-file' : '🖻',
    chart : '📈',
    chart2 : '📊',
    folder : '📂',
    pen : '🖋️',
    pencil : '✏️',
    ballpen : '🖊️',
    crayon : '🖍',
    paintbrush : '🖌️',
    scissors : '✂️',
    clipboard : '📋',
    clip : '📎',
    link : '🔗',
    ruler : '📏',
    ruler2: '📐',
    pin : '📌',
    'safety-pin' : '🧷',
    card : '💳',
    label : '🏷️',
    memo : '📝',
    scroll : '📜',
    book : '📕',
    books : '📚',
    bookmark : '🔖',
    'open-book' : '📖',
    notebook : '📓',
    notepad : '🗒️',
    calendar : '📅',
    calendar2 : '📆',
    envelope : '✉️',
    email : '📧',
    mailbox : '📫',
    package : '📦',
    briefcase : '💼',
    newspaper : '📰',
    cabinet : '🗄️',
    'trash-can' : '🗑️',
},

electronics : {
    laptop : '💻',
    desktop : '🖥️',
    keyboard : '⌨️',
    'pc-mouse' : '🖱️',
    printer : '🖨️',
    smartphone : '📱',
    telephone : '☎️',
    microphone : '🎤',
    'studio-mic' : '🎙️',
    headphones : '🎧',
    camera : '📷',
    'video-camera' : '📹',
    'movie-camera' : '🎥',
    projector : '📽️',
    tv : '📺',
    radio : '📻',
    stereo : '📾',
    loudspeaker : '📢',
    gamepad : '🎮',
    joystick : '🕹️',
    'sd-card' : '⛘',
    cd : '💿',
    minidisc : '💽',
    floppy : '💾',
    tape : '📼',
    battery : '🔋',
    'power-plug' : '🔌',
    level : '🎚',
    knobs : '🎛',
},

tools : {
    tools : '🛠️',
    tools2 : '⚒️',
    wrench : '🔧',
    hammer : '🔨',
    pick : '⛏️',
    axe : '🪓',
    toolbox : '🧰',
    clamp : '🗜️',
    bolt : '🔩',
    bricks : '🧱',
    anchor : '⚓',
    scales : '⚖️',
    'old-key' : '🗝️',
    map : '🗺️',
    compass : '🧭',
    magnet : '🧲',
    abacus : '🧮',
    candle : '🕯',
    bulb : '💡',
    flashlight : '🔦',
    microscope : '🔬',
    telescope : '🔭',
    antenna : '📡',
    satellite : '🛰️',
    stethoscope : '🩺',
    syringe : '💉',
    'test-tube': '🧪',
    alembic : '⚗️',
    'petri-dish' : '🧫',
    watch : '⌚',
    stopwatch : '⏱️',
    clock : '⏰',
    hourglass : '⌛',
    razor : '🪒',
    dagger : '🗡️',
    swords : '⚔️',
    shield : '🛡️',
    bow : '🏹',
    gun : '🔫',
    bomb : '💣',
},

vehicles : {
    car : '🚗',
    'race-car' : '🏎️',
    rv : '🚙',
    bus : '🚌',
    minibus : '🚐',
    truck : '🚚',
    ambulance : '🚑',
    'fire-engine' : '🚒',
    skateboard : '🛹',
    scooter : '🛴',
    bicycle : '🚲',
    motorscooter : '🛵',
    motorcycle : '🏍️',
    metro : '🚇',
    train : '🚄',
    locomotive : '🚂',
    canoe : '🛶',
    sailboat : '⛵',
    speedboat : '🚤',
    motorboat : '🛥️',
    ferry : '⛴️',
    ship : '🚢',
    plane : '✈️',
    'small-plane': '🛩️',
    helicopter : '🚁',
    rocket : '🚀',
    ufo : '🛸',
},

buildings : {
    ecastle : '🏯',
    wcastle : '🏰',
    etemple : '⛩',
    wtemple : '🏛', 
    factory : '🏭',
    building : '🏢',
    mall : '🏬',
    school : '🏫',
    hospital : '🏥',
    mail : '🏣',
    store : '🏪',
    hotel : '🏨',
    'love-hotel' : '🏩',
    bank : '🏦',
    atm : '🏧',
},

characters : {
    jack : '⛄️',
    jack2 : '☃️',
    teddy : '🧸',
    teacherm : '👨‍🏫',
    teacherw : '👩‍🏫',
    scientistm : '👨‍🔬',
    scientistw : '👩‍🔬',
    hackerm : '👨‍💻',
    hackerw : '👩‍💻',
    artistm : '👨‍🎨',
    artistw : '👩‍🎨',
    doctorm : '👨‍⚕️',
    doctorw : '👩‍⚕️',
    astronautm : '👨‍🚀',
    astronautw : '👩‍🚀',
    elfm : '🧝‍♂️',
    elfw : '🧝‍♀️',
    fairym : '🧚‍♂️',
    fairyw : '🧚',
    merman : '🧜‍♂️',
    mermaid : '🧜‍♀️',
    magem : '🧙‍♂️',
    magew : '🧙‍♀️',
    geniem : '🧞‍♂️',
    geniew : '🧞‍♀️',
    superherom : '🦸‍♂️',
    superherow : '🦸‍♀️',
    supervillainm : '🦹‍♂️',
    supervillainw : '🦹‍♀️',
    vampirem : '🧛‍♂️',
    vampirew : '🧛‍♀️',
    zombiem : '🧟‍♂️',
    zombiew : '🧟‍♀️',
},

faces : {
    man : '👨',
    woman : '👩',
    robot : '🤖',
    skull : '💀',
    imp : '👿',
    monster : '👾',
    alien : '👽',
    ghost : '👻',
    goblin : '👺',
    ogre : '👹',
},

animals : {
    elefant : '🐘',
    rhino : '🦏',
    hippo : '🦛',
    monkey : '🐒',
    gorilla : '🦍',
    orangutan : '🦧',
    kangaroo : '🦘',
    sloth : '🦥',
    otter : '🦦',
    sheep : '🐑',
    ram : '🐏',
    goat : '🐐',
    deer : '🦌',
    camel : '🐪',
    horse : '🐎',
    llama : '🦙',
    pig : '🐖',
    cow : '🐄',
    turtle : '🐢',
    rabbit : '🐇',
    squirrel : '🐿️',
    hedgehog : '🦔',
    raccoon : '🦝',
    badger : '🦡',
    skank : '🦨',
    mouse : '🐁',
    rat : '🐀',
    cat : '🐈',
    dog : '🐕',
    leopard : '🐆',
    tiger : '🐅',
    snake : '🐍',
    gecko : '🦎',
    crocodile : '🐊',
    dragon : '🐉',
    dinosaur : '🦕',
    't-rex' : '🦖',
    dolphin : '🐬',
    shark : '🦈',
    whale : '🐋',
    whale2 : '🐳',
    fugu : '🐡',
    nemo : '🐟',
    dori : '🐠',
    crab : '🦀',
    lobster : '🦞',
    squid : '🦑',
    octopus : '🐙',
    penguin : '🐧',
    bird : '🐦',
    dove : '🕊️',
    eagle : '🦅',
    parrot : '🦜',
    peacock : '🦚',
    duck : '🦆',
    swan : '🦢',
    flamingo : '🦩',
    owl : '🦉',
    bat : '🦇',
    turkey : '🦃',
    rooster : '🐓',
    chick : '🐥',
    chick2 : '🐤',
    chick3: '🐣',
    snail : '🐌',
    butterfly : '🦋',
    mosquito : '🦟',
    bee : '🐝',
    ant : '🐜',
    cricket : '🦗',
    bug : '🐛',
    ladybug : '🐞',
    spider : '🕷️',
    scorpion : '🦂',
    microbe : '🦠',
},

plants : {
    herb : '🌿',
    leaf : '🍂',
    maple : '🍁',
    shamrock : '☘️',
    luck : '🍀',
    wheat : '🌾',
    bamboo : '🎋',
    flower : '🌼',
    sunflower : '🌻',
    rose : '🌹',
    hibiscus : '🌺',
    sakura : '🌸',
    tulip : '🌷',
    tree : '🌳',
    pine : '🌲',
    'palm-tree' : '🌴',
    cactus : '🌵',
    sprout : '🌱',
    nut : '🌰',
},

nature : {
    sun : '☀️',
    moon : '🌕',
    'new-moon' : '🌑',
    'crescent-moon' : '🌙',
    fire : '🔥',
    water : '💧',
    wave : '🌊',
    ice : '🧊',
    snowflake : '❄️',
    wind : '💨',
    cloud : '☁️',
    mountain : '⛰️',
    volcano : '🌋',
    rainbow : '🌈',
    globe : '🌏',
    globe2 : '🌎',
    globe3 : '🌍',
    comet : '☄️',
    planet : '🪐',
    galaxy : '🌌',
    dna : '🧬',
    cloudy : '⛅️',
    cloudy2 : '🌥',
    rainwsun : '🌦',
    rain : '🌧',
    storm : '⛈',
    thunder : '🌩',
    snow : '🌨',
    tornado : '🌪',
},

'food & drink' : {
    burger : '🍔',
    sandwich : '🥪',
    kebab : '🥙',
    taco : '🌮',
    burrito : '🌯',
    salad : '🥗',
    pizza : '🍕',
    'hot-dog' : '🌭',
    fries : '🍟',
    spaghetti : '🍝',
    paella : '🥘',
    falafel : '🧆',
    bread : '🍞',
    bread2 : '🥖',
    croissant : '🥐',
    bagel : '🥯',
    pretzel : '🥨',
    butter : '🧈',
    cheese : '🧀',
    egg : '🥚',
    'fried-egg' : '🍳',
    meat : '🥩',
    meat2 : '🍖',
    'chicken-leg' : '🍗',
    bacon : '🥓',
    onigiri : '🍙',
    gohan : '🍚',
    kare : '🍛',
    ramen : '🍜',
    dango : '🍡',
    sashimi : '🍣',
    shrimp : '🍤',
    oyster : '🦪',
    lobster : '🦞',
    soup : '🍲',
    bento : '🍱',
    takeout :'🥡',
    candy : '🍬',
    lollipop : '🍭',
    chocolate : '🍫',
    popcorn : '🍿',
    cookie : '🍪',
    donut : '🍩',
    waffle : '🧇',
    pancakes : '🥞',
    icecream : '🍨',
    icecream2 : '🍦',
    frosty : '🍧',
    pie : '🥧',
    cake : '🍰',
    cupcake : '🧁',
    'moon-cake': '🥮',
    custard : '🍮',
    banana : '🍌',
    strawberry : '🍓',
    cherry : '🍒',
    plum : '🍑',
    pear : '🍐',
    apple : '🍎',
    apple2 : '🍏',
    pineapple : '🍍',
    lemon : '🍋',
    orange : '🍊',
    melon : '🍈',
    watermelon : '🍉',
    mango : '🥭',
    coconut : '🥥',
    kiwi : '🥝',
    grapes : '🍇',
    tomato : '🍅',
    eggplant : '🍆',
    avocado : '🥑',
    broccoli : '🥦',
    cucumber : '🥒',
    greeny : '🥬',
    chili : '🌶',
    corn : '🌽',
    carrot : '🥕',
    potato : '🥔',
    'sweet-potato' : '🍠',
    garlic : '🧄',
    onion : '🧅',
    mushroom : '🍄',
    peanut : '🥜',
    honey : '🍯',
    juice : '🧃',
    tea : '🍵',
    coffee : '☕️',
    milk : '🥛',
    beer : '🍺',
    beers : '🍻',
    cheers : '🥂',
    daikiri : '🍹',
    martini : '🍸',
    whiskey : '🥃',
    wine : '🍷',
    sake : '🍶',
    mate : '🧉',
    forknife : '🍴',
    chopsticks : '🥢',
},

'sports & fun' : {
    running : '🏃',
    biking : '🚴‍♂️',
    climbing : '🧗‍♂️',
    swimming : '🏊',
    surfing : '🏄',
    rowing : '🚣‍♂️',
    diving : '🤿',
    skating : '⛸',
    skiing : '⛷',
    snowboard : '🏂',
    horseride : '🏇',
    yoga : '🧘‍♂️',
    rolling : '🤸‍♂️',
    juggling : '🤹‍♂️',
    basketball : '🏀',
    soccer : '⚽',
    football : '🏈',
    rugby : '🏉',
    volleyball : '🏐',
    beisball : '⚾',
    tennis : '🎾',
    badminton : '🏸',
    'ping-pong' : '🏓',
    hockey: '🏑',
    'ice-hockey': '🏒',
    lacrosse : '🥍',
    'cricket-game' : '🏏',
    golf : '⛳️',
    fishing : '🎣',
    box : '🥊',
    martial : '🥋', 
    frisbee : '🥏',
    bowling : '🎳',
    pool : '🎱',
    die : '🎲',
    puzzle : '🧩',
    slot : '🎰',
    darts : '🎯',
    theatre : '🎭',
    palette : '🎨',
    movie : '🎬',
    party : '🎉',
    party2 : '🎊',
    baloon : '🎈',
    yoyo : '🪀',
    kite : '🪁',
    fireworks : '🎇',
    fireworks2 : '🎆',
    santa : '🎅',
    xmas : '🎄',
    haloween : '🎃',
    birthday : '🎂',
    gift : '🎁',
},

music : {
    note : '🎵',
    notes : '🎶',
    sharp : '♯',
    flat : '♭',
    cleff : '🎼',
    'cleff-g' : '𝄞',
    'cleff-f' : '𝄢',
    'cleff-c' : '𝄡',
    guitar : '🎸',
    banjo : '🪕',
    piano : '🎹',
    violin : '🎻',
    saxophone : '🎷',
    trumpet : '🎺',
    drum : '🥁',
},

clothing : {
    shirt : '👕',
    't-shirt' : '👔',
    shorts : '🩳',
    pants : '👖',
    blouse : '👚',
    dress : '👗',
    sari : '🥻',
    'swim-suit' : '🩱',
    bikini : '👙',
    yukata : '👘',
    vest : '🦺',
    coat : '🧥',
    'lab-coat' : '🥼',
    heels : '👠',
    sandal : '👡',
    ballet : '🩰',
    texan : '👢',
    shoe : '👞',
    snicker : '👟',
    boot : '🥾',
    flats : '🥿',
    socks : '🧦',
    briefs : '🩲',
    gloves : '🧤',
    scarf : '🧣',
    hat : '👒',
    'top-hat' : '🎩',
    cap : '🧢',
    'grad-cap' : '🎓',
    helmet : '⛑',
    crown : '👑',
    pouch : '👝',
    purse : '👛',
    handbag : '👜',
    suitcase : '💼',
    backpack : '🎒',
    glasses : '👓',
    sunglasses : '🕶️',
    goggles : '🥽',
    ribbon : '🎀',
},

other : {
    hand: '✋',
    'thumbs-up' : '👍',
    'thumbs-down' : '👎',
    cool : '🤙',
    metal : '🤘',
    spock : '🖖',
    pinch : '🤏',
    arm : '💪',
    'bionic-arm' : '🦾',
    leg : '🦵',
    'bionic-leg' : '🦿',
    foot : '🦶',
    eye : '👁️',
    ear : '👂',
    'bionic-ear' : '🦻',
    tooth : '🦷',
    bone : '🦴',
    brain : '🧠',
    blood : '🩸',
    'band-aid' : '🩹',
    poo : '💩',
    heart : '❤️',
    hearts : '💕',
    'broken-heart' : '💔',
    star : '⭐',
    trophy : '🏆',
    diamond : '💎',
    jar : '⚱️',
    jar2 : '🏺',
    broom : '🧹',
    cart : '🛒',
    chair : '🪑',
    pill : '💊',
    globe : '🌐',
    flag : '⚑',
    film : '🎞️',
    newbie : '🔰',
    trident : '🔱',
    japan : '🗾',
    fuji : '🗻',
    'tokyo-tower' : '🗼',
    liberty : '🗽',
    picture : '🖼️',
    'crystal-ball' : '🔮',
    recycle : '♻',
    access : '♿',
    hot : '♨️',
    poison : '☠️',
    tension : '⚡',
    radioactive : '☢️',
    biohazard : '☣️',
    bisexual : '⚥',
    trans : '⚧',
    bitcoin : '₿',
},

culture : {
    pommee : '🕂',
    maltese : '✠',
    latin : '✝',
    latin2 : '🕇',
    celtic : '🕈',
    jew : '✡',
    ankh : '☥',
    peace : '☮',
    ohm : '🕉',
    'ying-yang' : '☯',
    atom : '⚛️',
    communism : '☭',
    'moon-star' : '☪',
    health : '⛨',
    darpa : '☸',
    diamonds : '❖',
},

astrology : {
    aries : '♈',
    tauro : '♉',
    gemini : '♊',
    piscis : '♋',
    leo : '♌',
    virgo : '♍',
    libra : '♎',
    scorpio : '♏',
    sagitarius : '♐',
    capricorn : '♑',
    aquarius : '♒',
    cancer : '♓',
    mercury : '☿️',
    venus : '♀',
    earth : '♁',
    mars : '♂',
    jupiter : '♃',
    saturn : '♄',
    uranus : '♅',
    neptune : '♆',
    pluto : '♇',
    ceres : '⚳',
    pallas : '⚴',
    juno : '⚵',
    vesta : '⚶',
    chiron : '⚷',
},

chess : {
    wqueen : '♔',
    wking : '♕',
    wtower : '♖',
    wbishop : '♗',
    whorse : '♘',
    wpawn : '♙',
    bqueen : '♚',
    bking : '♛',
    btower : '♜',
    bbishop : '♝',
    bhorse : '♞',
    bpawn : '♟',
},

arrows : {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    up2: '⇧',
    down2: '⇩',
    left2: '⇦',
    right2: '⇨',
    up3: '△',
    down3: '▽',
    left3: '◁',
    right3: '▷',
},

'keys & shapes' : {
    command : '⌘',
    option : '⌥',
    shift : '⇧',
    'caps-lock' : '⇪',
    backspace : '⌫',
    return : '⏎',
    enter : '⎆',
    escape : '⎋',
    tab : '↹',
    power : '⏻',
    sleep : '⏾',
    triangle : '▲',
    square : '■',
    pentagon : '⬟',
    hexagon : '⬢',
    circle : '●',
    'curved-triangle' : '🛆',
    'curved-square' : '▢',
    'square-quadrant' : '◰',
    'round-quadrant' : '◴',
},

hieroglyphs : {
    'hg-eye' : '𓁹',
    'hg-tear-eye' : '𓂀',
    'hg-ear' : '𓂈',
    'hg-writing-arm' : '𓃈',
    'hg-leg' : '𓂾',
    'hg-watering-leg' : '𓃂',
    'hg-hand' : '𓂧',
    'hg-hand-2' : '𓂩',
    'hg-finger' : '𓂭',
    'hg-open-wound' : '𓂍',
    'hg-arms-hat-spear' : '𓂙',
    'hg-staff' : '𓋈',
    'hg-fan' : '𓇬',
    'hg-jar' : '𓄣',
    'hg-beetle' : '𓆣',
    'hg-wasp' : '𓆤',
    'hg-fairy' : '𓋏',
    'hg-sitting-man' : '𓀀',
    'hg-happy-sitting-man' : '𓁏',
    'hg-sitting-woman' : '𓁑',
    'hg-sitting-bird-man' : '𓁟',
    'hg-sitting-wolf-man' : '𓁢',
    'hg-dancing-man' : '𓀤',
    'hg-broken-arms-man' : '𓀣',
    'hg-upside-down-man' : '𓀡',
    'hg-dead-guy' : '𓀿',
    'hg-three-legged-guy' : '𓁲',
},

/*

animal faces
🐼🐻🐺🐮🐷🐭🐹🐰🐱🐶🐵🐴🐯🐲🐨🐸🦄

*/

}

},{}],14:[function(require,module,exports){
exports.themes = {

    base : {
        font : 'normal 14px Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols, EmojiOne Mozilla',
        palette : {
            primary    : 'darkcyan',
            danger     : 'red',
            success    : 'green',
            darkest    : '#111',
            darker     : '#222',
            dark       : '#444',
            mid        : '#999',
            light      : '#bbb',
            lighter    : '#ddd',
            lightest   : '#eee',
            darken     : 'rgba(0,0,0,0.05)',
            darkener   : 'rgba(0,0,0,0.2)',
            darkenest  : 'rgba(0,0,0,0.5)',
            lighten    : 'rgba(255,255,255,0.05)',
            lightener  : 'rgba(255,255,255,0.2)',
            lightenest : 'rgba(255,255,255,0.5)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'darkest lighten',  // bg, header bg
        panel   : 'darker lighten',   // bg, header bg
        section : 'dark lighten',     // bg, header bg
        field   : 'transparent light',// bg, text
        btn     : 'primary darker',   // bg, text
        header  : 'light',            // text
        label   : 'light',            // text
        text    : 'light',            // text
    },

    light : {
        page    : 'light darken',
        panel   : 'mid lighten',
        section : 'lighten darken',
        field   : 'transparent dark',
        btn     : 'primary dark',
        header  : 'darker',
        label   : 'darker',
        text    : 'darker',
    },
    
}
},{}],15:[function(require,module,exports){
function type(exp) {
    const clazz = Object.prototype.toString.call(exp)
    return clazz.substring(8, clazz.length-1).toLowerCase()
}

const primitives = 'string number boolean symbol'
const all_types = 'object function array regexp ' + primitives

const is = {}
all_types.split(' ')
    .forEach(t => {
        is[t] = exp => type(exp) === t
    })
is.primitive = exp => primitives.includes( type(exp) )
is.empty = exp =>
    (is.array(exp) || is.string(exp)) ? exp.length === 0
    : is.object(exp) ? Object.keys(exp).length === 0
    : false
is.not = Object.fromEntries( Object.entries(is).map(([k,f]) => [k, exp => !f(exp)]) )
is.def = ref => ref !== undefined && ref !== null
is.nil = ref => !is.def(ref)


const sameType = (exp1, exp2) => type(exp1) === type(exp2)


const compose = (...funcs) => funcs.reduce((prev, curr) => (...args) => curr(prev(...args)))


const chain = ref => method => (...args) => { method(...args); return ref }


const safe = err_handler => method => (...args) => {
    try { method(...args) }
    catch(err) { is.array(err) ? err_handler(...err) : err_handler(err) }
}


const prepTemplate = tmpl_func => data => data.map( compose( checkData, tmpl_func )).join('')


function inject(sources) {
    if (is.string(sources)) sources = sources.split(',')
    if (is.not.array(sources)) return rasti.error('Invalid sources, must be an array or a string')
    const $body = $(document.body)

    function do_inject(sources) {
        const src = sources.shift().trim()
        const ext = src.split('.')[1]
        let $el

        switch (ext) {
            case 'js':
                $el = $('<script>').attr('src', src)
                break
            case 'css':
                $el = $('<link rel=stylesheet>').attr('href', src)
                break
            default:
                rasti.error('Invalid source "%s", must be a js script or a css stylesheet', src)
                return
        }
  
        $el[0].onload = () => {
            rasti.log('> Loaded %s', src)
            sources.length
                ? do_inject(sources)
                : rasti.log('All sources loaded')
        }

        $el[0].onerror = e => {
            rasti.error('> Error loading %s', src, e)
        }
        
        rasti.log('> Loading %s ...', src)
        $body.append($el)
    }

    do_inject(sources)
}


function checkData(data) {
    switch (typeof data) {
        case 'string':
            data = {value: data, label: data, alias: data.toLowerCase()}
            break
        case 'object':
            if ( is.not.string(data.value) || is.not.string(data.label) ) {
                rasti.error('Invalid data object (must have string properties "value" and "label"):', data)
                //invalid_count++
                data = {value: '', label: 'INVALID DATA', alias: ''}
            }
            else if ( is.not.string(data.alias) ) {
                if (data.alias) {
                    rasti.error('Invalid data property "alias" (must be a string):', data)
                    //invalid_count++
                }
                data.alias = data.value.toLowerCase()
            }
            else data.alias = data.alias.toLowerCase() +' '+ data.value.toLowerCase()
            break
        default:
            rasti.error('Invalid data (must be a string or an object):', data)
            //invalid_count++
            data = {value: '', label: 'INVALID DATA', alias: ''}
    }
    return data
}


function html(templateObject, ...substs) {
    // Use raw template strings (don’t want backslashes to be interpreted)
    const raw = templateObject.raw
    let result = ''

    substs.forEach((subst, i) => {
        let lit = raw[i]
        // Turn array into string
        if ( is.array(subst) ) subst = subst.join('')
        // If subst is preceded by an !, escape it
        if ( lit.endsWith('!') ) {
            subst = htmlEscape(subst)
            lit = lit.slice(0, -1)
        }
        result += lit
        result += subst
    })
    // Take care of last template string
    result += raw[raw.length - 1]

    return result
}


function htmlEscape(str) {
    return str.replace(/&/g, '&amp;') // first!
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;')
}


function resolveAttr($el, name) {
    var value = $el.attr(name) || $el.attr('name') || $el.attr('template') || $el.attr('prop') || $el.attr('nav') || $el.attr('section') || $el.attr('panel') || $el.attr('page')
    if (!value) rasti.warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
    return value
}


/**
 * Makes a widget navigatable via keyboard
 * @param {jquery object} $el widget container
 */
function keyNav($el) {

    if ($el.is('[template]')) {
        $el.on('keydown', e => {
            const $trigger = $(e.target)

            switch(e.keyCode) {
                case 37:
                case 38:
                    $trigger.off('blur')
                        .prev().focus()
                    return false
                case 39:
                case 40:
                    $trigger.off('blur')
                        .next().focus()
                    return false
                case 13:
                case 32:
                    $trigger.off('blur').click()
                    setTimeout(() => $el.find('.active').focus(), 0)
                    return false
            }
        })
        .on('rendered', e => {
            let $child, isActive,
                noActive = true

            $el.children().each( child => {
                $child = $(child)
                isActive = $child.is('.active')
                $child.attr('tabindex', isActive ? 0 : -1)
                if (isActive) {
                    noActive = false
                    $child.on('focus', e => e.target.setAttribute('tabindex', -1))
                }
            })

            if (noActive) {
                $el.children().first()
                    .attr('tabindex', 0)
                    .on('focus', e => e.target.setAttribute('tabindex', -1))
            }
        })
        .on('focus', 'div', e =>
            $(e.target).one('blur', e => setTimeout(() => $el.find('.active').attr('tabindex', 0), 0))
        )
    } else {
        $el.attr('tabindex', 0)
            .on('keydown', e => !'Enter Space'.includes(e.key) || (e.target.click(), false))
    }
}


const random = () => (Math.random() * 6 | 0) + 1


const public = {
    is,
    type,
    sameType,
    inject,
    random,
    compose,
    chain,
    safe,
    keyNav,
}

const private = {
    prepTemplate,
    checkData,
    html,
    resolveAttr,
}

module.exports = {
    ...public,
    ...private,
    public,
}

},{}],16:[function(require,module,exports){
(function (global){
/* Umbrella JS 3.1.0 umbrellajs.com */

var u=$=function(t,e){return this instanceof u?t instanceof u?t:("string"==typeof t&&(t=this.select(t,e)),t&&t.nodeName&&(t=[t]),void(this.nodes=this.slice(t))):new u(t,e)};u.prototype={get 0(){return this.nodes[0]},get length(){return this.nodes.length}},u.prototype.nodes=[],u.prototype.add=function(t){return this.nodes=this.nodes.concat(this.select(t)),this},u.prototype.addClass=function(){return this.eacharg(arguments,function(t,e){t.classList.add(e)})},u.prototype.adjacent=function(i,t,n){return"number"==typeof t&&(t=0===t?[]:new Array(t).join().split(",").map(Number.call,Number)),this.each(function(r,o){var e=document.createDocumentFragment();u(t||{}).map(function(t,e){var n="function"==typeof i?i.call(this,t,e,r,o):i;return"string"==typeof n?this.generate(n):u(n)}).each(function(t){this.isInPage(t)?e.appendChild(u(t).clone().first()):e.appendChild(t)}),n.call(this,r,e)})},u.prototype.after=function(t,e){return this.adjacent(t,e,function(t,e){t.parentNode.insertBefore(e,t.nextSibling)})},u.prototype.append=function(t,e){return this.adjacent(t,e,function(t,e){t.appendChild(e)})},u.prototype.args=function(t,e,n){return"function"==typeof t&&(t=t(e,n)),"string"!=typeof t&&(t=this.slice(t).map(this.str(e,n))),t.toString().split(/[\s,]+/).filter(function(t){return t.length})},u.prototype.array=function(o){o=o;var i=this;return this.nodes.reduce(function(t,e,n){var r;return o?((r=o.call(i,e,n))||(r=!1),"string"==typeof r&&(r=u(r)),r instanceof u&&(r=r.nodes)):r=e.innerHTML,t.concat(!1!==r?r:[])},[])},u.prototype.attr=function(t,e,r){return r=r?"data-":"",this.pairs(t,e,function(t,e){return t.getAttribute(r+e)},function(t,e,n){t.setAttribute(r+e,n)})},u.prototype.before=function(t,e){return this.adjacent(t,e,function(t,e){t.parentNode.insertBefore(e,t)})},u.prototype.children=function(t){return this.map(function(t){return this.slice(t.children)}).filter(t)},u.prototype.clone=function(){return this.map(function(t,e){var n=t.cloneNode(!0),r=this.getAll(n);return this.getAll(t).each(function(t,e){for(var n in this.mirror)this.mirror[n]&&this.mirror[n](t,r.nodes[e])}),n})},u.prototype.getAll=function(t){return u([t].concat(u("*",t).nodes))},u.prototype.mirror={},u.prototype.mirror.events=function(t,e){if(t._e)for(var n in t._e)t._e[n].forEach(function(t){u(e).on(n,t)})},u.prototype.mirror.select=function(t,e){u(t).is("select")&&(e.value=t.value)},u.prototype.mirror.textarea=function(t,e){u(t).is("textarea")&&(e.value=t.value)},u.prototype.closest=function(e){return this.map(function(t){do{if(u(t).is(e))return t}while((t=t.parentNode)&&t!==document)})},u.prototype.data=function(t,e){return this.attr(t,e,!0)},u.prototype.each=function(t){return this.nodes.forEach(t.bind(this)),this},u.prototype.eacharg=function(n,r){return this.each(function(e,t){this.args(n,e,t).forEach(function(t){r.call(this,e,t)},this)})},u.prototype.empty=function(){return this.each(function(t){for(;t.firstChild;)t.removeChild(t.firstChild)})},u.prototype.filter=function(e){var t=function(t){return t.matches=t.matches||t.msMatchesSelector||t.webkitMatchesSelector,t.matches(e||"*")};return"function"==typeof e&&(t=e),e instanceof u&&(t=function(t){return-1!==e.nodes.indexOf(t)}),u(this.nodes.filter(t))},u.prototype.find=function(e){return this.map(function(t){return u(e||"*",t)})},u.prototype.first=function(){return this.nodes[0]||!1},u.prototype.generate=function(t){return/^\s*<tr[> ]/.test(t)?u(document.createElement("table")).html(t).children().children().nodes:/^\s*<t(h|d)[> ]/.test(t)?u(document.createElement("table")).html(t).children().children().children().nodes:/^\s*<script>/.test(t)?u(document.createElement("script")).nodes:/^\s*</.test(t)?u(document.createElement("div")).html(t).children().nodes:document.createTextNode(t)},u.prototype.getset=function(e,n,t){return void 0===n?this.first()[e]||t:this.each(function(t){t[e]=n})},u.prototype.handle=function(){var t=this.slice(arguments).map(function(e){return"function"==typeof e?function(t){t.preventDefault(),e.apply(this,arguments)}:e},this);return this.on.apply(this,t)},u.prototype.hasClass=function(){return this.is("."+this.args(arguments).join("."))},u.prototype.html=function(e){return void 0===e?this.first().innerHTML||"":this.each(function(t){t.innerHTML=e})},u.prototype.is=function(t){return 0<this.filter(t).length},u.prototype.isInPage=function(t){return t!==document.body&&document.body.contains(t)},u.prototype.last=function(){return this.nodes[this.length-1]||!1},u.prototype.map=function(t){return t?u(this.array(t)).unique():this},u.prototype.not=function(e){return this.filter(function(t){return!u(t).is(e||!0)})},u.prototype.off=function(t){return this.eacharg(t,function(e,n){u(e._e?e._e[n]:[]).each(function(t){e.removeEventListener(n,t)})})},u.prototype.on=function(t,e,r){if("string"==typeof e){var o=e;e=function(e){var n=arguments;u(e.currentTarget).find(o).each(function(t){if(t===e.target||t.contains(e.target)){try{Object.defineProperty(e,"currentTarget",{get:function(){return t}})}catch(t){}r.apply(t,n)}})}}var n=function(t){return e.apply(this,[t].concat(t.detail||[]))};return this.eacharg(t,function(t,e){t.addEventListener(e,n),t._e=t._e||{},t._e[e]=t._e[e]||[],t._e[e].push(n)})},u.prototype.pairs=function(n,t,e,r){if(void 0!==t){var o=n;(n={})[o]=t}return"object"==typeof n?this.each(function(t){for(var e in n)r(t,e,n[e])}):this.length?e(this.first(),n):""},u.prototype.param=function(e){return Object.keys(e).map(function(t){return this.uri(t)+"="+this.uri(e[t])}.bind(this)).join("&")},u.prototype.parent=function(t){return this.map(function(t){return t.parentNode}).filter(t)},u.prototype.prepend=function(t,e){return this.adjacent(t,e,function(t,e){t.insertBefore(e,t.firstChild)})},u.prototype.remove=function(){return this.each(function(t){t.parentNode&&t.parentNode.removeChild(t)})},u.prototype.removeClass=function(){return this.eacharg(arguments,function(t,e){t.classList.remove(e)})},u.prototype.replace=function(t,e){var n=[];return this.adjacent(t,e,function(t,e){n=n.concat(this.slice(e.children)),t.parentNode.replaceChild(e,t)}),u(n)},u.prototype.scroll=function(){return this.first().scrollIntoView({behavior:"smooth"}),this},u.prototype.select=function(t,e){return t=t.replace(/^\s*/,"").replace(/\s*$/,""),/^</.test(t)?u().generate(t):this.slice((e||document).querySelectorAll(t))},u.prototype.serialize=function(){var r=this;return this.slice(this.first().elements).reduce(function(e,n){return!n.name||n.disabled||"file"===n.type?e:/(checkbox|radio)/.test(n.type)&&!n.checked?e:"select-multiple"===n.type?(u(n.options).each(function(t){t.selected&&(e+="&"+r.uri(n.name)+"="+r.uri(t.value))}),e):e+"&"+r.uri(n.name)+"="+r.uri(n.value)},"").slice(1)},u.prototype.siblings=function(t){return this.parent().children(t).not(this)},u.prototype.size=function(){return this.first().getBoundingClientRect()},u.prototype.slice=function(t){return t&&0!==t.length&&"string"!=typeof t&&"[object Function]"!==t.toString()?t.length?[].slice.call(t.nodes||t):[t]:[]},u.prototype.str=function(e,n){return function(t){return"function"==typeof t?t.call(this,e,n):t.toString()}},u.prototype.text=function(t){return this.getset("textContent",t,"")},u.prototype.toggleClass=function(t,e){return!!e===e?this[e?"addClass":"removeClass"](t):this.eacharg(t,function(t,e){t.classList.toggle(e)})},u.prototype.trigger=function(t){var o=this.slice(arguments).slice(1);return this.eacharg(t,function(t,e){var n,r={bubbles:!0,cancelable:!0,detail:o};try{n=new window.CustomEvent(e,r)}catch(t){(n=document.createEvent("CustomEvent")).initCustomEvent(e,!0,!0,o)}t.dispatchEvent(n)})},u.prototype.unique=function(){return u(this.nodes.reduce(function(t,e){return null!=e&&!1!==e&&-1===t.indexOf(e)?t.concat(e):t},[]))},u.prototype.uri=function(t){return encodeURIComponent(t).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A").replace(/%20/g,"+")},u.prototype.val=function(t){return this.getset("value",t)},u.prototype.wrap=function(t){return this.map(function(e){return u(t).each(function(t){(function(t){for(;t.firstElementChild;)t=t.firstElementChild;return u(t)})(t).append(e.cloneNode(!0)),e.parentNode.replaceChild(t,e)})})},"object"==typeof module&&module.exports&&(module.exports=u,module.exports.u=u);
require('./js/extensions')
const { History, Pager, state, crud } = require('./js/components')
const utils = require('./js/utils')
const { is, sameType, resolveAttr, chain, safe, compose, html } = utils
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


    // public methods

    const api = compose(safe(error), chain(this))

    
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
            container.find(tag + '[label]').each( el => {
                fixLabel($(el))
            })
        })


        // fix input icons
        container.find('input[icon]').each( el => {
            fixIcon($(el))
        })


        // init blocks and data templates
        container.find('[data]').each( el => {
            updateBlock($(el))
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
        container.find('[key-nav]').each( el => {
            utils.keyNav($(el))
        })

        
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

        var $prevPage = self.active.page,
            prevPagename = $prevPage && $prevPage.attr('page'),
            prevPage = prevPagename && self.pages[prevPagename]

        if (pagename == prevPagename) return

        var page = self.pages[pagename],
            $page = container.find('[page='+ pagename +']')

        if (!$page.length) throw ['Cannot navigate to page [%s]: page container not found', pagename]

        container.find('[menu]').hide()
        container.find('.rs-backdrop').removeClass('backdrop')

        if ($prevPage) $prevPage.removeClass('active')

        if (prevPage && prevPage.out) {
            is.not.function(prevPage.out)
                ? warn('Page [%s] {out} property must be a function!', prevPagename)
                : prevPage.out(params)
        }

        self.active.page = $page

        if ( params && is.not.object(params) ) warn('Page [%s] nav params must be an object!', pagename)
        if (page && page.in) {
            is.not.function(page.in)
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
            $el = el.nodeName ? $(el) : el
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


    const updateBlock = api(($el, data) => {

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

    })


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
    Object.assign(this, {config, init, navTo, render, setLang, setTheme, updateBlock})

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
        $el.is('[template]') ? render($el, $el.is('[data]') ? null : value)
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
                    app.options[key] = $container.attr(key)
                    // non-value boolean attributes are true
                    if (is.boolean(options[key]) && !app.options[key]) app.options[key] = true
                }
            })
            // load any declared sources
            var sources = $container.attr('src')
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


$('head').prepend( genBlockStyles() + `<style>:root{--pad:20px}body{margin:0;overflow-x:hidden;text-shadow:0 0 0}*,:after,:before{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:background-color .2s}:focus{outline-style:none;outline-color:var(--lightener)}.active:focus{outline-color:var(--primary)}[key-nav] :focus{outline-style:solid}a{text-decoration:none;font-weight:600}h1{font-size:3em}h2{font-size:2.3em}h3{font-size:1.7em}h1,h2,h3{margin-top:0}p.big{font-size:1.5em}ol,ul{padding:5px 10px 5px 30px;border-radius:2px}li:not(:last-child){margin-bottom:5px}caption,table,tbody,td,tfoot,th,thead,tr{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}table{border:1px solid #0003;width:100%;text-align:center;border-collapse:collapse}table td,table th{border:1px solid #0003;padding:4px 5px}table thead{background:#ddd;border-bottom:3px solid #0003}table thead th{font-weight:700;text-align:center}table tfoot{font-weight:700;border-top:3px solid #0003}.field,button,input,select,textarea{min-height:35px;width:100%;padding:5px 10px;margin:0 0 15px 0;border:0;border-radius:2px;outline:0;font-family:inherit!important;font-size:inherit;vertical-align:text-bottom;transition:all .2s}input{border-radius:0}input:not([type]),input[type=email],input[type=password],input[type=tel],input[type=text]{box-shadow:0 2px 0 0 var(--lighten)}input:not([type]):hover,input[type=email]:hover,input[type=password]:hover,input[type=tel]:hover,input[type=text]:hover{box-shadow:0 2px 0 0 var(--lightener)}input:not([type]):focus,input[type=email]:focus,input[type=password]:focus,input[type=tel]:focus,input[type=text]:focus{box-shadow:0 2px 0 0 var(--primary)}input:not([type]):focus:invalid,input[type=email]:focus:invalid,input[type=password]:focus:invalid,input[type=tel]:focus:invalid,input[type=text]:focus:invalid{box-shadow:0 2px 0 0 var(--danger)}button,input[type=range],option,select{cursor:pointer}button{display:inline-block;height:50px;width:auto;min-width:50px;padding:10px 20px;border:1px solid rgba(0,0,0,.1);font-size:1.2em;text-align:center;text-decoration:none;text-transform:capitalize}button:not(:disabled):focus,button:not(:disabled):hover{filter:contrast(1.5)}button:disabled{filter:contrast(.5);cursor:auto}button[icon]{display:flex;align-items:center;justify-content:center;padding:0}select{appearance:none;-moz-appearance:none;-webkit-appearance:none}textarea{height:70px;resize:none}.big_>button,.big_>input,button.big,input.big{min-height:70px;margin-bottom:25px;font-size:1.5em}.small_>button,.small_>input,button.small,input.small{min-height:25px;max-height:25px;font-size:1em}input[type=checkbox],input[type=radio]{-webkit-appearance:none;appearance:none;min-height:25px;width:25px;margin:5px;font-size:2em;line-height:.6;text-align:center;vertical-align:middle;cursor:pointer}input[type=radio]{border-radius:50%}input[type=checkbox]+label,input[type=radio]+label{height:40px;max-width:90%;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;cursor:pointer}input[type=checkbox]:checked::before{content:'⨯';display:inline-block;position:absolute;color:#222}input[type=radio]:checked::after{display:inline-block;position:absolute;height:16px;width:16px;margin-left:-33px;background-color:#000;border-radius:50%}input[type=checkbox]:checked,input[type=checkbox]:focus,input[type=checkbox]:hover,input[type=radio]:checked,input[type=radio]:focus,input[type=radio]:hover{box-shadow:inset 0 0 4px #000}input[type=checkbox]+label:hover,input[type=checkbox]:focus+label,input[type=checkbox]:hover+label,input[type=radio]+label:hover,input[type=radio]:focus+label,input[type=radio]:hover+label{font-weight:600}input[type=checkbox].toggle{position:relative;height:26px;width:44px;border-radius:12px;transition:background-color .4s}input[type=checkbox].toggle::before{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background-color:#000;transition:left .4s}input[type=checkbox].toggle:checked::before{left:20px}meter,progress{width:100%;margin:0;border-radius:2px}meter{height:8px;border:1px solid #ccc}hr{display:flex;align-items:center;height:30px;border:none}hr::before{content:'';display:block;height:2px;width:100%;background-color:var(--darkener)}.tab-labels>.bar,button,input[type=checkbox]:checked,input[type=radio]:checked,nav>a.active,nav>div.active{background-color:var(--primary)}[page],[panel],[section]{position:relative;overflow:hidden}[page]{min-height:100vh;width:100vw!important;padding-bottom:10px;margin-bottom:-5px;overflow-y:auto}[page]:not(.active){display:none!important}nav:not([hidden])~[page]:not(.hide-nav){min-height:calc(100vh - 50px)}.fullh[page]{height:100vh}[panel]{padding:25px;border-radius:2px}[section]{padding:20px;border-radius:2px}[section] [label]:before{text-shadow:0 0 0 #000}[section]>:first-child:not([label]){margin-top:0}[section]:not(:last-child){margin-bottom:15px}[foldable],[header]{position:relative}[foldable],[foldable][class*=pad]{padding-top:35px}[header]:not([page]){padding-top:45px}[header].h-big{padding-top:55px}[foldable][panel],[header][panel]{padding-top:65px}[foldable]:before,[footer][page]:after,[header]:before{content:attr(header);display:flex;align-items:center;justify-content:center;width:100%;text-transform:capitalize}[foldable]:not([page]):before,[header]:not([page]):before{position:absolute;top:0;left:0}[foldable]:before,[header]:before{height:35px;padding:10px;font-size:1.2em;line-height:20px}[header][panel]:before{height:40px;font-size:1.5em}[header].h-big:before,[header][page]:before{height:50px;margin-bottom:15px;font-size:1.8em;line-height:30px}[footer][page]:after{content:attr(footer)}[page][header].h-fix:before{position:fixed;top:0}[movable]{user-select:none;cursor:move}[resizable]{resize:both;overflow:hidden}[foldable].open{animation:fold-out .2s}[foldable].folded{animation:fold-in .2s;height:0;overflow:hidden;padding-top:30px!important;padding-bottom:0}[foldable]:before{content:'△  'attr(foldable);cursor:pointer}[foldable].folded:before{content:'▽  'attr(foldable)}[foldable].folded:focus:before,[foldable].folded:hover:before{content:'▼  'attr(foldable)}[img]{background-repeat:no-repeat;background-position:center;background-size:contain;background-origin:content-box}[template]{position:relative}[template]:not(.rendered){display:none}[template]>.results{max-height:calc(100% - 60px);margin:0 -15px;padding:0 15px}[template][stats]>.results{max-height:calc(100% - 95px)}[template]>.controls{height:60px;padding:10px;color:#fff}[template]>.controls *{margin:0 2px}[template]>.stats{height:40px;padding:10px;font-size:1.1em}[paged]{padding-bottom:0!important}[crud]>*{position:relative}.rasti-crud-create{display:block!important}.rasti-crud,.rasti-crud-accept,.rasti-crud-cancel,.rasti-crud-input,[crud].active .rasti-crud-create{display:none!important}[crud].active .rasti-crud-accept,[crud].active .rasti-crud-cancel,[crud].active .rasti-crud-input{display:inline-block!important}[crud]>.rasti-crud{bottom:-40px;z-index:1}[crud]:hover>.rasti-crud,[crud]>:hover>.rasti-crud{display:block!important}[sidemenu].enabled{position:fixed!important;top:0;left:-80vw;height:100%;min-width:80vw!important;max-width:80vw;overflow-x:hidden;overflow-y:auto;z-index:10}[sidemenu].enabled.open{left:0;animation:slide-in .2s}[sidemenu].enabled.close{animation:slide-out .2s}.modal,[modal]{visibility:hidden;position:fixed;left:0;right:0;top:0;bottom:0;margin:auto!important;height:auto;width:auto;max-height:600px;max-width:400px;overflow-y:auto;z-index:10}.modal.big,[modal].big{max-height:800px;max-width:600px}.modal.small,[modal].small{max-height:400px;max-width:200px}[modal].open{visibility:visible;animation:zoom-in .2s,fade-in .2s}[modal].close{animation:zoom-out .2s,fade-out .2s}[menu]{visibility:hidden;position:fixed;background-color:inherit;box-shadow:0 0 4px 4px var(--darkener);z-index:10;cursor:pointer}[menu]>div{padding:10px;margin-bottom:0;text-transform:capitalize}[menu]>div:not(:last-child){border-bottom:1px solid #0003}[menu].open{visibility:visible;animation:fold .2s reverse}[menu].close{animation:fold .2s}[label]{position:relative;margin-top:35px;margin-bottom:15px;vertical-align:bottom}[label][fixed]>*{margin-bottom:0}[label]>input,[label]>select,[label]>textarea{margin-top:0!important}[label]:not([panel]):not([section]):before{content:attr(label);position:absolute;height:35px;line-height:35px;font-size:1.2em;text-transform:capitalize}[label]:before{top:0;left:0;margin-top:-35px}[label].big:before{margin-left:0}[label][fixed]:before{margin-top:-30px;margin-left:0}.inline-label[label],.inline-label_>[label]{width:auto;margin-top:0;padding-left:calc(40% + 10px)}.inline-label[label]:before,.inline-label_>[label]:before{top:auto;width:80%;left:-40%;margin-top:0;text-align:right}.inline-label[label][fixed]:before,.inline-label_>[label][fixed]:before{margin-top:0;margin-left:-8px}.below-label[label]:before,.below-label_>[label]:before{bottom:-40px;left:0;right:0;margin-top:0;margin-left:0}.big [label]{margin-top:25px;font-size:1.2em}.big [label]:before{margin-top:-27px}.clickable,[hide],[on-click],[onclick],[show],[toggle]{cursor:pointer}.hidden{position:absolute;visibility:hidden}.rel,.rel_>*{position:relative}.abs,.abs_>*{position:absolute}.fix,.fix_>*{position:fixed}.inline,.inline_>*{display:inline-block;margin-top:0;margin-bottom:0}.flex,.flex_>*{display:flex}.floatl,.floatl_>*{float:left}.floatr,.floatr_>*{float:right}.left,.left_>*{position:absolute;left:0}.right,.right_>*{position:absolute;right:0}.top,.top_>*{position:absolute;top:0}.bottom,.bottom_>*{position:absolute;bottom:0}.abs.centerx,.abs_.centerx_>*{left:0;right:0;margin:auto!important}.abs.centery,.abs_.centery_>*{top:0;bottom:0;margin:auto!important}.abs.center,.abs_.center_>*{left:0;right:0;top:0;bottom:0;margin:auto!important}.flex.centerx,.flex_.centerx_>*{justify-content:center}.flex.centery,.flex_.centery_>*{align-items:center}.flex.center,.flex_.center_>*{justify-content:center;align-items:center}.scrollx,.scrollx_>*{width:100%;overflow-x:auto;overflow-y:hidden}.scrolly,.scrolly_>*{height:100%;overflow-x:hidden;overflow-y:auto}.scroll,.scroll_>*{overflow:auto}.textl,.textl_>*{text-align:left}.textr,.textr_>*{text-align:right}.textc,.textc_>*{text-align:center}.fullw,.fullw_>*{width:100%}.fullh,.fullh_>*{height:100%}.halfw,.halfw_>*{width:50%}.halfh,.halfh_>*{height:50%}.autow,.autow_>*{width:auto}.autoh,.autoh_>*{height:auto}.autom,.autom_>*{margin:auto!important}.m0{margin:0!important}.pad-s,.pad-s_>*{padding:calc(var(--pad) * .5)}.pad,.pad_>*{padding:var(--pad)}.pad-l,.pad-l_>*{padding:calc(var(--pad) * 1.5)}.p0{padding:0!important}.round,.round_>*{border-radius:50%}.columns-2,.columns-3{display:flex;flex-wrap:wrap;align-content:flex-start}.columns-2>*{width:49%;margin-right:2%}.columns-3>*{width:32%;margin-right:2%}.columns-2>:nth-child(2n),.columns-3>:nth-child(3n){margin-right:0}.wrap{flex-wrap:wrap}.nowrap{flex-wrap:nowrap}.upper{text-transform:uppercase}.h-left:before{justify-content:left}.h-left:not([foldable]):before{padding-left:0}.h-upper:before{text-transform:uppercase}.scale-up,.scale-up_>*{transition:all .2s ease-in-out}.scale-up:hover,.scale-up_>:hover{transform:scale(1.1)}.tab-group{display:flex;flex-wrap:nowrap;height:100%;min-width:100%;overflow-x:auto;overflow-y:hidden}.tab-group>*{display:inline-block;white-space:normal;height:100%;min-width:100%;border-radius:0;margin-top:0;margin-bottom:0;margin-left:auto!important;margin-right:auto;vertical-align:top}.tab-labels+.tab-group{height:calc(100vh - 50px)}nav~[page]>.tab-labels+.tab-group{height:calc(100vh - 100px)}.tab-labels,nav{position:relative;display:flex;align-items:center;white-space:nowrap;min-width:100vw;height:50px;padding:0;border-bottom:1px solid var(--darkener);border-radius:0;text-transform:capitalize}nav{z-index:8}.tab-labels{justify-content:space-around;z-index:2}.tab-labels>.bar{position:absolute;bottom:0;left:0;height:4px;transition:left .2s,width .2s}[tab-label],nav>a,nav>div{display:flex;justify-content:center;align-items:center;flex:1 1 auto;height:100%;min-width:50px;padding:5px;font-size:1.4em;text-shadow:0 0 0 #000;text-decoration:none;border-right:1px solid #0003;color:inherit;cursor:pointer}nav>a,nav>div{transition:all .2s}[tab-label].active{filter:contrast(1.5)}.list{border:1px solid var(--darkener)}.list[header]{padding-top:40px}.list>div{position:relative;display:flex;align-items:center;height:7vh;padding:2vh;border:1px solid transparent;border-bottom-color:var(--darkener);transition:all .2s}.list>div:first-child{border-top-color:var(--darkener)}.list>div:focus,.list>div:hover{border-color:var(--lightener);outline:0}.list>div.active{color:var(--primary);font-weight:600}.list>div.active:focus{border-color:var(--primary)}.list>div.active:after,.list>div:focus:after,.list>div:hover:after{content:'';display:block;position:absolute;left:0;height:100%;width:4px;background-color:var(--lightener)}.list>div.active:after{background-color:var(--primary)}.nodata{padding:10% 5%;margin:auto;font-size:1.5rem;text-align:center}button.fab{position:fixed;bottom:0;right:0;width:50px;margin:20px;border-radius:50%;z-index:5}.backdrop:before{content:'';position:fixed;top:0;left:0;height:100vh;width:100vw;background:rgba(0,0,0,.7);animation:fade-in .2s;z-index:9}.loading{color:transparent!important;position:relative}.loading>*{visibility:hidden}.loading:after{content:'';position:absolute;top:0;bottom:0;left:0;right:0;width:25px;height:25px;margin:auto;border-radius:50%;border:.25rem solid var(--lighten);border-top-color:#fff;animation:spin 1s infinite linear;visibility:visible}.big.loading:after{position:fixed;width:100px;height:100px;z-index:10}.loading2{perspective:120px}.loading2:after{content:"";position:absolute;left:25px;top:25px;width:50px;height:50px;background-color:#3498db;animation:flip 1s infinite linear}.row{width:100%;display:flex;flex-flow:row wrap;align-content:flex-start;padding-left:1%}.col{display:flex;flex-flow:column nowrap;align-content:flex-start;align-items:center}.col>.row-1,.row>.col-1{flex-basis:7.33%}.col>.row-2,.row>.col-2{flex-basis:15.66%}.col>.row-3,.row>.col-3{flex-basis:24%}.col>.row-4,.row>.col-4{flex-basis:32.33%}.col>.row-5,.row>.col-5{flex-basis:40.66%}.col>.row-6,.row>.col-6{flex-basis:49%}.col>.row-7,.row>.col-7{flex-basis:57.33%}.col>.row-8,.row>.col-8{flex-basis:65.66%}.col>.row-9,.row>.col-9{flex-basis:74%}.col>.row-10,.row>.col-10{flex-basis:82.33%}.col>.row-11,.row>.col-11{flex-basis:90.66%}.row [class*=col-]{margin-left:0!important}.row [class*=col-]:not(:last-child){margin-right:1%!important}.col [class*=row-]{margin-top:0!important;margin-bottom:1vh!important}.page-options{flex-basis:initial!important}::-webkit-scrollbar{width:4px;background-color:transparent}::-webkit-scrollbar-thumb{max-height:10px;background-color:var(--lighten);background-clip:content-box;border-radius:4px}::-webkit-scrollbar-thumb:hover{background-color:var(--primary)}@-moz-document url-prefix(http://),url-prefix(https://){scrollbar{-moz-appearance:none!important;background:#0f0!important}scrollbarbutton,thumb{-moz-appearance:none!important;background-color:#00f!important}scrollbarbutton:hover,thumb:hover{-moz-appearance:none!important;background-color:red!important}scrollbarbutton{display:none!important}scrollbar[orient=vertical]{min-width:15px!important}}input[type=range]{--bg:var(--lighten);-webkit-appearance:none;background:0 0}input[type=range]:hover{--bg:var(--lightener)}input[type=range]:focus{--bg:var(--primary)}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:18px;width:18px;background-color:var(--primary);border-radius:50%;border:1px solid var(--darker);margin-top:-8px;cursor:pointer;transition:scale .2s}input[type=range]::-webkit-slider-runnable-track{width:100%;height:4px;background-color:var(--bg);border:1px solid var(--darker);border-radius:5px;cursor:pointer;transition:background-color .2s}input[type=range]:focus::-webkit-slider-thumb{transform:scale(1.1)}input[type=range]::-ms-track{width:100%;cursor:pointer;background:0 0;border-color:transparent;color:transparent}meter::-webkit-meter-bar{background:#fff}meter::-webkit-meter-optimum-value{background:linear-gradient(to bottom,#62c462,#51a351)}meter::-webkit-meter-suboptimum-value{background:linear-gradient(to bottom,#fbb450,#f89406)}meter::-webkit-meter-even-less-good-value{background:linear-gradient(to bottom,#ee5f5b,#bd362f)}[icon]{min-height:50px}[icon]:empty{padding:0}[icon]:before{display:inline-block;flex-grow:0;height:50px;width:50px;font-size:1.5rem;line-height:2;text-align:center;text-decoration:none;transition:all .2s}[on-click][icon]:empty{border:1px solid transparent;transition:all .2s}[on-click][icon]:empty:hover{border-color:var(--lightener)}[on-click][icon]:empty:focus{border-color:var(--primary)}.small[icon],.small_>[icon]{min-height:35px}.small[icon]:before,.small_>[icon]:before{height:35px;width:35px;font-size:1.2rem;line-height:1.7}.big[icon]:before,.big_>[icon]:before{height:70px;width:70px;font-size:2.2rem;line-height:1.9}.huge[icon]:before,.huge_>[icon]:before{height:100px;width:100px;font-size:3.2rem;line-height:1.9}.round[icon]:before,.round_>[icon]:before{border-radius:50%}.floating[icon]{position:relative;padding-left:0}.floating[icon]:before{position:absolute;top:0;left:4px;height:35px;width:35px;font-size:1.1rem}.floating[icon]>input{padding-left:45px}[icon=remove]:before{line-height:.6!important;font-weight:600}[icon=close]:before,[icon=network]:before{line-height:1!important}[icon=diamonds]:before{line-height:1.1!important}[icon=pommee]:before,[icon=restore]:before{line-height:1.2!important}[icon=ankh]:before,[icon=celtic]:before,[icon=comunism]:before,[icon=img-file]:before,[icon=latin2]:before,[icon=reload]:before,[icon=stereo]:before,[icon^=hg-]:before{line-height:1.3!important}[icon=filter]:before,[icon=sync]:before{line-height:1.3!important;transform:rotate(90deg)}[icon=error]:before{line-height:1.35!important;font-weight:600}[icon=copy]:before{line-height:1.5!important;font-weight:600;font-size:1.7rem}[icon=health]:before{line-height:1.5!important}[icon=warning]:before{line-height:1.6!important}[icon=maximize]:before,[icon=minimize]:before{line-height:1.7!important}[icon=play]:before,[icon=undo]:before{line-height:1.7!important;transform:rotate(90deg)}[icon=redo]:before{line-height:1.7!important;transform:rotate(-90deg)}[icon=caps-lock]:before,[icon=return]:before,[icon=shift]:before{font-family:auto;font-weight:600}[icon=candle]:before,[icon=desktop]:before,[icon=printer]:before,[icon=stopwatch]:before,[icon=studio-mic]:before{font-weight:600}[icon=tab]:before{font-family:auto}[icon=pinch]:before{transform:rotate(90deg)}[icon=crescent-moon]:before,[icon=moon]:before{filter:grayscale(1)}[fx=toast]{position:fixed;display:flex;left:0;right:0;bottom:-100px;width:100vw;max-width:600px;min-height:90px;max-height:90px;padding:20px;margin:auto;overflow:hidden;text-overflow:ellipsis;z-index:10;transition:bottom ease-out .25s}[fx=toast].active{bottom:0}[fx=toast] [icon]::before{border-radius:50%;font-size:2rem;line-height:1.6;box-shadow:0 0 0 1px}[fx=toast] [icon=warning]::before{background:#ff0;line-height:1.4}[fx=toast] [icon=error]::before{background:red;line-height:1.4}[fx=toast] [icon=accept]::before{background:green}.fx-stack-container>*{transition:margin-top 2s ease;margin-top:0}.fx-stack-el{margin-top:100px}.fx-stamp-container>*{transition:opacity .3s;animation:stamp .3s}.fx-stamp-el{opacity:0;animation:none}.flip-container{perspective:1000px;position:relative}.flipper{transition:.6s;transform-style:preserve-3d;position:absolute}.flipper.flip{transform:rotateY(180deg)}.flipper .back,.flipper .front{backface-visibility:hidden;top:0;left:0}.flipper .front{z-index:2;transform:rotateY(0)}.flipper .back{transform:rotateY(180deg)}@keyframes stamp{50%{transform:scale(1.2)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes flip{0%{transform:rotate(0)}50%{transform:rotateY(180deg)}100%{transform:rotateY(180deg) rotateX(180deg)}}@keyframes zoom-in{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes zoom-out{0%{transform:scale(1)}100%{transform:scale(0)}}@keyframes fade-in{0%{opacity:0}100%{opacity:1}}@keyframes fade-out{0%{opacity:1}100%{opacity:0}}@keyframes slide-in{0%{left:-100vw}100%{left:0}}@keyframes slide-out{0%{left:0}100%{left:-100vw}}@keyframes fold-in{0%{height:var(--elem-h);overflow:hidden}100%{height:0;overflow:hidden}}@keyframes fold-out{0%{height:0;overflow:hidden}100%{height:var(--elem-h);overflow:hidden}}@media only screen and (min-width:800px){.show-phone,.show-tablet{position:absolute;visibility:hidden}.pad-s-desktop,.pad-s-desktop_>*{padding:calc(var(--pad) * .5)}.pad-desktop,.pad-desktop_>*{padding:var(--pad)}.pad-l-desktop,.pad-l-desktop_>*{padding:calc(var(--pad) * 1.5)}.p0-desktop{padding:0}}@media only screen and (min-width:500px) and (max-width:800px){.show-phone{position:absolute;visibility:hidden}.pad-s-tablet,.pad-s-tablet_>*{padding:calc(var(--pad) * .5)}.pad-tablet,.pad-tablet_>*{padding:var(--pad)}.pad-l-tablet,.pad-l-tablet_>*{padding:calc(var(--pad) * 1.5)}.p0-tablet{padding:0}}@media only screen and (max-width:800px){[page][header]:before{line-height:.8}.hide-tablet{display:none}.show-tablet{position:relative;visibility:visible}[header].hh-tablet:before{display:none}[header].hh-tablet[page]{padding-top:0}[header].hh-tablet[panel]{padding-top:20px}[header].hh-tablet[section]{padding-top:15px}}@media only screen and (max-width:500px){[page]{padding-bottom:0;overflow-y:auto}[panel]{padding:15px;border-radius:0}[template]>.controls>.columns,[template]>.controls>.sizes{display:none}[options]{bottom:0;left:0!important;right:0;height:80%!important;margin:auto}.row{padding-left:0}.row:not(.rigid)>[class*=col-],[class*=columns-]:not(.rigid)>*{min-width:100%}.hide-phone{display:none}.show-phone{position:relative;visibility:visible}[header].hh-phone:before{display:none}[header].hh-phone[page]{padding-top:0}[header].hh-phone[panel],[header].hh-phone[section]{padding-top:15px}.pad-s-phone{padding:calc(var(--pad) * .5)}.pad-phone{padding:calc(var(--pad))}.pad-l-phone{padding:calc(var(--pad) * 1.5)}.p0-phone{padding:0}.bottom-phone{position:absolute;bottom:0}.up-phone{position:absolute;top:0}}</style>` + genIconStyles() )

bootstrap()

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./js/blocks/all":1,"./js/components":10,"./js/extensions":11,"./js/fx":12,"./js/icons":13,"./js/themes":14,"./js/utils":15}]},{},[16])(16)
});

//# sourceMappingURL=rasti.js.map
