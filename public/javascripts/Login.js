


function otpLoginOpen(){
    
    
    
if(document.getElementById('flexSwitchCheckDefault').checked==true){
    document.getElementById('otplog').style.display="none"
    const OTPBTN= document.getElementById('otpLabel')
    OTPBTN.className="btn btn-primary"
    OTPBTN.innerHTML="OTP LOGIN";
    document.getElementById('email').disabled=false
    document.getElementById('password').disabled=false
    const submit= document.getElementById('submit')
    submit.disabled=false
    submit.innerText="Log in"
}else{
    document.getElementById('otplog').style.display="block"
    const OTPBTN= document.getElementById('otpLabel')
    OTPBTN.innerHTML="Close OTP";
    OTPBTN.className="btn btn-primary mt-2"
    document.getElementById('email').disabled=true
    document.getElementById('password').disabled=true
    const submit= document.getElementById('submit')
    submit.disabled=true
    submit.innerText="CLOSE OTP FIRST"

    }


}


function otpwindow(){
     if(document.getElementById('pnumber').value==""){
document.getElementById('errnbr').innerHTML=`<p class="text-danger">Enter Number First</p>`
    }else{
        
        $("#exampleModal").modal("toggle");
       let phoneNumber = document.getElementById('pnumber')
       $.ajax({
        url:'/users/login-otp',
        method:'get',
        data:{name:phoneNumber.value},
        success:(response)=>{
            if (response.success==true) {
               console.log(response)
            }
        }
       })


      



      
}

}


// data-bs-toggle="modal"; data-bs-target="#exampleModal"




