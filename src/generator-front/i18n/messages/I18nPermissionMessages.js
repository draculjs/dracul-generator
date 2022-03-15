
module.exports = function ({model}) {
    let content = `
const messages = {
    en: {
       role: {
            permissions: {
                ${model.name.toUpperCase()}_MENU: "Access to ${model.name}",
                ${model.name.toUpperCase()}_SHOW: "View ${model.name}",
                ${model.name.toUpperCase()}_CREATE: "Create ${model.name}",
                ${model.name.toUpperCase()}_UPDATE: "Modify ${model.name}",
                ${model.name.toUpperCase()}_DELETE: "Delete ${model.name}",
            }
       }
    },
    es: {
        role: {
            permissions: {
                ${model.name.toUpperCase()}_MENU: "Acceder ${model.name}",
                ${model.name.toUpperCase()}_SHOW: "Ver ${model.name}",
                ${model.name.toUpperCase()}_CREATE: "Crear ${model.name}",
                ${model.name.toUpperCase()}_UPDATE: "Modificar ${model.name}",
                ${model.name.toUpperCase()}_DELETE: "Eliminar ${model.name}",
            }
       }
    },
    pt: {
       role: {
            permissions: {
                ${model.name.toUpperCase()}_MENU: "Acessar ${model.name}",
                ${model.name.toUpperCase()}_SHOW: "Ver ${model.name}",
                ${model.name.toUpperCase()}_CREATE: "Criar ${model.name}",
                ${model.name.toUpperCase()}_UPDATE: "Modificar ${model.name}",
                ${model.name.toUpperCase()}_DELETE: "Eliminar ${model.name}",
            }
       }
    }
}

export default messages
    `
    return content
}


