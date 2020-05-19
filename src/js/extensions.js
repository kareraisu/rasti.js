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
