module.exports = function StringListExist(properties) {

    for(let i=0; i< properties.length;i++){
        if (properties[i].type == 'StringList') {
            return true
        }
    }
    return false
}
