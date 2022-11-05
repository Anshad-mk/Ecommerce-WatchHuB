const db = require("../config/connection");
const { ObjectId } = require("mongodb");
const Mycollection = require("../config/collections");
const collections = require("../config/collections");
const Razorpay = require('razorpay');
const bcrypt = require('bcrypt')


var instance = new Razorpay({
  key_id: 'rzp_test_3FXgnN9RmxDnjy',
  key_secret: 'wcywClX3z6jW6Cf207UPZepB',
});


module.exports = {
  userRegister: async (user) => {
    user.email = user.email.toLowerCase()
    user.blocked = false
    user.password = await bcrypt.hash(user.password, 10)
    user.repassword = user.password
    return new Promise((resolve, reject) => {
      db.get()
        .collection(Mycollection.user_Collections)
        .insertOne(user)
        .then((data) => {
          resolve(data);
        });
    });
  },
  userExist:(email)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.user_Collections).findOne({email:email}).then((exist)=>{
        resolve(exist)
      }).catch((err)=>{
        reject(err)
      })
    })
  },

  
  validreferal:(referal)=>{
return new Promise((resolve,reject)=>{
  db.get().collection(Mycollection.user_Collections).updateOne({referal:referal},
    {
      $push:{
        'Wallet.transactions':{
          msg:"credited By Referal",
          amount:Number(50)
        },
        
          
        

      },
      $inc:{
        'Wallet.Balance':Number(50)
      
      }
          }
        
  ).then((resp)=>{
    resolve(resp)
  }).catch((err)=>{
    reject(err)
  })
})
  },
  userLogin: (loguser) => {
    return new Promise(async (resolve, reject) => {
      const check = await db
        .get()
        .collection(Mycollection.user_Collections)
        .findOne({ email: loguser.email });
      const emailerr = "enter valid email id";
      const passerr = "enter valid password";
      const blockerr = "You are Blocked User !.  Please Contact us"
      if (check) {
        bcrypt.compare(loguser.password, check.password).then((response) => {
          if (response == true) {
            if (check.blocked) {
              console.log("in blocked")
              reject(blockerr)
            } else {
              console.log("true")
              check.status = true;
              resolve(check);
            }
          } else {
            console.log("reject");
            reject(passerr);
          }

        })

      } else {
        reject(emailerr);
      }
    });
  },

  listusers: () => {
    return new Promise(async (resolve, reject) => {
      let userlist = await db.get().collection(collections.user_Collections).find().toArray()
      resolve(userlist)
    })

  },
  blockUser: (userid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.user_Collections).updateOne({ _id: ObjectId(userid) }, { $set: { blocked: true } }).then((response) => {
        resolve(response)
      })
    })
  },
  unblockUser: (userid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.user_Collections).updateOne({ _id: ObjectId(userid) }, { $set: { blocked: false } }).then((response) => {
        resolve(response)
      })
    })
  },

  getUserDetails: (userID) => {
    return new Promise(async (resolve, reject) => {
      let userdetails = await db.get().collection(Mycollection.user_Collections).findOne({ _id: ObjectId(userID) })
      if (userdetails) {
        resolve(userdetails)
      }
    })

  },
  UpdateUser: (userID, userDetails) => {

    // console.log(userDetails);
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.user_Collections).updateOne({ _id: ObjectId(userID) }, { $set: userDetails }).then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
    })
  },


  addAddress: (userID, address) => {
    let uniqId = new Date()
    let addressObj = {
      user: ObjectId(userID),
      Address: [{
        uniqId: uniqId.toString(),
        Fname: address.FirstName,
        Lname: address.LastName,
        Address: address.Address,
        post: address.Post,
        pin: address.ZipCode,
        state: address.State,
        phone: address.Phone,
      }]

    }
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.address_Collection).insertOne(addressObj).then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  findAddress: (userID) => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.address_Collection).findOne({ user: ObjectId(userID) }).then((address) => {
        // console.log(address);
        resolve(address)
      }).catch((err) => {
        reject(err)
      })


    })
  },
  addNewAddress: (userId, address) => {

    let uniqId = new Date()

    let addNew = {
      uniqId: uniqId.toString(),
      Fname: address.FirstName,
      Lname: address.LastName,
      Address: address.Address,
      post: address.Post,
      pin: address.ZipCode,
      state: address.State,
      phone: address.Phone,

    }

    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.address_Collection).updateOne({ user: ObjectId(userId) }, {
        $push: { Address: addNew }
      }).then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
    })

  },
  viewOrders: (userID) => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.orders_Colloction).aggregate([
        {
          $match: {
            userID: ObjectId(userID)
          }

        },
        {
          $unwind: "$_id",
        },
        {
          $lookup: {
            from: Mycollection.Product_Colloctions,
            localField: 'products.item',
            foreignField: '_id',
            as: 'orders'
          }
        },
        {
          $project: {
            _id: 1,
            DeliveryAddress: 1,
            TotelAmound: 1,
            Date: 1,
            paymentMethod: 1,
            orders: 1,
            status: 1,
            products: 1,
            orderCancel: 1,

          }
        },
        {
          $sort: {
            date: -1
          }
        }

      ]).toArray().then((response) => {
        resolve(response)
        // console.log(response);

      }).catch((err) => {
        reject(err)
      })

    })

  },


  cancelOrder: (orderID) => {
    // console.log(orderID);
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.orders_Colloction).updateOne({ _id: ObjectId(orderID) }, {
        $set: {
          orderCancel: true,
          status: "Order Canceled"
        }
      }).then((response) => {
        resolve(true)


      }).catch((err) => {

        reject(false)

      })
    })

  },

  // razorPay Integration 
  generateRazorpay: (OrderID, totalAmount) => {
    // console.log("genarate pay", totalAmount.total,);
    // console.log(OrderID, totalAmount)
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalAmount.total * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: OrderID.toString()
      };
      instance.orders.create(options, function (err, order) {
        if (err) {

          console.log("err", err);

        } else {
          // console.log("new order", order);
          resolve(order)
        }



      });



    })
  },
  verifyPayment: (PaymentDetials) => {
    // console.log(PaymentDetials);
    return new Promise((resolve, reject) => {
      var crypto = require("crypto");

      let body = PaymentDetials['paymentdata[razorpay_order_id]'] + "|" + PaymentDetials['paymentdata[razorpay_payment_id]'];


      var expectedSignature = crypto.createHmac('sha256', 'wcywClX3z6jW6Cf207UPZepB')
        .update(body.toString())
        .digest('hex');
      // console.log("sig received ", PaymentDetials['paymentdata[razorpay_signature]']);
      // console.log("sig generated ", expectedSignature);

      if (expectedSignature === PaymentDetials['paymentdata[razorpay_signature]']) {
        resolve()
      } else {
        console.log("failed");
        reject()
      }


    })
  },
  changeOrderStatus: (orderID) => {

    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.orders_Colloction).updateOne({ _id: ObjectId(orderID) }, {
        $set: {
          status: "Placed"
        }
      }).then((response) => {
        resolve(response)
      }).catch((err) => {
        reject(err)
      })
    })

  },
  generatePaypal: (orderID, totalAmount) => {
    parseInt(totalPrice).toFixed(2)
    return new promises((resolve, reject) => {
      const create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": "http://localhost:3000/success",
          "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "list added",
              "sku": "001",
              "price": totalAmount,
              "currency": "USD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "USD",
            "total": totalAmount
          },
          "description": "Hat "
        }]
      };

      let data = paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          // console.log(error);
          throw error;
        } else {
          resolve(payment)
        }
      })
    })


  },
  deleteAddress: (date, userID) => {
    // console.log(date);
    return new Promise((resolve, reject) => {

      db.get().collection(Mycollection.address_Collection).updateOne({ user: ObjectId(userID) },

        { $pull: { Address: { uniqId: date } } }

      ).then((data) => {
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  EditAddress: (userID, index) => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.address_Collection).findOne({ user: ObjectId(userID) }).then((response) => {
        resolve(response.Address[parseInt(index)])


      })
    })
  },
  updateAddress: (date, userID) => {
    // console.log(date.uniquedate);
    // console.log(userID);
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.address_Collection).findOneAndUpdate({ user: ObjectId(userID), "Address.uniqId": date.uniquedate },
        {
          "$set": {
            "Address.$.Fname": date.FirstName,
            "Address.$.Lname": date.LastName,
            "Address.$.Address": date.Address,
            "Address.$.phone": date.Phone,
            "Address.$.post": date.Post,
            "Address.$.pin": date.ZipCode,
            "Address.$.state": date.State,
            "Address.$.uniqId": date.uniquedate
          }
        }
      ).then((response) => {
        resolve((response))
      }).catch((err) => {
        reject(err)
      })
    })
  },
  addtowish:(ProId, userID) => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.user_Collections).updateOne(
        { _id: ObjectId(userID) },
        {
          $push: { wishlist: { item: ObjectId(ProId) } },
        }
      ).then((response) => {
        
        resolve(response)
      }).catch((err) => {
        reject(err)
      })

    })
  },


  removewish: (ProID, userID) => {
    console.log("remove");
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.user_Collections).updateOne(
        {
          _id: ObjectId(userID),
          'wishlist.item': ObjectId(ProID)
        },
        {
          $pull: { wishlist: { item: ObjectId(ProID) } }
        }
      ).then((response) => {
        // console.log(response);
      resolve(response)
    }).catch((err) => {
      reject(err)
    })

    })
  },

  viewwishlist:(userID) => {
    return new Promise((resolve, reject) => {
      
      db.get().collection(Mycollection.user_Collections).aggregate([
        {
          $match: { _id: ObjectId(userID) }
        },
        {
          $unwind: "$wishlist"
        },
        {
          $lookup: {
            from: Mycollection.Product_Colloctions,
            localField: "wishlist.item",
            foreignField: "_id",
            as: "product"
          }
        },
        {
          $unwind: "$product"
        },
        {
          $project: {
            product: 1,

          }
        },
        {
          $match: {
            'product.isDeleted': false
          }
        }
      ]).toArray().then((response) => {
          // console.log(response);
          resolve(response)
        })
        .catch((err) => {
          console.log(err);
          reject(err)
        })
      
    })
    

     

  },

 

}




