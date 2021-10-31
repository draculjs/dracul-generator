module.exports = function (moduleName) {
    let content =
`import merge from 'deepmerge'
import ${moduleName}ManagementRoutes from './${moduleName}ManagementRoutes'

const routes = merge.all([${moduleName}ManagementRoutes])


export default routes;

`
    return content
}


