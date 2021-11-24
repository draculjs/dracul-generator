const kebabCase = require('../../utils/kebabCase')
const capitalize = require('../../utils/capitalize')
const filterBackendProperties = require('../../utils/filterBackendProperties')
const importDayjsIfDateExist = require('../../utils/importDayjsIfDateExist')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({model,moduleName}) {
    let content =
        `<template>
        <crud-update :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >
         <${kebabCase(model.name)}-form ref="form" v-model="form" :input-errors="inputErrors" />
    </crud-update>
</template>

<script>

    import ${model.name}Provider from "../../../../providers/${model.name}Provider";
    
    import {CrudUpdate, ClientError} from '@dracul/common-frontend'
    
    import ${model.name}Form from "../${model.name}Form";
  
    ${importDayjsIfDateExist(model.properties)}

    export default {
        name: "${model.name}Update",
        
        components: { ${model.name}Form, CrudUpdate },
        
        props:{
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },

        data() {
            return {
                title: '${getI18nKey(moduleName,model.name,'editing')}',
                errorMessage: '',
                inputErrors: {},
                loading: false,
                id: this.item.id,
                form: {
                    ${generateFormObjectFields(model.properties)}
                }
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    ${model.name}Provider.update${capitalize(model.name)}(this.id, this.form).then(r => {
                            if (r) {
                                this.$emit('itemUpdated',r.data.update${capitalize(model.name)})
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
        switch(field.type){
            case 'MultiLang':
                return `${field.name}: {
          en: this.item.title.en,
          es: this.item.title.es,
          pt: this.item.title.pt
        }`
            case 'Date':
                return `${field.name}: this.item.${field.name}?Dayjs(parseInt(this.item.${field.name})):null`
            case 'Datetime':
                return `${field.name}: this.item.${field.name}?Dayjs(parseInt(this.item.${field.name})):null`
            case 'ObjectId':
                return `${field.name}: this.item.${field.name} ? this.item.${field.name}.id : null`
            case 'ObjectIdList':
                return `${field.name}: this.item.${field.name} ? this.item.${field.name}.map(i=> i.id?i.id:i) : null`
            default:
                return `${field.name}: this.item.${field.name}`
        }
    }).join(',\n                    ')
}
