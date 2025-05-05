// const connection=require('../conexion/conexion');
// const cnn=connection();
// const {render, name}=require('ejs');
// const bcryptjs=require('bcryptjs');
// const controller={};


// // renderizados //


// controller.reportes=(req,res,next)=>{
//     res.render('reportes')
// }
// controller.usuarios=(req,res,next)=>{
//     if(req.session.Login){
//         res.render('usuarios');
//     }else{
//         res.redirect('/');  
//     }

// }
// controller.clientes=(req,res,next)=>{
//     if(req.session.Login){
//         res.render('clientes');
//     }else{
//         res.redirect('/');  
//     }

// }
// controller.proveedores=(req,res,next)=>{
//     if(req.session.Login){
//         res.render('proveedores');
//     }else{
//         res.redirect('/');  
//     }

// }
// controller.productos=(req,res,next)=>{
//     if(req.session.Login){
//         res.render('productos');
//     }else{
//         res.redirect('/');  
//     }

// }
// controller.ventas=(req,res,next)=>{
//     if(req.session.Login){
//         res.render('ventas');
//     }else{
//         res.redirect('/')
//     }

// }
// controller.detalles=(req,res,next)=>{
//     if(req.session.Login){
//         res.render('detalles');
//     }else{
//         res.redirect('/')
//     }

// }


// // fin de renderizdos //




// // SECCION DE USUARIO //

// controller.tb_usuarios=(req,res,next)=>{
//     if(req.session.Login){

//     cnn.query('SELECT * FROM usuarios',(err,result)=>{
//         if(err){
//             next(new Error(err))
//             console.log("Error en la consulta")
//         }
//         else{
//             console.log(result)
//             res.render('tabla-1',{datos:result})
//         }
//     })
//     }
//     else{
//         res.redirect('/');
//     }
// }
// controller.insertar_usuarios=async(req,res,next)=>{
//     //espacios para el usuario digite informacion
//     const c=req.body.dd;
//     const e=req.body.uu;
//     const n=req.body.cc;
//     const p=req.body.rr;
//     const u=req.body.ee;

//     const password=await bcryptjs.hash(p,8)//encriptamos la clve
//     cnn.query('INSERT INTO usuarios SET?',{cedusu:c,emailusu:e,nomusu:n,password:password,usu:u},(err,result)=>{
//         if(err){
//             next(new Error(err))
//         }
//         else{
//             res.render('usuarios')
//         }
//         //hacemos el proceso de saber si los datos ingresan bien
//     })
// }

// controller.actualizar_usuarios=async(req,res,next)=>{
//     const docx=req.body.dd;
//     const usux=req.body.uu;
//     const clavex=req.body.cc;
//     const rolx=req.body.rr;
//     const estadx=req.body.ee;

//     const password=await bcryptjs.hash(rolx,8)
//     cnn.query('UPDATE usuarios SET emailusu="'+usux+'",nomusu="'+clavex+'",password="'+password+'",usu="'+estadx+'" WHERE cedusu="'+docx+'"'),async(err,result)=>{
//         if(err){
//             next(new Error(err));
//         }
//         else{
//             console.log("actualizado")
//             res.redirect('usuarios');
//         }
//     }
// }
// controller.eliminar_usuarios=async(req,res,next)=>{  
//     const d=req.body.dd;

//     cnn.query('DELETE FROM usuarios WHERE cedusu="'+d+'"',async(err,result)=>{
       
//         if(err){
//             next(new Error(err));

//         }else{
//             console.log("Borrado")
//             res.render('usuarios');
//         }

//         });
    

// }
// controller.consultar_usuarios=async(req,res,next)=>{  

//     if(req.session.Login){

//     const d=req.body.cedusu;
//     console.log(d);
//     cnn.query('SELECT * FROM usuarios WHERE cedusu=?',[d],(err,resbd)=>{

//     if(err){
//             throw err
//     }else{
//             res.render('consulta_us',{datos:resbd})

//     }

//     })

//     }

// }






// // SECCION DE CLIENTE //
// controller.insertar_cliente=async(req,res,next)=>{
//     const c=req.body.dd;
//     const e=req.body.uu;
//     const n=req.body.cc;
//     const p=req.body.rr;
//     const u=req.body.ee;

//     cnn.query('INSERT INTO clientes SET?',{cedcli:c,direccli:e,emailcli:n,nomcli:p,telcli:u},(err,result)=>{
//         if(err){
//             next(new Error(err))
//         }
//         else{
//             res.redirect('clientes')
//         }
//     })
// }
// controller.actualizar_cliente=async(req,res,next)=>{
//     const docx=req.body.dd;
//     const usux=req.body.uu;
//     const clavex=req.body.cc;
//     const rolx=req.body.rr;
//     const estadx=req.body.ee;

