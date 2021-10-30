const capitalize = require('../../../utils/capitalize')

module.exports = function (model) {
let content =
`mutation delete${capitalize(model.name)}($id: ID!){
    delete${capitalize(model.name)}(id: $id){
        id
        success
    }
}

`

return content
}
