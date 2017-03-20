app.config({

    data : {

        iam : [
            {label: 'Alpha',     value: 'A'},
            {label: 'Omega',     value: 'Ω'},
            {label: 'The First', value: '[0]'},
            {label: 'The Last',  value: '[n-1]'},
        ],

        meta : [
            {label: 'Platform',  value: 'PS1'},
            {label: 'Developer', value: 'Squaresoft'},
            {label: 'Year',      value: '1998'},
            {label: 'Genre',     value: 'RPG'},
        ],

        locations : [
            'Lahan',
            'Aveh',
            'Kislev',
            'Shevat',
            'Solaris',
            'Thames',
            'Yggdrasil',
        ],

        party : function(render) {
            // this could be asynchronous
            var charNames = Object.keys(app.utils.charData)
            render(charNames)
        }

    },


    pages : {

        landing : {

            init : function(params) {}

        },

        results : {

            init : function(params) {
                app.set('field=iam', params.iam)
                app.set('field=guess', params.guess)
            }

        },

    },


    ajax : {

        getResults : function(data, render) {
            app.get('name=data').html(JSON.stringify(data, null, 4))
            // ajax simulation
            setTimeout(function() {
                var characters = app.utils.getCharData(data.party)
                render(characters)
            }, 500)
        },

    },


    themes : {

        Weltall : {
            font : 'normal 14px sans-serif',
            fontcolor : '#eee',
            palette : {
                light: '#B5C1E2',
                mid: '#445288',
                dark: '#263256',
                detail: '#C94C40',
            }
        },

        Heimdal : {
            font : 'normal 14px fantasy',
            fontcolor : '#eee',
            palette : {
                light: '#E0DEDE',
                mid: '#436F6E',
                dark: '#1D3638',
                detail: '#DFD665',
            }
        },

        Brigandier : {
            font : 'normal 14px sans-serif',
            fontcolor : '#eee',
            palette : {
                light: '#C04542',
                mid: '#7C1E1A',
                dark: '#4B1817',
                detail: '#DDCB41',
            }
        },

    },


    utils : {

        applyTheme : function(e) {
            app.setTheme(this.value)
        },

    },


    templates : {
        cards : function (results) {
            var html = ''
            for (var obj of results) {
                html += `
                <div class="card row" section="section">
                  <div class="photo col-2" style="background-image: url(http://shrines.rpgclassics.com/psx/xeno/images/${obj.img}"></div>
                  <div class="col-10">
                    <div class="name">${obj.name}</div>
                    <div class="row">
                      <div class="data col-8 row">
                        <div class="col-4">
                            <em>Occupation:</em><br/>
                            <em>Location:</em><br/>
                            <em>Weapon:</em><br/>
                            <em>Email:</em>
                        </div>
                        <div class="col-8">
                            ${obj.occupation}<br/>
                            ${obj.location}<br/>
                            ${obj.weapon}<br/>
                            ${obj.email}
                        </div>
                      </div>
                      <div class="actions col-4 ib_">
                        <div class="btn">CONTACT</div><br/><i class="fa fa-star-o"/>|<i class="fa fa-print"/>|<i class="fa fa-envelope"></i>
                      </div>
                    </div>
                  </div>
                </div>
                `
            }
            return html
        }
    }

})


app.data.themes = Object.keys(app.themes)


app.init({
    //root : 'results',
    //theme : 'Weltall',
    //log : false,
})



