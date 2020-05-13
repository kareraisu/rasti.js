exports.themes = {

    base : {
        font : 'normal 14px Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols, EmojiOne Mozilla',
        palette : {
            primary    : 'darkcyan',
            danger     : 'red',
            success    : 'green',
            darkest    : '#111',
            darker     : '#222',
            dark       : '#444',
            mid        : '#999',
            light      : '#bbb',
            lighter    : '#ddd',
            lightest   : '#eee',
            darken     : 'rgba(0,0,0,0.05)',
            darkener   : 'rgba(0,0,0,0.2)',
            darkenest  : 'rgba(0,0,0,0.5)',
            lighten    : 'rgba(255,255,255,0.05)',
            lightener  : 'rgba(255,255,255,0.2)',
            lightenest : 'rgba(255,255,255,0.5)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'darkest lighten',  // bg, header bg
        panel   : 'darker lighten',   // bg, header bg
        section : 'dark lighten',     // bg, header bg
        field   : 'transparent light',// bg, text
        btn     : 'primary darker',   // bg, text
        header  : 'light',            // text
        label   : 'light',            // text
        text    : 'light',            // text
    },

    light : {
        page    : 'light darken',
        panel   : 'mid lighten',
        section : 'lighten darken',
        field   : 'transparent dark',
        btn     : 'primary dark',
        header  : 'darker',
        label   : 'darker',
        text    : 'darker',
    },
    
}