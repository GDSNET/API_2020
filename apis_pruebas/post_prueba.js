
var sql = require('mssql'); 

exports.funPruebas = function (req, res)  {
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
        queryspdv = "select * from [v_app_salas] where token = '" + token + "';"
        queryspdv2 = "select * from [v_app_salas_indicadores] where token= '" + token + "';"
        queryspdv3 = "select * from [v_app_salas_indicadores_detalle] where token= '" + token + "';"
        queryAll = queryspdv + queryspdv2 + queryspdv3
       new Promise((resolve) => {
            resolve(funcionQuery(queryAll, conn ))
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
    return await conn.query(queryspdv).then( (res_sql) => {
    //console.info("va con todo: ", JSON.stringify(res_sql.recordsets[2]))
    return new Promise((resolve) => {
        resolve(funAgruparData(res_sql.recordsets))
    }).then(respuesta=>{
        //console.log('respuesta OK', respuesta)
        return respuesta
      })
      .catch(respuesta=>{
       console.log('respuesta error', respuesta)
      })
  })
  }
  


  function funAgruparData (data) {
   
    salas = data[0]
    indicadores = data[1]
    detalles = data[2]
    // console.log("recibiendo todo el salas :  : ", salas)
    // console.log("recibiendo todo el indicadores :  : ", indicadores)
    // console.log("recibiendo todo el detalles :  : ", detalles)
    return funAgrupando(salas, indicadores, detalles)
  }
    


   function  funAgrupando (salas, indicadores, detalles) {
    const   dataReduced =   salas
    .reduce( (obj,val) => {
     const  dataIndicador  =  indicadores
     .filter(indicadores => {
       if(indicadores.id_sala===val.id_sala){

       dataDetalle = detalles.filter(det => {
          if(indicadores.id_sala===det.id_sala && indicadores.id_indicador===det.id_indicador ){
          return det
          }
        })
      
        return indicadores["detalles"] = dataDetalle
       }
     })
     const key = "sala" + val.id_sala
     obj[key] = {}
     obj[key].id_sala = val.id_sala;
     obj[key].desc_sala = val.desc_sala;
     obj[key].desc_cadena = val.desc_cadena;
     obj[key].indicadores = dataIndicador
     return obj;
  }, {})
  
  return  dataReduced
}
    