//     cnn.query('UPDATE clientes SET direccli="'+usux+'",emailcli="'+clavex+'",nomcli="'+rolx+'",telcli="'+estadx+'" WHERE cedcli="'+docx+'"'),async(err,result)=>{
//         if(err){
//             next(new Error(err));
//         }
//         else{
//             console.log("actualizado")
//             res.redirect('clientes');
//         }
//     }
// }
// controller.eliminar_cliente=async(req,res,next)=>{  
//     const c=req.body.aa;


//     cnn.query('DELETE FROM clientes WHERE cedcli="'+c+'"',async(err,result)=>{
       
//         if(err){
//             next(new Error(err));

//         }else{
//             console.log("Borrado")
//             res.redirect('clientes');
//         }

//         });
    

// }
// controller.consultar_clientes=async(req,res,next)=>{  

//     if(req.session.Login){

//     const d=req.body.cedcli;
//     console.log(d);
//     cnn.query('SELECT * FROM clientes WHERE cedcli=?',[d],(err,resbd)=>{

//     if(err){
//             throw err
//     }else{
//             res.render('consulta_cli',{datos:resbd})

//     }

//     })

//     }

// }


// // SECCION DE  PROVEEDORES //

// controller.tb_proveedores=(req,res,next)=>{
//     if(req.session.Login){

//     cnn.query('SELECT * FROM proveedores',(err,result)=>{
//         if(err){
//             next(new Error(err))
//             console.log("Error en la consulta")
//         }
//         else{
//             console.log(result)
//             res.render('tabla-3',{datos:result})
//         }
//     })
//     }
//     else{
//         res.redirect('/');
//     }

    
// }
// controller.insertar_proveedores=async(req,res,next)=>{
//     const c=req.body.dd;
//     const e=req.body.uu;
//     const n=req.body.cc;
//     const p=req.body.rr;
//     const u=req.body.ee;

//     cnn.query('INSERT INTO proveedores SET?',{nitprov:c,ciudadprov:e,direcprov:n,nomprov:p,telprov:u},(err,result)=>{
//         if(err){
//             next(new Error(err))
//         }
//         else{
//             res.redirect('proveedores')
//         }
//     })
// }
// controller.actualizar_proveedores=async(req,res,next)=>{
//     const docx=req.body.dd;
//     const usux=req.body.uu;
//     const clavex=req.body.cc;
//     const rolx=req.body.rr;
//     const estadx=req.body.ee;

//     cnn.query('UPDATE proveedores SET ciudadprov="'+usux+'",direcprov="'+clavex+'",nomprov="'+rolx+'",telprov="'+estadx+'" WHERE nitprov="'+docx+'"'),async(err,result)=>{
//         if(err){
//             next(new Error(err));
//         }
//         else{
//             console.log("actualizado")
//             res.redirect('proveedores');
//         }
//     }
// }
// controller.eliminar_proveedores=async(req,res,next)=>{  
//     const c=req.body.dd;


//     cnn.query('DELETE FROM proveedores WHERE nitprov="'+c+'"',async(err,result)=>{
       
//         if(err){
//             next(new Error(err));

//         }else{
//             console.log("Borrado")
//             res.redirect('clientes');
//         }

//         });
    

// }
// controller.consultar_proveedores=async(req,res,next)=>{  

//     if(req.session.Login){

//     const d=req.body.nitprov;
//     console.log(d);
//     cnn.query('SELECT * FROM proveedores WHERE nitprov=?',[d],(err,resbd)=>{

//     if(err){
//             throw err
//     }else{
//             res.render('consulta_prov',{datos:resbd})

//        }

//     })

//     }

// }



// // SECCION DE  PRODUCTOS //

// controller.tb_productos=(req,res,next)=>{
//     if(req.session.Login){

//     cnn.query('SELECT * FROM productos',(err,result)=>{


//         if(err){
//             next(new Error(err))
//             console.log("Error en la consulta")
//         }
//         else{
//             console.log(result)
//             res.render('tabla-4',{datos:result})
//         }
//     })
//     }
//     else{
//         res.redirect('/');
//     }

    
// }
// controller.insertar_productos=async(req,res,next)=>{
//     const c=req.body.dd;
//     const e=req.body.uu;
//     const n=req.body.cc;
//     const p=req.body.rr;
//     const u=req.body.ee;
//     const tt=req.body.pp;

//     cnn.query('INSERT INTO productos SET?',{codpro:c,ivacom:e,nitprov:n,nompro:p,preccom:u,precven:tt},(err,result)=>{
//         if(err){
//             next(new Error(err))
//         }
//         else{
//             res.redirect('productos')
//         }
//     })
// }
// controller.actualizar_productos=async(req,res,next)=>{
//     const docx=req.body.dd;
//     const usux=req.body.uu;
//     const clavex=req.body.cc;
//     const rolx=req.body.rr;
//     const estadx=req.body.ee;
//     const ven=req.body.ss;

