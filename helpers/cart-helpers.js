const db = require("../config/connection");
const { ObjectId } = require("mongodb");
const Mycollection = require("../config/collections");
const { Category_Colloctions } = require("../config/collections");
const collections = require("../config/collections");

module.exports = {
  AddtoCart: (proId, userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        let proObj = {
          item: ObjectId(proId),
          quantity: 1,
        };

        let userCart = await db
          .get()
          .collection(Mycollection.Cart_Colloctions)
          .findOne({ user: ObjectId(userId) });
        if (userCart) {
          let proExist = userCart.products.findIndex(
            (products) => products.item == proId
          );
          if (proExist != -1) {
            // console.log("Ex");
            db.get()
              .collection(Mycollection.Cart_Colloctions)
              .updateOne(
                { user: ObjectId(userId), "products.item": ObjectId(proId) },
                { $inc: { "products.$.quantity": 1 } }
              )
              .then(() => {
                resolve();
              });
          } else {
            db.get()
              .collection(Mycollection.Cart_Colloctions)
              .updateOne(
                { user: ObjectId(userId) },
                {
                  $push: { products: proObj },
                }
              )
              .then((response) => {
                resolve();
              });
          }
        } else {
          let cartObj = {
            user: ObjectId(userId),
            products: [proObj],
          };

          db.get()
            .collection(Mycollection.Cart_Colloctions)
            .insertOne(cartObj)
            .then((response) => {
              resolve();
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  viewCart: (userID) => {
    return new Promise(async (resolve, reject) => {
      let CartItems = await db
        .get()
        .collection(Mycollection.Cart_Colloctions)
        .aggregate([
          {
            $match: { user: ObjectId(userID) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: Mycollection.Product_Colloctions,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      console.log(CartItems);
      resolve(CartItems);
    });
  },

  getItemCount: (userID) => {
    try {
      return new Promise(async (resolve, reject) => {
        let count = 0;
        let cart = await db
          .get()
          .collection(Mycollection.Cart_Colloctions)
          .findOne({ user: ObjectId(userID) });
        if (cart != null || cart == true) {
          count = cart.products.length;
          resolve(count);
        } else {
          count = 0;
          resolve(count);
        }
      });
    } catch (error) {
      resolve(count);
    }
  },
  ChangeProQuantity: (items) => {
    let { cartID, ProID, count, ProQuantity } = items;
    count = parseInt(count);
    ProQuantity = parseInt(ProQuantity);
    return new Promise((resolve, reject) => {
      if (count == -1 && ProQuantity == 1) {
        db.get()
          .collection(Mycollection.Cart_Colloctions)
          .updateOne(
            { _id: ObjectId(cartID) },
            {
              $pull: { products: { item: ObjectId(ProID) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(Mycollection.Cart_Colloctions)
          .updateOne(
            { _id: ObjectId(cartID), "products.item": ObjectId(ProID) },
            { $inc: { "products.$.quantity": count } }
          )
          .then((response) => {
            response.status=true
            resolve(response);
          });
      }
    });
  },
  removeCartProduct: (cartproduct) => {
    let { cartID, ProID } = cartproduct
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.Cart_Colloctions).updateOne({ _id: ObjectId(cartID) },
        {
          $pull: { products: { item: ObjectId(ProID) } },
        }

      ).then((response) => {
        resolve({ProRemove:true})
      })
    })
  },

  getCartTotal: (userID) => {
    return new Promise(async (resolve, reject) => {
      let CartTotal = await db
        .get()
        .collection(Mycollection.Cart_Colloctions)
        .aggregate([
          {
            $match: { user: ObjectId(userID) },
          },
          {
            $unwind: "$products",
            },
            {
              $project:{
                item:'$products.item',
                quantity:'$products.quantity'
              }
            },
            {
              $lookup:{
                from:Mycollection.Product_Colloctions,
                localField:"item",
                foreignField:"_id",
                as:"product"
              }
            },
            {
              $project: {
                item: 1,
                quantity: 1,
                product: { $arrayElemAt: ["$product", 0] },
              },
          },
          {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity','$product.proPrice']}}
            }
          },

        ]).toArray()
        resolve(CartTotal[0]);
    })
    
  },

ProcessCheckout:(order,userID)=>{
db.get().collection(Mycollection.orders_Colloction).insertOne({order})

}
  


};
