// prototype extensions
Object.defineProperties(Array.prototype, {
    get : { value : function(i) {
       return i < 0 ? this[this.length + i] : this[i]
    }},
    remove : { value : function(el) {
        var i = this.indexOf(el)
        if (i >= 0) this.splice(i, 1)
    }},
    update : { value : function(el, newel) {
        var i = this.indexOf(el)
        if (i >= 0) this.splice(i, 1, newel)
    }},
    capitalize : { value : function() {
       return this.length && this[0].toUpperCase() + this.slice(1).toLowerCase()
    }},
})


// $ extensions
$.fn.hasAttr = function(name) {  
    return this[0].hasAttribute(name)
}

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
