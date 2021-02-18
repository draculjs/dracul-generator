module.exports = function dateExist(properties) {

    for(let field in properties){
        if (properties[field].type == 'Date' || properties[field].type == 'Datetime') {
            return true
        }
    }
    return false
}
