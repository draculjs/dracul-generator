const getI18nKey = require('../../utils/getI18nKey')
const importDayjsMixinIfDateExist = require('../../utils/importDayjsMixinIfDateExist')
const dateExist = require('../../utils/dateExist')

module.exports = function ({model, moduleName}) {
    let columns = distribute(model.properties)
    let content =
        `<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[1], moduleName)}
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[2], moduleName)}
            </v-list>
        </v-col>

        <v-col cols="12" sm="6" md="4">
            <v-list>
                ${getItems(model, columns[3], moduleName)}
            </v-list>
        </v-col>

    </v-row>
</template>
<script>
    import {ShowField} from '@dracul/common-frontend'
    ${importDayjsMixinIfDateExist(model.properties)} 
    
    export default {
        name: '${model.name}ShowData',
        components: {ShowField},
        ${dateExist(model.properties)?'mixins: [DayjsMixin],':''}
        props: {
            item: {type: Object, required: true}
        }
    }
</script>

`

    return content
}


function distribute(properties) {

    let columnNum = 1
    let columns = {1: [], 2: [], 3: []}
    properties.forEach(prop => {
        columns[columnNum].push(prop)
        columnNum++
        if (columnNum > 3) {
            columnNum = 1
        }
    })
    return columns
}


function getItems(model, column, moduleName) {

    return column.map(field => {

        switch(field.type){
            case 'MultiLang':
                return ` <show-field :value="item.${field.name}.en" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}') + '(en)'" icon="${field.icon}"/> 
                <show-field :value="item.${field.name}.es" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}') + '(es)'" icon="${field.icon}"/> 
                <show-field :value="item.${field.name}.pt" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}') + '(pt)'" icon="${field.icon}"/>`
            case 'Boolean':
            case 'Int':
            case 'Float':
                return ` <show-field :value="String(item.${field.name})" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}')" icon="${field.icon}"/>`
            case 'Date':
                return ` <show-field :value="getDateFormat(item.${field.name})" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}')" icon="${field.icon}"/>`
            case 'Datetime':
                return ` <show-field :value="getDateTimeFormat(item.${field.name})" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}')" icon="${field.icon}"/>`
            case 'ObjectId':
                return ` <show-field :value="item.${field.name}.${field.refDisplayField}" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}')" icon="${field.icon}"/>`
            case 'ObjectIdList':
                return ` <show-field :value="item.${field.name}.map(i => i.${field.refDisplayField}).join(', ')" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}')" icon="${field.icon}"/>`
            default:
                return ` <show-field :value="item.${field.name}" :label="$t('${getI18nKey(moduleName,model.name, field.name,true)}')" icon="${field.icon}"/>`
        }


    }).join('\n                ')
}
