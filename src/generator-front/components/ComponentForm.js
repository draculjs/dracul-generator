const filterBackendProperties = require('../../utils/filterBackendProperties')
const filterDateProperties = require('../../utils/filterDateProperties')
const componentField = require('../../utils/componentField')
const {generateImportCombos, generateImportCombosEnum, generateImportComponentCombos} = require('../../utils/componentFieldCombos')
const importDayjsMixinIfDateExist = require('../../utils/importDayjsMixinIfDateExist')
const dateExist = require('../../utils/dateExist')

module.exports = function ({model, moduleName}) {
    let content =
        `<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="save" >
        <v-row>
           ${generateFields(model.properties, model.name, moduleName)}
        </v-row>
    </v-form>
</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    ${generateImportCombos(model.properties)}
    ${generateImportCombosEnum(model.properties)}
    ${importDayjsMixinIfDateExist(model.properties)}

    export default {
        name: "${model.name}Form",
        mixins: [InputErrorsByProps, RequiredRule ${dateExist(model.properties)?', DayjsMixin':''}  ],
        ${generateImportComponentCombos(model.properties)}
        props:{
            value: {
                type: Object,
                required: true
            },
        },
        computed: {
           form: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
         watch: {
            form: {
                handler(newVal) {
                    this.$emit('input', newVal)
                },
                deep: true
            }
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            }
        },
        data(){
            return {
                ${generateDataMenus(model.properties)}
            }
        }
    }
</script>

<style scoped>

</style>

`

    return content
}


function generateFields(properties, modelName, moduleName) {
    let propFiltered = filterBackendProperties(properties);

    return propFiltered.map(field => {
        return componentField(field, modelName, moduleName)
    }).join('\n ')

}

function generateDataMenus(properties) {
    let propFiltered = filterDateProperties(properties);

    return propFiltered.map(field => {
        if(field.type == 'Date'){
            return field.name + "DateMenu: false"

        }else if(field.type == 'Datetime'){
            return field.name + "DateMenu: false, " + field.name + "TimeMenu: false"
        }
    }).join(',\n ')

}
