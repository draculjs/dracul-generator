module.exports = function filterDateProperties(properties) {
    let propFiltered = properties.filter(field => {

        if (field.name == 'createdBy' || field.name == 'updatedBy') {
            return false
        }

        if (field.type == 'Date' || field.type == 'Datetime') {
            return true
        }
        return false
    })
    return propFiltered;
}
