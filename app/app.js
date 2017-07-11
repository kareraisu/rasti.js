app.pages.login = {

    in : function(params) {
        $('nav').hide()
    },

    out : function() {
        $('nav').show()
    },
}


app.pages.main = {

    url : 'the-main-page',

    in : function(params) {
        if (!params) return
        app.get('section=user').text(params.user)
    },

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
            <div class="photo col-2">
                <img src="img/${obj.id}.jpg"/>
            </div>
            <div class="data col-10">
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

    var people = app.utils.getPeople(reqdata)

    render(people) // (or not)

}


app.init()



