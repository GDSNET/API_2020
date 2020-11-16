
var sql = require('mssql'); 

exports.funSalas = function (req, res)  {
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
   
          array_salas = data[0]
          array_indicadores = data[1]
          array_variables = data[2]
          // console.log("recibiendo todo el salas :  : ", array_salas)
          // console.log("recibiendo todo el indicadores :  : ", array_indicadores)
          // console.log("recibiendo todo el detalles :  : ", array_variables)
          return funAgrupadoSala(array_salas, array_indicadores, array_variables)
        }
          
        

    }


   function  funAgrupadoSala (array_salas, array_indicadores, array_variables) {
    const   dataReduced =   array_salas
    .reduce( (obj,val) => {
     const key = "sala" + val.id_sala
     obj[key] = {}
     obj[key].id_sala = val.id_sala;
     obj[key].desc_sala = val.desc_sala;
     obj[key].desc_cadena = val.desc_cadena;
     obj[key].indicadores = funAgrupadoIndicador(array_indicadores, val.id_sala, array_variables)
     return obj;
  }, {})

  return  dataReduced
}
    


function  funAgrupadoIndicador (array_indicadores, id_sala, array_variables) {
  const  dataIndicador  =  array_indicadores
  .filter(indicadores => {
    if(indicadores.id_sala===id_sala){
    dataDetalle = funAgrupadoVariables(array_indicadores, array_variables)
     return indicadores["detalles"] = dataDetalle
    }
  }, {})

  return  dataIndicador
}

function  funAgrupadoVariables(array_indicadores, array_variables) {
  const  dataDetalle  = array_variables
  .filter(det => {
    console.log(det)
    if(array_indicadores.id_sala===det.id_sala && array_indicadores.id_indicador===det.id_indicador ){
    return det
    }
  })

  return  dataDetalle
}

