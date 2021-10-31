const descapitalize = require('../../../utils/descapitalize')

module.exports = function ({model, moduleName}) {
    let content = `
const messages = {
    en: {
       ${descapitalize(moduleName)}: {
          ${getModelMessages(model, 'en')}
       }
    },
    es: {
       ${descapitalize(moduleName)}: {
          ${getModelMessages(model, 'es')}
       }
    },
    pt: {
       ${descapitalize(moduleName)}: {
          ${getModelMessages(model, 'pt')}
       }
    }
}

export default messages
    `
    return content
}


function getModelMessages(model, lang) {

    return `${descapitalize(model.name)}: { 
          ${getTitlesMessages(model, lang)},
            labels: {
              ${getPropertiesMessages(model.properties, lang)}
            },
          ${geti18nMessages(model, lang)}
          }`

}

function geti18nMessages(model, lang) {
    if (model.i18n) {
        return aditionals.map(aditional => {
            return `  ${getPropertyMessage(aditional, lang)}`
        }).join(",\n          ")
    }
    return ''
}


function getPropertiesMessages(properties, lang) {
    return properties.map(property => {
        return `  ${getPropertyMessage(property, lang)}`
    }).join(",\n              ")
}

function getPropertyMessage(property, lang) {
    return `${property.name}: '${property.i18n[lang]}'`
}

function getTitlesMessages(model, lang) {

    const titles = {
        en: {
            name: model.name,
            title: model.name + ' management',
            subtitle: 'View, search, create, edit and delete ' + model.name,
            creating: 'Creating ' + model.name,
            editing: 'Editing ' + model.name,
            deleting: 'Deleting ' + model.name,
            showing: 'Showing ' + model.name,
            menu: model.name
        },
        es: {
            name: model.name,
            title: 'Administración de ' + model.name,
            subtitle: 'Ver, buscar, crear, editar, y borrar ' + model.name,
            creating: 'Creando ' + model.name,
            editing: 'Modificando ' + model.name,
            deleting: 'Eliminando ' + model.name,
            showing: 'Detalles de ' + model.name,
            menu: model.name
        },
        pt: {
            name: model.name,
            title: 'Administração de ' + model.name,
            subtitle: 'Ver, buscar, criar, editar e usar ' + model.name,
            creating: 'Criando ' + model.name,
            editing: 'Edição ' + model.name,
            deleting: 'Apagando ' + model.name,
            showing: 'Detalhes do ' + model.name,
            menu: model.name
        },
    }

    return `  name: '${titles[lang].name}',
            title: '${titles[lang].title}',
            subtitle: '${titles[lang].subtitle}',
            creating: '${titles[lang].creating}',
            editing: '${titles[lang].editing}',
            deleting: '${titles[lang].deleting}',
            showing: '${titles[lang].showing}',
            menu: '${titles[lang].menu}'`
}

