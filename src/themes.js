exports.themes = {

    base : {
        font : 'normal 14px Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols, EmojiOne Mozilla',
        palette : {
            white   : '#fff',
            lighter : '#ddd',
            light   : '#bbb',
            mid     : '#888',
            dark    : '#444',
            darker  : '#222',
            black   : '#000',
            detail  : 'darkcyan',
            lighten : 'rgba(255,255,255,0.5)',
            darken  : 'rgba(0,0,0,0.2)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'darker lighten', // bg, header bg
        panel   : 'dark lighten',   // bg, header bg
        section : 'mid lighten',    // bg, header bg
        field   : 'light darker',   // bg, text
        btn     : 'detail darker',  // bg, text
        header  : 'darker',         // text
        label   : 'darker',         // text
        text    : 'darker',         // text
    },

    light : {
        page    : 'lighter darken',
        panel   : 'mid lighten',
        section : 'light darken',
        field   : 'lighter dark',
        btn     : 'detail light',
        header  : 'dark',
        label   : 'mid',
        text    : 'darker',
    },
    
}