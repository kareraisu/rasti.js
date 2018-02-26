(function (body, ...sources){
    var s, inject = (sources) => {
        s = document.createElement('script')
        s.src = sources.shift()
        if (sources.length) s.onload = () => inject(sources)
        body.append(s)
    }
    inject(sources)
    document.querySelector('#magic').remove()
})(document.querySelector('body'),
    location.hostname == 'localhost' ? '../dist/rasti+zepto.js' : 'https://rawgit.com/kareraisu/rasti.js/dev/dist/rasti%2Bzepto.min.js')