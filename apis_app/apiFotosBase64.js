var sql = require('mssql');

exports.funGuardaFoto = function (req, res, next) {
    
    var id_foto = req.body.id_foto;
    var foto_base_64 = req.body.foto_base_64;


    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'sasa',
        server: '192.168.0.22',
        database: 'GDS_APP'
    })

    var conn = pool;

conn.connect().then(function () {
var req = new sql.Request(conn);

queryinsertfoto = "insert into [dbo].[image_64] values("+id_foto+",'"+foto_base_64+"')";
//console.log(queryinsertfoto);
conn.query(queryinsertfoto).then( function (recordset) {
    
console.log(recordset);
res.json({"mensaje" : "OK"});
res.end();
conn.close();

})
})
}