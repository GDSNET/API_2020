var sql = require('mssql');

exports.funLoginApp = function (req, res, next) {
    
    var username = req.body.username;
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

query = "SELECT token, nombre, id_cliente FROM [dbo].[app_cfg_usuario] WHERE username = '"+username+"' AND password= '"+password+"'";
//console.log(query);
conn.query(query).then( function (recordset) {
//console.log(recordset)

console.log(recordset.recordset.length)

if(recordset.recordset.length === 0){
    res.json({"usuario"  : "Usuario o Contraseña invalidos."})
}
else{res.json(recordset.recordset[0])}
            
}) 
    .catch(function (err) {
        console.log("ERROR 2");
        res.json({"usuario":"ERROR",
                  "desc_error": err}); 
        conn.close();
    });

})
.catch(function (err) {
    console.log("ERROR 2");
    res.json({"usuario":"ERROR",
              "desc_error": err}); 
    conn.close();
});
}
