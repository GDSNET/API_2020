
var sql = require('mssql'); 

module.exports = {
    bar: function (req, res) {
     

        console.info('invocando post_pruebas new')
    
        var token = req.body.token;
        
        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'sasa',
            server: '192.168.0.22',
            database: 'GDS_APP'
        })
        
        var conn = pool;
        
        queryspdv = "select * from [v_app_salas] where token= '" + token + "'"
        console.info("imprimiendo query:" , queryspdv);
        
        try{
        conn.connect().then(function () {
        console.log("dentro de la funcion connpdv la query es: " +queryspdv)
        conn.query(queryspdv).then(function (recordset) {

            console.log("dentro de la funcion conn")
        
        var Salas = {
            salas:[]
        };
        
        recordset.recordset.map(async function (value, i)  {
            Salas.salas.push({
                "id_sala" : value.id_sala,
                "fecha_visita" : value.fecha_visita,
                "cadena" : value.desc_cadena,
                "desc_sala" : value.desc_sala,
                "direccion" : value.desc_direccion,
                "vista" : value.vista
        });       
        
        })
        
        querysindicadores = "select * from v_app_salas_indicadores WHERE token = '" + token + "'"
        conn.query(querysindicadores).then(function (recordset) {
        
        var Indicadores = {
            indicador:[]
        };
        
         recordset.recordset.map(async function (value, i)  {
            Indicadores.indicador.push({
                "id_sala" : value.id_sala,
                "display_name" : value.display_name,
                "valor" : value.valor,
                "diferencia" : value.diferencia
        });       
        
        })

        
        querysDetalle = "select * from v_app_salas_indicadores_detalle WHERE token = '" + token + "'"
        conn.query(querysDetalle).then(function (recordset) {
       
       var Detalles = {
           detalle:[]
       };

       console.log('recordet:', recordset)
       
        recordset.recordset.map(async function (value, i)  {
            Detalles.detalle.push({
               "token" : value.token,
               "id_sala" : value.id_sala,
               "id_indicador" : value.id_indicador,
               "desc_indicador" : value.desc_indicador,
               "desc_var1" : value.desc_var1,
               "desc_var2" : value.desc_var2,
               "desc_var3" : value.desc_var3,
               "presencia" : value.valor_presencia,
               "precio" : value.valor_precio,
               "promocion" : value.valor_promocion,
               "exhibicion" : value.valor_exhibicion,
               "porcentaje" : value.valor_porcentaje,
       });       
       })
        
        var resA={}, fin = [], resC= {},  resD=[], resB={}
        
        Salas.salas.map(function(value, i){
        
        resA=  {"id_sala" : value.id_sala,
        "desc_sala" : value.desc_sala,
        "fecha_visita" : value.fecha_visita,
        "vista" : value.vista}
        
        Indicadores.indicador.map(function(values, i){
        if(value.id_sala == values.id_sala){

        let union = []
        union =  [{"display_name" : values.display_name,
        "valor" : values.valor,
        "diferencia" : values.diferencia}]

        var todo = Object.assign(union);
        
         resB = todo

         Detalles.detalle.map(function(valor, i){
            
            if(valor.id_sala == values.id_sala){
             
            let union_det =  {"presencia" : valor.presencia,
            "precio" : valor.precio,
            "promocion" : valor.promocion,
            "exhibicion" : valor.exhibicion,
            "porcentaje" : valor.porcentaje}

            var todo_det = Object.assign(union_det);

            resD.push(todo_det)
            }//CIERRE IF Detalles
            })//CIERRE MAP Detalles

        }//CIERRE IF SALAS
        resB["detalle"] = resD
        })//CIERRE MAP Indicadores
        
       
         resC["sala" + resA.id_sala] = resA
      
         resA["indicadores"]= resB
        
         //console.log(resD)
        
        })//CIERRE MAP SALA
        fin.push(Salas);
        fin.push(resC);
        res.json(fin)
        
        })//CIERRE CONN
        })
        })
        .catch(function (err) {
            console.log("ERROR 2" +err);
            res.json({"id_usuario":"ERROR"}); 
            conn.close();
        });
    });
        }catch(err) {
            console.log("ERROR: " +err);
            res.json({"id_usuario":"ERROR"}); 
            conn.close();
        };   



    }
  };



  var convertirObjeciones = function (objeciones) {
    const objecionesReduced = objeciones
      .filter( v => v.status !== 'enviado')
      .reduce( (obj,val) => {
        //console.info(val.indicador)
        const key = 'sala' + val.id_sala
        if(obj[key]) {
          
          obj[key].acciones.push({
            type: val.type,
            indicador: val.indicador,
            fechaHora:val.fechaHora,
            item: val.desc_sku,
            ean: val.ean,
            id_sku: val.id_sku,
            accion: val.objecion,
            fechaHoraEnvio: val.fechaHoraEnvio
          
          }) 
        } else {
          
          obj[key] = {}
          obj[key].id_sala = val.id_sala;
          obj[key].cadena = val.cadena;
          obj[key].desc_sala = val.desc_sala;
          obj[key].direccion = val.direccion;
          obj[key].fechaHora = val.fechaHora;
          obj[key].acciones = [
            {
              type: val.type,
              indicador: val.indicador,
              fechaHora:val.fechaHora,
              item: val.desc_sku,
              ean: val.ean,
              id_sku: val.id_sku,
              accion: val.objecion,
              fechaHoraEnvio: val.fechaHoraEnvio
            }
          ]
        }
        
        return obj;
        
      },{})

    return Object.keys(objecionesReduced)
      .map(v => objecionesReduced[v])
  }
  