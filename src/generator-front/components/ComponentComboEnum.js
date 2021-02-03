const capitalize = require('../../utils/capitalize')
const descapitalize = require('../../utils/descapitalize')
const pluralize = require('../../utils/pluralize')
const getI18nKey = require('../../utils/getI18nKey')
const enumStringToArray = require('../../utils/enumStringToArray')

module.exports = function ({field, model, moduleName}) {
    let content =
`<template>

        <v-select
                ${field.type == 'EnumList' ? 'multiple' : ''}
                prepend-icon="${field.icon ? field.icon : 'label'}"
                :items="items"
                v-model="item"
                :label="$t('${getI18nKey(moduleName,model.name,field.name,true)}')"
                :loading="loading"
                :error="hasInputErrors('${field.name}')"
                :error-messages="getInputErrors('${field.name}')"
                color="secondary"
                item-color="secondary"
                ${field.required?':rules="required"':''}
        ></v-select>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    
    ${provider(field)}

    export default {
        name: "${capitalize(field.ref)}Combobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {
               type: [String, Array]
            },
        },
        data() {
            return {
                items: [${enumOptionsArrayList(field)}],
                loading: false
            }
        },
        computed: {
           item: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
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

function enumOptionsArrayList(field){
    enumStringToArray(field.enumOptions).map(opt => "'"+opt+"'").join(",")
}

function provider(field){
    if(field.ref == 'User'){
        return `import {userProvider} from "@dracul/user-frontend"`
    }else{
        return `import ${capitalize(field.ref)}Provider from "../../../providers/${capitalize(field.ref)}Provider"`
    }
}


function fetchFunction(field){
    if(field.ref == 'User'){
        return `this.loading= true
              userProvider.users().then(r => {
                    this.items = r.data.users
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)`
    }else{
        return `this.loading= true
                ${capitalize(field.ref)}Provider.fetch${capitalize(pluralize(field.ref))}().then(r => {
                    this.items = r.data.${descapitalize(field.ref)}Fetch
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)`
    }
}
