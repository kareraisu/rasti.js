app.config({

    state : {

    },

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
            var alias = {
                Fei : 'Fong Wong Id Lakan',
                Elly : 'Elhaym Van Houten',
                Citan : 'Doctor Uzuki',
            }
            render( charNames.map(name => { return {label: name, value: name, alias: alias[name]} } ) )
        }

    },


    pages : {

        results : {

            url : 'results',

            init : function() {
                app.set('field=lang', app.options.lang)
                app.set('field=theme', app.options.theme.split(' ')[0])
                app.set('data=themeMaps', app.options.theme.split(' ')[1] || 'dark')
                app.add('field=party', ['Fei','Elly'], 'Citan')
            },

            nav : function(params) {
                if (params) {
                    app.get('name=iam').html(params.iam)
                    app.set('field=guess', params.guess)
                }
            },

        },

    },


    ajax : {

        getResults : function(data, render) {
            app.get('name=data').html(JSON.stringify(data, null, 4))
            // ajax simulation
            setTimeout(function() {
                var characters = app.utils.getCharData(data.party)
                render(characters)
            }, 2000)
        },

    },


    utils : {

        applyTheme : function(e) {
            var theme = app.get('field=theme').val(),
                map = app.get('data=themeMaps').val()
            if (theme && map) app.setTheme(theme +' '+ map)
        },

        applyLang : function(e) {
            app.setLang(this.value)
        },

        setPartyMax : function(e) {
            app.get('field=party')[0].max = this.value
        },

        doSomethingAndAlso : function(data) {
            if (app.utils.chatting) return
            
            app.get('tab-label="1"').click()
            console.group('chatting')
            app.utils.chatting = true

            var lines = [
                'do sth besides rendering cards? ok, lets see...', '',
                '2 + 2 =', 2+2,
                '... thats basic', '',
                'the value of pi is', Math.PI,
                '... mmm i like pie', '',
                'typeof [] == "%s"', typeof [],
                '... of course', '',
                'wait what?', `

              ( |\\  //|
               \\|\\\\//\\|
                 /66\\
                ((_v.)
                 > "<  
            `
            ]

            function chat(){
                console.log(lines.shift(), lines.shift())
                if (lines.length) setTimeout(chat, 2000)
                else {
                    console.groupEnd('chatting')
                    app.utils.chatting = false
                }
            }

            chat()
        },

    },


    templates : {
        cards : function (data, lang) {
            return data.map(function(obj){ return `
                <div class="card row" section="section">
                    <div class="photo col-2" style="background-image: url(http://shrines.rpgclassics.com/psx/xeno/images/${obj.img}"></div>
                    <div class="col-10">
                        <div class="name">${obj.name}</div>
                        <div class="row">
                            <div class="labels col-4">
                                ${lang.occupation}:</em><br/>
                                ${lang.location}:</em><br/>
                                ${lang.weapon}:</em><br/>
                                ${lang.email}:</em>
                            </div>
                            <div class="values col-8">
                                ${obj.occupation}<br/>
                                ${obj.location}<br/>
                                ${obj.weapon}<br/>
                                ${obj.email}
                            </div>
                        </div>
                    </div>
                </div>
                ` }).join()
        },

    },


    themes : {

        Weltall : {
            font : 'normal 14px sans-serif',
            palette : {
                light: '#B5C1E2',
                mid: '#445288',
                dark: '#263256',
                detail: '#C94C40',
            },
        },

        Heimdal : {
            font : 'normal 14px fantasy',
            palette : {
                light: '#E0DEDE',
                mid: '#436F6E',
                dark: '#1D3638',
                detail: '#DFD665',
            },
        },

        Brigandier : {
            font : 'normal 14px sans-serif',
            palette : {
                light: '#C04542',
                mid: '#7C1E1A',
                dark: '#4B1817',
                detail: '#DDCB41',
            },
        },

    },


    langs : {
        en : {
            title : 'rasti.js example prototype',
            guess : 'Guess the reference!',
            iam : 'I am',
            urguess : 'Your guess',
            ph1 : 'I have no idea... the Bible maybe?',
            show_hints : 'SHOW HINTS',
            fields : 'FIELDS',
            previous : 'Your previous input',
            guesswas : 'Your guess was',
            ph2: "You didn't even try... u_u",
            hints : 'Here are some more hints',
            theme : 'Theme',
            meta : 'Meta data',
            location : 'Location',
            party : 'Party',
            size : 'Max size:',
            data : 'Data',
            get_results : 'SHOW RESULTS',
            results : 'RESULTS',
            results_2 : 'AWESOME RESULTS',
            lang : 'Language',
            filter_text : 'Start typing a name!',
            tips : 'Try adding some folks to the party and then click the big button (you might want to extend the max party size first)',
            occupation : 'Occupation',
            location : 'Location',
            weapon : 'Weapon',
            email : 'Email',
        },
        es : {
            rasti_stats : '%n resultados en %t segundos',
            rasti_noData : 'No se encontraron resultados',
            title : 'prototipo ejemplo de rasti.js',
            guess : 'Adiviná la referencia!',
            iam : 'Yo soy',
            urguess : 'Tu suposición',
            ph1 : 'Ni idea... la Biblia?',
            show_hints : 'MOSTRAR PISTAS',
            fields : 'CAMPOS',
            previous : 'Tu entrada anterior',
            guesswas : 'Tu suposición fue',
            ph2: "Ni siquiera intestaste... u_u",
            hints : 'Acá tenés más pistas',
            theme : 'Tema',
            meta : 'Meta datos',
            location : 'Ubicación',
            party : 'Grupo',
            size : 'Tamaño máx:',
            data : 'Datos',
            get_results : 'MOSTRAR RESULTADOS',
            results : 'RESULTADOS',
            results_2 : 'RESULTADOS ASOMBROSOS',
            lang : 'Idioma',
            filter_text : 'Empezá a escribir un nombre!',
            tips : 'Probá agregando gente al grupo y luego clickeá el botón grande (puede que quieras extender el tamaño del grupo antes)',
            occupation : 'Ocupación',
            location : 'Ubicación',
            weapon : 'Arma',
            email : 'Email',
        },
    }

})


app.data.themes = Object.keys(app.themes)

app.data.themeMaps = Object.keys(app.themeMaps)

app.data.langs = Object.keys(app.langs)


app.init({
    log : true,
    //root : 'results',
    theme : 'Weltall',
    //lang : 'es',
    state : true,
})



