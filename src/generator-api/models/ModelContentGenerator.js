const enumOptionsArrayList = require('../../utils/enumOptionsArrayList')

module.exports = function (model) {
    let content =
`const mongoose = require('mongoose'); 

${(model.softDelete===true)?"const softDelete = require('mongoose-softdelete')":""}

const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ${model.name}Schema = new Schema({ 

${fields(model.properties)}


}${timestamp(model.timestamp)});


${(model.softDelete===true)?model.name+"Schema.plugin(softDelete);":""}

${model.name}Schema.plugin(mongoosePaginate);
${model.name}Schema.plugin(uniqueValidator, {message: 'validation.unique'});

const ${model.name} = mongoose.model('${model.name}', ${model.name}Schema);

module.exports = ${model.name};`

    return content;
}

function fields(properties) {

    return properties.map(field => {
        if(!field.name) throw new Error("Field needs name atributte")
        if(!field.type) throw new Error("Field " + field.name + " needs type atributte")
        switch (field.type) {
            case "ObjectId":
                if(!field.ref) throw new Error("Field " + field.name + "  has ObjectId type so needs ref atributte")
                return ` ${field.name}: {type: mongoose.Schema.Types.ObjectId, ref: "${field.ref}", required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}`
            case "ObjectIdRel":
                if(!field.ref) throw new Error("Field " + field.name + "  has ObjectId type so needs ref atributte")
                return ` ${field.name}: { rel: {type: mongoose.Schema.Types.ObjectId, ref: "${field.ref}", required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}, ${field.refDisplayField}: {type: String, required: false, index: false, unique: false }  }`
            case "ObjectIdList":
                if(!field.ref) throw new Error("Field " + field.name + "  has ObjectIdList type so needs ref atributte")
                return ` ${field.name}: [{type: mongoose.Schema.Types.ObjectId, ref: "${field.ref}",required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}]`
            case "Enum":
                return ` ${field.name}: {type: String, enum: ${enumOptionsArrayList(field.enumOptions)}, required: ${field.required}, index: ${(field.unique === true)?true:false}}`
            case "EnumList":
                return ` ${field.name}: [{type: String, enum: "${enumOptionsArrayList(field.enumOptions)}, required: ${field.required}, index: ${(field.unique === true)?true:false}}]`
            case "StringList":
                return ` ${field.name}: [{type: String, required: ${field.required}}]`
            case "StringLarge":
                return ` ${field.name}: {type: String, required: ${field.required}}`
            case "Float":
                return ` ${field.name}: {type: Number, required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}`
            case "Int":
                return ` ${field.name}: {type: Number, required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}`
            case "Boolean":
                return ` ${field.name}: {type: Boolean, required: ${field.required}, index: ${(field.unique === true)?true:false}}`
            case "Date":
            case "Datetime":
                return ` ${field.name}: {type: Date, required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}`
            case "Mixed":
                return ` ${field.name}: {type: mongoose.Schema.Types.Mixed, ref: "${field.ref}", required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}`
            case "MultiLang":
                return ` ${field.name}: {
            en: {type: String, required: false, index: false},
            es: {type: String, required: false, index: false},
            pt: {type: String, required: false, index: false},
        }`
            default:
                return ` ${field.name}: {type: ${field.type}, required: ${field.required}, unique: ${(field.unique === true)?true:false}, index: ${(field.unique === true)?true:false}}`

        }
    }).join(',\n')
}

function timestamp(timestamp){
    if(timestamp){
        return `, { timestamps: true }`
    }
    return ""
}
