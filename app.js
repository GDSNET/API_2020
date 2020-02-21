const express = require('express');
const app = express();
const fs = require('fs');
var multer  = require('multer')
var sql = require('mssql'); 
const readXlsxFile = require('read-excel-file/node');

app.use(express.json());

const apiResponse = (res, status = 200) => (data, success = true, errorMsg = null, error = null) => {
    return res.status(status).json({
        data,
        success,
        errorMsg,
        error
    });
};

const apiError = (res, status = 500) => (errorMsg = null, error = null) => apiResponse(res, status)(null, false, errorMsg, error);

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,path');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/filemanager/list', (req, res) => {
    const path = __dirname + '/Documentos' + req.query.path || '/';
console.log('Iniciando', path)
    fs.readdir(path, (err, files) => {
        if (err) {
            return apiError(res)('Cannot read folder', err);
        }

        let items = (files || []).map(f => {
            const fpath = path + '/' + f;
            let type = 'file';
            let size = 0;
            let createdAt = null;
            let updatedAt = null;
            try {
                const stat = fs.statSync(fpath);
                type = stat.isDirectory() ? 'dir' : type;
                size = stat.size;
                createdAt = stat.birthtimeMs;
                updatedAt = stat.mtimeMs;
            } catch (err) {
            }
            return {
                name: f,
                type,
                size,
                createdAt,
                updatedAt
            }
        });

        return apiResponse(res)(items);
    });

});


app.post('/filemanager/dir/create', (req, res) => {
    const fullPath = __dirname + '/Documentos' + req.body.path + '/' + req.body.directory;
    
    if (fs.existsSync(fullPath)) {
        return apiError(res)('The folder already exist', err);
    }
    try {
        result = fs.mkdirSync(fullPath);
        return apiResponse(res)(result);
    } catch(err) {
        return apiError(res)('Unknown error creating folder', err);
    }
});


app.get('/filemanager/file/content', (req, res) => {
    let path = __dirname + '/Documentos' + req.query.path;
    
    return res.download(path);
    
});


app.post('/filemanager/items/copy', (req, res) => {
    const { path, filenames, destination } = req.body;

    const promises = (filenames || []).map(f => {
        return new Promise((resolve, reject) => {
            const oldPath = __dirname + '/Documentos' + '/' + f;
            const newPath = __dirname + '/Documentos' + '/' + f;
            fs.copyFile(oldPath, newPath, err => {
                const response = {
                    success: !err,
                    error: err,
                    oldPath,
                    newPath,
                    filename: f
                };
                return err ? reject(response) : resolve(response);
            });        
        });        
    });

    Promise.all(promises).then(values => {
        return apiResponse(res)(values);
    }).catch(err => {
        return apiError(res)('An error ocurred copying files', err);
    });
});

app.post('/filemanager/items/move', (req, res) => {
    const { path, filenames, destination } = req.body;

    const promises = (filenames || []).map(f => {
        return new Promise((resolve, reject) => {
            const oldPath = __dirname + '/Documentos' +  path + '/' + f;
            const newPath = __dirname + '/Documentos' + destination + '/' + f;
            fs.rename(oldPath, newPath, err => {
                const response = {
                    success: !err,
                    error: err,
                    oldPath,
                    newPath,
                    filename: f
                };
                return err ? reject(response) : resolve(response);
            });        
        });        
    });

    Promise.all(promises).then(values => {
        return apiResponse(res)(values);
    }).catch(err => {
        return apiError(res)('An error ocurred moving files', err);
    });
});

app.post('/filemanager/item/move', (req, res) => {
    const { path, destination } = req.body;

    const promise = new Promise((resolve, reject) => {
        fs.rename(path, destination, err => {
            const response = {
                success: !err,
                error: err,
                path,
                destination
            };
            return err ? reject(response) : resolve(response);
        });        
    });        

    promise.then(values => {
        return apiResponse(res)(values);
    }).catch(err => {
        return apiError(res)('An error ocurred renaming file', err);
    });
});

app.post('/filemanager/items/upload', (req, res, next) => {
    let pathUpload = __dirname + '/Documentos' + req.headers.path
    const upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                // we pass the path by headers because is not present in params at this point
                cb(null, pathUpload);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        })
    }).array('file[]');

    upload(req, res, err => {
        if (err) {
            return apiError(res)('An error occurred uploading files', err);
        }
        if (! req.files.length) {
            return apiError(res)('Cannot find any file to upload');
        }
        return apiResponse(res)(true);
    });
});

app.post('/filemanager/items/remove', (req, res) => {
    const { path, filenames, recursive } = req.body;
    const promises = (filenames || []).map(f => {
        const fullPath = __dirname + '/Documentos' + path + '/' + f;
        return new Promise((resolve, reject) => {
            fs.unlink(fullPath, err => {
                const response = {
                    success: !err,
                    error: err,
                    path,
                    filename: f,
                    fullPath
                };
                return err ? reject(response) : resolve(response);
            });
        });
    });

    Promise.all(promises).then(values => {
        return apiResponse(res)(values);
    }).catch(err => {
        return apiError(res)('An error ocurred deleting file', err);
    });
    
});


