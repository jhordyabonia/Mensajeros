/* 
send
{
    "Nombres": "Demo Cliente",
    "Apellidos": "Apellido 1",
    "Cedula": "1234567",            
    "Telefono": "3156619506",
    "Correo": "f@f.com",
    "Usuario": "info@ziel.com.co",  
    "Clave": "12345",
    "MiCodigoPromocional": "",      <
    "IdCiudad": 1,                  <
    "DireccionPrincipal": "Casa"    <
}
//result
{
    "Error": true,
    "Descripcion": "El usuario ya se encuentra registrado."
}
 */
var _URL="http://hermesapi2018.azurewebsites.net/api/Usuario/RegistrarUsuario";
var _PRE="#error-popover-";
var _OK=false;
var _ERR="Debe aceptar los terminos y condiciones de uso.";
var ciudades_cargadas=false;
var This=document;
function send(data_in)//data_in:node from /*send(document.getElementById('form')*/
{        
   var http=new XMLHttpRequest();

   http.open(data_in.method, _URL, true);
   http.setRequestHeader('Content-Type',data_in.enctype);
   http.addEventListener('load',show,false);
   var data_raw = [];  
   /**convertimos el formuario en una cadena url*/
   for(var t=0;t<data_in.elements.length;t++)
   {     
       obj=data_in.elements[t];
       data_raw.push(encodeURIComponent(obj.name) + '=' + encodeURIComponent(obj.value));
   }
   data=data_raw.join('&').replace(/%20/g, '+');
   http.send(data);
   $.showLoading();         
   function show()//definimos que hacer con los resultados devueltos, tras el envio del fromulario 
   {
       var result;
       try { result= JSON.parse(http.response);} 
       catch ( e ) {}
       if(typeof result == "object")
         start(result);
    }
}
function start(db)//db:Object (datos de usuario)
{
    if(db.Error)
     alert(db.Descripcion);
    else
    {
        location.href=location.href.replace('usuario-registro.html','intro.html');
    }
    console.log(db);
    $.hideLoading();
} 

function validateCel(campo) 
{
    error=2; 
    if(campo.trim().length==10)//Validacion celular; Exactos 10 digitos debe tener el numero celular
        error--;
    if(campo.trim().startsWith("3"))//Validacion celular; Los numeros celulares en colombia inician con el digito numro 3
        error--;
        
    return (error<1);
}

function validateEmail(campo) 
{
    error=4;
    if(campo.indexOf('@')!=-1)//Validacion email; debe contener solo un caracter '@'
         error--;
    if(campo.substr(0,campo.lastIndexOf('@')).length>3)//Validacion email; debe tener dominio
         error--;
    lt=campo.substr(campo.lastIndexOf('@'),campo.length)//Validacion email; especifica el tipo de web, '.com','.com.co', '.co', '.net', etc
    if((lt.length>3)&&(lt.indexOf('.')!=-1))
         error--;
    if(campo.substr(campo.lastIndexOf('.'),campo.length).length>3)
         error--;
    if(campo.replace("@","").indexOf('@')==-1)
        error--;
    else msj_err="";
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //Validacion email; no debe contener caracteres especiales
    return (regex.test(campo))&&(error<1);
};

