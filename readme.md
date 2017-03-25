# Rasti.js <img align=right height=200 src="http://www.rasti.com.ar/files/img_products/avion-2.png">

Rasti is a tiny frontend framework for building prototypes in a fast and simple way. It was born from the process of building a prototype in which I wanted to be able to write just the essential, while also making the code as expressive as possible. This led to a super-terse attribute-driven html api backed by a simple config object.



## Installation

Just download the styles and logic and insert them into your html.
Currently the only dependency is jquery.
```html
<link rel="stylesheet" href="lib/rasti.css">
<script src="lib/jquery.min.js"></script>
<script src="lib/rasti.js"></script>
```



## Initialization

```javascript
var app = new rasti()

app.config({
    pages: {...},
    data: {...},
    ajax: {...},
    templates: {...},
    themes: {...},
    blocks: {...},
    fx: {...},
    utils: {...},
})

app.init({
    root : 'rootPage', // defaults to first page defined in 'pages' config property
    theme : 'myTheme', // defaults to 'base' theme
    log : false,       // defaults to true
})
```



## API

The whole framework is driven by attributes which can be classified into six categories. Also, there are some utility methods available.


### Navigation

**[page]**  
Defines a page of the app. A page is a top-level container. It's value must be a unique name among all the page containers defined within the app.

**[nav]**  
Defines a navigation action. It's value must be the name of a page. When the element is clicked, the app navigates to the specified page.

**[navparam]**  
Defines a navigation parameter. It's value must be a unique name among all the navparam elements defined within the enclosing page.

**[params]**  
Binds a params object to a nav action (if used, it must be accompanying a [nav] attribute). It's value must be a series of space separated navparam names, or empty. The current value of all specified navparam elements within the current page will be copied into an object which will be passed to the init function of the target page. If the attribute value is empty, the prior will apply to all existing navparam elements within the current page.


### Data

**[field]**  
Applies rasti styles to an element. If it has a value, it will be used as the key for the element's value in a potential ajax method data object.

**[data]**  
Binds the data source for an element. It's value must be the name of a defined data source (a key in the {data} config property).

**[ajax]**  
Binds an ajax method to a container. It's value must be the name of a defined ajax method (a key in the {ajax} config property).

**[submit]**  
Defines an element as a trigger for an ajax method. It's value must be the name of a defined ajax method. When the element is clicked, the method is called with a data object containing the current values of all the [field] elements within the [ajax] container bound to the ajax method.


### Templating

**[template]**  
Binds a template to a container. It's value must be the name of a defined template (a key in the {template} config property). Each time the template is executed, it's output is rendered inside the container.

**[render]**  
Defines an element as a trigger for a template. It's value must be the name of a defined template. When the element is clicked, the template is rendered.

**[fx]**  
Applies a visual effect to an element or container. It's value must be the name of a defined fx. When the element is rendered, the visual effect is displayed.


### Structure

**[panel]** and **[section]**  
Define a container of related content. Panels contain sections.

**[row]** and **[col-1]** to **[col-12]**  
Define a responsive grid a la bootstrap (12 columns grid system). Rows contain columns.

**[header]**  
Creates a header for a container, it's value becomes the text of the header. Can be used with panels and pages.

**[label]**  
Creates a label for an element, it's value becomes the text of the label. Can be used with any element, except panels and pages.


### Actions

**[click]** and **[change]**  
Bind an utility method to an element's click or change event. It's value must be the name of a defined utility method (a key in the {utils} config property).


### Style

These can be used as attributes or as classes, and have two variants:
- normal/single (no alteration): they affect the element to which they are applied.
- container/batch (adding an underscore at the end): they affect all immediate children of the element to which they are applied.

Their names are pretty straight-forward:
- ib: inline-block
- center: common horizontal centering
- centerx, centery, centerxy: "floating" centering in x, y or both
- fullw, fullh: full width or height
- autow, autoh: auto width or height
- scrollx, scrolly, scroll: scroll in x, y or both
- columns-2, columns-3: arrange elements in 2 or 3 columns, these are meant for containers, thus they don't have an underscore variant

Also, you can use any theme's color name as a class to apply the color to an element as the background-color upon setting the theme. For example, a div with the class 'detail' will be applied a background-color: 'darkcyan' when setting the theme 'base' (set by default in app.init()). See the configuration section for more details on adding themes.

### Methods
**get(selector)**  
selector : string  
Returns a jquery object of the DOM element specified by the selector.

**set(selector, value)**  
selector : string, value : any  
Sets the value of the DOM element specified by the selector.

**add(selector, item)**  
selector : string, item : any  
Adds an item to the value of the DOM element specified by the selector. This must only be used with elements whose value is an array.

These three methods target elements in the active page only, and the selectors must be strings with the form 'attribute=value' (or just 'attribute'). Their use is encouraged over jquery or native DOM querying since they trigger a change event on the target, which would otherwise need to be explicitly triggered for rasti blocks to update their UI.

**navTo(pageName, navParams)**  
pageName : string, navParams : object (optional)  
Navigates to the given page. If navParams are provided, they are passed to the init function of the page.

