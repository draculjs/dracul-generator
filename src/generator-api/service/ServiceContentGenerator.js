const capitalize = require('../../utils/capitalize')
const filterBackendProperties = require('../../utils/filterBackendProperties')

module.exports = function (model) {

    let content =
`import ${model.name} from './../models/${model.name}Model'
import {UserInputError} from 'apollo-server-express'

export const find${capitalize(model.name)} = async function (id) {
    return new Promise((resolve, reject) => {
        ${model.name}.findOne({_id: id}).${populate(model.properties)}exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetch${capitalize(model.name)} = async function () {
    return new Promise((resolve, reject) => {
        ${model.name}.find({})${model.softDelete?".isDeleted(false)":""}.${populate(model.properties)}exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginate${capitalize(model.name)} = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    function qs(search, filters) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    ${searchParams(model.properties)}
                ]
            }
        }
        
        if(filters){
        
            filters.forEach(filter => {
                switch(filter.operator){
                    case '=':
                    case 'eq':
                        qs[filter.field] = {...qs[filter.field], $eq: filter.value}
                        break;
                    case 'contain':
                    case 'regex':
                        qs[filter.field] = {...qs[filter.field], $regex: filter.value}
                        break;
                    case '>':
                    case 'gt':
                        qs[filter.field] = {...qs[filter.field], $gt: filter.value}
                        break;    
                    case '<':
                    case 'lt':
                        qs[filter.field] = {...qs[filter.field], $lt: filter.value}
                        break;    
                    case '>=':
                    case 'gte':
                        qs[filter.field] = {...qs[filter.field], $gte: filter.value}
                        break;    
                    case '<=':
                    case 'lte':
                        qs[filter.field] = {...qs[filter.field], $lte: filter.value}
                        break;          
                    default:
                        qs[filter.field] = {...qs[filter.field], $eq: filter.value}
                }
            })
        
        }
        
        return qs
    }
    
     function getSort(orderBy, orderDesc) {
        if (orderBy) {
            return (orderDesc ? '-' : '') + orderBy
        } else {
            return null
        }
    }

    ${model.softDelete?"let query = {deleted: false, ...qs(search, filters)}":"let query = qs(search, filters)"}
    let populate = ${populateArray(model.properties)}
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        ${model.name}.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}



${findBy(model)}

export const create${capitalize(model.name)} = async function (authUser, {${paramsFields(model.properties)}}) {
    
    const doc = new ${model.name}({
        ${docFields(model.properties)}
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {
        
            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }    
        
            ${resolvePopulate(model.properties)}
        }))
    })
}

export const update${capitalize(model.name)} = async function (authUser, id, {${paramsFields(model.properties)}}) {
    return new Promise((resolve, rejects) => {
        ${model.name}.findOneAndUpdate({_id: id},
        {${docFields(model.properties, true)}}, 
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {
            
            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                
                }
                return rejects(error)
                
            } 
        
            ${resolvePopulate(model.properties)}
        })
    })
}

export const delete${capitalize(model.name)} = function (id) {
    return new Promise((resolve, rejects) => {
        find${model.name}(id).then((doc) => {
            doc.${model.softDelete?"softdelete":"delete"}(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

`
    return content;
}


// ---------------- FINDS BY ----------------------

function findBy(model){
    let properties = model.properties.filter(field => field.findby == true)

    return properties.map(field => {
        return findByMethod(model,field)
    }).join('\n')
}

function findByMethod(model, field){
    let content =
`
export const find${capitalize(model.name)}By${capitalize(field.name)} = async function (${field.name}) {
    return new Promise((resolve, reject) => {
        ${model.name}.find({${field.name}: ${field.name}}).${populate(model.properties)}exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}
`
    return content
}
// ---------------- END FINDS BY ----------------------

// ---------------- SEARCH ----------------------
function searchParams(properties){
    properties = properties.filter(field => field.search)
    return properties.map(field => {
        return `{${field.name}: {$regex: search, $options: 'i'}}`
    }).join(',\n')
}

// ---------------- POPULATE ----------------------
function resolvePopulate(properties){
    properties = getObjectIdProperties(properties)

    if(properties.length > 0){
        return 'doc.'+properties.map(field => {
            return `populate('${field.name}')`
        }).join('.') + '.execPopulate(() => resolve(doc))'
    }
    return 'resolve(doc)'
}


function populateArray(properties){
    properties = getObjectIdProperties(properties)

    if(properties.length > 0){
        return '[' + properties.map(field => {
            return `'${field.name}'`
        }).join(',') + ']'
    }
    return null
}

function populate(properties){
    properties = getObjectIdProperties(properties)

    if(properties.length > 0){
        return properties.map(field => {
            return `populate('${field.name}')`
        }).join('.') + '.'
    }
    return ''
}

function getObjectIdProperties(properties) {
    let propFiltered = properties.filter(field => {
        if (field.type == 'ObjectId' || field.type == 'ObjectIdList') {
            return true
        }
        return false
    })
    return propFiltered;
}

// ---------------- END POPULATE ----------------------


function paramsFields(properties){
    properties =  filterBackendProperties(properties)
    return properties.map(field => field.name).join(', ')
}


function docFields(properties, update = false){
    return properties.map(field => {
        switch(field.name) {
            case 'createdBy':
                return `createdBy: authUser.id`
            case 'updatedBy':
                return `updatedBy: authUser.id`
            default:
                return field.name
        }
    }).join(', ')
}

