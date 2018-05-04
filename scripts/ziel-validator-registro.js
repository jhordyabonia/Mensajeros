/* 
//Ejemplo datos conumidos en api de registro
var send =
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

/**Declaracionde variabes gobales */
var _URL="http://hermesapi2018.azurewebsites.net/api/Usuario/RegistrarUsuario";
var _PRE="#error-popover-";
var _OK=false;
var _ERR="Debe aceptar los terminos y condiciones de uso.";
var _CIUDADES_CARGADAS=false;
var This=document;

function send(data_in)//data_in:node from /*send(document.getElementById('form')*/
{        
   /**Instancio y configuro solicitud al Api-rest*/
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
    /**Envío el formulario*/
   http.send(data);
   $.showLoading();   
   /**
    * Veficamos la respuesta recibida, y llamamos el metodo
    * Define que hacer con los datos recibidos, tras el envio del fromulario       
  */
   function show()
   {
       var result;
       try { result= JSON.parse(http.response);} 
       catch ( e ) {}
       if(typeof result == "object")
       {
        if(result.Error)
         alert(result.Descripcion);
        else
        { location.href=location.href.replace('usuario-registro.html','intro.html'); }
        console.log(result);
        $.hideLoading();
        } 
    }
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
/**Posicion actual del paso de registro (indice del div actulamente en pantalla)*/
var count = 0;
/**Muestra el siguiente paso del registro. (Muestra el siguiente div)*/
function show(){   
    /**incremento la posicion actual*/ 
    count++;    
    /**ejecuta efecto de entrada de divs*/
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
    /**ejecuta efecto de salida de divs*/
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
/**Retrocede al anterior pasos de registro*/
function back(){
    hide(arrayPart[count]);
    count-=2;    
    /**retrasa la ejecusion del metodo show 1.5 segundoos*/
	setTimeout(show,1500);
}
/**Avanza al siguiente paso del registro.*/
function next(){
    /**Verifica si las ciudades estan o no cargadas, y las carga en consecuencia*/
    if(!_CIUDADES_CARGADAS)
        getCiudades();        
    /**Si la validacion no es satisfactoria, no avanza al siguiente paso de registro*/
    if(!validate())return;
    /**Si todos los paso de registro, estan listos, envia el formulario*/
    if(_OK)send($('#form_singup')[0]);
    /**oculta eldiv actual*/
	hide(arrayPart[count]);
    /**retrasa la ejecusion del metodo show 1.5 segundoos*/
	setTimeout(show,1500);
}
/**Ejecucion de validaciones en tiempo real*/
function validate()
{
    var test;
    switch (count)
    {
        case 0://Validaciones del primer paso de registro
            $(_PRE+'nombres').hide();//oculta los msj de error para el campo nombres
            $(_PRE+'apellidos').hide();//oculta los msj de error para el campo apellidos
            //verifica que el campo nombres no este vacio
            test= $('#nombres').val().trim().length==0;
            if(test)
            {
                //mustra los msj de error para el campo nombres
                $(_PRE+'nombres').show();
                return !test;
            }
            //verifica que el campo apellidos no este vacio
            test= $('#apellidos').val().trim().length==0;
            //mustra los msj de error para el campo apellidos
            test?$(_PRE+'apellidos').show():0;
            return !test;
        case 1: //Validaciones del segundo paso de registro       
            $(_PRE+'correo').hide();//oculta los msj de error para el campo correo
            $(_PRE+'cel').hide();//oculta los msj de error para el campo celular
            if($('#correo').val().trim().length==0)return false;
            test=validateEmail($('#correo').val().trim());
            //mustra los msj de error para el campo correo
            if(!test){$(_PRE+'correo').show(); return false;}
            if($('#cel').val().trim().length==0)return false;
            test=validateCel($('#cel').val().trim());
            //mustra los msj de error para el campo celular
            if(!test)$(_PRE+'cel').show();
            $('#usuario').val($('#correo').val());
            return test;
        case 2:return true;//Validaciones del tercer paso de registro
        case 3://Validaciones del cuarto paso de registro
            $(_PRE+'pass').hide();//oculta los msj de error para el campo clave
            $(_PRE+'pass2').hide();//oculta los msj de error para el campo repetir clave         
            if($('#pass').val().trim().length==0)return false;
            test=$('#pass').val().trim().length<6; //Comprueba que la clave tenga minimo 6 caracteres
            if(test)//mustra los msj de error para el campo clave
            {   $(_PRE+'pass').show(); return false;}
            else  if($('#pass').val().trim()!=$('#pass2').val().trim()) 
            {   $(_PRE+'pass2').show();  return false;} //mustra los msj de error para el campo repetir clave           
            return true;            
        case 4: _OK=$('#terminos')[0].checked;//Validaciones del quinto paso de registro y todo el formulario
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
/**Definicion de Objeto contenedor de informacion para cada paso del registro*/
function Stage(step,ti,txt,img,back)
{
    this._step=step;//int: almacena el paso del registro
    this._title=ti;//string: almacena el titulo del paso del registro
    this._text=txt;//string: almacena el texto de info del paso del registro
    this._image=img;//url: almacena la url de la img del paso del registro
    this._back=back;//bool: habilita si se puede retoceder o no, en los pasos de registro
    this.play=play;//function: inserta la informacion almacenada en pantalla
}
/**Intancia array de objetos contenedores (Informacion para cada paso del registro)*/
var _STAGES=[
    new Stage(1,"Contacto","Te enviaremos un mensaje con un código de validación","correoFull.png",false),
    new Stage(2,"Ubicación","Debes ingresar tu número de télefono celular y un correo de contacto","BanderoFull.png",true),
    new Stage(3,"Contraseña","Por seguridad en tu cuenta; Tu contraseña sera encriptada","CandadoFull.png",true),
    new Stage(4,"Contacto","Te enviaremos un mensaje con un código de validación","correoFull.png",true),
    new Stage(5,"Contacto","Te enviaremos un mensaje con un código de validación","correoFull.png",true)];

/**Carga de ciudades desde api*/
function getCiudades()
{
   var url="http://hermesapi2018.azurewebsites.net/api/Ciudad/Listado";

   
   /**Instancio y configuro solicitud al Api-rest*/
   var http=new XMLHttpRequest();
   http.open("POST", url, true);
   http.setRequestHeader('Content-Type',"application/x-www-form-urlencoded");
   http.addEventListener('load',show,false);
   /**Envío el solicitud vacia*/
   http.send(null);
   /**
   * Veficamos la respuesta recibida, y llamamos el metodo
   * Define que hacer con los datos recibidos, tras el envio del fromulario       
  */
   function show()
   {
    try 
    {
        //Base de datos
        /**Convierte respuesta en objeto JSON*/
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
        /**Indica la carga correcta de las ciudade*/
         _CIUDADES_CARGADAS=true;
    } catch ( e ) {}
   }
}
function recuperarClave()
{   
    //bool : comprobar si el campo email no esta vacio 
    var t1=$('#inputEmail').val().length>0;
    //bool : comprobar si el error de email esta visible 
    var  t2=$('#error-popover-correo')[0].style.display=='none';
    
    if(t1)
    {
        if(t2)
        {
            $.showLoading();
            /**jhordy: Codigo ejemplo 
             * Implementar aqui llamado a Api-rest 'actualizacion de clave'
             * {idUsuario:1,clave:*****}
            */
            setTimeout(
                function(e)
                {
                    $.hideLoading();
                    $('#launcher')[0].click();
                },3000); 
            /**jhordy: Codigo ejemplo */
        }
    }
}
/**Envia codigo de recuperacion de clave*/     //Falta implentacion del Api
function enviarClave()
{
    //bool: comprueba longitud minima de 3 caracteres
    var test=$('#clave').val().length>3;
   
    if(test)
    {
    $.showLoading();
     /**jhordy: Codigo ejemplo 
     * Implementar aqui llamado a Api-rest 'Envio de correo electronico con pin de recuperacion'
     */
    setTimeout(
        function(e)
        {
            $.hideLoading();
            $('#dismiss')[0].click();
            location.href=location.href.replace('recuperar-clave.html','nueva-clave.html');             
        },300);
    /**jhordy: Codigo ejemplo */
    }else alert('codigo inválido');//remplazar por pop-up de diseño    
}
function departamentos()
{
    /**Instancio y configuro y envio solicitud al Api-rest*/
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
   /**Instancio, configuro y envio solicitud al Api-rest
    * para cargar las ciudades de una departamento especifico 
   */
    var popup=new XMLHttpRequest();
    var url_popup='http://123seller.azurewebsites.net/tools/municipio_select/';
    popup.open("POST", url_popup, true);
    popup.addEventListener('load',show,false);
    data= new FormData();
    data.append("dept",id);
    popup.send(data);
    function show()
    { $('#ciudad').html(popup.response);}
}                                     