const capitalize = require('../../utils/capitalize')
const pluralize = require('../../utils/pluralize')
const descapitalize = require('../../utils/descapitalize')

module.exports = function (model) {
let content =
`import graphqlClient from "../../../apollo";

class ${model.name}Provider {

    find${capitalize(model.name)}(id) {
        return graphqlClient.query({
            query: require('./gql/${descapitalize(model.name)}Find.graphql'),
            variables: {id:id}
        })
    }

    fetch${pluralize(capitalize(model.name))}() {
        return graphqlClient.query({query: require('./gql/${descapitalize(model.name)}Fetch.graphql')})
    }
    
    paginate${pluralize(capitalize(model.name))}(pageNumber, itemsPerPage, search = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/${descapitalize(model.name)}Paginate.graphql'),
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }
    
    ${findBy(model)}

    create${capitalize(model.name)}(form) {
        return graphqlClient.mutate({
            mutation: require('./gql/${descapitalize(model.name)}Create.graphql'),
            variables: form
        })
    }
    
    update${capitalize(model.name)}(form) {
        return graphqlClient.mutate({
            mutation: require('./gql/${descapitalize(model.name)}Update.graphql'),
            variables: form
        })
    }
    
     delete${capitalize(model.name)}(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/${descapitalize(model.name)}Delete.graphql'),
            variables: {id}
        })
    }

}

export default new ${model.name}Provider()


`

    return content
}


function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content =
`${model.name.toLowerCase()}sBy${capitalize(field.name)}(${field.name}) {
        return graphqlClient.query({
            query: require('./gql/${pluralize(model.name.toLowerCase())}By${capitalize(field.name)}.graphql'),
            variables: {${field.name}}
        })
    }
`
    return content
}
