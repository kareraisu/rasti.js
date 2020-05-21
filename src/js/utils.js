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


const $ify = method => (el, ...args) => method($check(el), ...args)


function $check(el) {
    if (el instanceof $) return el
    else if (el instanceof Node) return $(el)
    else throw 'invalid argument "el", must be a DOM node or a $ instance'
}


const prepTemplate = tmpl_func => data => data.map( compose( checkData, tmpl_func )).join('')


function inject(sources, {parallel}={}) {
    if (is.string(sources)) sources = sources.split(',')
    if (is.not.array(sources)) return rasti.error('Invalid sources, must be an array or a string')
    const $body = $(document.body)

    function do_inject(sources) {
        const src = is.array(sources) ? sources.shift().trim() : sources.trim()
        const ext = src.split('.')[1]
        const $el = 'css' === ext
            ? $('<link rel=stylesheet>').attr('href', src)
            : $('<script>').attr('src', src)

        if (!parallel)
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

    parallel
        ? sources.map(do_inject)
        : do_inject(sources)
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


function html(strings, ...substs) {
    // Use raw template strings (don’t want backslashes to be interpreted)
    const raw = strings.raw
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


const resolveAttr = $ify(($el, name) => {
    const attrs = `${name} name template prop nav section panel page`.split(' ')
    do { value = $el.attr( attrs.shift() ) } while (!value && attrs.length)
    if (!value) rasti.warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
    return value
})


/**
 * Makes a widget navigatable via keyboard
 * @param {jquery object} $el widget container
 */
const keyNav = $ify($el => {

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
})


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
    $ify,
    $check,
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
