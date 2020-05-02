exports.themes = {

    base : {
        font : 'normal 14px Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols, EmojiOne Mozilla',
        palette : {
            white   : '#eee',
            lighter : '#ddd',
            light   : '#bbb',
            mid     : '#999',
            dark    : '#444',
            darker  : '#222',
            black   : '#111',
            detail  : 'darkcyan',
            lighten : 'rgba(255,255,255,0.2)',
            darken  : 'rgba(0,0,0,0.2)',
        },
    },

}


exports.themeMaps = {

    dark : {
        page    : 'black lighten', // bg, header bg
        panel   : 'darker lighten',   // bg, header bg
        section : 'dark lighten',    // bg, header bg
        field   : 'light darker',   // bg, text
        btn     : 'detail darker',  // bg, text
        header  : 'light',          // text
        label   : 'light',          // text
        text    : 'light',          // text
    },

    light : {
        page    : 'light darken',
        panel   : 'mid lighten',
        section : 'lighten darken',
        field   : 'lighter dark',
        btn     : 'detail dark',
        header  : 'darker',
        label   : 'darker',
        text    : 'darker',
    },
    
}