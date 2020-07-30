
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
        queryspdv = "select * from [dbo].[v_app_salas] where token = '" + token + "';"
        queryspdv2 = "select * from [dbo].[v_app_salas_indicadores] where token= '" + token + "';"
        queryspdv3 = "select * from [dbo].[v_app_salas_indicadores_detalle] where token= '" + token + "';"
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
      console.info("va con todo: ", JSON.stringify(res_sql.recordsets[2]))
    return new Promise((resolve) => {
        resolve(funAgruparData(res_sql.recordset))
    }).then(respuesta=>{
        console.log('respuesta OK', respuesta)
        return respuesta
      })
      .catch(respuesta=>{
       console.log('respuesta error', respuesta)
      })
  })

  }
  

   function funAgruparData (data) {
    console.log("inicio : funAgruparData : ", data)
    
     const  dataReduced =  data
      .reduce( (obj,val) => {
        
        const key = val.fecha_visita
        if(obj[key]) {
          obj[key].data.push({
            desc_indicador: val.desc_indicador,
            valor:val.valor,
          }) 
        } else {
          obj[key] = {}
          obj[key].fecha_visita = val.fecha_visita;
          obj[key].desc_cadena = val.desc_cadena;
          obj[key].data = [
            {
              desc_indicador: val.desc_indicador,
              valor:val.valor
            }
          ]
        }
        
        return obj;
        
      },{})

    return Object.keys(dataReduced)
      .map(v => dataReduced[v])
  }
    
