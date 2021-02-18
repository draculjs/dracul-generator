module.exports = function importDayjsIfDateExist(properties) {
    let propFilter = properties.filter(field => {
        if (field.type == 'Date' || field.type == 'Datetime') {
            return true
        }
        return false
    })
    if (propFilter.length > 0) {
        return `import {Dayjs} from "@dracul/dayjs-frontend";`
    }
    return ''
}
