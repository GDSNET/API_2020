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
        queryspdv = "select TOP 3 * from [v_app_salas] where token = '" + token + "'"
        queryspdv2 = "select * from [v_app_salas_indicadores] where token= '" + token + "'"
        queryspdv3 = "select * from [v_app_salas_indicadores_detalle] where token= '" + token + "'"
        queryAll = queryspdv + queryspdv2 + queryspdv3
       new Promise((resolve) => {
            resolve(funcionQuery(queryAll, conn ))
        }).then(respuesta=>{

         // respuesta.push(funIndexSalas());
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
   
          arraySalas = data[0]
          arrayIndicadores = data[1]
          arrayVariables = data[2]
           //console.log("recibiendo todo el arraySalas :  : ", arraySalas)
          // console.log("recibiendo todo el arrayIndicadores :  : ", arrayIndicadores)
          // console.log("recibiendo todo el arrayVariables :  : ", arrayVariables)
          return funAgrupadoSala(arraySalas, arrayIndicadores, arrayVariables)
        }
          
        

    }


   function  funAgrupadoSala (arraySalas, arrayIndicadores, arrayVariables) {

    dataRes = {}

    var sala = {
      salas:[]
  };
  

  arraySalas.map( function (value, i)  {
    sala.salas.push({
                "id_sala": value.id_sala,
                "fechaHora" : value.fecha_visita,
                "cadena": value.desc_cadena,
                "desc_sala": value.desc_sala,
                "direccion": value.desc_direccion,
                "numero": 99,
                "estado": value.estado
            })

        })

    const   dataReduced =   arraySalas
    .reduce( (obj,val) => {

     const key = "sala" + val.id_sala
     obj[key] = {}
     obj[key].id_sala = val.id_sala;
     obj[key].desc_sala = val.desc_sala;
     obj[key].desc_cadena = val.desc_cadena;
     obj[key].indicadores = funAgrupadoIndicador(arrayIndicadores, val.id_sala, arrayVariables)
     return (obj);
  }, {})

dataRes.salas = (sala)
dataRes.det = (dataReduced)

let obj_unidos = Object.assign(dataRes.salas, dataRes.det )

//return Object.keys(obj_unidos).map(v => obj_unidos[v])

  return  obj_unidos
}


function  funAgrupadoIndicador (arrayIndicadores, id_sala, arrayVariables) {
  const  dataIndicador  =  arrayIndicadores
  .filter(indicadores => {
    if(indicadores.id_sala===id_sala){
    dataFiltrada = funFiltroVariables(indicadores, arrayVariables)
    dataFiltradAgrupada = funAgrupadoVariables (dataFiltrada)
     return indicadores["detalles"] = dataFiltradAgrupada
    }
  }, {})

  return  dataIndicador
}

function  funFiltroVariables(arrayIndicadores, arrayVariables) {
  const  dataDetalle  = arrayVariables
  .filter(det => {
    if(arrayIndicadores.id_sala===det.id_sala && arrayIndicadores.id_indicador===det.id_indicador){
    return det
    }
  })

  return  dataDetalle
}



function funAgrupadoVariables (envios) {
  const enviosReduced = envios
    .reduce( (obj,val) => {
      const key = val.id_sku
      if(obj[key]) {
        //console.log("entro al if" +   obj[key].cantidad)
        //obj[key].cantidad = obj[key].cantidad + 1;
      } else {
        //console.log("entro al else")
        obj[key] = {}
        obj[key] =
          {
            id_sala: val.id_sala,
            id_indicador: val.id_indicador,
            id_sku: val.id_sku,
            agrupador: val.desc_agrupador,
            titulo: val.desc_titulo,
            subtitulo: val.desc_subtitulo
            //cantidad : 1,
          }
      }

      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===1 ){
        obj[key].presencia = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===2){
        obj[key].precio = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===3){
        obj[key].promocion = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===4){
        obj[key].exhibicion = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===5){
        obj[key].numerico = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===6){
        obj[key].alfanumerico = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===7){
        obj[key].porcentaje = val.valor_variable;
      }
      if (val.id_sala===obj[key].id_sala && val.id_indicador===obj[key].id_indicador  && val.id_variable===8){
        obj[key].semaforo = val.valor_variable;
      }
      //console.log(obj)
      return obj;
      
    },{})
    //console.log(enviosReduced)
    return Object.keys(enviosReduced).map(v => enviosReduced[v])
    //return enviosReduced;
  }




  

