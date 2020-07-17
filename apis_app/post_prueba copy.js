
var sql = require('mssql'); 



  

class MyClass {

  constructor() {}

  funcionUno(req, res, next) {
     return "asdgashdkajshdkajshdkj"
  }

  bar(req, res, next) {
   

      console.info('invocando post_pruebas new')
  
      var token = req.body.token;
      
      const pool = new sql.ConnectionPool({
          user: 'sa',
          password: 'sasa',
          server: '192.168.0.22',
          database: 'GDS_APP'
      })
      
      var conn = pool;
      

      
      try{
      conn.connect().then(function () {
   
   

          funcionUno(token, conn).then(function(resultado) {
              console.log('primera parte : ', resultado)
              res.json(resultado); 
              return resultado
            })
            .then(function(nuevoResultado) {
                console.log('entro en la tercera parte : ', nuevoResultado)
               return nuevoResultado
              })
            .catch(console.log('fallo'));

 
  });
      }catch(err) {
          console.log("ERROR: " +err);
          res.json({"id_usuario":"ERROR"}); 
          conn.close();
      };   



  }

}

module.exports = new MyClass();





var sql = require('mssql'); 

const bar = (req, res) => {
    return getLocation(res)
    
  };
  
  function getLocation (res) {
   return res.json('location function: Jim')
  };
  
  const dateOfBirth = '12.01.1982';
  
  exports.bar = bar;
  exports.getLocation = getLocation;
  exports.dob = dateOfBirth;