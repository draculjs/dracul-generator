const capitalize = require('../../utils/capitalize')
const pluralize = require('../../utils/pluralize')

module.exports = function (model) {
let content =
`import graphqlClient from "../../../apollo";

class ${model.name}Provider {

    find${capitalize(model.name)}(id) {
        return graphqlClient.query({
            query: require('./gql/${model.name}/find${capitalize(model.name)}.graphql'),
            variables: {id:id}
        })
    }

    fetch${capitalize(model.name)}() {
        return graphqlClient.query({query: require('./gql/${model.name}/fetch${capitalize(model.name)}.graphql')})
    }
    
    paginate${capitalize(model.name)}(pageNumber, itemsPerPage, search = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/${model.name}/paginate${capitalize(model.name)}.graphql'),
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }
    
    ${findBy(model)}

    create${capitalize(model.name)}(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/${model.name}/create${capitalize(model.name)}.graphql'),
            variables: {input}
        })
    }
    
    update${capitalize(model.name)}(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/${model.name}/update${capitalize(model.name)}.graphql'),
            variables: {id, input}
        })
    }
    
     delete${capitalize(model.name)}(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/${model.name}/delete${capitalize(model.name)}.graphql'),
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
