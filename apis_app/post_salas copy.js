
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

    return await conn.query(queryspdv).then( (res_sql) => {
      
    return new Promise((resolve, reject) => {
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
            desc_cadena: val.desc_cadena,
            desc_sala:val.desc_sala,
          }) 
        } else {
          obj[key] = {}
          obj[key].fecha_visita = val.fecha_visita;
          obj[key].data = [
            {
                desc_cadena: val.desc_cadena,
                desc_sala:val.desc_sala,
            }
          ]
        }
        
        return obj;
        
      },{})

    return Object.keys(dataReduced)
      .map(v => dataReduced[v])
  }
    
