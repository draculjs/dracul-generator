const kebabCase = require('../../utils/kebabCase')
const capitalize = require('../../utils/capitalize')
const getI18nKey = require('../../utils/getI18nKey')

module.exports = function ({model, moduleName}) {
    let content =
        `<template>
      <crud-delete :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @delete="remove"
                 @close="$emit('close')"
    >

        <v-card-text>
          <${kebabCase(model.name)}-show-data :item="item" />
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>

    </crud-delete>
</template>

<script>
    //Provider  
    import ${model.name}Provider from "../../../../providers/${model.name}Provider";
    
    //Show Data
    import ${model.name}ShowData from "../${model.name}Show/${model.name}ShowData";
    
    //Common
    import {CrudDelete, ClientError} from '@dracul/common-frontend'
    
    export default {
        name: "${model.name}Delete",
        
        components: {${model.name}ShowData, CrudDelete},
        
        props: {
          open: {type: Boolean, default: true},
          item: {type: Object, required: true}
        },
        
        data() {
            return {
                modal: false,
                title: '${getI18nKey(moduleName,model.name,'deleting')}',
                areYouSure: this.$t('common.areYouSureDeleteRecord'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            remove() {
                this.loading = true
                ${model.name}Provider.delete${capitalize(model.name)}(this.item.id).then(result => {
                            if (result.data.delete${capitalize(model.name)}.success) {
                                this.$emit('itemDeleted',result.data.delete${capitalize(model.name)})
                                this.$emit('close')
                            }else{
                                this.errorMessage = 'Error on Delete'
                            }
                        }
                    ).catch(error =>{
                        let clientError = new ClientError(error)
                        this.errorMessage = clientError.showMessage
                }).finally(() => this.loading = false)
            },
        },
    }
</script>


`

    return content
}
