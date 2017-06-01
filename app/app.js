app.pages.main = {

    url : 'the-main-page',

    nav : function(params) {
        if (!params) return
        app.get('section=user').text(params.user)
    }
    
}


app.data.skills = ['html', 'css', 'javascript']


app.templates.cards = function(data) {

    return data.map(function(obj){

        return `<div class="card row" section>
            <div class="photo col-2" style="background-image: url(${obj.img})"></div>
            <div class="col-10">
                <div class="name">${obj.name}</div>
                <div class="row">
                    <div class="labels col-4">
                        Area:<br/>
                        Position:<br/>
                        Skills:<br/>
                        Email:
                    </div>
                    <div class="values col-8">
                        ${obj.area}<br/>
                        ${obj.position}<br/>
                        ${obj.skills}<br/>
                        ${obj.email}
                    </div>
                </div>
            </div>
        </div>`

    }).join('')

}


app.ajax.getPeople = function(reqdata, render) {

    app.set('name=reqdata', JSON.stringify(reqdata, null, 2) )

    var people = app.data.people //app.utils.getPeople(reqdata)

    render(people) // (or not)

}


app.init()



