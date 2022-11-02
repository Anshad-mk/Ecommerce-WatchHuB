const express = require('express');
const cartHelpers = require('../helpers/cart-helpers');
const router = express.Router();
const productHelpers=require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const paypal =require('paypal-rest-sdk');
const adminHelpers = require('../helpers/admin-helpers');
const { route } = require('.');
let cartcount = 0


const userVerrify=(req,res,next)=>{
  let cartcount = 0
  if(req.session.user){
    next()
  }else{
    res.redirect('/users/login')
  }
}

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ASVAT4RqsGB4WwcfuVT2NpKbt0seSFXUW3ic6R5K0oevO6WKB0XoYeWBiwXA75DRi0HvBH_XBQd94qZb',
  'client_secret': 'EIMTcJPFzbVjm4KbQ5PmWUMxjOR33Hhv96Lx2CQIL1uJwMSbTJMWr30oO1VCvzr4XQcQhkdTTb0xrJqW'
});


// otp login
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
  let user ={
    firstName:req.body.firstName,
    LastName:req.body.LastName,
    email:req.body.email.toLowerCase(),
    password:req.body.password,
    repassword:req.body.repassword
  }
userHelpers.userLogin(user).then((excist)=>{
  if(excist){
    res.render('register',{err:"email ID alredy existing !! Try login"})
  }
}).catch((err)=>{
  
    if(req.body.password!=req.body.repassword){
      res.render('register',{err:"password not match"})
  
    }else{
      userHelpers.userRegister(user).then((data)=>{
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
// console.log(req.body.phone);
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
  // console.log(otp,phone);
  client.verify.services(serverSID).verificationChecks.create({ to: `+91${phone}`, code: otp })
    .then((resp) => {
      // console.log(req.body.phone);
      if (!resp.valid) {
        res.render('login-otp',{err:"Wrong OTP"})
      } else {
    req.session.loggedIn=true
    req.session.userName=resp.to
    req.session.user=resp.to
    // console.log(resp);
    console.log('login successfully')
    res.redirect('/')
}
    }).catch(err => {
      console.log(err);
    })
})

router.get('/cart',userVerrify,async(req,res,next)=>{
  // console.log(req.session.userID);
  Uname=req.session.userName;
  let products= await cartHelpers.viewCart(req.session.userID)
  let cartCount= await cartHelpers.getItemCount(req.session.userID)  
  let tottleCost=await cartHelpers.getCartTotal(req.session.userID)
   res.render('Cart',{products,Uname,cartCount,tottleCost});
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


router.get('/checkout',userVerrify,async(req,res,next)=>{
  // let count=await cartHelpers.getItemCount(req.session.userID)
  let Prototal=await cartHelpers.getCartTotal(req.session.userID)
  let products=await cartHelpers.viewCart(req.session.userID)
  let savedAddress=await userHelpers.findAddress(req.session.userID)
  if(savedAddress){
    if(Prototal&&products){
      total=Prototal.total;   
      // console.log("savedAddress",savedAddress); 
      res.render('Checkout',{Uname:req.session.userName,total,products,user:req.session.userID,savedAddress})
     } else{
      if(Prototal&&products){
        total=Prototal.total;
        // console.log(products);
              
        res.render('Checkout',{Uname:req.session.userName,total,products,user:req.session.userID})
       } 
     }
  }else{
    if(Prototal&&products){
      total=Prototal.total;   
      // console.log("savedAddress",savedAddress); 
      res.render('Checkout',{Uname:req.session.userName,total,products,user:req.session.userID,savedAddress})
     } else{
      if(Prototal&&products){
        total=Prototal.total;
        // console.log(products);
              
        res.render('Checkout',{total,products,user:req.session.userID})
       } 
     }

  }
   
})

router.post('/place-order',userVerrify,async(req,res,next)=>{
  let products = await cartHelpers.cartproductslist(req.session.userID)
  let totalPrice= await cartHelpers.getCartTotal(req.session.userID)
//  console.log(req.body);
  cartHelpers.PlaceOrder(req.body,products,totalPrice).then((OrderID)=>{
    console.log(req.body,products,totalPrice);
    if(req.body['paymentMethod']==='COD'){
    res.json({COD_Success:true})
    } else if (req.body['paymentMethod']==='PayPal'){
userHelpers.changeOrderStatus(OrderID.insertedId).then((response)=>{
  // console.log(OrderID.insertedId,"hiii odid");
  {response.paypal = true}
  res.json(response)
})
    } else if(req.body['paymentMethod']==='razorpay'){

userHelpers.generateRazorpay(OrderID.insertedId,totalPrice).then((response)=>{
  
  response.Razorpay=true
res.json(response)
}).catch((err)=>{
  res.json(err)
})


    }else if(req.body['paymentMethod']==='razorpay'){
userHelpers.generatePaypal(OrderID.insertedId,totalPrice).then(()=>{

})

    }

  })

  
})

router.get('/ordersuccess',userVerrify,(req,res,next)=>{
  res.render('CartSuccessFull',{Uname:req.session.userName})
})

router.get('/profile',userVerrify,async(req,res,next)=>{
  let profileData =await userHelpers.getUserDetails(req.session.userID)
  let address=await userHelpers.findAddress(req.session.userID)
  // console.log(profileData,address);
  if(address){
    
    res.render('profile',{profileData,Uname:req.session.userName,address})
  }else{
     res.render('profile',{profileData,Uname:req.session.userName})
  }
 
 
})

router.post('/Profile',userVerrify,(req,res,next)=>{
userHelpers.UpdateUser(req.session.userID,req.body).then((response)=>{
    res.json(response)
    
  })
})

router.get('/address',userVerrify,(req,res,next)=>{
  res.render('address',{Uname:req.session.userName})
})

router.post('/address',userVerrify,async (req,res,next)=>{
  let proExist= await userHelpers.findAddress(req.session.userID)
  if(proExist){
    userHelpers.addNewAddress(req.session.userID,req.body).then((response)=>{
      // console.log(response);
      res.redirect('/users/Profile')
    })
  }else{
userHelpers.addAddress(req.session.userID,req.body).then((response)=>{
  // console.log(response);
    res.redirect('/users/Profile')
  })
  }
  
})
router.get('/viewOrder',userVerrify,(req,res,next)=>{
  userHelpers.viewOrders(req.session.userID).then((response)=>{    
    res.render('viewOrder',{response,Uname:req.session.userName})
  }).catch((err)=>{
    res.render('viewOrder',{Uname:req.session.userName})
  })
  
})

router.get('/cancel_Order/:id',userVerrify,async(req,res,next)=>{  
  // console.log(req.params.id);
let response = await userHelpers.cancelOrder(req.params.id)
if(response){
  res.json(response)
}
})

router.get('/orderdetails/:id',userVerrify,async (req,res,next)=>{
  let orderdata =await cartHelpers.viewaOrderedData(req.params.id)
  if(orderdata){
     res.render('orderDeteails',{Uname:req.session.userName,orderdata})
    //  console.log(orderdata);
  }else{
    res.render('orderDeteails',{Uname:req.session.userName,})
  }
 
})



router.post('/verify-payment',(req,res)=>{
  userHelpers.verifyPayment(req.body).then((response)=>{
   
userHelpers.changeOrderStatus(req.body['order[receipt]']).then(()=>{
  res.json({status:true})
}).catch((err)=>{
  res.json({status:false,errMsg:''})
})

  })
 
})

router.get('/deleteAddress',userVerrify,(req,res,next)=>{
  userHelpers.deleteAddress(req.query.date,req.query.UserID).then((response)=>{
 res.json(response)

 })


})

router.get('/EditAddress/:index',userVerrify,(req,res,next)=>{
  userHelpers.EditAddress(req.session.userID,req.params.index).then((response)=>{
    res.render('address',{Uname:req.session.userName,response})
    // console.log(response);
  })

})

router.post('/UpdateAddress',userVerrify,(req,res,next)=>{
  userHelpers.updateAddress(req.body,req.session.userID).then((response)=>{
res.redirect('/users/Profile')
  })
})

router.get('/wishlist',userVerrify,(req,res,next)=>{
userHelpers.viewwishlist(req.session.userID).then((response)=>{
  console.log(response);
  res.render('wishlist',{Uname:req.session.userName,response})
  
}).catch((err)=>{
  console.log(err);
})

  
})

router.get('/addTowish/:id',userVerrify,(req,res,next)=>{
  // console.log(req.params.id,req.session.userID);
 userHelpers.addtowish(req.params.id,req.session.userID).then((response)=>{
  response.status=true
  res.json(response)

 }).catch((err)=>{
  res.json(err)
 })
})

router.get('/remove/:id',userVerrify,(req,res,next)=>{
  userHelpers.removewish(req.params.id,req.session.userID).then((response)=>{
    response.status=true
    res.json(response)
  })
})










module.exports = router;
