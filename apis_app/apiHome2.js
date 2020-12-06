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
        queryrank = "select top 10 * from [dbo].[v_app_salas_indicadores] where id_indicador = 0 and valor IS NOT NULL and token= '"+token+"' order by valor asc "
        queryAll = querysobj + queryres + queryrank
       // console.log(queryAll)


    });
        }catch(err) {
            console.log("ERROR 3: " +err);
            res.json({"id_usuario":"ERROR"}); 
            conn.close();
        };   

    }