app.post('/post_api_semana', function (req, res) {

    console.log("SOY LA API post_api_semana")
    
    const pool = new sql.ConnectionPool({
        user: 'sa',
        password: 'sasa',
        server: '192.168.0.16',
        database: 'GDS_DW_PROD2'
    })
    
    var conn = pool;
    
      
    conn.connect().then(function () {
        var req = new sql.Request(conn);
        console.log("SOY LA CONEXION")
    querys = "select * from v_api_tie_semana"
    console.log(querys)
    conn.query(querys).then(function (recordset) {
    
    
        var semanas = {
            semana:[]
        };
    
        recordset.recordset.map( function (value, i)  {
            semanas.semana.push({
                "id" : value.id_tie_semana,
                "desc" : value.desc_tie_dias_semana
        });               
        })
    
        res.json(semanas); 
        res.end();
        conn.close();
    }) 
        .catch(function (err) {
            res.json({"usuario":"ERROR"}); 
            res.end();
            conn.close();
        });
    })
    .catch(function (err) {
    res.json({"usuario":"ERROR CONEXION"}); 
    res.end();
    conn.close();
    });
    })


    app.post('/api_gds_select_cliente_intranet', function (req, res) {
   
        
        const pool = new sql.ConnectionPool({
            user: 'sa',
            password: 'sasa',
            server: '192.168.0.16',
            database: 'GDS_DW_PROD2'
        })
       
        var conn = pool;
    
    
        conn.connect().then(function () {
            var req = new sql.Request(conn);

        querys = "SELECT * FROM  [dbo].[l_clientes_intranet]"  
        //console.log(querys)
        conn.query(querys).then(function (recordset) {
        
       // console.log('recordset.recordset: ' + recordset.recordset);
        
        //console.log('recordset:  ' + recordset);
            var data = {
                cliente_int:[]
            };
        
            recordset.recordset.map( function (value, i)  {
            data.cliente_int.push({
                "id" : value.cliente_log,
                "desc" : value.desc_cliente
            });
            })
        //console.log(data);
            res.json(data); 
            res.end();
            conn.close();
        }) 
            .catch(function (err) {
                res.json({"usuario":"ERROR"}); 
                res.end();
                conn.close();
            });
        })
        .catch(function (err) {
        res.json({"usuario":"ERROR CONEXION"}); 
        res.end();
        conn.close();
        });
        })

        app.post('/post_api_log', function (req, res) {

            console.log("SOY LA API LOG")
            
            var cliente = req.body.cliente;
            var semana = req.body.semana;
            var estado = req.body.estado;    
            
           // console.log(cliente);
        
            const pool = new sql.ConnectionPool({
                user: 'sa',
                password: 'sasa',
                server: '192.168.0.16',
                database: 'GDS_DW_PROD2'
            })
           
            var conn = pool;
        

            conn.connect().then(function () {
                var req = new sql.Request(conn);
               // console.log("SOY LA CONEXION")
            querys = "select * from log_CH_clientes where cliente = '"+cliente+"'and id_cfg= "+semana+" and estado_ok = "+estado+""
            console.log(querys)
            conn.query(querys).then(function (recordset) {
            
           // console.log('recordset.recordset: ' + recordset.recordset);
            
            //console.log('recordset:  ' + recordset);
                var data = {
                    log:[]
                }; 
                recordset.recordset.map( function (value, i)  {
                    data.log.push({
                        "id_tie_dia" : value.id_tie_dia,
                        "cliente" : value.cliente,
                        "id_cfg" : value.id_cfg,
                        "id_sala" : value.id_sala,
                        "desc_sala" : value.desc_sala,
                        "estado_pre_log" : value.estado_pre_log,
                        "desc_pre_log" : value.desc_pre_log,
                        "estado_log" : value.estado_log,
                        "desc_log" : value.desc_log,
                        "estado_valido" : value.estado_valido,
                        "estado_ok" : value.estado_ok,
                });
                })
            console.log(data);
                res.json(data); 
                res.end();
                conn.close();
            }) 
                .catch(function (err) {
                    res.json({"usuario":"ERROR"}); 
                    res.end();
                    conn.close();
                });
            })
            .catch(function (err) {
            res.json({"usuario":"ERROR CONEXION"}); 
            res.end();
            conn.close();
            });
            })        

            app.post('/post_api_update_log', function (req, res) {

                console.log("SOY LA API post_api_update_log")
                
                   // console.log(cliente);
                                    
                var cliente = req.body.cliente;
                var sala = req.body.sala;
                var semana = req.body.semana;
                var estado = req.body.estado;
                
                const pool = new sql.ConnectionPool({
                user: 'sa',
                password: 'sasa',
                server: '192.168.0.16',
                database: 'GDS_DW_PROD2'
                })
                   
                var conn = pool;
                
                conn.connect().then(function () {
                var req = new sql.Request(conn);
                   // console.log("SOY LA CONEXION")
                querys = "exec [dbo].[usp_CH_valida_salas_log] '"+cliente+"','"+sala+"','"+semana+"','"+estado+"'"  
                console.log(querys)
                conn.query(querys).then(function (recordset) {
                
                if (recordset.rowsAffected.length >0)
                { console.log ("Update OK");
                res.json({"data":"ok"});
                res.end();
                conn.close();
                }
                else
                {
                console.log ("0 filas afectadas");
                res.json({"data":"error"});
                res.end();
                conn.close();
                }
                }) 
                .catch(function (err) {
                   // console.log(err)
                    res.json({"usuario":"ERROR"}); 
                    res.end();
                    conn.close();
                });
                })
                .catch(function (err) {
                res.json({"usuario":"ERROR CONEXION"}); 
                res.end();
                conn.close();
                });
                })


              
 
                // File path.
                readXlsxFile('/path/to/file').then((rows) => {
                  // `rows` is an array of rows
                  // each row being an array of cells.
                })
                 
                // Readable Stream.
                readXlsxFile(fs.createReadStream('/path/to/file')).then((rows) => {
                  ...
                })





    app.listen(3009);