**setTheme(themeName, mapName)**  
themeName : string, mapName : string (optional)  
Sets the given theme, which must be correctly defined (either a default framework theme or else defined via the {themes} config property). If a map name is provided, it will be first looked up in the theme and then -if not found- in the framework. If the map name is not found in neither, or is not provided, the default 'light' map will be used.

**updateBlock($el, data)**  
$el : jQuery object, data : array or function (optional)  
Updates the options of the given element (which must be a rasti block or a select) according to the given data, or if no data argument is provided, to the data source specified in the [data] attribute of the element. This allows, for example, to create field dependency (fields whose options depend on other fields' values).


## Custom elements (aka "blocks")

Rasti comes with a couple of custom elements for speeding up UI implementation. These elements are available via the [rasti] attribute:

**[rasti=radios]**  
Creates a group of related radio buttons.

**[rasti=buttons]**  
Creates a group of small related persistent buttons (currently singletons).

**[rasti=multi]**  
Creates a multi select element whose value is an array.
Options:
- [max] : must be a number, sets the maximum number of options that can be selected at once.
- [filter] : must be a string or empty, enables filtering options via an input field, it's value will be the input's placeholder text.

There is one more custom element that doesn't use the [rasti] attribute.

**select[img]**  
Creates a select capable of showing images in its options. The images are retrieved from the relative path specified in the [img] attribute.

### Adding blocks
Blocks can be added to the framework via the {blocks} config property (see next section).



## Configuration

Rasti allows to define the pages, data sources, ajax methods and templates of the app and also to add themes, "blocks" (custom elements), visual effects and utility methods via the following config properties (which are objects themselves). These properties can be accesed from the app namespace or they can be extended using the config() method.

**pages: {...}**  
Defines the pages of the app. Pages can have two properties:
- url: a string which represents the page's url fragment identifier (aka 'hash'), which will be updated upon navigation (or will dictate navigation from the browser location bar).
- init: a function with takes an optional navParams object, used to initialize the page state upon navigation.

**data: {...}**  
Defines the data sources available for binding to elements via the [data] attribute. For templates, data sources can be anything the template expects. For rasti blocks, data sources must be arrays of strings or arrays of objects with string properties 'value' and 'label'.
Data sources can also be functions with a callback argument, which should be called with the actual data, allowing for ajax-driven data sources.

**ajax: {...}**  
Defines the ajax methods available for binding to containers via the [ajax] attribute (and to triggers via the [submit] attribute). The ajax methods must take 2 arguments: a data object and a callback function.

**templates: {...}**  
Defines the templates available for binding to containers via the [template] attribute (and to triggers via the [render] attribute). The templates must be functions that take a data object or array.

**themes: {...}**
Adds global themes available for applying via the setTheme() method. The themes must be objects with the following structure:

```javascript
themeName : {
    font :      'normal 14px sans-serif',
    palette : {
        light:  '#ddd',
        mid:    '#aaa',
        dark:   '#444',
        detail: 'darkcyan',
    },
    maps : {
        mapName1 : {
            page :    'light detail',
            panel :   'dark detail',
            section : 'mid dark',
            field :   'light dark',
            btn :     'detail light',
            text :    'dark',
            label :   'light',
        },
        mapName2 : {...},
    }
}
```

This is an example using the color names defined in the default themes and maps. The theming system uses maps to give more flexibility to themes, allowing to create variatons of the same palette. Thus, the names and quantity of the colors are without constraint, but if you want to use your own names, you must define at least one custom theme map with those names. If no map is defined, the default 'light' map will be used (in which case your theme must use the default color names or it won't load).

All theme map keys except 'text' and 'label' expect two colors, the first will be used for the background and the second for the header (in the case of containers) or the text of the element. (page, panel, section : 'bgcolor headercolor', fiel, btn : 'bgcolor textcolor').


**blocks: {...}**  
Adds blocks available to be used via the [rasti] attribute. They must have the following structure:

```javascript
 blockName : {
    template : function(data) {...}, // data : array
    init : function($el) {...},      // $el : jQuery object
    style : `...`                    // string of css rules
}
```

**fx: {...}**  
Adds visual effects available for binding to elements or containers via the [fx] attribute. Visual effects must be functions that take a jquery element (the element to which they are bound).
Rasti comes prepackaged with the following effects to use right out of the box:

* **stack** (container): produces a bottom-to-top stacking effect of the element's children

**utils: {...}**  
Adds utility methods within the app namespace available for general use and for binding to click and change events of elements via the [click] and [change] attributes.



## Roadmap

These are some of the things I've got in mind:
- [x] ~~themes api~~
- [x] ~~blocks api~~
- [x] ~~function data sources~~
- [x] ~~url navigation~~
- [x] i18n support (done - documentation pending)
- [ ] 'loading' component (bar/dots/circle)
- [ ] more fx's (fade, slide, twist)



## Contributing

Please let me know of any issues you may find or improvements you may think of or features you would like to see (of course you can also send a PR :+1:).



## About the name

Rasti is a block construction toy made in Argentina that resembles Lego, but it's much simpler. This framework was built with simplicity in mind, and includes some "blocks", so the name fits nicely (pwn intended).



## License

MIT
