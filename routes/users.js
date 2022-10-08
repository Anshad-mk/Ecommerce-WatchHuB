var express = require('express');
const cartHelpers = require('../helpers/cart-helpers');
var router = express.Router();
const productHelpers=require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
let cartcount = 0
const userVerrify=(req,res,next)=>{
  let cartcount = 0
  if(req.session.user){
    next()
  }else{
    res.redirect('/users/login')
  }
}



const serverSID = 'VA1ba1c2ccf59eab6cd1ce93da4430a493'
const accountSID = 'ACc7ba82acea39bd6937724171a36aaffb'
const authtoken = '2d92805a2add53481c1654d007bcf1df'
const client = require('twilio')(accountSID, authtoken)


router.get('/login', function(req, res, next) {
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render("userlogin");
  }
  
});

router.get('/register', function(req, res, next) {
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render("register");
  }
  
});


router.post('/register',(req, res, next)=>{
userHelpers.userLogin(req.body).then((excist)=>{
  if(excist){
    res.render('register',{err:"email ID alredy existing !! Try login"})
  }
}).catch((err)=>{
  
    if(req.body.password!=req.body.repassword){
      res.render('register',{err:"password not match"})
  
    }else{
      userHelpers.userRegister(req.body).then((data)=>{
        console.log(req.body)
          res.redirect('/users/login')
      })
    
  }
})

  
});

router.post('/login',(req,res,next)=>{
userHelpers.userLogin(req.body).then((response)=>{
  if(response.status){
    req.session.loggedIn=true
    req.session.userName=response.firstName
    req.session.user=response.email
    req.session.userID=response._id
    console.log(response._id);
    console.log('login successfully')
    res.redirect('/')
  }
  
}).catch((err)=>{

  res.render('userlogin',{err})
   console.log(err);
  
})
})

router.get('/logout',(req,res,next)=>{
  req.session.loggedIn=false
  req.session.destroy()

  res.redirect('/')
})



router.get('/login-otp', (req, res) => {
res.render('login-otp')

})

router.post('/login-otp', (req, res) => {
console.log(req.body.phone);
client.verify
     .services(serverSID)
     .verifications.create({
       to: `+91${req.body.phone}`,
       channel: 'sms'
     }).then(data => {
      res.render('login-otp',req.body.phone)
       
     })
     .catch(err => {
       console.log(err);
     })
res.render('login-otp',{phone:req.body.phone})

})

router.post('/login-otpverification',(req,res,next)=>{
  const { otp, phone } = req.body
  console.log(otp,phone);
  client.verify.services(serverSID).verificationChecks.create({ to: `+91${phone}`, code: otp })
    .then((resp) => {
      console.log(req.body.phone);
      if (!resp.valid) {
        res.render('login-otp',{err:"Wrong OTP"})
      } else {
    req.session.loggedIn=true
    req.session.userName=resp.to
    req.session.user=resp.to
    console.log(resp);
    console.log('login successfully')
    res.redirect('/')
}
    }).catch(err => {
      console.log(err);
    })
})

router.get('/addToCart/:id',(req,res,next)=>{
if(req.session.loggedIn){
  cartHelpers.AddtoCart(req.params.id,req.session.userID).then((response)=>{
    if(req.session.user){
      res.json({status:true})
  }else{
    res.json({status:false})
  } 
  })
}else{
  res.redirect('/users/login')
}




})


router.get('/cart',userVerrify,async(req,res,next)=>{
  console.log(req.session.userID);
  Uname=req.session.userName;
  let products= await cartHelpers.viewCart(req.session.userID)
  let cartCount= await cartHelpers.getItemCount(req.session.userID)  
  let tottleCost=await cartHelpers.getCartTotal(req.session.userID)
   res.render('Cart',{products,Uname,cartCount,tottleCost});
})

router.post('/changeProQuantity',userVerrify,(req,res,next)=>{
  cartHelpers.ChangeProQuantity(req.body).then(async(response)=>{
    let tottleCost=await cartHelpers.getCartTotal(req.session.userID)
    if( tottleCost==null ||tottleCost=='' ||tottleCost.total<=0 ){
      response.tottleCost=0
      res.json(response)
    }else{
      response.tottleCost=tottleCost.total
    res.json(response)
    }
    
   

  })
})

router.post('/removeCartProduct',(req,res,next)=>{
  cartHelpers.removeCartProduct(req.body).then((response)=>{
    
    res.json(response)
  })
})

router.post('/place-order',(req,res,next)=>{
  console.log(req.body );
  
})
router.get('/checkout',userVerrify,async(req,res,next)=>{
  // let count=await cartHelpers.getItemCount(req.session.userID)
  let Prototal=await cartHelpers.getCartTotal(req.session.userID)
  let products=await cartHelpers.viewCart(req.session.userID)
   if(Prototal&&products){
    total=Prototal.total;
    // let ProSum=[]
    // products.forEach((element) => { 
    //   let sum=element.quantity*element.product.proPrice
    //   ProSum.push(sum)
    // });
  
    res.render('Checkout',{total,products})
   } 
})

router.get('order',(req,res,next)=>{
  
})






module.exports = router;