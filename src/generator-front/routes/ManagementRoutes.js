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
        return `import ${model.name + 'Page'} from '../pages/crud/${model.name + 'Page'}'`
    }).join("\n")
}

function getRoutesPages(models) {
    return models.map(model => {
        return `   
     {
        name: '${model.name + 'Page'}', 
        path: '/crud/${model.name.toLowerCase()}', 
        component: ${model.name + 'Page'},  
        meta: {
            requiresAuth: true,
            permission: "${model.name.toUpperCase()}_SHOW"
        }
     }`
    }).join(",\n")
}
