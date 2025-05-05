function ajaxpro(){
    let nit,nom,com,ven,iva,cod;

    cod = document.getElementById("codigo").value;
    nom = document.getElementById('nombre').value;
    nit = document.getElementById("nit").value;
    com = document.getElementById("precioc").value;
    iva = document.getElementById("iva").value;
    ven = document.getElementById("venta").value;
    $.ajax({
    
        type:"POST",
        url:"/creaproducto",
        data:{
            cc:cod,nn:nom,nini:nit,coco:com,ii:iva,vv:ven
        },
        success: function (cedula){
            
        }
    })

}