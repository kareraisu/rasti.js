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
    fx: {...}
})
app.init({ root: 'rootpage'})
```



## API

The whole framework is driven by attributes which can be classified in five categories. Also, there are some utility methods available.


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
Binds the data source for an element. It's value must be the name of a defined data source (a key in the 'data' property of the rasti config object).

**[ajax]**  
Binds an ajax method to a container. It's value must be the name of a defined ajax method (a key in the 'ajax' property of the rasti config object).

**[submit]**  
Defines an element as a trigger for an ajax method. It's value must be the name of a defined ajax method. When the element is clicked, the method is called with a data object containing the current values of all the [field] elements within the [ajax] container bound to the ajax method.


### Templating

**[template]**  
Binds a template to a container. It's value must be the name of a defined template (a key in the 'template' property of the rasti config object). Each time the template is executed, it's output is rendered inside the container.

**[render]**  
Defines an element as a trigger for a given template. It's value must be the name of a defined template. When the element is clicked, the template is rendered.

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


### Style

These can be used as attributes or as classes, and have two variants:
- normal/single (no alteration): they affect the element to which they are applied.
- container/batch (adding an underscore at the end): they affect all immediate children of the element to which they are applied.

Their names are pretty self-explanatory:
ib, center, fl-center, fullw, fullh, autow, autoh, scrollx, scrolly, scroll, columns-2, columns-3.

Note: the last two are meant for containers, thus they don't have an underscore variant.


### Methods
**get(selector)**
Returns a jquery object of the DOM element specified by the selector.

**set(selector, value)**
Sets the value of the DOM element specified by the selector.

**add(selector, item)**
Adds an item to the value of to the DOM element specified by the selector. This must only be used with elements whose value is an array.

These three methods target elements in the active page only, and the selectors must be strings with the form 'attribute=value' (or just 'attribute').

**setTheme(themeName)**
Sets the theme with name themeName, which must of course be correctly defined (either a framework theme or else defined via the rasti config object).



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



## Configuration

Rasti allows to define the pages, data sources, ajax methods and templates of the app and also to add themes and visual effects through a config object with the corresponding properties (which are objects themselves):

**pages: {...}**  
Defines the pages of the app. Currently the only property available to define is the init function of a page, used to initialize it's state upon navigation using the provided navparams. So if a page doesn't need initialization, it's not necessary to add it here.

**data: {...}**  
Defines the data sources available for binding to elements via the [data] attribute. For templates, data sources can be anything the template expects. For rasti blocks, data sources must be arrays of strings or arrays of objects with string properties 'value' and 'label'.

**ajax: {...}**  
Defines the ajax methods available for binding to containers via the [ajax] attribute (and to triggers via the [submit] attribute). The ajax methods must take 2 arguments: a data object and a callback function.

**templates: {...}**  
Defines the templates available for binding to containers via the [template] attribute (and to triggers via the [render] attribute). The templates must be functions that take a data object or array.

**themes: {...}**
Adds global themes available for applying via the setTheme() method. The themes must be objects with the following structure:

```javascript
themeName : {
    font : 'normal 14px sans-serif',
    fontcolor : '#222',
    palette : {
        light: '#ddd',
        mid: '#aaa',
        dark: '#444',
        detail: 'darkcyan',
    },
}
```
This is an example using the color names defined in the default theme map. The theming system uses maps to give more flexibility to themes, allowing to create variatons of the same palette. Thus, the names and quantity of the colors are without constraint, but if you want to use your own names, you must define at least one custom theme map, like so:

```javascript
themeName : {
    font : 'normal 14px sans-serif',
    fontcolor : '#222',
    palette : {
        color1: '#ddd',
        color2: '#aaa',
        color3: '#444',
        color4: 'darkcyan',
    },
    maps : [
	    mapName: {
	        page : 'color1',
	        panel : 'color3',
	        section : 'color2',
	        field : 'color1',
	        btn : 'color4',
	    },
    ]
}
```


**fx: {...}**  
Adds visual effects available for binding to elements or containers via the [fx] attribute. Visual effects must be functions that take a jquery element (the element to which they are bound).
Rasti comes prepackaged with the following effects to use right out of the box:

* **stack** (container): produces a bottom-to-top stacking effect of the element's children



## Roadmap

These are some of the things I've got in mind:
[x] themes
[] ajax data sources
[] url navigation
[] i18n support
[] 'loading' component (bar/dots/circle)
[] more fx's (fade, slide, twist)



## Contributing

Please let me know of any issues you may find or improvements you may think of or features you would like to see (of course you can also send a PR :+1:).



## About the name

Rasti is a block construction toy made in Argentina that resembles Lego, but it's much simpler. This framework was built with simplicity in mind, and includes some "blocks", so the name fits nicely (pwn intended).



## License

MIT
