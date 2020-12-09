var sql = require('mssql');

exports.funGuardaFoto = function (req, res, next) {
    
    var id_usuario = req.body.id_usuario;
    var fecha_objecion = req.body.fecha_objecion;
    var id_sala = req.body.id_sala;
    var id_indicador = req.body.id_indicador;
    var id_sku = req.body.id_sku;
    var desc_objecion = req.body.desc_objecion;
    var foto = req.body.foto;
    var fecha_envio = req.body.fecha_envio;

    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'sasa',
        server: '192.168.0.22',
        database: 'GDS_APP'
    })

    var conn = pool;

conn.connect().then(function () {
var req = new sql.Request(conn);

queryinsertfoto = "insert into [dbo].[app_recibe_fotos] values("+id_usuario+",'"+fecha_objecion+"',"+id_sala+","+id_indicador+","+id_sku+",'"+desc_objecion+"','"+foto+"','"+fecha_envio+"')";
//console.log(queryinsertfoto);
conn.query(queryinsertfoto).then( function (recordset) {
    
//console.log(recordset);

res.json({"mensaje" : "OK"});
res.end();
conn.close();

})
.catch(function (err) {

    console.log("ERROR 2");
    res.json({"usuario":"ERROR",
              "desc_error": err.message}); 
    conn.close();
});
})
.catch(function (err) {
    console.log("ERROR 2");
    res.json({"usuario":"ERROR",
              "desc_error": err.message}); 
    conn.close();
});
}