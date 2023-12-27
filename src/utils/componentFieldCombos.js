const capitalize = require('./capitalize')
const descapitalize = require('./descapitalize')
const pluralize = require('./pluralize')
const dateExist = require('./dateExist')

module.exports.generateComboField = function (field, modelName, moduleName) {
    let content = `
                     <v-col cols="12" sm="6">
                        <v-select
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                :items="${field.name.toLowerCase()}s"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name)}')"
                                :loading="loading"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                item-color="secondary"
                                ${field.required ? ':rules="required"' : ''}
                        ></v-select>
                    </v-col>
    `
    return content
}

module.exports.generateDataCombos = function generateDataCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `${field.name.toLowerCase()}s: []`
    }).join(',\n')
}


module.exports.generateImportCombos = function generateImportCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {

        if(capitalize(field.ref) === 'User'){
            return `    import {UserAutocomplete} from "@dracul/user-frontend";`
        }
        if(capitalize(field.ref) === 'Group'){
            return `    import {GroupAutocomplete} from "@dracul/user-frontend";`
        }

        if(capitalize(field.ref) === 'Role'){
            return `    import {RoleCombobox} from "@dracul/user-frontend";`
        }

        return `import ${capitalize(field.ref)}Combobox from "../combobox/${capitalize(field.ref)}Combobox";`

    }).join('\n')
}

module.exports.generateImportCombosEnum = function generateImportCombos(properties) {

    let propFiltered = properties.filter(f => f.type == "Enum" || f.type == "EnumList");

    return propFiltered.map(field => {
        return `import ${capitalize(field.name)}Combobox from "../combobox/${capitalize(field.name)}Combobox";`
    }).join('\n')
}

module.exports.generateImportComponent = function generateImportComponent(properties) {

    function getMultilang(properties) {

        let propMultiLang = properties.filter(p => p.type == "MultiLang")

        if (propMultiLang.length > 0) {
            return "MultiLangSubform,\n          "
        } else {
            return ""
        }
    }

    let propFiltered = filterObjectIdAndEnumProperties(properties);

    let combos = propFiltered.map(field => {
        if (field.type == "ObjectId" || field.type == "ObjectIdList") {
            if(['User','Group'].includes(field.ref)){
                return `${capitalize(field.ref)}Autocomplete`
            }else{
                return `${capitalize(field.ref)}Combobox`
            }

        } else if (field.type == "Enum" || field.type == "EnumList") {
            return `${capitalize(field.name)}Combobox`
        } else if (field.type == "StringList") {
            return 'ListCombobox'
        }
    }).join(',\n          ')

    if (combos.length > 0) {
        return "components: {\n          " + combos + ",\n" + getMultilang(properties) + (dateExist(properties) ? '          DateInput\n' : '' ) + "        },"
    }else if(getMultilang(properties)){
        return "components: {" + getMultilang(properties) + (dateExist(properties) ? ' DateInput' : '') + "},"
    }else if(dateExist(properties)){
        return "components: { DateInput },"
    }


    return ''
}

module.exports.generateMountedCombos = function generateMountedCombos(properties) {

    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return `this.fetch${capitalize(field.ref)}s()`
    }).join('\n')
}


module.exports.generateMethodsCombos = function generateMethodsCombos(properties) {
    let propFiltered = filterObjectIdProperties(properties);

    return propFiltered.map(field => {
        return generateMethodCombo(field)
    }).join(',\n')
}

function generateMethodCombo(field) {
    let content =
        `
            fetch${capitalize(field.name)}s(){
                this.loading= true
                ${capitalize(field.ref)}Provider.${descapitalize(field.ref)}Fetch().then(r => {
                    this.${descapitalize(pluralize(field.ref))} = r.data.${descapitalize(field.ref)}Fetch
                    this.loading = false
                })
            }
        `
    return content
}


function filterObjectIdProperties(properties) {
    let propFiltered = properties.filter(field => {

        if (field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt') {
            return false
        }

        if (field.type == 'ObjectId' || field.type == 'ObjectIdList') {
            return true
        }
        return false
    })
    return propFiltered;
}

function filterObjectIdAndEnumProperties(properties) {
    let propFiltered = properties.filter(field => {

        if (field.name == 'createdBy' || field.name == 'updatedBy' || field.name == 'createdAt' || field.name == 'updatedAt') {
            return false
        }

        if (field.type == 'ObjectId' || field.type == 'ObjectIdList') {
            return true
        }

        if (field.type == 'Enum' || field.type == 'EnumList') {
            return true
        }

        if (field.type == 'StringList') {
            return true
        }

        return false
    })
    return propFiltered;
}
