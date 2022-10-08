const db = require("../config/connection");
const { ObjectId } = require("mongodb");
const Mycollection = require("../config/collections");
const { response } = require("../app");

module.exports = {
  addProducts: (Product) => {
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
                  proPrice: updateData.proPrice,
                  Quantity: updateData.Quantity,
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
};
