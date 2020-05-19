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