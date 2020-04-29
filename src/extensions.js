const { is } = require('./utils')

// prototype extensions
Object.defineProperties(Array.prototype, {
    get : { value : function(i) {
       return i < 0 ? this[this.length + i] : this[i]
    }},
    new : { value : function(el, i) {
        i = i || this.length
        var isNew = this.indexOf(el) < 0
        if (isNew) this.splice(i, 0, el)
        return isNew
    }},
    remove : { value : function(el) {
        this.update(el)
    }},
    update : { value : function(el, newel) {
        var i = this.indexOf(el)
        var found = i > -1
        if (found) this.splice(i, 1, newel)
        return found
    }},
    capitalize : { value : function() {
       return typeof this == 'string' && this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
    }},
})

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
$.fn.hasAttr = function(name) {
    return this[0] && this[0].hasAttribute(name)
}

;['show', 'hide'].forEach(method => {
    var origFn = $.fn[method]
    $.fn[method] = function() {
        const isSpecial = this.hasAttr('menu') || this.hasAttr('modal') || this.hasAttr('sidemenu')
        if (isSpecial) {
            document.body.style.setProperty("--elem-h", this[0].orig_h)
            const backdrop = this.closest('[rasti]').find('.rs-backdrop')
            if (method == 'show') {
                this.addClass('open')
                backdrop.addClass('backdrop')
                this[0].visible = true
                origFn.call(this)
            }
            if (method == 'hide') {
                this.removeClass('open')
                this.addClass('close')
                backdrop.removeClass('backdrop')
                this[0].visible = false
                setTimeout( () => {
                    this.removeClass('close')
                    origFn.call(this)
                }, 500)
            }
        }
        else origFn.call(this)
        return this
    }
})

$.fn.move = function(options) {
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
