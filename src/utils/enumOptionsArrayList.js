module.exports  = function(str,separator = "|"){
    return "[" + str.split(separator).map(opt => "'"+opt+"'").join(",") + "]"
}
