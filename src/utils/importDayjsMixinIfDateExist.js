module.exports = function importDayjsMixinIfDateExist(properties, importDateInput) {
    let propFilter = properties.filter(field => {
        if (field.type == 'Date' || field.type == 'Datetime') {
            return true
        }
        return false
    })
    if (propFilter.length > 0) {

        if(importDateInput){
            return `import {DayjsMixin, DateInput} from "@dracul/dayjs-frontend";`
        }else{
            return `import {DayjsMixin} from "@dracul/dayjs-frontend";`
        }

    }
    return ''
}
