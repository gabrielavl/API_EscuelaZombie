let express=require('express');
let router = express.Router();

let Zombie=require("../models/Zombie"); 
let Cerebro=require("../models/Cerebro"); 
let Usuario=require("../models/Usuario"); 
let CompraCerebro = require("../models/CompraCerebro"); 


//Obtener zombies según tipo de propietario ("admin" o "normal")
router.get('/zombies/:cuenta', async (req, res)=>{
    Usuario.findOne({email: req.params.cuenta}, function(error, user){
      
      console.log(user.tipo);
      try{
        //admin
        if(user.tipo == 'admin'){
          Zombie.find().exec((error, zombies)=>{
            if(!error){
                res.status(200).json(zombies);
            }else{
                res.status(500).json(error);
            }
          });
          //normal
        }else{
          Zombie.find({propietario:{$eq: req.params.cuenta}}).exec((error,zombies)=>{

            if(!error){
              
                res.status(200).json(zombies);
            }else{
                res.status(500).json(error);
            }
          });
        }
      }catch (e){
        res.status(500).json(e);
      }
    } 
  );
});

// Agrega cualquier zombie, según quien lo haya agregado
router.post("/zombies/add",function(req,res){
  let formZombieAdd=req.body;

  let nuevoZombie=new Zombie({
    nombre: formZombieAdd.nombre,
    email:formZombieAdd.email,
    tipo: formZombieAdd.tipo,
    propietario: formZombieAdd.propietario
  });
  nuevoZombie.save(function(error){
    if(error){
      let mensajeError=error.message;
      res.status(500).json({mensajeError:mensajeError});
      return error;
    }else{
      res.status(200).json("#");
      }
    });
  });


// Editar información de cualquier zombie (solo nombre y tipo)
router.put('/zombie/edit/:email', async function(req,res){
  try{
    var zombieData=await Zombie.findOne({email: req.params.email});
    zombieData.nombre=req.body.nombre;
    zombieData.tipo=req.body.tipo;

    await zombieData.save();
    res.status(200).json(zombieData);
  }
  catch(e){
    
    res.status(500).json({mensajeError:e});
  }
});

// Eliminar de la base de datos a cualquier zombie
router.delete('/zombies/delete/:id', async function(req,res){
  try{
      var zombie=await Zombie.findById(req.params.id);
      zombie.remove();
  
      res.status(200).json('#');
  }catch(e){
      res.status(500).json({mensajeError:e});
  }
});

//  SECCIÓN CEREBROS________________________________________________________________

// Obtener cerebros según tipo de propietario ("admin" o "normal") 
router.get('/cerebros/:cuenta', function(req,res){
  Usuario.findOne({email: req.params.cuenta}, function(error, user){
    console.log(user.tipo);
    try{
      // Regresa todos los cerebros por ser admin
      if(user.tipo == 'admin'){
        Cerebro.find().exec((error, cerebros)=>{
          if(!error){
              res.status(200).json(cerebros);
          }else{
              res.status(500).json(error);
          }
        });
        // Regresa solo los cerebros del usuario logeado (normal)
      }else{
        Cerebro.find({propietario:{$eq: req.params.cuenta}}).exec((error,cerebros)=>{
          if(!error){
            
              res.status(200).json(cerebros);
          }else{
              res.status(500).json(error);
          }
        });
      }
    }catch (e){
      res.status(500).json(e);
    }
  } 
);

});

router.post("/cerebro/add",function(req,res){
  let formAddBrainData=req.body;

  let nuevoCerebro=new Cerebro ({
    sabor: formAddBrainData.sabor,
    descripcion:formAddBrainData.descripcion,
    iq: formAddBrainData.iq, 
    propietario: formAddBrainData.propietario
  });
  nuevoCerebro.save(function(error){
    if(error){
      let mensajeError=error.message;
      res.status(500).json({mensajeError:mensajeError});
    }else{
      res.status(200).json('#');
      }
    });
    
});

// Edita cualquier zombie
router.put('/cerebros/edit/:id', async function(req,res){
  try{
    let cerebro=await Cerebro.findById(req.params.id);
    cerebro.falvor=req.body.flavor;
    cerebro.Description=req.body.Description;
    cerebro.IQ=req.body.IQ;
    cerebro.Picture=req.body.Picture;

    await cerebro.save();
    res.status(200).json('/cerebros');
  }
  catch(e){
    res.status(500).json({mensajeError:e});
  }
});

// Eliminar cualquier cerebro
router.delete('/cerebros/delete/:id', async function(req,res){
  try{
    let cerebro=await Cerebro.findById(req.params.id);
    cerebro.remove();

    res.status(200).json("/cerebros");
  }catch(e){
    res.status(500).json({mensajeError:e});
  }
});


//SECCION LOGIN/REGISTRO____________________________________________________________________

//Login
router.post('/usuario/login', function(req,res){
    var formLoginData = req.body;
    console.log(formLoginData);
    Usuario.findOne({email: formLoginData.email}, function(error, userData){
      console.log(userData)
      if(userData == null){
        res.status(500).json({errors: "usuario no encontrado"});
      }else {
        
          if(formLoginData.password == userData.password){
            res.status(200).json({});
          } else {
            res.status(500).json({errors: "contraseña o correo erroneos"});
          }
        
      }
    });
  });

  //Registro
  router.post("/registro/new",function(req,res){
    let data=req.body;
  
    let nuevoUser=new Usuario({
      email: data.email,
      password: data.password,
      tipo: 'normal'
    });
    nuevoUser.save(function(error){
      if(error){
        let errMessage=error.message;
        res.status(500).json({mensajeError:errMessage});
        return error;
      }else{
        res.status(200).json("/prueba");
        }
      });
    });

