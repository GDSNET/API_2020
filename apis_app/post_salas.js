
var sql = require('mssql'); 


const salas = (req, res) => {
        console.info('invocando post_pruebas new')
        var token = req.body.token;

        console.log("clase de arbol:", arbol)
        
        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'sasa',
            server: '192.168.0.22',
            database: 'GDS_APP'
        })
        
        var conn = pool;
    try{
        conn.connect().then(function () {
        queryspdv = "select * from [v_app_salas] where token= '" + token + "'"

       new Promise((resolve, reject) => {
            resolve(funcionQuery(queryspdv, conn ))
        }).then(respuesta=>{
            res.json(respuesta)
          })
          .catch(respuesta=>{
            res.json('problema red', respuesta )
          })

    });
        }catch(err) {
            console.log("ERROR 3: " +err);
            res.json({"id_usuario":"ERROR"}); 
            conn.close();
        };   



    }



  async function funcionQuery  (queryspdv, conn) {

    console.log("dentro de la funcion conn")
    
    var Salas = {
        salas:[]
    };

    await conn.query(queryspdv).then(function (res_sql) {
        console.log(res_sql)

        res_sql.recordset.map(async function (value, i)  {
            Salas.salas.push({
                "id_sala" : value.id_sala,
                "fecha_visita" : value.fecha_visita,
                "cadena" : value.desc_cadena,
                "desc_sala" : value.desc_sala,
                "direccion" : value.desc_direccion,
                "vista" : value.vista
        });       
        
        })

})
    return  Salas
   
  }
  


    
  exports.salas = salas;