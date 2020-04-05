var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/buena_onda', function(req,res){
  res.render("buena_onda", { title: ' Los alumnos del A no son muy buenos en AOEII',
   text:'Los alumnos del A son más buena onda que los del B' });
});
module.exports = router;
