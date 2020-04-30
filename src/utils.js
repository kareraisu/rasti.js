function type(exp) {
    const clazz = Object.prototype.toString.call(exp)
    return clazz.substring(8, clazz.length-1).toLowerCase()
}

const is = {}
'object function array string number regex boolean'.split(' ')
    .forEach(t => {
        is[t] = exp => type(exp) === t
    })
is.empty = exp =>
    (is.array(exp) || is.string(exp)) ? exp.length === 0
    : is.object(exp) ? Object.keys(exp).length === 0
    : false

const sameType = (exp1, exp2) => type(exp1) === type(exp2)

const exists = ref => ref !== undefined && ref !== null


const compose = (...funcs) => funcs.reduce((prev, curr) => (...args) => curr(prev(...args)))


const prepTemplate = tmpl_func => data => data.map( compose( checkData, tmpl_func )).join('')


function inject(sources) {
    if (is.string(sources)) sources = sources.split(',')
    if (!is.array(sources)) return rasti.error('Invalid sources, must be an array or a string')
    const body = $('body')
    function do_inject(sources) {
        const src = sources.shift().trim()
        const script = $('<script>').attr('src', src)
        script[0].onload = () => {
            rasti.log('> Loaded %s', src)
            sources.length
                ? do_inject(sources)
                : rasti.log('All sources loaded')
        }
        rasti.log('> Loading %s ...', src)
        body.append(script)
    }
    do_inject(sources)
}


function checkData(data) {
    switch (typeof data) {
    case 'string':
        data = {value: data, label: data, alias: data.toLowerCase()}
        break
    case 'object':
        if ( !is.string(data.value) || !is.string(data.label) ) {
            rasti.error('Invalid data object (must have string properties "value" and "label"):', data)
            //invalid_count++
            data = {value: '', label: 'INVALID DATA', alias: ''}
        }
        else if ( !is.string(data.alias) ) {
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
    var value = $el.attr(name) || $el.attr('name') || $el.attr('prop') || $el.attr('nav') || $el.attr('section') || $el.attr('panel') || $el.attr('page') || $el.attr('template')
    if (!value) rasti.warn('Could not resolve value of [%s] attribute in el:', name, $el[0])
    return value
}


const random = () => (Math.random() * 6 | 0) + 1


const onMobile = () => window.innerWidth < 500


module.exports = {
    is,
    type,
    sameType,
    exists,
    compose,
    prepTemplate,
    inject,
    checkData,
    html,
    resolveAttr,
    random,
    onMobile,
}
