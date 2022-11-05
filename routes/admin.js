const { Router } = require("express");
const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
const CategoryHelpers = require("../helpers/category-helpers");
const categoryHelpers = require("../helpers/category-helpers");
const adminHelpers = require("../helpers/admin-helpers");
const { response, render } = require("../app");

const { Db } = require("mongodb");
const { ObjectId} = require("mongodb");
const cartHelpers = require('../helpers/cart-helpers')







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
    res.redirect('/admin/dashboard')
  }).catch((err)=>{
    res.render("adminLogin", { admin: true,err });
  })
})


/* GET users listing. */
router.get("/",(req, res, next) =>{
  if(req.session.admin){
    res.redirect('/admin/manageusers')
  }else{
    res.render("adminLogin", { admin: true});
  }
  
});

router.get("/addproduct",loginVerrify, function (req, res, next) {
  categoryHelpers.viewCategory().then((response)=>{
    // console.log(response);
    res.render("addProduct", {admin:true ,response});
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
      res.redirect("/admin/addproduct");
    })
  })
  
  
})

router.get("/viewproducts",loginVerrify, (req, res, next) => {
  productHelpers.viewProducts().then((products) => {
    res.render("viewProduct", { admin: true, products });
// console.log(products);
  });
});

router.get("/manageusers",loginVerrify, (req, res, next) => {
  userHelpers.listusers().then((response) => {
    //  console.log(response.No);
    res.render("viewUsers", { admin: true, response});
  });
});


router.get("/categorymanage",loginVerrify, (req, res, next) => {
  categoryHelpers.viewCategory().then((response)=>{
    res.render('category',{ admin: true, response })
  })
});

router.post('/addcategory',(req,res,next)=>{
  // console.log(req.files.catImg);
  categoryHelpers.addCategory(req.body).then((response)=>{
    let id = ObjectId(response.insertedId).toString()
    let CatImage=req.files.catImg;
    CatImage.mv("./public/productIMG/" + id + ".jpg").then((response)=>{
      res.redirect('/admin/categorymanage')
    })
   
  })
})

router.get('/delete-Category/:id',(req,res,next)=>{
  // console.log(req.params.id);
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

router.get('/viewOrders',loginVerrify,(req,res,next)=>{
  adminHelpers.viewAllOrders().then((allOrders)=>{
    res.render('viewAllOrders',{allOrders,admin: true})
    
  }).catch((err)=>{
    res.render('viewAllOrders')
    console.log("Err");
  })
  
})

router.get('/dashboard',loginVerrify,(req,res,next)=>{
  
  res.render('dashbord',{admin: true})
})

router.get('/chartWeek',loginVerrify,(req,res,next)=>{
  adminHelpers.weekOrderCuount().then((value)=>{
    res.json(value)
  }).catch((err)=>{
    res.json(err)
  })
})

router.get('/chartMonth',loginVerrify,(req,res,next)=>{
  adminHelpers.MonthOrderCuount().then((value)=>{
    res.json(value)
  }).catch((err)=>{
    res.json(err)
  })
})

router.get('/chartYear',loginVerrify,(req,res,next)=>{
  adminHelpers.YearOrderCuount().then((value)=>{
    res.json(value)
  }).catch((err)=>{
    res.json(err)
  })
})

router.post('/change-status/:id',loginVerrify,(req,res,next)=>{
  
  adminHelpers.statusUpdate(req.params.id,req.body).then((value)=>{
    res.redirect('/admin/viewOrders')
  })
})

router.get('/orderdetails/:id',loginVerrify,async (req,res,next)=>{
  let orderdata =await cartHelpers.viewaOrderedData(req.params.id)
  if(orderdata){
     res.render('orderDeteails',{orderdata})
     
  }else{
    res.render('orderDeteails')
  }
 
})

router.get('/softdelete/:id',loginVerrify,(req,res,next)=>{
  productHelpers.softdelete(req.params.id).then((response)=>{
    res.json(true)
  })
})

router.get('/softfalse/:id',loginVerrify,(req,res,next)=>{
  productHelpers.deletefalse(req.params.id).then((response)=>{
    res.json(true)
  })

})

router.post('/addBanner',(req,res,next)=>{
// console.log(req.body);
adminHelpers.addBanner(req.body).then((response)=>{
  imageName=response.insertedId
  let Image=req.files.bannerimg;
  Image.mv("./public/productIMG/" + imageName + ".png").then((data)=>{
    res.redirect('/admin/addBanner')
  })


  })
  


})

router.get('/addBanner',(req,res,next)=>{
adminHelpers.BannerManage().then((response)=>{
  res.render('BannerManage',{response})
  // console.log(response);
}).catch((err)=>{
  console.log(err);
  res.render('BannerManage')
})


})

router.post('/offer',(req,res,next)=>{
  
  adminHelpers.categoryOffer(req.body).then((response)=>{
    
    response.status=true
    res.json(response)
  })
})

router.get('/coupon',(req,res,next)=>{
  adminHelpers.displayCoupon().then((response)=>{
    res.render('admin/addcupon',{response})
  })
  
})
router.post('/coupon',(req,res,next)=>{
  adminHelpers.addcupon(req.body).then((resp)=>{
    res.redirect('/admin/coupon')
  })
})


 


module.exports = router;
