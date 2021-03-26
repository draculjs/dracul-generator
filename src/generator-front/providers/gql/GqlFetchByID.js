const descapitalize = require('../../../utils/descapitalize')

module.exports = function (model) {
let content =
`query ${descapitalize(model.name)}Find($id:ID!){
    ${descapitalize(model.name)}Find(id:$id){
        id
        ${retorno(model.properties)}
    }
}
`

return content
}

function retorno(properties){


    return properties.map(field => {

        if(field.type == 'MultiLang'){
            return `${field.name}{
                en
                es
                pt
            }`
        }

        if(field.name == 'createdBy' || field.name == 'updatedBy'){
            return `${field.name}{
                id
                name
                username
            }`
        }

        if(field.type == 'ObjectId' || field.type == 'ObjectIdList'){
            return `${field.name}{
                id
                ${field.refDisplayField}
            }`
        }

        return `${field.name}`
    }).join('\n        ')
}
