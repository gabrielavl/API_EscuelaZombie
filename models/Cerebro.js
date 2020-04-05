var mongoose=require('mongoose');
var modelSchema=mongoose.Schema({
    sabor:{
        type:String,
        enum:["Picante","Amargo","Dulce","Salado","Ácido"],
        required:[true,"Debe de ingresar un sabor para el cerebro"]
    },
    descripcion:{
        type:String,
        maxlength:[150,"Descripción muy larga"],
        required:[true,"Debe de haber una descripción del cerebro"]
    },
    iq:{
        type:Number,
        min:[0,"Numeros mayores a -1"],
        max:[1000,"El límite de IQ es de 1000"],
        required:[true,"Debe de ingresar una IQ para el cerebro"]
    }, 
    propietario:{
        type: String
    }
});

var Cerebro=mongoose.model("Cerebro",modelSchema);
module.exports=Cerebro;