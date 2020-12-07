var sql = require('mssql'); 

exports.funHome = function (req, res)  {
        console.info('invocando funHome')

        var token = req.body.token;
        var id_cliente = req.body.cliente;

        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'sasa',
            server: '192.168.0.22',
            database: 'GDS_APP'
        })
        var conn = pool;
    try{
        conn.connect().then(function () {
        querysobj = "select * from [dbo].[app_cfg_objecion] where id_cliente = " + id_cliente + ""
        queryres = "select * from [v_app_usuarios_indicadores_resumen] where token= '" + token + "'"
        queryrank = "select * from v_app_ranking_salas where token= '"+token+"' order by valor asc "
        queryAll = querysobj + queryres + queryrank
       // console.log(queryAll)
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
   
          arrayObjeciones = data[0]
          arrayResumen = data[1]
          arrayRanking = data[2]
          // console.log("recibiendo todo el arraySalas :  : ", arraySalas)
          //console.log("recibiendo todo el arrayIndicadores :  : ", arrayIndicadores)
          // console.log("recibiendo todo el arrayRanking :  : ", arrayRanking)
          return funAgrupaObjeciones(arrayObjeciones, arrayResumen, arrayRanking)
        }
    }


    function  funAgrupaObjeciones (arrayObjeciones, arrayResumen, arrayRanking) {

        usuario = {}

        arrayResumen.map( function (value, i)  {
            usuario = ({
                "id_usuario": value.id_usuario,
                "desc_usuario": value.nombre,
                "estado": 0
            })

        })

var respuesta = []

        var objecion = {
            objeciones:[]
        };

        arrayObjeciones.map( function (value, i)  {
            objecion.objeciones.push({
                "desc_objecion": value.desc_objecion
            })

        })

        var indicador = {
            indicadores:[]
        }

        arrayResumen.map( function (value, i)  {
            indicador.indicadores.push({
                "indicador": value.display_name,
                "valor": value.valor,
                "diferencia": value.diferencia,
                "fuente":"transaccional"
            })

        })

        var ranking = {
            rankings:[]
        }

        arrayRanking.map( function (value, i)  {
            ranking.rankings.push({
                "id_sala": value.id_sala,
                "cadena": value.desc_cadena,
                "desc_sala": value.desc_pto_observacion,
                "indicadores": funIndicadoresRan(value.id_sala, value.id_indicador ,arrayRanking)
            });

        });

    respuesta = Object.assign(objecion, indicador, ranking)
    // respuesta.push(objecion, indicador, ranking);

     let obj_unidos = Object.assign(usuario, respuesta )

        return obj_unidos;
    };


    function  funIndicadoresRan(id_sala,id_indicador,arrayRanking){

        const indicadorRan = [];
        const  dataIndicador  =  arrayRanking
        .filter(indicadores => {
          if(indicadores.id_sala===id_sala && indicadores.id_indicador === id_indicador){
            indicadorRan.push({
                "indicador": indicadores.display_name,
                "valor" : indicadores.valor,
                "diferencia": indicadores.diferencia
            });

           return indicadores["indicadores"] = indicadorRan
          }
        }, {});
      
        return  indicadorRan;
    }