app.extend({

	themes : {

	    blue : {
	        font : 'normal 14px sans-serif',
	        palette : {
	            light  : '#B5C1E2',
	            mid    : '#445288',
	            dark   : '#263256',
	            detail : '#C94C40',
	        },
	    },

	    green : {
	        font : 'normal 14px fantasy',
	        palette : {
	            light  : '#E0DEDE',
	            mid    : '#436F6E',
	            dark   : '#1D3638',
	            detail : '#DFD665',
	        },
	    },

	    red : {
	        font : 'normal 14px sans-serif',
	        palette : {
	            light  : '#C04542',
	            mid    : '#7C1E1A',
	            dark   : '#4B1817',
	            detail : '#DDCB41',
	        },
	    },

	},

	langs : {

		en : {
			welcome  : 'rasti.js demo app',
			username : 'user name',
			pass     : 'password',
			login    : 'log in',
			main     : 'main',
			filters  : 'filters',
			personal : 'personal',
			name     : 'name',
			work     : 'work',
			skills   : 'skills',
			reqdata  : 'request data',
			search   : 'search',
			results  : 'results',
			config   : 'config',
			lang     : 'language',
			theme    : 'theme',
			about    : 'about',
		},

		es : {
			welcome  : 'demo de rasti.js',
			username : 'usuario',
			pass     : 'contraseña',
			login    : 'acceder',
			main     : 'principal',
			filters  : 'filtros',
			personal : 'personal',
			name     : 'nombre',
			work     : 'trabajo',
			skills   : 'habilidades',
			reqdata  : 'datos',
			search   : 'buscar',
			results  : 'resultados',
			config   : 'config',
			lang     : 'idioma',
			theme    : 'tema',
			about    : 'acerca de',
		},

	},

	utils : {

	    applyTheme : function(el) {
	        var theme = app.get('field=theme').val(),
	            map = app.get('data=themeMaps').val()
	        if (theme && map) app.setTheme(theme +' '+ map)
	    },

	},
})


app.extend({
	data : {
		lang : Object.keys(app.langs),
		theme : Object.keys(app.themes),
		themeMaps : Object.keys(app.themeMaps),
	},
})

