const { Router } = require("express");
var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
const CategoryHelpers = require("../helpers/category-helpers");
const categoryHelpers = require("../helpers/category-helpers");
const adminHelpers = require("../helpers/admin-helpers");
const { response } = require("../app");
var Handlebars = require('handlebars');
const { Db } = require("mongodb");
const { ObjectId} = require("mongodb");

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
  
});

const loginVerrify=(req,res,next)=>{
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin')
  }
}

// Admin login
router.post('/',(req,res,next)=>{
  adminHelpers.adminLogin(req.body).then((response)=>{
    req.session.admin=req.body.email
    req.session.admin=true
    res.redirect('/admin/manageusers')
  }).catch((err)=>{
    res.render("adminLogin", { admin: true,err });
  })
})


/* GET users listing. */
router.get("/",(req, res, next) =>{
  if(req.session.admin){
    res.redirect('/admin/manageusers')
  }else{
    res.render("adminLogin", { admin: true });
  }
  
});

router.get("/addproduct",loginVerrify, function (req, res, next) {
  categoryHelpers.viewCategory().then((response)=>{
    res.render("addProduct", { admin: true, response });
  })
  
});

router.post("/addproduct", function (req, res, next) {
  productHelpers.addProducts(req.body).then((data)=>{
    let id = ObjectId(data.insertedId).toString()
    let Image1 = req.files.image1;
    let Image2 = req.files.image2;
    let Image3 = req.files.image3;
    let Image4 = req.files.image4;

    Image1.mv("./public/productIMG/" + id + ".jpg");
    Image2.mv("./public/productIMG/" + id + "2.jpg");
    Image3.mv("./public/productIMG/" + id + "3.jpg");
    Image4.mv("./public/productIMG/" + id + "4.jpg").then((response)=>{
      res.redirect("/admin/addProduct");
    })
  })
  
  
})

router.get("/viewproducts",loginVerrify, (req, res, next) => {
  productHelpers.viewProducts().then((products) => {
    res.render("viewProduct", { admin: true, products });
console.log(products);
  });
});

router.get("/manageusers",loginVerrify, (req, res, next) => {
  userHelpers.listusers().then((response) => {
     console.log(response.No);
    res.render("viewUsers", { admin: true, response});
  });
});


router.get("/categorymanage",loginVerrify, (req, res, next) => {
  categoryHelpers.viewCategory().then((response)=>{
    res.render('category',{ admin: true, response })
  })
});

router.post('/addcategory',(req,res,next)=>{
  categoryHelpers.addCategory(req.body).then((response)=>{
    console.log(req.body);
    res.redirect('/admin/categorymanage')
  })
})

router.get('/delete-Category/:id',(req,res,next)=>{
  console.log(req.params.id);
categoryHelpers.deleteCategory(req.params.id).then((response)=>{
  res.redirect('/admin/categorymanage')
})
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
})

router.get('/delete_Product/:id',(req,res,next)=>{
  productHelpers.deleteProduct(req.params.id).then((response)=>{
    res.redirect('/admin/viewproducts')
  })
  
})
router.get('/block_user/:id',(req,res,next)=>{
  userHelpers.blockUser(req.params.id).then((response)=>{
    res.redirect('/admin/manageusers')
  })
})
router.get('/Unblock_user/:id',(req,res,next)=>{
  userHelpers.unblockUser(req.params.id).then((response)=>{
    res.redirect('/admin/manageusers')
  })
})

router.get('/edit_product/:id',(req,res,next)=>{
  productHelpers.editProducts(req.params.id).then((proDetiales)=>{
    CategoryHelpers.viewCategory().then((catdata)=>{
      res.render('editProduct',{ admin: true,proDetiales,catdata})
    })
    
  })
  
})

router.post('/edit_product/:id',(req,res, next)=>{
  let ImageNameID=req.params.id;
 productHelpers.upodateProducts(ImageNameID,req.body).then((response)=>{
  let Image1=req.files.image1;
  let Image2=req.files.image2;
  let Image3=req.files.image3;
  let Image4=req.files.image4;

 Image1.mv("./public/productIMG/" + ImageNameID + ".jpg")
 Image2.mv("./public/productIMG/" + ImageNameID + "2.jpg")
 Image3.mv("./public/productIMG/" + ImageNameID + "3.jpg")
 Image4.mv("./public/productIMG/" + ImageNameID + "4.jpg").then((response)=>{
  res.redirect("/admin/viewproducts");
 })

    
  })
})

router.get('/viewMore/:id',(req,res,next)=>{
  let id=req.params.id
  productHelpers.viewProduct(id).then((response)=>{
    res.json(response)
  }).catch((err)=>{
    console.log('errr');
  })
})


module.exports = router;
