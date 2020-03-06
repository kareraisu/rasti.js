# Rasti.js

<img align=right height=150 src="http://www.rasti.com.ar/files/img_products/avion-2.png">

Rasti is a tiny frontend framework for building prototypes in a fast and simple way. It was born from the process of building a prototype in which I wanted to be able to write just the essential, while also making the code as expressive as possible. This led to a super-terse attribute-driven html api backed by simple javascript objects classified in namespaces.



## Getting started

The easiest way to get started is to download the rasti+zepto bundle, insert it into your html at the end of the body and declare your app in the body start tag, like so:

```html
<body rasti="cool-app">
    
    <!-- cool app here -->

    <script src="rasti+zepto.min.js"></script>
</body>

```

Alternatively, you can clone or download the whole repo, open the example app inside the 'app' folder and start fiddling with it. You can open it simply by opening the index.html in a browser, or you can set up the dev environment to have live-reload capabilities (for this, see the Contributing section).



## Initialization

```javascript

app.extend({
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
    root : 'rootPage', // defaults to first page in html
    theme : 'myTheme', // defaults to 'base' theme
})
```



## API

The whole framework is driven by attributes which can be classified into seven categories. Also, there are some utility methods available.


### Structure

**[page]**  
Defines a page of the app. A page is a top-level container. It's value must be a unique name among all the page containers defined within the app.

**[panel]** and **[section]**  
Define a container of related content. Panels contain sections.

**[modal]**
Defines a container as a modal element.

**[menu]**
Defines a container as a menu element.

**[row]** and **[col-1]** to **[col-12]**  
Define a responsive grid a la bootstrap (12 columns grid system). Rows contain columns.


### Text

**[header]**  
Creates a header for a container, it's value becomes the text of the header. Can be used with panels and pages.

**[label]**  
Creates a label for an element, it's value becomes the text of the label. Can be used with any element, except panels and pages.

**[text]**  
Creates text within an element, it's value becomes the text.

These three attributes can be localized by using a language key for their value.


### Navigation

**[nav]**  
Defines a navigation action. It's value must be the name of a page. When the element is clicked, the app navigates to the specified page.

**[navparam]**  
Defines a navigation parameter. It's value must be a unique name among all the navparam elements defined within the enclosing page.

**[params]**  
Binds a params object to a nav action (if used, it must be accompanying a [nav] attribute). It's value must be a series of space separated navparam names, or empty. The current value of all specified navparam elements within the current page will be copied into an object which will be passed to the init function of the target page. If the attribute value is empty, the prior will apply to all existing navparam elements within the current page.


### Blocks (custom elements)

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

#### Adding blocks
Blocks can be added to the framework via the {blocks} namespace (see the Configuration section).


### Data

**[field]**  
Applies rasti styles to an element. If it has a value, it will be used as the key for the element's value in a potential ajax method data object.

**[data]**  
Binds the data source for an element. It's value must be the name of a defined data source (a key in the {data} namespace).

**[ajax]**  
Binds an ajax method to a container. It's value must be the name of a defined ajax method (a key in the {ajax} namespace).

**[submit]**  
Defines an element as a trigger for an ajax method. It's value must be the name of a defined ajax method. When the element is clicked, the method is called with a data object containing the current values of all the [field] elements within the [ajax] container bound to the ajax method.


### Templating

**[template]**  
Binds a template to a container. It's value must be the name of a defined template (a key in the {template} namespace). Each time the template is executed, it's output is rendered inside the container.

**[render]**  
Defines an element as a trigger for a template. It's value must be the name of a defined template. When the element is clicked, the template is rendered.

**[paging]**  
Adds paging to a template. It's value must be a number, which indicates the page size (the maximum number of elements a page can hold).

**[fx]**  
Applies a visual effect to an element or container. It's value must be the name of a defined fx. When the element is rendered, the visual effect is displayed.


### Actions

