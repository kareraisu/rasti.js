app.pages.login = {

    in : params => {
        $('nav').hide()
        app.get('btn=config').hide()
    },

    out : params => {
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

    init : () => {
        app.get('panel=results').on('click', '.card', e => {
            e.currentTarget.classList.toggle('modal')
        })
    }
}


skills = {
    tech   : 'HTML, CSS, Javascript, Node, git, Angular, React, Cordoba, Java, Maven, Hibernate, SQL, Mongo, Networking, Security, PaaS, Docker, Bash',
    people : 'Búsqueda, Selección, Psicología, Word, Excel, Powerpoint',
    design : 'Creatividad, Dibujo, Composición, Teoría del color, Fotografía, Branding, UI & UX, Photoshop, Illustrator, After Effects, Blender',
    manage : 'Planeamiento, Estrategia, Coordinación, Negociación, Análisis de costos, Word, Excel, Powerpoint',
}

areaSkills = {
    SDA : 'tech',
    'I+D' : 'tech',
    'Recursos Humanos' : 'people',
    Comunicación : 'design',
    Administración : 'manage',
}

app.data.area = Object.keys(areaSkills)

app.data.skills = (render, deps) => {
    render( skills[ areaSkills[deps.area || 'SDA'] ] )
}

app.data.features = 'navigation, ajax, templates, paging, actions, themes, i18n, tabs, modals, blocks, field dependency, field validation, responsive'


app.templates.cards = data => data.map(
        obj => `<div class="card row" section>
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
    ).join('')


app.ajax.getPeople = (reqdata, render) => {

    app.set('name=reqdata', JSON.stringify(reqdata, null, 2) )

    // ajax simulation
    setTimeout(function() {
        var people = app.utils.getPeople(reqdata)
        app.get('tab-label="1"').click()
        render(people)
    }, 2000)

}


app.utils.login = e => {
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



