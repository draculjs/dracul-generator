module.exports = function importMultiLangIfExist(properties) {
    let propFilter = properties.filter(field => {
        if (field.type == 'MultiLang') {
            return true
        }
        return false
    })
    if (propFilter.length > 0) {
        return `import {MultiLangSubform} from "@dracul/common-frontend";`
    }
    return ''
}
