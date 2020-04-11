var mongoose=require('mongoose');
var modelSchema=mongoose.Schema({
    emailUsuario:{
        type: String,
        required: [true,"Error al guardar email"]
    },
    cerebroSeleccionado:{
        type:String,
        required:[true,"Cerebro no seleccionado. Debe seleccionar uno para su compra"]
    },
    cantidad:{
        type: Number,
        min:[1,"Cantidad mínima: 1"],
        max:[100, "Cantidad máxima: 100"],
        required:[true,"Debe especificar la cantidad deseada"]
    },
    metodoEnvio:{
        type: String,
        enum:["Bronce","Silver", "Gold"],
        required:[true,"Debe seleccionar un método de envío"]
    },
    fechaPedido:{
        type:String
    },
    fechaEntrega:{
        type:String
    }

});

var CompraCerebro=mongoose.model("CompraCerebro",modelSchema);
module.exports=CompraCerebro;