const getI18nKey = require('./getI18nKey')
const kebabCase = require('./kebabCase')

module.exports = function componentField(field, modelName, moduleName) {
    switch (field.type) {
        case 'String':
            return generateTextField(field, modelName, moduleName)
        case 'StringLarge':
            return generateTextLargeField(field, modelName, moduleName)
        case 'MultiLang':
            return generateMultiLangField(field, modelName, moduleName)
        case 'StringList':
            return generateTextListField(field, modelName, moduleName)
        case 'Int':
        case 'Float':
            return generateNumberField(field, modelName, moduleName)
        case 'Boolean':
            return generateBooleanField(field, modelName, moduleName)
        case 'Date':
            return generateDateField(field, modelName, moduleName)
        case 'Datetime':
            return generateDatetimeField(field, modelName, moduleName)
        case 'ObjectId':
            return generateComboField(field, modelName, moduleName)
        case 'ObjectIdList':
            return generateComboListField(field, modelName, moduleName)
        case 'Enum':
        case 'EnumList':
            return generateComboEnumField(field, modelName, moduleName)
        default:
            return generateTextField(field, modelName, moduleName)
    }
}

function generateTextField(field, modelName, moduleName) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-text-field
                                ${field.disabled ? 'disabled' : ''}
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                name="${field.name}"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :placeholder="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                ${field.required ? ':rules="required"' : ''}
                        ></v-text-field>
                    </v-col>
    `
    return content
}

function generateTextLargeField(field, modelName, moduleName) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-textarea
                                rows="2"
                                ${field.disabled ? 'disabled' : ''}
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                name="${field.name}"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :placeholder="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                ${field.required ? ':rules="required"' : ''}
                        ></v-textarea>
                    </v-col>
    `
    return content
}

function generateTextListField(field, modelName, moduleName) {
    let content = `
                    <v-col cols="12" sm="6">
                        <list-combobox
                                ${field.disabled ? 'disabled' : ''}
                                icon="${field.icon ? field.icon : 'label'}"
                                name="${field.name}"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                        ></list-combobox>
                    </v-col>
    `
    return content
}

function generateNumberField(field, modelName, moduleName) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-text-field
                                ${field.disabled ? 'disabled' : ''}
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                name="${field.name}"
                                v-model.number="form.${field.name}"
                                type="number"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :placeholder="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                ${field.required ? ':rules="required"' : ''}
                        ></v-text-field>
                    </v-col>
    `
    return content
}

function generateBooleanField(field, modelName, moduleName) {
    let content = `
                    <v-col cols="12" sm="6">
                        <v-checkbox
                                prepend-icon="${field.icon ? field.icon : 'label'}"
                                name="${field.name}"
                                v-model="form.${field.name}"
                                :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                :error="hasInputErrors('${field.name}')"
                                :error-messages="getInputErrors('${field.name}')"
                                color="secondary"
                                ${field.required ? ':rules="required"' : ''}
                        ></v-checkbox>
                    </v-col>
    `
    return content
}


function generateComboField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                        <${kebabCase(field.ref)}-combobox v-model="form.${field.name}" :input-errors="inputErrors" />
                   </v-col>    
`
    return content
}

function generateMultiLangField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                        <multi-lang-subform 
                        field="${field.name}" 
                        v-model="form.${field.name}" 
                        :input-errors="inputErrors" 
                        :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                        :placeholder="$t('${getI18nKey(moduleName, modelName, field.name, true)}')" 
                        />
                   </v-col>    
`
    return content
}

function generateComboListField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                        <${kebabCase(field.ref)}-combobox v-model="form.${field.name}" :input-errors="inputErrors" />
                   </v-col>    
`
    return content
}

function generateComboEnumField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                        <${kebabCase(field.name)}-combobox v-model="form.${field.name}" :input-errors="inputErrors" />
                   </v-col>    
`
    return content
}


function generateDateField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                        <v-menu
                                v-model="${field.name}DateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        ${field.disabled ? 'disabled' : ''}
                                        v-model="form.${field.name}"
                                        :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                        prepend-icon="${field.icon ? field.icon : 'event'}"
                                        readonly
                                        v-on="on"
                                        ${field.required ? ':rules="required"' : ''}
                                        :error="hasInputErrors('${field.name}')"
                                        :error-messages="getInputErrors('${field.name}')"
                                        color="secondary"
                                ></v-text-field>
                            </template>
                            <v-date-picker v-model="form.${field.name}" scrollable @input="modal =false">
                            </v-date-picker>
                        </v-menu>

                    </v-col>
    `
    return content
}


function generateDatetimeField(field, modelName, moduleName) {
    let content = `
                   <v-col cols="12" sm="6">
                     <v-row>
                       <v-col  sm="6">
                          <v-menu
                                v-model="${field.name}DateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        ${field.disabled ? 'disabled' : ''}
                                        :value="getDateFormat(form.${field.name})"
                                        :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                        prepend-icon="${field.icon ? field.icon : 'event'}"
                                        readonly
                                        v-on="on"
                                        ${field.required ? ':rules="required"' : ''}
                                        :error="hasInputErrors('${field.name}')"
                                        :error-messages="getInputErrors('${field.name}')"
                                        color="secondary"
                                ></v-text-field>
                            </template>
                            <v-date-picker :value="getDateFormat(form.${field.name})" @input="val => setDateToFormField('${field.name}', val)">
                            </v-date-picker>
                          </v-menu>
                       </v-col>
                   
                       <v-col sm="6">
                       <v-menu
                                v-model="${field.name}TimeMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                        :value="getTimeFormat(form.${field.name})"
                                        :label="$t('${getI18nKey(moduleName, modelName, field.name, true)}')"
                                        prepend-icon="query_builder"
                                        readonly
                                        v-on="on"
                                        ${field.required ? ':rules="required"' : ''}
                                        :error="hasInputErrors('${field.name}')"
                                        :error-messages="getInputErrors('${field.name}')"
                                        color="secondary"
                                ></v-text-field>
                            </template>
                            <v-time-picker :value="getTimeFormat(form.${field.name})" @input="val => setTimeToFormField('${field.name}', val)">
                            </v-time-picker>
                          </v-menu>
                       </v-col>
                       
                     </v-row>

                   </v-col>
    `
    return content
}
