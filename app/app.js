app.pages.login = {

    in : function(params) {
        $('nav').hide()
        app.get('btn=config').hide()
    },

    out : function(params) {
        $('nav').show()
        app.get('btn=config').show()
        if (params) {
            app.get('nav=login').css({
                'background-image' : `url(img/${ params.user }.jpg)`,
                'background-size' : 'contain',
            })
        }
    },
}


app.pages.main = {

    url : 'the-main-page',

    init : function() {
        app.get('panel=results').on('click', '.card', function(e){
            e.currentTarget.classList.toggle('modal')
        })
    }
}

app.data.area = 'SDA, I+D, Recursos Humanos, Comunicación, Administración, Dirección'.split(', ')

app.data.skills = 'HTML, CSS, Javascript, Node, git, Angular, React, Cordoba, Java, SQL, Networking, Security, PaaS, Docker, Bash'.split(', ')

app.data.features = 'navigation, ajax, templates, paging, actions, themes, i18n, tabs, modals, blocks, validation, responsive'.split(', ')


app.templates.cards = function(data) {

    return data.map(function(obj){

        return `<div class="card row" section>
            <img src="img/${obj.id}.jpg"/>
            <div class="data">
                <div class="name">${obj.name}</div>
                <div class="row">
                    <div class="labels col-4">
                        Area:<br/>
                        Position:<br/>
                        Skills:<br/>
                    </div>
                    <div class="values col-8">
                        ${obj.area}<br/>
                        ${obj.position}<br/>
                        ${obj.skills}<br/>
                    </div>
                </div>
            </div>
        </div>`

    }).join('')

}


app.ajax.getPeople = function(reqdata, render) {

    app.set('name=reqdata', JSON.stringify(reqdata, null, 2) )

    // ajax simulation
    setTimeout(function() {
        var people = app.utils.getPeople(reqdata)
        app.get('tab-label="1"').click()
        render(people)
    }, 2000)

}


app.utils.login = function(e){
    if (app.get('field=pass').val() == '1234') {
        app.navTo('main', {user: app.get('field=user').val()})
    }
}


app.init({
    root : 'login'
    //theme : 'blue',
    //lang : 'es',
    //persist : true,
})



