const express=require('express');
const { Session } = require('inspector');
const morgan=require('morgan');
const session = require('express-session')
const app=express();
const path=require('path')//son parte del codigo base y de paquetes


app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'vista'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'clave_super_segura_que_nadie_conozca_123!@#$', // 🔹 Usa una clave segura y única
    resave: false, // 🔹 No volver a guardar sesiones si no hay cambios
    saveUninitialized: false, // 🔹 No crear sesiones vacías
    cookie: {
        secure: process.env.NODE_ENV === 'production', // 🔹 Solo en HTTPS en producción
        httpOnly: true, // 🔹 Evita accesos desde JavaScript
        maxAge: 1000 * 60 * 60 * 2 // 🔹 Expira en 2 horas
    }
}));


app.use(require('./rutas/rutas'))
app.use((err,req,res,next)=>{
    res.send({err:err.message});
});//creacion de la app donde le decimos que requerimos la carpeta rutas con ekl archivo rutas.js


// creacion de nuestro servidor
app.set('port',process.env.PORT || 1000);//utilizamos el puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`En el servidor ${app.get('port')}`);
})
