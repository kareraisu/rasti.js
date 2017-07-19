const is = {}
'object function array string number regex boolean'.split(' ').forEach(function(t){
    is[t] = function(exp){ return type(exp) === t }
})
function type(exp) {
        var clazz = Object.prototype.toString.call(exp)
        return clazz.substring(8, clazz.length-1).toLowerCase()
}
function sameType(exp1, exp2) {
    return type(exp1) === type(exp2)
}


function checkData(data) {
    switch (typeof data) {
    case 'string':
        data = {value: data, label: data, alias: data.toLowerCase()}
        break
    case 'object':
        if ( !is.string(data.value) || !is.string(data.label) ) {
            error('Invalid data object (must have string properties "value" and "label"):', data)
            invalidData++
            data = {value: '', label: 'INVALID DATA', alias: ''}
        }
        else if ( !is.string(data.alias) ) {
            if (data.alias) {
                error('Invalid data property "alias" (must be a string):', data)
                invalidData++
            }
            data.alias = data.value.toLowerCase()
        }
        else data.alias = data.alias.toLowerCase() +' '+ data.value.toLowerCase()
        break
    default:
        error('Invalid data (must be a string or an object):', data)
        invalidData++
        data = {value: '', label: 'INVALID DATA', alias: ''}
    }
    return data
}


function rastiError(msg, ...args){
    this.msg = msg
    this.el = args.pop()
    this.args = args
}


function random() {
    return (Math.random() * 6 | 0) + 1
}


function onMobile() {
    return window.innerWidth < 500
}


module.exports = {
	is,
	type,
	sameType,
	checkData,
	random,
	onMobile,
    rastiError,
}