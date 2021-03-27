const capitalize = require('../../utils/capitalize')
const descapitalize = require('../../utils/descapitalize')
const pluralize = require('../../utils/pluralize')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({field, model, moduleName}) {
    let content =
`<template>

        <v-select
                ${field.disabled ? 'disabled' : ''}
                ${field.type == 'ObjectIdList' ? 'multiple' : ''}
                prepend-icon="${field.icon ? field.icon : 'label'}"
                :items="items"
                :item-text="'${field.refDisplayField ? field.refDisplayField : 'name'}'"
                :item-value="'id'"
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
                items: [],
                loading: false
            }
        },
        computed: {
           item: {
                get() { return this.value },
                set(val) {this.$emit('input', val)}
            }
        },
        mounted() {
         this.fetch()
        },
        methods: {
            validate(){
              return this.$refs.form.validate()
            },
            fetch(){
               ${fetchFunction(field)}
            }
            
        }
    }
</script>

<style scoped>

</style>

`

return content
}

function provider(field){
    if(field.ref == 'User'){
        return `import {userProvider} from "@dracul/user-frontend"`
    } else if(field.ref == 'Role'){
        return `import {roleProvider} from "@dracul/user-frontend"`
    }
    else{
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
    }else if(field.ref == 'Role'){
        return `this.loading= true
              roleProvider.roles().then(r => {
                    this.items = r.data.roles
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
