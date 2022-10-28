const db=require('../config/connection')
const { ObjectId} = require("mongodb");
const Mycollection=require('../config/collections');
const { Category_Colloctions } = require('../config/collections');
const collections = require('../config/collections');

module.exports={
    addCategory:(category)=>{
        return new Promise((resolve,reject)=>{
        db.get().collection(Mycollection.Category_Colloctions).insertOne(category).then((response)=>{
resolve(response)
        })
        })
           },
viewCategory:()=>{
return new Promise (async(resolve,reject)=>{
    let Category= await db.get().collection(Mycollection.Category_Colloctions).find().toArray()
    resolve(Category)
})
    },
    deleteCategory:(categoryID)=>{
        console.log(categoryID);
        return new Promise((resolve,reject)=>{
db.get().collection(collections.Category_Colloctions).deleteOne({ _id: ObjectId(categoryID)}).then((response)=>{
    resolve(response)
})

        })
    },
 categoryProduct:(catname)=>{
    db.get().collection(Mycollection.Product_Colloctions).find({proCategory:catname.category}).then((response)=>{
        resolve(response)
    }).catch((err)=>{
reject(err)
    })
 },
 showCategoryProducts:(catID)=>{
db.get().collection(Mycollection.Product_Colloctions).find({proCategoryID:ObjectId(catID)})


 },
 
productCatogerize:(catName)=>{
    return new Promise(async(resolve,reject)=>{
  let catProducts= await db.get().collection(Mycollection.Product_Colloctions).find({proCategory:catName,isDeleted:false}).toArray()   
  if(catProducts){
    resolve(catProducts)
  }else{
    reject()
  }
  
    })


}




}