// SECCION GRAFICAS____________________________________________________________________________

 //Grafica sabores
 router.get('/dashboard/graficaSabores/:propietario', async (req, res)=>{
  var saboresTotales;
  Usuario.findOne({email: req.params.propietario}, async function(error, user){

    try{
      // Si el usuario logeado es administrador, obtendra la cantidad de los demás usuarios
      if(user.tipo == 'admin'){
        var cantidadPicante =await Cerebro.find({sabor: {$eq: 'Picante'}}).count();
        var cantidadAmargo =await Cerebro.find({sabor: {$eq: 'Amargo'}}).count();
        var cantidadDulce =await Cerebro.find({sabor: {$eq: 'Dulce'}}).count();
        var cantidadSalado =await Cerebro.find({sabor: {$eq: 'Salado'}}).count();
        var cantidadAcido =await Cerebro.find({sabor: {$eq: 'Acido'}}).count();
        
        saboresTotales = {
          picante: cantidadPicante,
          amargo: cantidadAmargo,
          dulce: cantidadDulce,
          salado: cantidadSalado,
          acido:cantidadAcido
        };
        res.status(200).json(saboresTotales);

        //Si no es administrador, solo obtendrá la cantidad de sus registros. 
      }else{
        var cantidadPicante =await Cerebro.find({$and: [{sabor: {$eq: 'Picante'}},{propietario: {$eq: user.email}}]}).count();
        var cantidadAmargo =await Cerebro.find({$and: [{sabor: {$eq: 'Amargo'}},{propietario: {$eq: user.email}}]}).count();
        var cantidadDulce =await Cerebro.find({$and: [{sabor: {$eq: 'Dulce'}},{propietario: {$eq: user.email}}]}).count();
        var cantidadSalado =await Cerebro.find({$and: [{sabor: {$eq: 'Salado'}},{propietario: {$eq: user.email}}]}).count();
        var cantidadAcido =await Cerebro.find({$and: [{sabor: {$eq: 'Acido'}},{propietario: {$eq: user.email}}]}).count();
        
        saboresTotales ={
          picante: cantidadPicante,
          amargo: cantidadAmargo,
          dulce: cantidadDulce,
          salado: cantidadSalado,
          acido:cantidadAcido
        };
        res.status(200).json(saboresTotales);
      }
    }catch (e){
      res.status(500).json(e);
    }
  } 
);
});

// Grafica cerebros por usuario
router.get('/dashboard/graficaUsuarios/:propietario', async (req, res)=>{
  var contadorUsuarios = [];
  Usuario.findOne({email: {$eq: req.params.propietario}}, async function(error, usuario){
    console.log(usuario);
    // Si el usuario es administrador, podrá ver la segunda gráfica (usuarios normales no podrán).
    if(usuario.tipo == 'admin'){
      Usuario.find({},{email:1,_id:0}).exec(async (error, usuariosRegistrados)=>{
        console.log(usuariosRegistrados);
        if(!error){
          for (var posicion in usuariosRegistrados){
            var cantidad = await Cerebro.find({propietario: {$eq: usuariosRegistrados[posicion].email}}).count();
             contadorUsuarios[posicion] = {y:cantidad, label: usuariosRegistrados[posicion].email};
          }
          res.status(200).json(contadorUsuarios);
        }else{
          res.status(500).json(error);
        }
      });
    }else{
      res.status(200).json('normal');
    }
  });
});



// SECCIÓN COMPRAS (CEREBROS)____________________________________________________________

//Obtenemos las compras realizadas del usuario logeado
router.get('/cerebros/compras/:user', async function(req, res){
  CompraCerebro.find({emailUsuario: req.params.user}, function(error, data){
    if(!error){
      res.status(200).json(data);
    }else{
      res.status(500).json(error);
    }
  });
});

//Realizar compra nueva
router.post('/cerebros/compras/new', async function(req,res){
  var info = req.body;
  let nuevoPedido=new CompraCerebro({
    emailUsuario: info.emailUsuario,
    cerebroSeleccionado:info.cerebroSeleccionado,
    cantidad: info.cantidad,
    metodoEnvio: info.metodoEnvio,
    fechaPedido:info.fechaPedido,
    fechaEntrega:info.fechaEntrega
  });
  nuevoPedido.save(function(error,nuevaCompra){
    if(error){
      let errMessage=error.message;
      res.status(500).json({mensajeError:errMessage});
      return error;
    }else{
      res.status(200).json(nuevaCompra);
      }
    });
});

router.get('/cerebros/compras/cerebro/:cerebroID', async (req, res)=>{
  try{
    var infoCerebro= await Cerebro.findById(req.params.cerebroID);
    console.log(req.params.cerebroID);
    res.status(200).json(infoCerebro);
  }catch (e){
    res.status(500).json(e);
  }
  
  });


module.exports=router;