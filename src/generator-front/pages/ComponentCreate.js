const kebabCase = require('../../utils/kebabCase')
const capitalize = require('../../utils/capitalize')
const filterBackendProperties = require('../../utils/filterBackendProperties')
const importDayjsIfDateExist = require('../../utils/importDayjsIfDateExist')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({model,moduleName}) {
    let content =
        `<template>
    <crud-create :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @create="create"
                 @close="$emit('close')"
    >
        <${kebabCase(model.name)}-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-create>
</template>

<script>

    import ${model.name}Provider from "../../../../providers/${model.name}Provider";
    
    import {CrudCreate, ClientError} from '@dracul/common-frontend'
    
    import ${model.name}Form from "../${model.name}Form";
    
    


    export default {
        name: "${model.name}Create",
         
        components: { ${model.name}Form, CrudCreate },
        
        props:{
          open: {type: Boolean, default: true}
        },
        
        data() {
            return {
                title: '${getI18nKey(moduleName,model.name,'creating')}',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    ${generateFormObjectFields(model.properties)}
                }
            }
        },
        
        methods: {
            create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    ${model.name}Provider.create${capitalize(model.name)}(this.form).then(r => {
                            if (r) {
                                this.$emit('itemCreated',r.data.create${capitalize(model.name)})
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                         let clientError = new ClientError(error)
                         this.inputErrors = clientError.inputErrors
                         this.errorMessage = clientError.i18nMessage
                    }).finally(() => this.loading = false)
                }

            }

        },
    }
</script>

<style scoped>

</style>

`

return content
}




function generateFormObjectFields(properties) {

    let propFiltered = filterBackendProperties(properties);

    return propFiltered.map(field => {
        switch (field.type) {
            case 'MultiLang':
                return `${field.name}: {en:null, es:null, pt:null}`
            case 'Date':
                return `${field.name}: null`
            case 'Datetime':
                return `${field.name}: null`
            case 'String':
                return `${field.name}: ${field.default?"'"+field.default+"'":"''"}`
            case 'Int':
                return `${field.name}: ${field.default?parseInt(field.default):null}`
            case 'Float':
                return `${field.name}: ${field.default?parseFloat(field.default):null}`
            case 'Boolean':
                return `${field.name}: ${(field.default === 'true')?'true':'false'}`
            case 'ObjectId':
                return `${field.name}: null`
            case 'ObjectIdList':
                return `${field.name}: []`
            case 'Enum':
                return `${field.name}: ${field.default?"'"+field.default+"'":"''"}`
            case 'EnumList':
                return `${field.name}: []`
            default:
                return `${field.name}: ${field.default?"'"+field.default+"'":"''"}`

        }
    }).join(',\n                    ')
}

