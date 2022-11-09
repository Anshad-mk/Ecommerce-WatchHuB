const db = require("../config/connection");
const { ObjectId, Timestamp } = require("mongodb");
const Mycollection = require("../config/collections");
const { Category_Colloctions } = require("../config/collections");
const collections = require("../config/collections");
const moment = require('moment');

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
        .aggregate(
          [
            {
              '$match': {
                'user': ObjectId(userID)
              }
            }, {
              '$unwind': '$products'
            }, {
              '$project': {
                'item': '$products.item',
                'quantity': '$products.quantity'
              }
            }, {
              '$lookup': {
                'from': Mycollection.Product_Colloctions,
                'localField': 'item',
                'foreignField': '_id',
                'as': 'product'
              }
            }, {
              '$project': {
                'item': 1,
                'quantity': 1,
                'product': {
                  '$arrayElemAt': [
                    '$product', 0
                  ]
                }
              }
            },
          ]
          )
        .toArray();
      
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
            response.status = true
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
        resolve({ ProRemove: true })
      })
    })
  },

  getCartTotal: (userID) => {
    return new Promise(async (resolve, reject) => {
      let offerlessTotal = await db
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
              item: '$products.item',
              quantity: '$products.quantity'
            }
          },
          {
            $lookup: {
              from: Mycollection.Product_Colloctions,
              localField: "item",
              foreignField: "_id",
              as: "product"
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
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$quantity', '$product.offerPrice'] } }
            }
          },

        ]).toArray()
        // console.log(offerlessTotal[0]);
      resolve(offerlessTotal[0]);
    })

  },
  getTotal:(userID)=>{
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
            $project: {
              item: '$products.item',
              quantity: '$products.quantity'
            }
          },
          {
            $lookup: {
              from: Mycollection.Product_Colloctions,
              localField: "item",
              foreignField: "_id",
              as: "product"
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
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$quantity', '$product.proPrice'] } }
            }
          },

        ]).toArray()
        // console.log(CartTotal[0]);
      resolve(CartTotal[0]);
    })

  },




  PlaceOrder: (Orderdata, products, total) => {
    return new Promise((resolve, reject) => {

      let createdAt = new Date().toString()

      UTCTime = new Date()
      const time = UTCTime.toTimeString().split('G')[0]

      var month = UTCTime.getUTCMonth() + 1; //months from 1-12
      var day = UTCTime.getUTCDate();
      var year = UTCTime.getUTCFullYear();

      let newdate = day + "-" + month + "-" + year + " " + time;
      let status = Orderdata.paymentMethod === 'COD' ? 'Placed' : 'Pending'

      let orderOBJ = {
        DeliveryAddress: {
          Name: Orderdata.FirstName,
          Address: Orderdata.Address,
          Post: Orderdata.Post,
          Zip: Orderdata.ZipCode,
          State: Orderdata.State,
          Phone: Orderdata.Phone,
          },
        userID: ObjectId(Orderdata.userID),
        TotelAmound: total,
        Date: newdate.slice(0, 10),
        createdAt: createdAt,
        date: new Date(),
        paymentMethod: Orderdata.paymentMethod,
        products: products,
        status: status,
        orderCancel: false,
        Timestamp: true,
        orderCash:{
          OriginalPrice:Orderdata.Total_Amount,
          OfferPersentage:Orderdata.Percentage,
          OfferAmount:Orderdata.OfferAmount,
          UsedCoupen:Orderdata.CoupenCode,
          CoupenAmount:Orderdata.CoupenValue,
          PayableAmount:Orderdata.PayableAmount
        }
      }
      db.get().collection(Mycollection.orders_Colloction).insertOne(orderOBJ).then((response) => {
        db.get().collection(Mycollection.user_Collections).updateOne({_id:ObjectId(Orderdata.userID)},{

          $push:{
            UsedCoupen:Orderdata.CoupenCode
          }
        })
        db.get().collection(Mycollection.Cart_Colloctions).deleteOne({ user: ObjectId(Orderdata.userID) })
        resolve(response)
        
      })

    })






  },
  cartproductslist: (userID) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db.get().collection(Mycollection.Cart_Colloctions).findOne({ user: ObjectId(userID) })
      if (cart) {
        resolve(cart.products)
      }

    })
  },

  viewaOrderedData: (orderID) => {
    return new Promise(async (resolve, reject) => {
      let orderItem = await db.get().collection(Mycollection.orders_Colloction).aggregate([
        {
          $match: { _id: ObjectId(orderID) }
        },
        {
          $unwind: '$products'
        },
        {
          $lookup: {
            from: Mycollection.Product_Colloctions,
            localField: 'products.item',
            foreignField: '_id',
            as: 'items'
          }
        },
        {
          $unwind: '$items'
        }

      ]).toArray()

      if (orderItem) {
        resolve(orderItem)
      } else {
        reject()
      }

    })



  },
  checkoutdata:(cartData,proID)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.Cart_Colloctions).updateOne({user:ObjectId(proID)},
      {
        $set:{
          UsedCoupen:cartData.UsedCoupen,
          CoupenValue:parseInt(cartData.CoupenValue),
          TottelAmount:parseInt(cartData.TottelAmount),
          payableamount:parseInt(cartData.payableamount),
          CategoryOffer:parseInt(cartData.CategoryOffer),
          CategoryPersentage:parseInt(100*(cartData.TottelAmount - cartData.CategoryOffer) / cartData.TottelAmount),
        }
      }).then((response)=>{
        resolve(response)
      }).catch((err)=>{
        reject(err)
      })
      // console.log(cartData);
    })
  },
  cartdata:(userID)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.Cart_Colloctions).findOne({user:ObjectId(userID)}).then((result)=>{
        resolve(result)
      }).catch((err)=>{
        reject(err)
      })
    })
  }



};
