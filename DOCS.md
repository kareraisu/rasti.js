# 📖 Rasti.js docs
Welcome to the docs!

Here you can find information and examples of (nearly) all the features of rasti.js (some small amount is still undocumented, but we' ll get there... we do what we can 🥴).

Use the index for quick navigation:

<!-- toc -->

- [Attributes](#attributes)
  * [Structure](#structure)
  * [Text](#text)
  * [Navigation](#navigation)
  * [State](#state)
  * [Data](#data)
  * [Templates](#templates)
  * [Blocks (custom elements)](#blocks-custom-elements)
  * [Events](#events)
  * [Actions](#actions)
  * [Functional](#functional)
- [Properties](#properties)
  * [.options](#options)
  * [.active](#active)
  * [.history](#history)
  * [.state](#state)
- [Namespaces](#namespaces)
  * [.pages](#pages)
  * [.data](#data)
  * [.props](#props)
  * [.methods](#methods)
  * [.themes](#themes)
  * [.langs](#langs)
  * [.blocks](#blocks)
  * [.fx](#fx)
- [Instance methods](#instance-methods)
- [Static utility methods](#static-utility-methods)
- [Utility classes](#utility-classes)

<!-- tocstop -->

# Attributes

The framework is driven by html attributes which can be classified into the following categories:


## Structure

**`[page]`**  
Declares a page container. A page is a top-level container. It's value must be a unique name among all the pages defined within the app.

**`[modal]`**  
Declares a modal container. Modals are dialogs which, while active, block the rest of the UI.

**`[menu]`**  
Declares a menu container. Menus are pop-up lists of options, usually used for navigation or for triggering specific actions.

**`[panel]`** and **`[section]`**  
Declares a container of related content. Panels contain sections and each are themeable.  
*Note: These two are currently under consideration as they are not that useful.*


## Text

**`[header]`** and **`[foldable]`**  
Create a header for a container, their value becomes the text of the header. The latter also makes the container foldable and it can be without value, in which case the header will contain just an arrow indicator.

**`[label]`**  
Creates a label for an element, it's value becomes the text of the label. The label can be inlined adding the `.inline-label` utility class to the element.

**`[text]`**  
Creates text within an element (replaces the inner html of the element), it's value becomes the text.

All these attributes can be localized by using a language key for their value.


## Navigation

**`[nav]`**  
Declares a navigation action. It's value must be the name of a page. When the element is clicked, the app navigates to the specified page.

**`[navparam]`**  
Declares a navigation parameter. It's value must be a unique name among all the `navparam` elements defined within the enclosing page.

**`[params]`**  
Binds a params object to a nav action (must be used along a `[nav]` attribute). It's value must be a series of space separated `navparam` names, or empty. The current value of all specified `navparam` elements within the current page will be copied into an object which will be passed to the `init` function of the target page. If the attribute value is empty, the prior will apply to all existing `navparam` elements within the current page.


## State

**`[prop]`**  
Declares a property (a piece of the app's state) and binds it to an element. The binding is bi-directional or "two-way", which means that when the property's value changes, the value of the element is updated accordingly, and viceversa (when the value of the element changes, the property's value is updated accordingly). In the case of templates, the binding is uni-directional since templates don't have a value, so they just react to prop changes by re-rendering.

**`[transient]`**  
Declares a property as transient (non-persistant). Props are persistant by default, which means that their values are persisted (remembered) between sessions. By declaring a prop as transient, it won't be persisted, so it's value will be lost when closing the tab or the window.

*Note: In case you don't want any props to be persisted, set the `persist` init option to `false`.*


## Data

**`[data]`**  
Declares a data source for the element. Its value must be the name of a defined data source (a key in the `{data}` namespace). This attribute pairs nicely with `[template]` elements, but can also be used in `<select>`,  `<table>`, `<ol>` and `<ul>` elements to automatically render their content based on the provided data.

**`[separator]`**  
Declares a separator for a string data source (must be used algong a `[data]` attribute). Its value must be a character, which will override the default separator (set via the `separator` init option) for the affected element.

**`[ajax]`**  
Binds a method to a container to be called on submit. It's value must be the name of a defined method (a key in the `{method}` namespace).

**`[submit]`**  
Declares an element as a trigger for an ajax method. It's value must be the name of a defined method. When the element is clicked, the method is called with a data object containing the current values of all the elements within the `[ajax]` container bound to the ajax method.

Example:

```html
<div ajax=getThings>
    <input prop=name label>
    <select prop=category data label></select>

    <button submit=getThings>Get'em!</button>
</div>
```


## Templates

**`[template]`**  
Declares a template. If a value is provided, it becomes the name of the template and it will be recognised by the `render()` method. Templates may also be bound to a data source via the `[data]` attribute and/or to a property via the `[prop]` attribute.  

Inside them, you have access to the following variables/namespaces:

- `el` : the current data scoped to the template, may be anything coming from a bound data source or else the value of a bound property (or `undefined` if neither applies).
- `data` : the app's `{data}` namespace.
- `props` : the app's `{props}` namespace.
- `methods` : the app's `{methods}` namespace.
- `lang` : the currently active lang (if any).  

You can access these variables and/or interpolate any other expressions inside elements or in attribute values via the `${}` syntax. For example, here's how we could implement a (localized) toast message:

```html
<div template=toast fx=toast>
    <div class="${ el.class }">
        <div icon="${ el.icon }"></div>
        <div class="scrolly flex centery"
            style="height: 50px; margin-left: 10px; flex-flow: wrap;">
            ${ props.isAllGood ? lang[el.msg] : lang[el.error] }
        </div>
    </div>
</div>
```

We could then render the template programmatically with `app.render('toast', {class, icon, msg, error})`. Or we could do this:

```html
<div template prop=toast fx=toast>
    <div class="${ props.toast.class }">
        <div icon="${ props.toast.icon }"></div>
        <div class="scrolly flex centery"
            style="height: 50px; margin-left: 10px; flex-flow: wrap;">
            ${ props.isAllGood ? lang[props.toast.msg] : lang[props.toast.error] }!
        </div>
    </div>
</div>
```

This version would automatically render when `app.props.toast` changes, so we don't need to render it manually. Just change the property and let the template react to the change.  
`Just keep in mind that it only reacts to new assignments, not to mutations!`

**`[render]`**  
Declares an element as a trigger for a template. It's value must be the name of a template. When the element is clicked, the template is rendered.

Can be combined with the `[submit]` attribute, in which case it waits for the ajax call to finish and then renders using the response data, allowing for an easy get-and-render combo. Building on the `[submit]` example:

```html
<div ajax=getThings>
    <input prop=name label>
    <select prop=category data label></select>

    <button submit=getThings render=things>
        Get'em! Then show'em!
    </button>
</div>

<div template=things>
    Here be things!
</div>
```


**`[paged]`**  
Adds paging to a template. The available page sizes (the maximum number of elements per page) can be defined via the `sizes` init option (the default is `[5, 10, 20, 50]`).

```html
<div paged template=things>
    Here be (paged) things!
</div>
```

**`[fx]`**  
Applies a visual effect to an element or container. It's value must be the name of a defined effect. When the element is rendered, the visual effect is displayed. Currently these are the available effects:
- `stack`
- `stamp`
- `toast`


## Blocks (custom elements)

Rasti comes with a couple of (currently non-standard) custom elements for speeding up UI implementation. These elements are available via the `[block]` attribute:

**`[block=radios]`**  
Creates a group of related radio buttons.

**`[block=buttons]`**  
Creates a group of small related persistent buttons. By default it acts as a group of radio buttons (only one can be checked at a time) but can behave like a checkbox group by adding a `[multiple]` attribute.

**`[block=multi]`**  
Creates a multi select element whose value is an array.
Options:
- `[max]` : must be a number, sets the maximum number of options that can be selected at once.
- `[filter]` : must be a string or empty, enables filtering options via an input field, it's value will be the input's placeholder text.

There is one more custom element that doesn't use the `[block]` attribute.

**`<select img>`**  
Creates a select capable of showing images in its options. The images are retrieved from the relative path specified in the `[img]` attribute.


### Adding blocks
Blocks can be added to the framework via the `{blocks}` namespace (see the Configuration section).




## Events

**`[on-...]`**   
Declares an event handler (similar to the standard way but with an "`-`" after the "`on`"). It's value must be the name of a defined method (a key in the `{methods}` namespace). When the event is triggered on the element, the method will be called with the event object as its sole argument. It's a convinience for handling events, with the added benefit of delegating to the container when used in templates.

```html
<button on-click="doTheThing">Do it</button>
```
```js
// inside app config
methods : {
    ...
    doTheThing(e) {
        console.log('Doing the thing!')
        ...
    },
    ...
}
```


## Actions

**`[show]`**, **`[hide]`** and **`[toggle]`**   
They allow an element's `click` event to change another element's visibility in a simple fashion. It's value must be a selector string of the form `"attr=value"` (the target element, which must be in the same page). For example:

```html
<button show="modal=signup">Sign up</button>

<div modal=signup>
    This will show up on click
</div>
```


## Functional

**`[movable]`**  
Makes an element freely movable via drag and drop.

**`[resizable]`**  
Makes an element resizable (adds a small handle in the bottom-right corner).

**`[foldable]`**  
Makes an element foldable (adds a header to it to fold or unfold it, when folded only the header remains visible). If a value is provided, it is used as the text for the header (which can be localized).

**`[key-nav]`**  
Makes an element or a template navigatable via keyboard, which means it can be focused via `Tab` key, clicked via `Enter` or `Space` keys, and for templates its immediate children can be traversed (same level only) via the arrow keys.



# Properties

These are the properties available in rasti instances.

## .options
These are the options used to initialise the app. Here is the complete list of options with their default values:

```js
> app.options
// returns the following
< {
    history : true,     // enables internal history
    persist : true,     // enables state persistence
    root    : '',       // defines the initial page
    theme   : 'base',   // defines the initial theme
    lang    : '',       // defines the initial lang
    separator : ';',    // defines the default character for splitting string data
    imgPath : 'img/',   // defines the default path for images
    imgExt  : '.png',   // defines the default extension for images
    pageSizes : [5, 10, 20, 50], // defines the available page sizes for paging templates
    media   : {         // defines the media breakpoints of the app
        phone : 500,
        tablet : 800,
    },
}
```

## .active
Object that exposes the currently active page, theme and lang names. Useful for app introspection.
```js
> app.active
// returns the following
< {
    page  : '(active page name)',
    theme : '(active theme name)',
    lang  : '(active lang name)',
}
```

## .history
Object for managing the internal app navigation history. Exposes the following methods:

- `.back()` : navigates back to the previous page in the history

- `.forward()` : navigates forward to the next page in the history

- `.clear()` : clears the navigation history


## .state
Object for managing the app state persistence. Exposes the following methods:

- `.get()` : returns the last saved state from local storage

- `.save()` : saves the current state of the app to local storage

- `.restore()` : restores the app state to the last saved state

- `.clear()` : clears the saved state (deletes the local storage item)



# Namespaces

Rasti allows to define page hooks, data sources, props and methods of an app and also to add themes, languages, "blocks" (custom elements) and "fx" (visual effects) via the following namespaces.

*Note: These are just properties of any given rasti instance and can be accesed and assigned directly as such ( `instance.namespace = sth` ) or -just as a convinience- they can also be defined in "batch" using the `config()` method.*

## .pages
Defines hooks for the pages of the app. Each page can have one of each of the following hooks:

- `init()` : a function with no arguments which is used to initialize the page state (this function is called only once during app initialization).

- `in(navParams?)` : a function which takes an optional `navParams` object argument, used to update the page state upon navigation. This function is called everytime the user navigates into the page (**after** activating the page).

- `out(navParams?)` : a function which takes an optional `navParams` object argument, used to update the page state upon navigation. This function is called everytime the user navigates out of the page (**before** activating the next page).

Example:

```js
app.pages = {
    main : {
        init() {
            // init the page
        },
        in( {foo, bar} ) {
            // do sth when entering the page
        },
        out( {baz} ) {
            // do sth when exiting the page
        }
    }
}
```

## .data
Defines the data sources available for binding to elements via the `[data]` attribute.

For templates, data sources can be anything the template expects.

For rasti blocks, `<select>`, `<ol>` and `<ul>` elements, data sources must be token-separated strings (like the `csv` format), arrays of strings or arrays of objects with string properties `value` and `label`.

For `<tables>` the strings must represent tabular data, with the first strings being the column headers, or else an array of objects of the same shape, in which case the columns are generated from the properties of the objects.

Data sources can also be `functions` with a callback argument, which should be called with the actual data, allowing for ajax-driven data sources.

Example:

```js
app.data = {
    // for some template
    artist : {
        name: 'Carpenters',
        bio: 'An awesome band from the 70s',
        albums: [...]
    },
    // for a list
    genres : 'vocal, ballad, oldies but goldies',
    // for a table
    songs : `Name | Album | Duration
        | Sing | Carpenters | 4:20
        | Top of the World | Carpenters | 2.50
        | Solitaire | Carpenters | 4:40
        ...`,
    // ajax source
    getLyrics(cb) {
        fetch(`www.lyrics.com/${this.props.song}`)
            .then(lyrics => cb(lyrics)) // or just .then(cb)
    }
}
```

## .props
Provides access to the current app state, that is to all the app properties declared via the `[prop]` attribute. You can get and set prop values via this namespace.

Example:
```html
<input prop=name placeholder="enter your name"/>

<span template prop=name>I will call you: ${props.name}<span>
```
```js
console.log(app.props.name) // logs the current value of the input

app.props.name = 'Marta' // changes the input value to 'Marta'
                         // and re-renders the span
```

## .methods
Defines the methods available for binding to containers via the `[ajax]` attribute, to triggers via the `[submit]` attribute or for handling events via `[on-...]` attributes. Note: methods used for ajax must take 2 arguments: a data object and a callback function.


## .themes
Adds themes available for applying via the `setTheme()` method. Themes are objects with `font`, `palette` and `maps` properties.

Example:

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

This is an example using the color names defined in the default themes and maps. The theming system uses maps to give more flexibility to themes, allowing to create variatons of the same palette. Thus, the names and quantity of the colors are without constraint, but if you want to use your own names, you must define at least one custom theme map with those names. If no map is defined, the default `'light'` map will be used (in which case your theme must use the default color names or it won't load).

All theme map keys except `'text'` and `'label'` expect two colors, the first will be used for the background and the second for the header (in the case of containers) or the text of the element. (page, panel, section : 'bgcolor headercolor', btn : 'bgcolor textcolor').

## .langs
Adds languages available for loading via the `setLang()` method. Languages must be simple maps (also called "dictionaries") of strings, which in js means just plain objects with string properties.

For example:
```js
app.langs = {
    es : {
        lang : 'español',
        hello : 'hola',
        bye_bye : 'hasta luego',
        i_know_lang : 'no gracias, soy alérgico a los crustáceos',
        ...
    },
    jp : {
        lang : '',
        hello : '',
        bye_bye : '',
        i_know_lang : '',
        ...
    }
}
```

## .blocks
Adds blocks available to be used via the `[block]` attribute. They must have the following structure:

```javascript
 blockName : {
    render : function(data) {...},   // data : array
    init : function($el) {...},      // $el : $ instance
    style : `...`                    // string of css rules
}
```

## .fx
Adds visual effects available for binding to elements or containers via the `[fx]` attribute. Visual effects must be functions that take a $ instance (of the element to which they are bound).
Rasti comes prepackaged with the following effects to use right out of the box:

* **`stack`** (container): produces a bottom-to-top stacking effect on the element's children

* **`stamp`** (container): produces a stamp-like effect on the element's children

* more to come (maybe)



# Instance methods

These are the methods available in rasti instances. They are chainable.

**`config(config?)`**  
`config` : object (optional)  
Configures the rasti instance (defines the page hooks, props, data sources, methods, themes and langs).

**`init(options?)`**  
`options` : object (optional)  
Initializes the rasti instance using the provided options. The available options are:  
TODO describe init options

**`navTo(pageName, navParams?)`**  
`pageName` : string, `navParams` : object (optional)  
Navigates to the given page. If `navParams` are provided, they are passed to the `in()` hook of the page (if any) **before** navigating to it. If there is an error the navigation is aborted. If the navigation succeeds, a `'rasti-nav'` event is triggered on the app container.


**`render(el, data?)`**  
`el` : string or DOM node or $ instance, `data` : string or array or function (optional)  
If `el` is a string, it (re-)renders the template by that name, else it updates the contents of the given element (which can be a `[block]`, `<select>`, `<table>`, `<ol>` or `<ul>`). Uses the provided `data` (if any) or fallbacks to the data source declared in the `[data]` attribute of the element.

**`setTheme(themeName, mapName)`**  
`themeName` : string, `mapName` : string (optional)  
Loads the given theme (either a default framework theme or else one defined in the `{themes}` namespace). If a map name is provided, it will be first looked up in the theme and then -if not found- in the framework. If the map name is not found in neither, or is not provided, the default `'light'` map will be used.

**`setLang(langName)`**  
`langName` : string  
Loads the given language (which must be defined in the `{langs}` namespace).  
Upon loading the language, all `[header]`, `[foldable]`, `[label]` and `[placeholder]` attributes whose value matches a key of the language will have their value replaced by the corresponding string. `[text]` attributes values are also matched against the language, but the corresponding string is applied as the element's inner html (any prior contents will be lost).



# Static utility methods

Apart from the instance methods, rasti provides some useful utility methods available via the static `rasti.utils` namespace.



# Utility classes

There are also several utility css classes available, which come in two variants:
- normal/single (no alteration): they affect the element to which they are applied.
- container/batch (adding an underscore `_` at the end): they affect all immediate children of the element to which they are applied.

Their names are pretty straight-forward:
- `rel`: relative positioning
- `abs`: absolute positioning
- `fix`: fixed positioning
- `inline`: inline-block display
- `flex`: flexible display
- `small`, `big`, `huge`: changes the size of `[btn]`s and `[icon]`s
- `round`: makes an element round (border-radius)
- `floating`: used for adding `[icon]`s to `<inputs>`s
- `left`, `right`, `top`, `bottom`: absolute positioning
- `centerx`, `centery`, `center`: centering in x, y or both, must be used in combination with `abs` or `flex`
- `scrollx`, `scrolly`, `scroll`: scroll in the x axis, y axis or both
- `fullw`, `fullh`: full width or height
- `halfw`, `halfh`: half width or height
- `autow`, `autoh`,`autom`: auto width, height or margin
- `m0`, `p0`: margin 0, padding 0
- `columns-2`, `columns-3`: arrange elements in 2 or 3 columns (these are meant for containers, thus they don't have a `_` variant)
- `scale-up`: scale up a bit upon hover

Besides these, there are some classes that come in handy for tuning element visibility, spacing and structure across different viewport sizes. They are of the form `name-size`, where the sizes are `phone`, `tablet` and `desktop`:
- `show-<size>`: shows the element for some viewport size
- `hide-<size>`: hides the element for some viewport size
- `pad-s-<size>`: applies a small padding to the element for some viewport size
- `pad-<size>`: applies a medium padding to the element for some viewport size
- `pad-l-<size>`: applies a large padding to the element for some viewport size
- `hh-<size>`: hides any `[header]` defined on the element for some viewport size
- `tabs-<size>`: turns the element's immediate children into tabs for some viewport size (meant for containers)

Also, you can use any theme's color name as a class to apply the color to an element as the background-color upon setting the theme. For example, a div with the class `primary` will be applied a `background-color: 'darkcyan'` when setting the `base` theme (set by default by `app.init()`). See the configuration section for more details on adding themes.
