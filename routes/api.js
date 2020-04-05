let express=require('express');
let router = express.Router();

let Zombie=require("../models/Zombie"); //modelo
let Cerebro=require("../models/Cerebro"); //modelo
let Usuario=require("../models/Usuario"); //modelo


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


//login
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
  


module.exports=router;