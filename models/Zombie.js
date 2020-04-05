var mongoose=require('mongoose');
var modelSchema=mongoose.Schema({
    nombre:{
        type:String,
        minlength:[6,"El nombre de ser de almenos 6 caracteres"],
        maxlength:[12,"Nombre demasiado largo"]
    },
    email:{
        type:String,
        required:[true,"Falta correo electrónico (campo obligatorio"],
        unique:[true, "Ya existe un zombie con ese correo electrónico"]
    },
    tipo:{
        type:String,
        enum:["Zombie alumno","Zombie maestro"]
    }, 
    propietario:{
        type: String
    }
});

var Zombie=mongoose.model("Zombie",modelSchema);
module.exports=Zombie;