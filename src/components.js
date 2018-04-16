const { is, resolveAttr } = require('./utils')

class History {

    constructor() {
        this.i = 0
        this.content = []
    }
    
    back() {
        if (this.i > 0) navTo(this.content[--(this.i)])
    }
    forth() {
        if (this.i < this.content.length) navTo(this.content[++(this.i)])
    }
    push(page) {
        this.content.splice(this.i, null, page)
        this.i++
    }
}


class Pager {

    constructor(id, results, sizes) {
        this.id = id
        if ( !is.string(id) ) return rasti.error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( !is.array(results) ) return rasti.error('%s Results must be an array', this.logid)
        this.results = results
        if ( !is.array(sizes) || !is.number(sizes[0]) ) return rasti.error('%s Page sizes must be an array of numbers', this.logid)
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
        if ( !is.number(size) ) return rasti.error('%s Must specify a number as the page size', this.logid)
        this.page_size = size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)
    }

    getPageResults(page) {
        if ( !is.number(page) ) {
            rasti.error('%s Must specify a page number to get results from', this.logid)
            return []
        }
        try {
            var i = (page -1) * this.page_size
            return this.results.slice(i, i + this.page_size)
        }
        catch(err) {
            rasti.error('%s Could not get results of page %s, error:', this.logid, page, err)
            return []
        }
    }

}


function state(app) {
    function invalid() {
        error('Saved state for app [%s] is invalid', app.name)
    }

    return Object.defineProperties({}, {
        page  : { get : _ => app.active.page.attr('page'), enumerable : true },
        theme : { get : _ => app.active.theme, enumerable : true },
        lang  : { get : _ => app.active.lang, enumerable : true },
        save : { value : _ => {
            localStorage.setItem('rasti.' + app.name, JSON.stringify(app.state))
            rasti.log('State saved')
        } },
        get : { value : _ => {
            var state
            try {
                state = JSON.parse( localStorage.getItem('rasti.' + app.name) )
                if ( !state ) rasti.log('No saved state found for app [%s]', app.name)
                else if ( !is.object(state) ) invalid()
                else return state
            }
            catch(err) {
                invalid()
            }
        } },
        restore : { value : _ => {
            var state = app.state.get()
            if (state) {
                rasti.log('Restoring state...')
                for (let prop in state) {
                    app.state[prop] = state[prop]
                }
                if (state.theme) app.setTheme(state.theme)
                if (state.lang) app.setLang(state.lang)
                app.navTo(state.page)
                rasti.log('State restored')
            }
            return state
        } },
        clear : { value : _ => {
            window.localStorage.removeItem('rasti.' + app.name)
        } },
    })
}


function crud(app) {
    function checkDataSource(fn) {
        return (datakey, ...args) => {
            const data = app.data[datakey]
            if (!data) {
                rasti.error('Undefined data source "%s"', datakey)
                return false
            }
            else return fn(data, datakey, ...args)
        }
    }

    function exists(el, arr) {
        return is.object(el)
            ? arr.find(d => d.id === el.id)
            : arr.indexOf(el) > -1
    }

    return {
        create : checkDataSource((data, datakey, newel) => {
            const exists = exists(newel, data)
            if (exists) {
                rasti.warn('Element [%s] already exists in data source [%s]', newel.id || newel, datakey)
            }
            else {
                if (is.object(newel)) newel.id = newel.id || datakey + '-' + Date.now()
                data.push(newel)
            }
            return !exists
        }),

        delete : checkDataSource((data, datakey, id) => {
            const el = data.length && (is.object(data[0]) ? data.find(el => el.id === id) : id)
            !el
                ? rasti.warn('Element [%s] not found in data source [%s]', id, datakey)
                : data.remove(el)
            return el
        }),

        update : checkDataSource((data, datakey, el, newel) => {
            const exists_el = exists(el, data)
            const exists_newel = exists(newel, data)
            if (!exists_el) rasti.warn('El [%s] not found in data source [%s]', el, datakey)
            if (exists_newel) rasti.warn('El [%s] already exists in data source [%s]', newel, datakey)
            const valid = exists_el && !exists_newel
            if (valid) data.update(el, newel)
            return valid
        }),

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
            const values = $el.find('.rasti-crud-input').find('[contenteditable]')
            let dataEl
            if ( is.object(template.props) ) {
                dataEl = {}
                Object.keys(template.props).forEach( (key, i) => {
                    dataEl[key] = values[i].html()
                })
            }
            else dataEl = values[0].html()
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
