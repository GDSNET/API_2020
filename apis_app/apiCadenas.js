var sql = require('mssql');

exports.funCadenasApp = function (req, res, next) {

    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'sasa',
        server: '192.168.0.22',
        database: 'GDS_APP'
    })

    var conn = pool;

conn.connect().then(function () {
var req = new sql.Request(conn);

query = "SELECT * FROM [dbo].[app_cfg_cadena]";
//console.log(query);

new Promise((resolve) => {
    resolve(funcionQuery(query, conn ))
}).then(respuesta=>{
    res.json(respuesta)
  })
  .catch(respuesta=>{
    res.json('problema red', respuesta )
  })

})
.catch(function (err) {
    console.log("ERROR 2");
    res.json({"usuario":"ERROR",
              "desc_error": err}); 
    conn.close();
});


async function funcionQuery  (query, conn) {
    return await conn.query(query).then( (res_sql) => {
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

    arrayData = data[0]
    // console.log("recibiendo todo el arraySalas :  : ", arraySalas)
    // console.log("recibiendo todo el arrayIndicadores :  : ", arrayIndicadores)
    // console.log("recibiendo todo el arrayVariables :  : ", arrayVariables)
    return funAgrupadoCadena(arrayData)
  }

}

function  funAgrupadoCadena (arrayData) {
    const   dataReduced =   arrayData
    .reduce( (obj,val) => {
     const key =  val.desc_cadena
     obj[key] = {}
     obj[key].uri = val.imagen_cadena;

     return obj;
  }, {})

  return  dataReduced
}