**[on-click]**, **[on-change]**, **[on-hover]**, **[on-focus]**, **[on-load]**   
Bind an utility method to an element's event. It's value must be the name of a defined utility method (a key in the {utils} namespace). When the event is triggered, the utility method will be called with the event object as its sole argument.

**[show]**, **[hide]** and **[toggle]**   
They allow an element's click or hover event to change another element's visibility in a simple fashion. It's value must be a selector string of the form 'attr=value' (the target element, which must be in the same page).


### Functional

**[movable]**
Makes an element freely movable via drag and drop.

**[resizable]**
Makes an element resizable (adds a small handle in the bottom-right corner).

**[foldable]**
Makes an element foldable upon clicking on its header (must be used along with the [header] attr).


### Utility Classes

These are classes (values of the [class] attribute), and have two variants:
- normal/single (no alteration): they affect the element to which they are applied.
- container/batch (adding an underscore at the end): they affect all immediate children of the element to which they are applied.

Their names are pretty straight-forward:
- rel: relative positioning
- fix: fixed positioning
- inline: inline-block display
- big, small: change the size of [field]s, [btn]s and [icon]s
- round: make an element round (ie [btn]s and [icon]s)
- floating: useful for creating [field]s with [icon]s
- left, right, top, bottom: absolute positioning
- centerx, centery, center: absolute centering in x, y or both
- fcenterx, fcentery, fcenter: flex centering in x, y or both
- fullw, fullh: full width or height
- halfw, halfh: half width or height
- autow, autoh: auto width or height
- autom: auto margin
- scrollx, scrolly, scroll: scroll in the x axis, y axis or both
- columns-2, columns-3: arrange elements in 2 or 3 columns (these are meant for containers, thus they don't have an underscore variant)
- scale-up: scale a bit upon hover

Besides these, there are some classes that come in handy for tuning element visibility, spacing and structure across different viewport sizes. They are of the form `<name>-<size>`, where the sizes are `phone`, `tablet` and `desktop`:
- show-<size>: shows the element for some viewport size
- hide-<size>: hides the element for some viewport size
- pad-s-<size>: applies a small padding to the element for some viewport size
- pad-<size>: applies a medium padding to the element for some viewport size
- pad-l-<size>: applies a large padding to the element for some viewport size
- hh-<size>: hides any [header] defined on the element for some viewport size
- tabs-<size>: creates tabs within the element for some viewport size (meant for containers)

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
Navigates to the given page. If navParams are provided, they are passed to the in() function of the page.

**setTheme(themeName, mapName)**  
themeName : string, mapName : string (optional)  
Loads the given theme (either a default framework theme or else defined in the {themes} namespace). If a map name is provided, it will be first looked up in the theme and then -if not found- in the framework. If the map name is not found in neither, or is not provided, the default 'light' map will be used.

**setLang(langName)**  
langName : string  
Loads the given language (which must be defined in the {langs} namespace).

**updateBlock($el, data)**  
$el : jQuery object, data : array or function (optional)  
Updates the options/items of the given element (which must be a rasti block, a select or a list) according to the given data, or if no data argument is provided, to the data source specified in the [data] attribute of the element.



## Namespaces

Rasti allows to define the pages, data sources, ajax methods and templates of the app and also to add themes, languages, "blocks" (custom elements), visual effects and utility methods via the following namespaces. These are just object properties of any given rasti instance and can be accesed directly as such (instance.namespace) or -just for the sake of code brevity- they can also be extended using the extend() method.

**pages: {...}**  
Defines the pages of the app. Pages must be objects which can have any or all of the following properties:
- url: a string which represents the page's url fragment identifier (aka 'hash'), which will be updated upon navigation (or will dictate navigation from the browser location bar).
- init: a function with no arguments which is used to initialize the page state (this function is called once during app initialization).
- in: a function which takes an optional 'navParams' object argument, used to update the page state upon navigation. This function is called everytime the user navigates into the page.
- out: a function which takes an optional 'navParams' object argument, used to update the page state upon navigation. This function is called everytime the user navigates away from the page.

**data: {...}**  
Defines the data sources available for binding to elements via the [data] attribute. For templates, data sources can be anything the template expects. For rasti blocks, data sources must be arrays of strings or arrays of objects with string properties 'value' and 'label'.
Data sources can also be functions with a callback argument, which should be called with the actual data, allowing for ajax-driven data sources.

**ajax: {...}**  
Defines the ajax methods available for binding to containers via the [ajax] attribute (and to triggers via the [submit] attribute). The ajax methods must take 2 arguments: a data object and a callback function.

**templates: {...}**  
Defines the templates available for binding to containers via the [template] attribute (and to triggers via the [render] attribute). The templates -as usual- must be functions that take a data object or array and return a string of html.

**themes: {...}**  
Adds themes available for applying via the setTheme() method. The themes must be objects with the following structure:

```javascript
themeName : {
    font : 'normal 14px sans-serif',
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

**langs: {...}**  
Adds languages available for loading via the setLang() method. Languages nust be simple maps of strings (objects with string properties). Upon loading the language, all [header], [label] and [placeholder] attributes whose value matches a key of the language map will have their value replaced by the corresponding string. [text] attributes values are also matched against the language map, but the corresponding string is applied as the element's inner html (any prior contents will be lost).

**blocks: {...}**  
Adds blocks available to be used via the [block] attribute. They must have the following structure:

```javascript
 blockName : {
    template : function(data) {...}, // data : array
    init : function($el) {...},      // $el : jQuery object
    style : `...`                    // string of css rules
}
```

**fx: {...}**  
Adds visual effects available for binding to elements or containers via the [fx] attribute. Visual effects must be functions that take a jquery-wrapped element (the element to which they are bound).
Rasti comes prepackaged with the following effects to use right out of the box:

* **stack** (container): produces a bottom-to-top stacking effect on the element's children

* **stamp** (container): produces a stamp-like effect on the element's children

* more to come (maybe)

**utils: {...}**  
Adds utility methods within the app namespace available for general use and for quick binding as element event handlers via the [on-...] attributes.



## Roadmap

These are some of the things I've got in mind:

- [ ] accordeon block
- [ ] carruosel block
- [ ] easy toasts
- [ ] css variables
- [ ] internal (instance) history
- [ ] easy keyboard bindings (per page or global)
- [ ] conditional dependencies
- [ ] navbar utility classes (top, bottom, side)
- [ ] fullscreen toggle handle
- [ ] more fx's (fade, slide, flip, twist)

Done:
- [x] themes api
- [x] blocks api
- [x] templates
- [x] function data sources
- [x] url navigation
- [x] i18n support
- [x] field validation **(docs pending)**
- [x] field dependency **(docs pending)**
- [x] state management and persistence **(docs pending)**
- [x] paging
- [x] tabs
- [x] modals
- [x] icons **(docs pending)** 
- [x] attribute fallback
- [x] app bootstrapping
- [x] single bundle (js+css+zepto)
- [x] scrollbar styles
- [x] move & resize
- [x] 'loading' component (circle) **(bar & dots pending)**


## Contributing / Dev environment setup

1. Fork / clone / download the repo : `$ git clone https://github.com/kareraisu/rasti.js.git`

2. cd into your local copy : `$ cd rasti.js`

3. Install dependencies : `$ npm install` (install [Node.js](https://nodejs.org/) first if you don't have it)

4. Start the live-reload server : `$ gulp` (this also generates the bundles and watches all the files, see the gulpfile.js if curious)

5. Hack away

6. Make a Pull Request (if you forked)

Please let me know of any issues you may find, improvements you may think of or features you would like to see!



## About the name

[Rasti](https://en.wikipedia.org/wiki/Rasti) is a block construction toy made in Argentina that resembles Lego, but it's much simpler. This framework was built with simplicity in mind, and includes some "blocks", so the name fits nicely.



## License

MIT
