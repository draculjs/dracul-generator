const fs = require('fs');
const createDir = require("../utils/createDir");
const writeFile = require("../utils/writeFile");
const writeIndex = require("../utils/writeIndex");
const capitalize = require("../utils/capitalize");
const descapitalize = require("../utils/descapitalize");
const pluralize = require("../utils/pluralize");

const OUTPUT_PATH = './output/front/'

//Generators
const I18nMessages = require("./i18n/messages/I18nMessages");
const I18nPermissionMessages = require("./i18n/messages/I18nPermissionMessages");
const I18nIndex = require("./i18n/I18nIndex");
const ManagementRoutes = require("./routes/ManagementRoutes");
const IndexRoute = require("./routes/IndexRoute");
const Provider = require("./providers/Provider");
const PageCrud = require("./pages/PageCrud");
const ComponentList = require("./pages/ComponentList");
const ComponentForm = require("./pages/ComponentForm");
const ComponentCreate = require("./pages/ComponentCreate");
const ComponentUpdate = require("./pages/ComponentUpdate");
const ComponentDelete = require("./pages/ComponentDelete");
const ComponentShowData = require("./pages/ComponentShowData");
const ComponentShow = require("./pages/ComponentShow");

const ComponentComboObjectId = require("./components/ComponentComboObjectId");
const ComponentComboEnum = require("./components/ComponentComboEnum");
const IndexCombobox = require("./components/IndexCombobox");

//GQL
const GqlFetchAll = require("./providers/gql/GqlFetchAll")
const GqlFetchByID = require("./providers/gql/GqlFetchByID")
const GqlPaginate = require("./providers/gql/GqlPaginate")
const GqlCreate = require("./providers/gql/GqlCreate")
const GqlUpdate = require("./providers/gql/GqlUpdate")
const GqlDelete = require("./providers/gql/GqlDelete")
const GqlFetchBySomething = require("./providers/gql/GqlFetchBySomething")

class FrontGeneratorManager {

    constructor(source) {
        this.source = source
    }

    getModuleLc() {
        if (this.source && this.source.module) {
            return this.source.module.toLowerCase()
        }
        throw new Error("source.module is required")
    }

    BASE_PATH() {
        return OUTPUT_PATH + this.getModuleLc()
    }


    I18N_PATH() {
        return this.BASE_PATH() + '/i18n/'
    }

    I18N_MESSAGES_PATH() {
        return this.BASE_PATH() + '/i18n/messages/'
    }

    I18N_PERMISSION_MESSAGES_PATH() {
        return this.BASE_PATH() + '/i18n/permissions/'
    }

    ROUTES_PATH() {
        return this.BASE_PATH() + '/routes'
    }

    PAGES_PATH() {
        return this.BASE_PATH() + '/pages/'
    }

    COMPONENTS_PATH() {
        return this.BASE_PATH() + '/components/'
    }

    COMBOBOX_PATH() {
        return this.BASE_PATH() + '/combobox/'
    }

    PAGES_CRUD_PATH() {
        return this.BASE_PATH() + '/pages/crud/'
    }

    FORM_PATH() {
        return this.BASE_PATH() + '/forms/'
    }

    PROVIDERS_PATH() {
        return this.BASE_PATH() + '/providers/'
    }

    GQL_PATH() {
        return this.PROVIDERS_PATH() + '/gql/'
    }

    createDirs() {
        createDir(OUTPUT_PATH)
        createDir(this.BASE_PATH())
        createDir(this.I18N_PATH())
        createDir(this.I18N_MESSAGES_PATH())
        createDir(this.I18N_PERMISSION_MESSAGES_PATH())
        createDir(this.ROUTES_PATH())
        createDir(this.PAGES_PATH())
        createDir(this.FORM_PATH())
        createDir(this.COMPONENTS_PATH())
        createDir(this.PAGES_CRUD_PATH())
        createDir(this.PROVIDERS_PATH())
        createDir(this.GQL_PATH())
    }

    generateI18n() {


        this.source.models.forEach(model => {
            let path = this.I18N_MESSAGES_PATH() + model.name + 'Messages.js'
            writeFile(path, I18nMessages, {model: model, moduleName: this.source.module}, 'i18nMessages')
        })

        this.source.models.forEach(model => {
            let path = this.I18N_PERMISSION_MESSAGES_PATH() + model.name + 'PermissionMessages.js'
            writeFile(path, I18nPermissionMessages, {model: model}, 'i18nPermissionMessages')
        })

        let path = this.I18N_PATH() + 'index.js'
        writeFile(path, I18nIndex, this.source, 'i18nIndex')


    }


    generateManagementRoutes() {
        let path = this.ROUTES_PATH() + '/'+ this.source.module + 'CrudRoutes.js'
        writeFile(path, ManagementRoutes, this.source.models, 'Routes')
    }

    generateIndexRoute() {
        let path = this.ROUTES_PATH() + '/index.js'
        writeFile(path, IndexRoute, this.source.module, 'Routes')
    }


    generateProviders() {
        this.source.models.forEach(model => {
            let path = this.PROVIDERS_PATH() + model.name + 'Provider.js'
            writeFile(path, Provider, model, 'Provider')
        })
    }


    generateGqlDir() {
        this.source.models.forEach(model => {
            createDir(this.GQL_PATH() + model.name)
        })

    }

    generateGqlAll() {
        this.source.models.forEach(model => {
            let name = 'fetch' + capitalize(model.name)
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + model.name + '/' + fileName
            writeFile(filePath, GqlFetchAll, model, fileName)
        })
    }

    generateGqlById() {
        this.source.models.forEach(model => {
            let name = 'find' + capitalize(model.name)
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + model.name + '/' + fileName
            writeFile(filePath, GqlFetchByID, model, fileName)
        })
    }

