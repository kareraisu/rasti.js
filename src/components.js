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

    constructor(id, results, page_size) {
        this.id = id
        if ( !is.string(id) ) return rasti.error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( !is.array(results) ) return rasti.error('%s Results must be an array', this.logid)
        if ( !is.number(page_size) ) return rasti.error('%s Page size must be a number', this.logid)
        this.results = results
        this.sizes = [5, 10, 20]
        this.page_size = page_size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)

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
            log('State saved')
        } },
        get : { value : _ => {
            var state
            try {
                state = JSON.parse( localStorage.getItem('rasti.' + app.name) )
                if ( !state ) log('No saved state found for app [%s]', app.name)
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
                log('Restoring state...')
                for (let prop in state) {
                    app.state[prop] = state[prop]
                }
                if (state.theme) setTheme(state.theme)
                if (state.lang) setLang(state.lang)
                navTo(state.page)
                log('State restored')
            }
            return state
        } },
        clear : { value : _ => {
            localStorage.removeItem('rasti.' + app.name)
        } },
    })
}


function crud(app) {
    function checkDataSource(fn) {
        return (datakey, ...args) => {
            const data = app.data[datakey]
            if (!data) {
                error('Undefined data source "%s"', datakey)
                return false
            }
            else return fn(data, datakey, ...args)
        }
    }

    return {
        create : checkDataSource((data, datakey, el) => {
            const exists = data.find(e => e === el)
            exists
                ? warn('El [%s] already exists in data source [%s]', el, datakey)
                : data.push(el)
            return !exists
        }),
        delete : checkDataSource((data, datakey, el) => {
            const exists = data.find(e => e === el)
            !exists
                ? warn('El [%s] not found in data source [%s]', el, datakey)
                : data.remove(el)
            return exists
        }),
        update : checkDataSource((data, datakey, el, newel) => {
            const exists_el = data.find(e => e === el)
            const exists_newel = data.find(e => e === newel)
            if (!exists_el) warn('El [%s] not found in data source [%s]', el, datakey)
            if (exists_newel) warn('El [%s] already exists in data source [%s]', newel, datakey)
            const valid = exists_el && !exists_newel
            if (valid) data.update(el, newel)
            return valid
        }),
        addInputEl : $el => {
            let template = resolveAttr($el, 'template')
            template = app.templates[template]
            // TODO: try to parse the template identifying props in order to build a similar html tree but with inputs instead of divs or spans, binding each input to its corresponding prop
            $el.append('<div class=rasti-crud-input>' + template(['TEST']) +'</div>')
        },
        removeInputEl : $el => {
            $el.find('.rasti-crud-input').detach()
        },
    }
}


module.exports = {
    History,
    Pager,
    state,
    crud,
}
