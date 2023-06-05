module.exports = function (models) {
    let content =
`${getImportPages(models)}

const routes = [
    ${getRoutesPages(models)}
]

export default routes;
`
    return content
}

function getImportPages(models) {
    return models.map(model => {
        return `import ${model.name + 'CrudPage'} from '../pages/crud/${model.name + 'CrudPage'}'`
    }).join("\n")
}

function getRoutesPages(models) {
    return models.map(model => {
        return `   
     {
        name: '${model.name + 'CrudPage'}', 
        path: '/crud/${model.name.toLowerCase()}', 
        component: ${model.name + 'CrudPage'},  
        meta: {
            requiresAuth: true,
            permission: "${model.name.toUpperCase()}_MENU"
        }
     }`
    }).join(",\n")
}
