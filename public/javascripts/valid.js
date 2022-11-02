function validatename() {
    let name_err = document.getElementById('username-error')
    let name = document.getElementById('username').value;

    if (name.length == 0 || name == '') {
        name_err.innerHTML = "Name cannot be empty";
        return false;
    }

    if (!name.match(/^[A-Za-z]*\s{0,1}?[A-Za-z]*\s{0,1}?[A-Za-z]*$/)) {
        name_err.innerHTML = "Write Proper name";
        return false;
    }

    if (name.length <= 3 || name.length >= 25) {
        name_err.innerHTML = "Name must be between 3 and 25 characters";
        return false;
    }

    name_err.innerHTML = ""
    return true;
}


function validateEmail() {
    let email = document.getElementById('email').value
    let email_err = document.getElementById('emailid-err')

    if (email.length == 0 || email == '') {
        email_err.innerHTML = 'Email cannot be empty'
        return false;
    }

    if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        email_err.innerHTML = "Enter valid Email ID";
        return false;
    }

    email_err.innerHTML = ''
    return true;
}

function validatemobile() {
    let mob = document.getElementById('mobilenumber').value
    let mob_err = document.getElementById('mobilenumber-err')

    if (mob.length != 10) {
        mob_err.innerHTML = 'Enter Proper Number'
        return false;
    }

    mob_err.innerHTML = ''
    return true;
}

function validatepassword() {
    let password = document.getElementById('password').value
    let password_err = document.getElementById('password-err')

    if (password.length == 0 || password.length <= 2) {
        password_err.innerHTML = 'Enter valid password'
        return false;
    }
    password_err.innerHTML = ''
    return true;

}

function validateForm1() {
    if (!validatepassword() || !validatemobile() || !validateEmail() || !validatename()) {
        document.getElementById('valideee').innerHTML = 'Fill All data'
        return false;
    }
    return true;
}

function updatedata() {
    if (!validatemobile() || !validateEmail() || !validatename()) {
        return false;
    }
    return true;
}
function pwcheck() {
    if (!validatepassword()) {
        document.getElementById('pwErr').innerHTML = 'Enter currect data'
        return false;
    }
    return true;
}


function checkAddress() {
    let street = document.getElementById('street').value
    let streetErr = document.getElementById('streetErr')
    if (street.length <= 3 || street == '') {
        streetErr.innerHTML = 'Enter valid details'
        return false;
    }
    streetErr.innerHTML = ''
    return true;
}

function checktown(){
    let street = document.getElementById('town').value
    let streetErr = document.getElementById('townErr')
    if (street.length <= 3 || street == '') {
        streetErr.innerHTML = 'Enter valid details'
        return false;
    }
    streetErr.innerHTML = ''
    return true;
}

function country() {
    let street = document.getElementById('country').value
    let countryErr = document.getElementById('countryErr')
    if (street.length <= 3 || street == '') {
        countryErr.innerHTML = 'Enter valid details'
        return false;
    }
    countryErr.innerHTML = ''
    return true;
}

function checkpin() {
    let street = document.getElementById('pin').value
    let pinErr = document.getElementById('pinErr')
    if (street.length <= 3 || street == '') {
        pinErr.innerHTML = 'Enter valid details'
        return false;
    }
    pinErr.innerHTML = ''
    return true;
}

function saveadd(){
    if (!validatename() || !checkAddress() || !checktown() || !country() || !checkpin() ) {
        document.getElementById('formErr').innerHTML = 'Fill All data'
        return false;
    }else{
       return true; 
    }
    
}


function checkAddresstwo() {
    let street = document.getElementById('address').value
    let addressErr = document.getElementById('addressErr')
    if (street == '' || street.length <= 3) {
        addressErr.innerHTML = 'Enter valid details'
        return false;
    }
    addressErr.innerHTML = ''
    return true;
}


function validateOrderForm() {
    if (!checkAddress() || !checkAddresstwo() || !country() || !checkpin() || !validateEmail() || !validatemobile()) {
        document.getElementById('formErr').innerHTML = 'Fill All data'
        return false;
    }
    return true;
}

function checkprDT() {
    if (!checkpin()) {
        document.getElementById('formErr').innerHTML = 'Fill All data'
        return false
    }
    return true;
}
////////////////////////////////////////////////////////////////////

function validateProductName() {
    let name_err = document.getElementById('username-err')
    let name = document.getElementById('productname').value;

    if (name.length == 0 || name == '') {
        name_err.innerHTML = "Name cannot be empty";
        return false;
    }

    if (!name.match(/^[A-Za-z]*\s{0,1}?[A-Za-z]*\s{0,1}?[A-Za-z]*$/)) {
        name_err.innerHTML = "Write Proper name";
        return false;
    }

    if (name.length <= 3 || name.length >= 25) {
        name_err.innerHTML = "Name must be between 3 and 25 characters";
        return false;
    }

    name_err.innerHTML = ""
    return true;
}

function validatedesc() {
    let name_err = document.getElementById('desc-err')
    let name = document.getElementById('descrip').value;

    if (name.length == 0 || name == '') {
        name_err.innerHTML = "This field cannot be empty";
        return false;
    }


    name_err.innerHTML = " "
    return true;
}

function validatePrice(){
    let price = document.getElementById('price').value
    let error = document.getElementById('priceError')
    if(price.length<=0 || price.length =='' ){
        error.innerHTML = 'Enter proper Price'
        return false;
    }
    if(price<=1000){
        error.innerHTML = 'Enter amount more than 1000'
        return false;
    }
    error.innerHTML =''
    return true;
}

function validateStock(){
    let price = document.getElementById('stock').value
    let error = document.getElementById('stockError')
    if(price.length<=0 || price.length =='' ){
        error.innerHTML = 'Enter proper stock'
        return false;
    }
    
    error.innerHTML =''
    return true;
}

function validateForm() {
    if (!validateProductName() || !validatedesc() || !validatePrice() || !validateStock()) {
        document.getElementById('proAddErr').innerHTML = 'Fill All data'
        return false
    }
    return true;
}


function validatelogin(){
    if (!validateEmail() || !validatepassword()) {
        document.getElementById('valideee').innerHTML = 'Fill All data'
        return false
    }
    return true;
}

function validateOTP(){
    if(!validatemobile()){
        document.getElementById('otpvalid').innerHTML = 'Fill the Number'
        return false
    }
    return true;
}