/**Divs que conforman el formulario  de registro*/
var arrayPart = new Array(".part0",".part1",".part2",".part3",".part4");
/**Posicion actual del paso de registro (indice del div actulamente en pantalla) */
var count = 0;
/**Muestra el siguiente paso del registro. (Muestra el siguiente div) */
function show(){    
	count++;
	$(arrayPart[count]).ready(function(){				
  		$(arrayPart[count]).fadeIn(1500);		
    }); 
    $(".panel-footer").ready(function(){				
        $(".panel-footer").fadeIn(1500);		
    });
    $(".ziel-button").ready(function(){				
        $(".ziel-button").fadeIn(1500);		
    });
    _STAGES[count].play();
}
/*Oculta el actual paso de registro (oculta el div actual)*/
function hide(){
	$(arrayPart[count]).ready(function(){				
  		$(arrayPart[count]).fadeOut(1500);		
    });
    $(".panel-footer").ready(function(){				
        $(".panel-footer").fadeOut(1500);		
    });
    $(".ziel-button").ready(function(){				
        $(".ziel-button").fadeOut(1500);		
    });
}
/**Retrocede al anterior pasos de registro */
function back(){
    hide(arrayPart[count]);
    count-=2;
	setTimeout(show,1500);
}
/**Avanza al siguiente paso del registro. */
function next(){
    if(!ciudades_cargadas)
        getCiudades();
    if(!validate())return;
    if(_OK)send($('#form_singup')[0]);
	hide(arrayPart[count]);
	setTimeout(show,1500);
}
/**Ejecucion de validaciones en tiempo real*/
function validate()
{
    var test;
    switch (count)
    {
        case 0://Validaciones del primer paso de registro
            $(_PRE+'nombres').hide();
            $(_PRE+'apellidos').hide();
            test= $('#nombres').val().trim().length==0;
            if(test)
            {
                $(_PRE+'nombres').show();
                return !test;
            }
            test= $('#apellidos').val().trim().length==0;
            test?$(_PRE+'apellidos').show():0;
            return !test;
        case 1: //Validaciones del segundo paso de registro       
            $(_PRE+'correo').hide();
            $(_PRE+'cel').hide();
            if($('#correo').val().trim().length==0)return false;
            test=validateEmail($('#correo').val().trim());
            if(!test){$(_PRE+'correo').show(); return false;}
            if($('#cel').val().trim().length==0)return false;
            test=validateCel($('#cel').val().trim());
            if(!test)$(_PRE+'cel').show();
            $('#usuario').val($('#correo').val());
            return test;
        case 2:return true;//Validaciones del tercer paso de registro
        case 3://Validaciones del cuarto paso de registro
            $(_PRE+'pass').hide();
            $(_PRE+'pass2').hide();            
            if($('#pass').val().trim().length==0)return false;
            test=$('#pass').val().trim().length<6; //Comprueba que la clave tenga minimo 6 caracteres
            if(test)
            {   $(_PRE+'pass').show(); return false;}
            else  if($('#pass').val().trim()!=$('#pass2').val().trim()) 
            {   $(_PRE+'pass2').show();  return false;}            
            return true;            
        case 4: _OK=$('#terminos')[0].checked;//Validaciones del quinto paso de registro
            if(_OK&&$('#MiCodigoPromocional').val().trim().length==0)//autocompleta el CodigoPromocional si esta vacio
                $('#MiCodigoPromocional').val("0001");
            if(!_OK)
            {
                $('#_msj').html(_ERR);
                $('#launcher')[0].click()
            }
            return _OK;
    }
}
/**Cambia los mensajes informativos del footer segun el punto del registro*/
function play()
{
    $('#_title').html(this._title);
    $('#_texto').html(this._texto);
    $('#_image')[0].src="../images/"+this._image;
    $('#_step')[0].src="../images/Step"+this._step+".png";
    if(this._back)
        $('#goBack').show(); 
    else  $('#goBack').hide(); 
}
/**Definicion de Objeto contenedor de informacion para cada paso del registro */
function Stage(step,ti,txt,img,back)
{
    this._step=step;
    this._title=ti;
    this._text=txt;
    this._image=img;
    this._back=back;
    this.play=play;
}
/**Intancia array de objetos contenedores (Informacion para cada paso del registro) */
var _STAGES=[
    new Stage(1,"Contacto","Te enviaremos un mensaje con un código de validación","correoFull.png",false),
    new Stage(2,"Ubicación","Debes ingresar tu número de télefono celular y un correo de contacto","BanderoFull.png",true),
    new Stage(3,"Contraseña","Por seguridad en tu cuenta; Tu contraseña sera encriptada","CandadoFull.png",true),
    new Stage(4,"Contacto","Te enviaremos un mensaje con un código de validación","correoFull.png",true),
    new Stage(5,"Contacto","Te enviaremos un mensaje con un código de validación","correoFull.png",true)];

/**Carga de ciudades desde api */
function getCiudades()
{
   var url="http://hermesapi2018.azurewebsites.net/api/Ciudad/Listado";
    
   var http=new XMLHttpRequest();

   http.open("POST", url, true);
   http.setRequestHeader('Content-Type',"application/x-www-form-urlencoded");
   http.addEventListener('load',show,false);
   http.send(null);
   function show()
   {
    try 
    {
        //Base de datos
         var DB= JSON.parse(http.response);
         $('#ciudad')[0].innerHTML="";
         for(t=0;t<DB.length;t++)
         {
            var option=This.createElement('option');
            option.value=DB[t].IdCiudad;
            option.innerText=DB[t].NombreCiudad;
            $('#ciudad')[0].append(option);
         }         
         $('#ciudad')[0].val(DB[0].IdCiudad);
         ciudades_cargadas=true;
    } catch ( e ) {}
   }
}
function recuperarClave()
{   
    //bool temporal, para comprobar si el campo email no esta vacio 
    var t1=$('#inputEmail').val().length>0;
    //bool temporal, para comprobar si el error de email esta visible 
    var  t2=$('#error-popover-correo')[0].style.display=='none';
    
    if(t1)
    {
        if(t2)
        {
            $.showLoading();
            setTimeout(
                function(e)
                {
                    $.hideLoading();
                    $('#launcher')[0].click();
                },3000);           
        }
    }
}
/**Envia codigo de recuperacion de clave */     //Falta implentacion del Api
function enviarClave()
{
    //Valida que la clave tenga una longitud minima de 3 caracteres
    if($('#clave').val().length>3)
    {
    $.showLoading();
    setTimeout(
        function(e)
        {
            $.hideLoading();
            $('#dismiss')[0].click();
            location.href=location.href.replace('recuperar-clave.html','nueva-clave.html');             
        },300);
    }else alert('codigo inválido');
}
function departamentos()
{
    var popup=new XMLHttpRequest();
    var url_popup='http://123seller.azurewebsites.net/tools/departamentos/';
    popup.open("GET", url_popup, true);
    popup.addEventListener('load',show,false);
    popup.send(null);
    function show()
      {
        $('#pais').html(popup.response);
        $('#pais')[0].onchange=function(){cambio_departamento($('#pais').val());}
      }
}
window.onload=function(){departamentos();};

function cambio_departamento(id)
{
    var popup=new XMLHttpRequest();
    var url_popup='http://123seller.azurewebsites.net/tools/municipio_select/';
    popup.open("POST", url_popup, true);
    popup.addEventListener('load',show,false);
    data= new FormData();
    data.append("dept",id);
    popup.send(data);
    function show()
      {
        $('#ciudad').html(popup.response);
      }
}                                     