//     cnn.query('UPDATE productos SET ivacom="'+usux+'", nitprov="'+clavex+'",nompro ="'+rolx+'",preccom="'+estadx+'",precven="'+ven+'" WHERE codpro="'+docx+'"'),async(err,result)=>{
//         if(err){
//             next(new Error(err));
//         }
//         else{
//             console.log("actualizado")
//             res.redirect('productos');
//         }
//     }
// }
// controller.eliminar_productos=async(req,res,next)=>{  
//     const c=req.body.dd;
//     cnn.query('DELETE FROM productos WHERE codpro="'+c+'"',async(err,result)=>{
       
//         if(err){
//             next(new Error(err));

//         }else{
//             console.log("Borrado")
//             res.redirect('productos');
//         }

//         });
// }
// controller.consulta_productos=async(req,res,next)=>{  

//     if(req.session.Login){

//     const d=req.body.codpro;
//     console.log(d);
//     cnn.query('SELECT * FROM productos WHERE codpro=?',[d],(err,resbd)=>{

 

//     if(err){
//             throw err
//     }else{
//             res.render('consulta_prod',{datos:resbd})

//         }

//     })

//     }

// }



// // SECCION DE  VENTAS //
// controller.tb_ventas=(req,res,next)=>{
//         if(req.session.Login){

//         cnn.query('SELECT * FROM ventas',(err,result)=>{
//             if(err){
//                 next(new Error(err))
//                 console.log("Error en la consulta")
//             }
//             else{
//                 console.log(result)
//                 res.render('tabla-5',{datos:result})
//             }
//         })
//         }
//         else{
//             res.redirect('/');
//         }

    
// }

// controller.ventas=(req,res,next)=>{
//     if(req.session.Login){
//         cnn.query('SELECT * FROM productos',(err,result)=>{
//             if(err){
//                 next(new Error(err))
//                 console.log("Error en la consulta")
//             }
//             else{
//                 cnn.query('SELECT * FROM clientes',(err,resbb)=>{
//                     if(err){
//                         next(new Error(err))
//                         console.log("Error en la consulta")
//                     }
//                     else{

//                         res.render('ventas',{datos:result,clientes:resbb})
//                         console.log(result)

//                     }
//                 })

//             }
//         })
//     }

// }


// controller.consultaproductor=(req,res)=>{


//     if(req.session.Login){
//         cnn.query('SELECT * FROM productos',(err,result)=>{
//             if(err){
//                 throw err
//             }
//             else{
//                 cnn.query('SELECT * FROM clientes',(err,resbb)=>{
//                     if(err){
//                         throw err
//                     }
//                     else{

//                         const id = req.params.cc;

//                         console.log(id);

//                         cnn.query('SELECT * FROM productos WHERE codpro = ?',[id], (err,rows)=>{
//                             //cnn.end();
//                             if(err){
//                                 throw err
//                             }
//                             else{
//                                 console.log(rows)
//                                 res.json(rows)
                                
//                             }
//                         })
//                     }
//                 })

//             }
//         })
//     }


// }




// controller.insertarventa1=(req,res)=>{
//     const cod = req.params.indi;
//     const ced = req.body.cc;
//     const pro1 = req.body.p1;
//     const pro2 = req.body.p2;
//     const pro3 = req.body.p3;
//     const nom1 = req.body.n1;
//     const nom2 = req.body.n2;
//     const nom3 = req.body.n3;
//     const can1 = req.body.ca1;
//     const can2 = req.body.ca2;
//     const can3 = req.body.ca3;
//     const iva1 = req.body.iv1;
//     const iva2 = req.body.iv2;
//     const iva3 = req.body.iv3;
//     const valor1 = req.body.v1;
//     const valor2 = req.body.v2;
//     const valor3 = req.body.v3;
//     const totalventas = req.body.tve;
//     const iva = req.body.iva;
//     const total = req.body.tol;

//     cnn.query('INSERT INTO ventas SET ?',
//     {codven:cod,cedcli:ced,cedusu:ced,
//     ivaven:iva,totven:totalventas,valven:total}),(err)=>{}

//     var response = [
//         [can1,pro1,cod,valor1,valor1,iva1],
//         [can2,pro2,cod,valor2,valor2,iva2],
//         [can3,pro3,cod,valor3,valor3,iva3]
//     ]

//     cnn.query('INSERT INTO detalle (cantpro,codpro,codven,valtot,valven,valiva) VALUES ?',[response],(err)=>{
//         if(err){
//             throw err
//         }
//         else{
//             res.redirect('/ventas')
//         }
//     })
// }








// module.exports=controller;