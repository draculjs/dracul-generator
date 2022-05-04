const capitalize = require('../../utils/capitalize')

module.exports = function ({name}) {
    let content =
`import ${capitalize(name)}Combobox from "./${capitalize(name)}Combobox";

export {${capitalize(name)}Combobox}
export default ${capitalize(name)}Combobox


`
    return content
}


