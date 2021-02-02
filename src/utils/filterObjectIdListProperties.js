module.exports = function filterObjectIdProperties(properties) {
    let propFiltered = properties.filter(field => {
        if (field.type == 'ObjectIdList') {
            return true
        }
        return false
    })
    return propFiltered;
}
