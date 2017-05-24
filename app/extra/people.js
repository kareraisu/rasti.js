app.data.people = [{
    name     : 'Agustín Cuesta',
    img      : 'acuesta.jpg',
    area     : 'I+D',
    position : 'Web/mobile dev',
    skills   : 'CSS, HTML, Javascript, Angular, Node, Cordoba',
    email    : 'acuesta@cdt.com.ar',
},{
    name     : 'Julio Incarbone',
    img      : 'jincarbone.jpg',
    area     : 'I+D',
    position : 'Project manager',
    skills   : 'Resource management, Innovation, Good vibes',
    email    : 'jincarbone@cdt.com.ar',
},{
    name     : 'Alejandro Solari',
    img      : 'asolari.jpg',
    area     : 'I+D',
    position : 'Web/mobile dev',
    skills   : 'CSS, HTML, Javascript, Backbone, Git, Angular, Node, Cordoba',
    email    : 'asolari@cdt.com.ar',
},{
    name     : 'Jairo Jovanovich',
    img      : 'jjovanovich.jpg',
    area     : 'SDA',
    position : 'DevOps',
    skills   : 'Networking, Security, PaaS, Docker, Bash',
    email    : 'jjovanovich@cdt.com.ar',
},{
    name     : 'Mario Giménez',
    img      : 'mgimenez.jpg',
    area     : 'SDA',
    position : 'Full-stack dev',
    skills   : 'Java, SQL, Angular, Node, Cordoba',
    email    : 'mgimenez@cdt.com.ar',
},{
    name     : 'Carina Monteiro',
    img      : 'cmonteiro.jpg',
    area     : 'SDA',
    position : 'Java dev',
    skills   : 'Java, SQL, Git',
    email    : 'cmonteiro@cdt.com.ar',   
}]


app.utils.getPeople = criteria => {
    var ret = []
    people.forEach(person => {
        Object.keys(criteria).forEach(prop => {
            if ( person[prop].matches(new Regex(criteria[prop])) ) ret.push(person)
        })
    })
    return ret
}
