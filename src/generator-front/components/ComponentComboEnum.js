const capitalize = require('../../utils/capitalize')
const getI18nKey = require('../../utils/getI18nKey')
const enumOptionsArrayList = require('../../utils/enumOptionsArrayList')

module.exports = function ({field, model, moduleName}) {
    let content =
`<template>

        <v-select
                ${field.disabled ? 'disabled' : ''}
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
                :clearable="clearable"
                :multiple="multiple"
                :chips="chips"
                :solo="solo"
        ></v-select>

</template>

<script>

    import {InputErrorsByProps, RequiredRule} from '@dracul/common-frontend'
    
    

    export default {
        name: "${capitalize(field.name)}Combobox",
        mixins: [InputErrorsByProps, RequiredRule],
        props:{
            value: {type: [String, Array]},
            clearable: {type:Boolean, default: false},
            multiple: {type:Boolean, default: false},
            solo: {type:Boolean, default: false},
            chips: {type:Boolean, default: false}
        },
        data() {
            return {
                items: ${enumOptionsArrayList(field.enumOptions)},
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


