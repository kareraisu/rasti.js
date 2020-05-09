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
            $el.find('.rasti-crud-input').removeClass('.rasti-crud-input')
                .find('[contenteditable]').removeAttr('[contenteditable]')
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
