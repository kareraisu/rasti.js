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
        if ( !is.string(id) ) return error('Pager id must be a string')
        this.logid = `Pager for template [${ this.id }]:`
        if ( !is.array(results) ) return error('%s Results must be an array', this.logid)
        if ( !is.number(page_size) ) return error('%s Page size must be a number', this.logid)
        this.results = results
        this.sizes = [5, 10, 20]
        this.page_size = page_size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)

    }

    next() {
        if (this.hasNext()) this.page++
        else warn('%s No next page', this.logid)
        return this.getPageResults(this.page)
    }

    prev() {
        if (this.hasPrev()) this.page--
        else warn('%s No previous page', this.logid)
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
        if ( !is.number(size) ) return error('%s Must specify a number as the page size', this.logid)
        this.page_size = size
        this.page = 0
        this.total = Math.ceil(this.results.length / this.page_size)
    }

    getPageResults(page) {
        if ( !is.number(page) ) {
            error('%s Must specify a page number to get results from', this.logid)
            return []
        }
        try {
            var i = (page -1) * this.page_size
            return this.results.slice(i, i + this.page_size)
        }
        catch(err) {
            error('%s Could not get results of page %s, error:', this.logid, page, err)
            return []
        }
    }

}


let state = Object.defineProperties({}, {
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

module.exports = {
    History,
    Pager,
    state
}