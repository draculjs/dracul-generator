const descapitalize = require('../../../utils/descapitalize')

module.exports = function (model) {
let content =
`mutation ${descapitalize(model.name)}Update($id: ID!, ${variables(model.properties)}){
    ${descapitalize(model.name)}Update(id: $id, input: {${input(model.properties)} }){
        id
        ${retorno(model.properties)}
    }
}

`

return content
}

function variables(properties){

    let propFiltered = properties.filter(field => {
        if(field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt'){
            return false
        }
        return true
    })

    return propFiltered.map(field => {
        switch(field.type){
            case 'ObjectId':
                return `$${field.name}:ID${field.required?'!':''}`
            case 'ObjectIdList':
                return `$${field.name}:[ID${field.required?'!':''}]`
            case 'Enum':
                return `$${field.name}:${field.name}Enum${field.required?'!':''}`
            case 'EnumList':
                return `$${field.name}:[${field.name}Enum${field.required?'!':''}]`
            case 'StringList':
                return `$${field.name}:[String${field.required?'!':''}]`
            case 'Date':
            case 'Datetime':
                return `$${field.name}:String${field.required?'!':''}`
            case 'Mixed':
                return `$${field.name}:JSON${field.required?'!':''}`
            case 'MultiLang':
                return `$${field.name}:MultiLangInput${field.required?'!':''}`
            default:
                return `$${field.name}:${field.type}${field.required?'!':''}`
        }

    }).join(', ')
}


function input(properties){

    let propFiltered = properties.filter(field => {
        if(field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt'){
            return false
        }
        return true
    })

    return propFiltered.map(field => {
        return `${field.name}: $${field.name}`
    }).join(', ')
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
