const db = require("../config/connection");
const { ObjectId } = require("mongodb");
const Mycollection = require("../config/collections");


module.exports = {
  addProducts: (ProductData) => {
    Product={
      
        proName: ProductData.proName,
        proPrice: parseInt(ProductData.proPrice),
        Quantity: parseInt(ProductData.Quantity),
        proDiscription: ProductData.proDiscription,
        proCategory: ProductData.proCategory,
        isDeleted:false
    
    }

    return new Promise((resolve, reject) => {
      db.get()
        .collection(Mycollection.Category_Colloctions)
        .findOne({ category: Product.proCategory })
        .then(async (catdata) => {
          Product.proCategoryID = catdata._id;
          let data = await db
            .get()
            .collection(Mycollection.Product_Colloctions)
            .insertOne(Product);
          resolve(data);
        });
    });
  },

  viewProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(Mycollection.Product_Colloctions)
        .find()
        .toArray();
      resolve(products);
    }); 
  },

  deleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(Mycollection.Product_Colloctions)
        .deleteOne({ _id: ObjectId(proId) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  editProducts: (proId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(Mycollection.Product_Colloctions)
        .findOne({ _id: ObjectId(proId) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  upodateProducts: (id, updateData) => {
    
    return new Promise((resolve, reject) => {
      db.get()
        .collection(Mycollection.Category_Colloctions)
        .findOne({ category: updateData.proCategory })
        .then(async (catdata) => {
        //   updateData.proCategoryID = catdata._id;
          let response = await db
            .get()
            .collection(Mycollection.Product_Colloctions)
            .updateOne(
              { _id: ObjectId(id) },
              {
                $set: {
                  proName: updateData.proName,
                  proDiscription: updateData.proDiscription,
                  proCategory: updateData.proCategory,
                  proPrice: parseInt(updateData.proPrice),
                  Quantity: parseInt(updateData.Quantity),
                  proCategoryID:catdata._id
                },
              }
            );
          resolve(response);
        });
    });
  },
  viewProduct: (Proid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(Mycollection.Product_Colloctions)
        .findOne({ _id: ObjectId(Proid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  softdelete:(id)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.Product_Colloctions).updateOne({_id:ObjectId(id)},
      {
        $set:{isDeleted:true}
      }).then((resp)=>{
        resolve(resp)
      }).catch((err)=>{
        reject(err)
      })
    })
  },
  deletefalse:(id)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.Product_Colloctions).updateOne({_id:ObjectId(id)},
      {
        $set:{isDeleted:false}
      }).then((resp)=>{
        resolve(resp)
      }).catch((err)=>{
        reject(err)
      })
    })
  },
  IndexProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(Mycollection.Product_Colloctions)
        .find({isDeleted:false})
        .toArray();
      resolve(products);
    }); 
  }






};
