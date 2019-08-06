// Puerto

process.env.PORT = process.env.PORT || 3000;

//============
//Entorno
//===========


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



//============
//Vencimiento del token
//===========

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//============
//SEED autenticación
//===========


process.env.SEED = process.env.SEED || 'este-es-el-seed-desarollo';

//============
//Database
//===========

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//============
//Google ClienteID
//===========


process.env.CLIENT_ID = process.env.CLIENT_ID || '128430487677-fnh59qe7rh4kqvh1mlkv9rkrau23104a.apps.googleusercontent.com';