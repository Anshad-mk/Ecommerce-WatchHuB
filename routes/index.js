var express = require("express");
const { Db } = require("mongodb");
const { ObjectId} = require("mongodb");
const cartHelpers = require("../helpers/cart-helpers");
const categoryHelpers = require("../helpers/category-helpers");
var router = express.Router();
let productHelpers=require('../helpers/product-helpers')


/* GET home page. */
router.get("/", async(req, res, next)=> {
  if(req.session.user){
    let Uname=req.session.userName 
    let products= await productHelpers.viewProducts()
    let cat=await categoryHelpers.viewCategory()
    let cartCount =await cartHelpers.getItemCount(req.session.userID) 
    if(cartCount){
      res.render("index",{products,Uname,cat,cartCount})
    }else{
      res.render("index",{products,Uname,cat
      })
    }
        
  
  }else{
    const Uname=req.session.userName
    let products =await productHelpers.viewProducts()
      let cat=await categoryHelpers.viewCategory()
     res.render("index",{products,cat});
      
   
  }

  
});

router.get('/preview-product/:id',(req,res,next)=>{
  if(req.session.loggedIn){
    Uname=req.session.userName;
    productHelpers.viewProduct(req.params.id).then(async(resProduct)=>{
      let cartCount= await cartHelpers.getItemCount(req.session.userID)  
      res.render('product-preview',{resProduct,Uname,cartCount})      
 })
  }else{
    productHelpers.viewProduct(req.params.id).then((resProduct)=>{
      res.render('product-preview',{resProduct})      
 })
  }
    
  
})

router.get('/new',(req,res,next)=>{
  Uname=req.session.userName;
  res.render('index2',{Uname})
})

router.get('/catogarylisting/:id',(req,res,next)=>{
  Uname=req.session.userName;
    res.render('/',{Uname})
})

router.get('/listAllProducts',(req,res,next)=>{
  res.render('listProducts')
})




module.exports = router;
