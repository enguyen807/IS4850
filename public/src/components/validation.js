function validateForm()
{
    
    var name=document.myform.name.value;  
    var password=document.myform.password.value;  
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 
    
    if (name==null || name == " " || isNaN(name))
    {  
        alert("Name can't be blank and can't be numeric");  
        return false;  
    }
    else if(password.length<6)
    {  
        alert("Password must be at least 6 characters long.");  
        return false;  
    }
    
    
    
}


function matchpass(){  
var firstpassword=document.f1.password.value;  
var secondpassword=document.f1.password2.value;  
  
if(firstpassword==secondpassword){  
return true;  
}  
else{  
alert("password must be same!");  
return false;  
}  
}  


/* 
https://firebase.google.com/docs/storage/web/create-reference ****
http://www.w3resource.com/javascript/form/phone-no-validation.php
http://www.javatpoint.com/javascript-form-validation
https://javebratt.com/validate-forms-ionic-firebase/
https://firebase.google.com/docs/reference/security/database/#validate
https://firebase.google.com/docs/database/security/securing-data#validating_data
https://firebase.google.com/docs/database/web/start
https://firebase.google.com/docs/reference/js/firebase.User
https://code.tutsplus.com/tutorials/creating-a-web-app-from-scratch-using-angularjs-and-firebase-part-2--cms-22734
https://forums.asp.net/t/2105986.aspx?How+to+save+modal+popup+form+into+database+data+table
https://docs.microsoft.com/en-us/aspnet/web-pages/overview/ui-layouts-and-themes/4-working-with-forms
https://scotch.io/tutorials/angularjs-form-validation

*/