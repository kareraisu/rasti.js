app.data.people = [{
    name     : 'Agustín Cuesta',
    id       : 'acuesta',
    area     : 'I+D',
    position : 'Web/mobile dev',
    skills   : 'CSS, HTML, Javascript, Angular, Node, Cordoba',
},{
    name     : 'Julio Incarbone',
    id       : 'jincarbone',
    area     : 'I+D',
    position : 'Project manager',
    skills   : 'Resource management, Innovation, Good vibes',
},{
    name     : 'Alejandro Solari',
    id       : 'asolari',
    area     : 'I+D',
    position : 'Web/mobile dev',
    skills   : 'CSS, HTML, Javascript, Backbone, Git, Angular, Node, Cordoba',
},{
    name     : 'Jairo Jovanovich',
    id       : 'jjovanovich',
    area     : 'SDA',
    position : 'DevOps',
    skills   : 'Networking, Security, PaaS, Docker, Bash',
},{
    name     : 'Mario Giménez',
    id       : 'mgimenez',
    area     : 'SDA',
    position : 'Full-stack dev',
    skills   : 'Java, SQL, Angular, Node, Cordoba',
},{
    name     : 'Carina Monteiro',
    id       : 'cmonteiro',
    area     : 'SDA',
    position : 'Java dev',
    skills   : 'Java, SQL, Git',
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