    generateGqlPaginate() {
        this.source.models.forEach(model => {
            let name = 'paginate' + capitalize(model.name)
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + model.name + '/' + fileName
            writeFile(filePath, GqlPaginate, model, fileName)
        })
    }

    generateGqlCreate() {
        this.source.models.forEach(model => {
            let name = 'create' + capitalize(model.name)
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + model.name + '/' + fileName
            writeFile(filePath, GqlCreate, model, fileName)
        })
    }

    generateGqlUpdate() {
        this.source.models.forEach(model => {
            let name = 'update' + capitalize(model.name)
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + model.name + '/' + fileName
            writeFile(filePath, GqlUpdate, model, fileName)
        })
    }

    generateGqlDelete() {
        this.source.models.forEach(model => {
            let name = 'delete' + capitalize(model.name)
            let fileName = name + '.graphql'
            let filePath = this.GQL_PATH() + model.name + '/' + fileName
            writeFile(filePath, GqlDelete, model, fileName)
        })
    }

    generateGqlFetchBySomething() {
        this.source.models.forEach(model => {
            model.properties.forEach(field => {
                if (field.findby) {
                    let name = descapitalize(model.name) + 'By' + capitalize(field.name) + '.graphql'
                    let fileName = name + '.graphql'
                    let filePath = this.GQL_PATH() + model.name + '/' + fileName
                    writeFile(filePath, GqlFetchBySomething, {model, field}, fileName)
                }
            })
        })
    }

    PAGE_CRUD_FINALPATH(model) {
        if (model && model.name) {
            return this.PAGES_CRUD_PATH() + model.name + 'CrudPage/'
        }
        throw new Error("model.name is required")
    }

    FORM_FINALPATH(model) {
        if (model && model.name) {
            return this.FORM_PATH() + model.name + 'CrudPage/'
        }
        throw new Error("model.name is required")
    }


    generatePages() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model)
            createDir(dirPath)
            let name = model.name + "CrudPage"
            let path = this.PAGE_CRUD_FINALPATH(model) + name + '.vue'
            writeFile(path, PageCrud, {model: model, moduleName: this.source.module}, 'Page')
            writeIndex(dirPath, name)
        })
    }

    generateForm() {
        this.source.models.forEach(model => {
            let dirPath = this.FORM_PATH() + model.name + 'Form/'
            createDir(dirPath)
            let name = model.name + 'Form'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentForm, {model: model, moduleName: this.source.module}, 'Form')
            writeIndex(dirPath, name)
        })
    }

    generateFormCombos() {
        this.source.models.forEach(model => {
            model.properties.forEach(field => {
                if (field.type == 'ObjectId' || field.type == 'ObjectIdList') {
                    let dirPath = this.COMBOBOX_PATH() + capitalize(field.ref) + 'Combobox/'
                    createDir(dirPath)
                    let name = capitalize(field.ref) + 'Combobox'
                    let fileName = name + '.vue'
                    let filePath = dirPath + fileName
                    writeFile(filePath, ComponentComboObjectId, {
                        field: field,
                        model: model,
                        moduleName: this.source.module
                    }, fileName)

                    //INDEX
                    let indexFileName =  'index.js'
                    let indexFilePath =  dirPath + indexFileName
                    writeFile(indexFilePath, IndexCombobox, {
                        name: field.ref
                    }, indexFileName)
                }

                if (field.type == 'Enum' || field.type == 'EnumList') {
                    let dirPath = this.COMBOBOX_PATH() + capitalize(field.name) + 'Combobox/'
                    createDir(dirPath)
                    let name = capitalize(field.name) + 'Combobox'
                    let fileName = name + '.vue'
                    let filePath = dirPath + fileName
                    writeFile(filePath, ComponentComboEnum, {
                        field: field,
                        model: model,
                        moduleName: this.source.module
                    }, fileName)

                    //INDEX
                    let indexFileName =  'index.js'
                    let indexFilePath =  dirPath + indexFileName
                    writeFile(indexFilePath, IndexCombobox, {
                        name: field.name
                    }, indexFileName)
                }




            })
        })
    }

    generateCreate() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model) + model.name + 'Create/'
            createDir(dirPath)
            let name = model.name + 'Create'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentCreate, {model: model, moduleName: this.source.module}, 'Create')
            writeIndex(dirPath, name)
        })
    }

    generateUpdate() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model) + model.name + 'Update/'
            createDir(dirPath)
            let name = model.name + 'Update'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentUpdate, {model: model, moduleName: this.source.module}, 'Update')
            writeIndex(dirPath, name)
        })
    }

    generateDelete() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model) + model.name + 'Delete/'
            createDir(dirPath)
            let name = model.name + 'Delete'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentDelete, {model: model, moduleName: this.source.module}, 'Delete')
            writeIndex(dirPath, name)
        })
    }

    generateShowData() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model) + model.name + 'Show/'
            createDir(dirPath)
            let name = model.name + 'ShowData'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentShowData, {model: model, moduleName: this.source.module}, 'ShowData')
        })
    }

    generateShow() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model) + model.name + 'Show/'
            createDir(dirPath)
            let name = model.name + 'Show'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentShow, {model: model, moduleName: this.source.module}, 'Show')
            writeIndex(dirPath, name)
        })
    }

    generateList() {
        this.source.models.forEach(model => {
            let dirPath = this.PAGE_CRUD_FINALPATH(model) + model.name + 'List/'
            createDir(dirPath)
            let name = model.name + 'List'
            let fileName = name + '.vue'
            let filePath = dirPath + fileName
            writeFile(filePath, ComponentList, {model: model, moduleName: this.source.module}, 'List')
            writeIndex(dirPath, name)
        })
    }



}

module.exports = FrontGeneratorManager;
