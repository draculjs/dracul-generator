
module.exports = function (source) {
    let content = `
import merge from 'deepmerge'        
${getImportMessages(source.models)}

${getImportPermissionMessages(source.models)}


const messages = merge.all([
    ${getModelMessages(source.models)}
])

export default messages;
`
    return content
}

function getImportMessages(models) {
    return models.map(model => {
        return `import ${model.name + 'Messages'} from './messages/${model.name + 'Messages'}'`
    }).join("\n")
}

function getImportPermissionMessages(models) {
    return models.map(model => {
        return `import ${model.name + 'PermissionMessages'} from './permissions/${model.name + 'PermissionMessages'}'`
    }).join("\n")
}

function getModelMessages(models) {
    return models.map(model => {
        return `${model.name}Messages, ${model.name}PermissionMessages`
    }).join(",\n")
}
