const filterBackendProperties = require('../../utils/filterBackendProperties')
const componentField = require('../../utils/componentField')
const {generateImportCombos, generateImportCombosEnum, generateImportComponentCombos} = require('../../utils/componentFieldCombos')

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
    

    export default {
        name: "${model.name}Form",
        mixins: [InputErrorsByProps, RequiredRule],
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
