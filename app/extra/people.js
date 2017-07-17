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
},{
    name     : 'Federico Altenug',
    id       : 'faltenug',
    area     : 'SDA',
    position : 'Java dev',
    skills   : 'Java, SQL, Git',
},{
    name     : 'Marcelo Olgiati',
    id       : 'molgiati2',
    area     : 'SDA',
    position : 'Java dev',
    skills   : 'Java, Angular, SQL, Git',
},{
    name     : 'Alejandro Paiz',
    id       : 'apaiz',
    area     : 'SDA',
    position : 'Java dev',
    skills   : 'Java, SQL, Git',
}]


app.utils.getPeople = criteria => {
    var matches, query
    return app.data.people.filter(person => {
        matches = true
        Object.keys(criteria).forEach(prop => {
            query = criteria[prop]
            if ( app.utils.is.array(query) ) { 
                query = criteria.and
                    ? '(?=.*'+ query.join(')(?=.*') +')'
                    : query.join('|')
                matches = matches && RegExp(query, 'i').test( person[prop] )
            }
            else if ( app.utils.is.string(query) ) {
                matches = matches && ( person[prop].toLowerCase().includes(query.toLowerCase()) )
            }
            else {
                console.warn('Invalid criteria property : %s. Must be array or string!', prop)
            }
        })
        return matches
    })
}
