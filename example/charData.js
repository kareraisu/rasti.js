app.utils.charData = {
    Fei : {
        name : 'Fei Fong Wong',
        occupation : 'Artist',
        location : 'Lahan',
        weapon : 'Bare hands',
        email : 'fei@lahan.com',
        img : 'fei.gif',
    },
    Elly : {
        name : 'Elhaym Van Houten',
        occupation : 'Gebler Soldier',
        location : 'unknown',
        weapon : 'Eather',
        email : 'elly@gebler.com',
        img : 'elly.gif',
    },
    Citan : {
        name : 'Citan Uzuki',
        occupation : 'Town doctor',
        location : 'Lahan',
        weapon : 'Katana',
        email : 'cuzuki@lahan.com',
        img : 'citan.gif',
    },
    Bart : {
        name : 'Bartholomew Fatima',
        occupation : 'Sand Pirate',
        location : 'unknown',
        weapon : 'Whip',
        email : 'bart@yggy.com',
        img : 'bart.gif',
    },
    Billy : {
        name : 'Billy Lee Black',
        occupation : 'Etone Priest',
        location : 'unknown',
        weapon : 'Guns',
        email : 'billy@etos.com',
        img : 'billy.gif',
    },
    Ricardo : {
        name : 'Ricardo Banderas',
        occupation : 'Arena Champion',
        location : 'Kislev',
        weapon : 'Bare hands',
        email : 'thechamp@arena.com',
        img : 'rico.gif',
    },
    Maria : {
        name : 'Maria Balthasar',
        occupation : 'unknown',
        location : 'unknown',
        weapon : 'Gear',
        email : 'maria@zeibzhen.com',
        img : 'maria.gif',
    },
    Emeralda : {
        name : 'Emeralda',
        occupation : 'unknown',
        location : 'unknown',
        weapon : 'unknown',
        email : 'unknown',
        img : 'emeralda-k.gif',
    },
    Wiseman : {
        name : 'Wiseman',
        occupation : 'unknown',
        location : 'unknown',
        weapon : 'unknown',
        email : 'unknown',
        img : 'wiseman.gif',
    },
    Grahf : {
        name : 'Grahf',
        occupation : 'unknown',
        location : 'unknown',
        weapon : 'unknown',
        email : 'unknown',
        img : 'grahf.gif',
    },
}

app.utils.getCharData = function(names) {
    var ret = []
    names.forEach(function(name){
        if (app.utils.charData[name]) ret.push(app.utils.charData[name])
    })
    return ret
}
