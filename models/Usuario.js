var mongoose=require('mongoose');
var modelSchema=mongoose.Schema({
    email:{
        type:String,
        required:[true,"Falta correo electrónico (campo obligatorio"],
        unique:[true, "Ya existe éste email"]
    },
    password:{
        type:String,
        required:[true,"Falta la contraseña (campo obligatorio)"]
    },
    tipo:{
        type: String
    }
});

var Usuario=mongoose.model("Usuario",modelSchema);
module.exports= Usuario;