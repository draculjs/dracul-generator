module.exports = function (moduleName) {
    let content =
`import merge from 'deepmerge'
import ${moduleName}CrudRoutes from './${moduleName}CrudRoutes'

const routes = merge.all([${moduleName}CrudRoutes])


export default routes;

`
    return content
}


