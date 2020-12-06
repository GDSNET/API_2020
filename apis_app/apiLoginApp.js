var sql = require('mssql');

exports.funLoginApp = function (req, res, next) {
    
    var id_usuario = req.body.id_usuario;
    var password = req.body.password;

    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'sasa',
        server: '192.168.0.22',
        database: 'GDS_APP'
    })

    var conn = pool;

conn.connect().then(function () {
var req = new sql.Request(conn);

query = "SELECT token FROM [dbo].[app_cfg_usuario] WHERE id_usuario = "+id_usuario+" AND password= '"+password+"'";
console.log(query);
conn.query(query).then( function (recordset) {
console.log(recordset)
  res.json(recordset.recordset[0])
            
}) 
    .catch(function (err) {
        console.log("ERROR 2");
        res.json({"usuario":"ERROR"}); 
        conn.close();
    });

})
.catch(function (err) {
    console.log("ERROR 2");
    res.json({"usuario":"ERROR"}); 
    conn.close();
});
}
