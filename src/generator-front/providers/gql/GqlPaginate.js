const capitalize = require('../../../utils/capitalize')

module.exports = function (model) {
let content =
`query paginate${capitalize(model.name)}( $pageNumber: Int, $itemsPerPage:Int, $search: String, $filters: [FilterInput], $orderBy: String, $orderDesc: Boolean){
    paginate${capitalize(model.name)}( pageNumber: $pageNumber, itemsPerPage: $itemsPerPage, search: $search, filters: $filters, orderBy: $orderBy, orderDesc: $orderDesc){
        totalItems
        page
        items{
          id
          ${retorno(model.properties)}
        }
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
                ${field.refDisplayField != 'id' ? field.refDisplayField : ''}
            }`
        }

        return `${field.name}`
    }).join('\n        ')
}
