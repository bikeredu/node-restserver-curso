const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
                    .json({
                        ok: false,
                        err:{
                            message: 'No se ha seleccionado ningún archivo'
                        }
                    });
    }

    //valida tipo

    let tiposValidos = ['productos', 'usuarios'];
     
    if( tiposValidos.indexOf( tipo ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo: tipo
            }
        })

    }

    
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length -1];

    // Extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if( extensionesValidas.indexOf( extension ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })

    }

    // Cambiar nombre al archivo

    //Ex: 183985dasd-123.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
          return res.status(500)
                        .json({
                            ok: false,
                            err
                        });

        // Aqui, imagen cargada
        imagenUsuario(id, res, nombreArchivo);
        // res.json({
        //     ok: true,
        //     message: 'Archivo cargado correctamente'
        // })
      });
});


function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB)=>{
        if(err){
            deleteArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){

            deleteArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        deleteArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img =  nombreArchivo;

        usuarioDB.save( (err, usuarioDB)=> {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })
        })
        
    })
}

function imagenProducto(){
    
}


function deleteArchivo( nombreArchivo, tipo) {
    //validar si existe la imagen

    let pathImagen =  path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }` );

    //verificar imagen y borrar
    if( fs.existsSync( pathImagen )){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;