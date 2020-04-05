var express = require('express');
var router = express.Router();

var Zombie=require("../models/Zombie"); //modelo
var Cerebro=require("../models/Cerebro"); //modelo

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'C/S Course' });
});*/

router.get('/prueba', function(req,res){
  Zombie.find().exec(function(error,Zombies)
  {
    if(!error)
    {
      res.render('index',{ coleccion:Zombies});
    }
  });
});

//Rutas cerebros _____________________________________

router.get('/cerebros', function(req,res){
  Cerebro.find().exec(function(error,cerebros)
  {
    if(!error)
    {
      res.render('cerebro/index',{title: 'Brains', coleccion:cerebros});
    }
  });
});

router.get("/cerebro/add",function(req,res){
  res.render("cerebro/add",{mensajeError:'',mensajeCorrecto:''});
});

router.post("/cerebro/new",function(req,res){
  var data=req.body;

  var nuevoCerebro=new Cerebro ({
    sabor: data.sabor,
    descripcion:data.descripcion,
    iq: data.iq,
  });
  nuevoCerebro.save(function(error){
    if(error){
      var errMessage=error.message;
      console.log("\n" + errMessage + "\n");
      res.render("cerebro/add",{mensajeError:errMessage});
      console.log(error);
    }else{
      res.redirect("/cerebros");
      console.log(error);
    }
  });
    
});



router.get('/cerebros/edit/:id', async function(req,res){
  var cerebro= await Cerebro.findById(req.params.id);

  res.render('cerebro/edit',{cerebro:cerebro,mensajeError:''});
});

router.put('/cerebros/edit/:id', async function(req,res){
  try{
    var cerebro=await Cerebro.findById(req.params.id);
    cerebro.sabor=req.body.sabor;
    cerebro.descripcion=req.body.descripcion;
    cerebro.iq=req.body.iq;
    
    await cerebro.save();
    res.redirect('/cerebros');
  }
  catch(e){
    cerebro=await Cerebro.findById(req.params.id);
    res.redirect('/cerebros/edit/:id',{cerebro:cerebro,mensajeError:'No se pudo actualizar', mensajeCorrecto:''});
  }
});

router.get('/cerebros/delete/:id', async function(req,res){
  var cerebro=await Cerebro.findById(req.params.id);

  res.render('cerebro/delete',{cerebro:cerebro, mensajeError:''});
});

router.delete('/cerebros/delete/:id', async function(req,res){
  try{
    var cerebro=await Cerebro.findById(req.params.id);
    cerebro.remove();

    res.redirect("/cerebro");
  }catch(e){
    res.redirect("/cerebro");
  }
});


//rutas zombie________________________________________________________________________

router.get("/zombies/add",function(req,res){
  res.render("add",{mensajeError:''});
});

router.post("/zombies/new",function(req,res){
  var data=req.body;

  var nuevoZombie=new Zombie({
    nombre: data.name,
    email:data.email,
    tipo: data.type
  });
  nuevoZombie.save(function(error){
    if(error){
      var errMessage=error.message;
      res.render("add",{mensajeError:errMessage});
    }else{
      res.redirect("/prueba");
      }
    });
  });


  router.get('/zombies/edit/:id', async function(req,res){
    var zombie= await Zombie.findById(req.params.id);

    res.render('edit',{zombie:zombie,mensajeError:'', mensajeCorrecto:''});
  });

  router.put('/zombies/edit/:id', async function(req,res){
    try{
      var zombie=await Zombie.findById(req.params.id);
      zombie.nombre=req.body.nombre;
      zombie.email=req.body.email;
      zombie.tipo=req.body.tipo;

      await zombie.save();
      res.redirect('/prueba');
    }
    catch(e){
      res.redirect('/prueba');
    }
  });

  router.get('/zombies/delete/:id', async function(req,res){
    var zombie= await Zombie.findById(req.params.id);

    res.render('delete',{zombie:zombie});
  });

  router.delete('/zombies/delete/:id', async function(req,res){
    try{
      var zombie=await Zombie.findById(req.params.id);
      zombie.remove();

      res.redirect("/prueba");
    }catch(e){
      res.redirect("/");
    }
  });
module.exports = router;


