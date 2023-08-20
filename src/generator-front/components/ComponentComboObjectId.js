const capitalize = require('../../utils/capitalize')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({field, model, moduleName}) {
    let content =
        `<template>
        <v-autocomplete
                prepend-icon="${field.icon ? field.icon : 'label'}"
                :items="items"
                :item-text="itemText"
                :item-value="itemValue"
                v-model="item"
                :label="$t('${getI18nKey(moduleName, model.name, field.name, true)}')"
                :loading="loading"
                :error="hasInputErrors('${field.name}')"
                :error-messages="getInputErrors('${field.name}')"
                color="secondary"
                item-color="secondary"
                :rules="isRequired ? required : []"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
                :disabled="disabled"
                :readonly="readonly"
                :clearable="clearable"
                :hide-details="hideDetails"
                :style="{width: width, maxWidth: width}"
                :return-object="returnObject"
        ></v-autocomplete>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    
    ${provider(field)}

    export default {
        name: "${capitalize(field.ref)}Combobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: [String, Array, Object]},
            multiple: {type:Boolean, default: ${field.type == 'ObjectIdList' ? 'true' : 'false'} },
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false},
            readonly: {type:Boolean, default:false},
            disabled: {type:Boolean, default: ${field.disabled ? 'true' : 'false'}},
            isRequired: {type:Boolean, default: ${field.required ? 'true' : 'false'} },
            clearable: {type:Boolean, default: false},
            hideDetails: {type: Boolean, default: false},
            returnObject: {type: Boolean, default: false},
            itemValue: {type: String, default: 'id'},
            itemText: {type: String, default: '${field.refDisplayField ? field.refDisplayField : 'name'}'},
            width: {type: String, default: null},
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

</style>`

    return content
}

function provider(field) {
    if (field.ref == 'User') {
        return `import {userProvider} from "@dracul/user-frontend"`
    } else if (field.ref == 'Role') {
        return `import {roleProvider} from "@dracul/user-frontend"`
    } else {
        return `import ${capitalize(field.ref)}Provider from "../../providers/${capitalize(field.ref)}Provider"`
    }
}


function fetchFunction(field) {
    if (field.ref == 'User') {
        return `this.loading= true
              userProvider.users().then(r => {
                    this.items = r.data.users
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)`
    } else if (field.ref == 'Role') {
        return `this.loading= true
              roleProvider.roles().then(r => {
                    this.items = r.data.roles
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)`
    } else {
        return `this.loading= true
                ${capitalize(field.ref)}Provider.fetch${capitalize(field.ref)}().then(r => {
                    this.items = r.data.fetch${capitalize(field.ref)}
                }).catch(err => console.error(err))
                .finally(()=> this.loading = false)`
    }
}
