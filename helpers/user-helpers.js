const db = require("../config/connection");
const { ObjectId } = require("mongodb");
const Mycollection = require("../config/collections");
const collections = require("../config/collections");


module.exports = {
  userRegister: (user) => {
    user.blocked=false
    return new Promise((resolve, reject) => {
      db.get()
        .collection(Mycollection.user_Collections)
        .insertOne(user)
        .then((data) => {
          console.log(data);
          resolve(data);
        });
    });
  },
  userLogin: (loguser) => {
    console.log(loguser);

    return new Promise(async (resolve, reject) => {
      const check = await db
        .get()
        .collection(Mycollection.user_Collections)
        .findOne({ email: loguser.email });
      const emailerr = "enter valid email id";
      const passerr = "enter valid password";
      const blockerr="You are Blocked User !.  Please Contact us"
      if (check) {
        if (check.email == loguser.email) {
          if (check.password == loguser.password) {
            if(check.blocked){
              reject(blockerr)
            }else{
              check.status = true;
              resolve(check);
            }
            
          } else {
            reject(passerr);
          }
        } else {
          reject(emailerr);
        }
      } else {
        reject(emailerr);
      }
    });
  },
listusers:()=>{
    return new Promise(async(resolve,reject)=>{
let userlist=await db.get().collection(collections.user_Collections).find().toArray()
resolve(userlist)
    })

},
blockUser:(userid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(Mycollection.user_Collections).updateOne({_id:ObjectId(userid)},{$set:{blocked:true}}).then((response)=>{
            resolve(response)
        })
    })
},
unblockUser:(userid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(Mycollection.user_Collections).updateOne({_id:ObjectId(userid)},{$set:{blocked:false}}).then((response)=>{
            resolve(response)
        })
    })
},

getUserDetails:(userID)=>{
  return new Promise (async(resolve,reject)=>{
let userdetails=await db.get().collection(Mycollection.user_Collections).findOne({_id:ObjectId(userID)})
if(userdetails){
  resolve(userdetails)
}
  })

},
UpdateUser:(userID,userDetails)=>{
  
console.log(userDetails);
  return new Promise((resolve,reject)=>{
    db.get().collection(Mycollection.user_Collections).updateOne({_id:ObjectId(userID)},{$set:userDetails}).then((response)=>{
      resolve(response)
    }).catch((err)=>{
      reject(err)
    })
  })
},
// updateAddress:(userID,[address])=>{

//   return new Promise ((resolve,reject)=>{
//     db.get().collection(Mycollection.user_Collections).updateOne({_id:ObjectId(userID)},{$PUSH:{address}}).then((response)=>{
//       resolve(response)
//     }).catch((err)=>{
//       reject(err)
//     })
//   })
// }

addAddress:(userID,address)=>{
 let addressObj={
    user:ObjectId(userID),
    address:[{
      Fname:address.FirstName,
      Lname:address.LastName,
    address:address.Address,
    post:address.Post,
    pin:address.ZipCode,
    state:address.State,
    phone:address.Phone,
  }]
    
   }
  return new Promise((resolve,reject)=>{
    db.get().collection(Mycollection.address_Collection).insertOne(addressObj).then((response)=>{
      resolve(response)
    }).catch((err)=>{
      reject(err)
    })
   })
},
findAddress:(userID)=>{
  return new Promise ((resolve,reject)=>{
    db.get().collection(Mycollection.address_Collection).findOne({user:ObjectId(userID)}).then((address)=>{
      // console.log(address);
      resolve(address)
    }).catch((err)=>{
reject(err)
    })
   
    
  })
},
addNewAddress:(userId,address)=>{
  let addNew={
    Fname:address.FirstName,
    Lname:address.LastName,
    address:address.Address,
    post:address.Post,
    pin:address.ZipCode,
    state:address.State,
    phone:address.Phone,
  
  }
  return new Promise((resolve,reject)=>{
    db.get().collection(Mycollection.address_Collection).updateOne({user:ObjectId(userId)},{$push:{address:addNew}
    }).then((response)=>{
      resolve(response)
    }).catch((err)=>{
      reject(err)
    })
  })

},
viewOrders:(userID)=>{
return new Promise((resolve,reject)=>{
db.get().collection(Mycollection.orders_Colloction).aggregate([
  {
    $match:{
      userID:ObjectId(userID)
    }

  },
  {
    $unwind: "$products",
    },
  {
    $lookup:{
      from:Mycollection.Product_Colloctions,
      localField:'products.item',
      foreignField:'_id',
      as:'orders'
    }
  },
  {
    $unwind:'$orders'
  },
  {
    $project:{
      _id:1,
      DeliveryAddress:1,
      TotelAmound:1,
      Date:1,
      paymentMethod:1,
      orders:1,
      status:1,
      products:1

    }
  }

]).toArray().then((response)=>{
  resolve(response)
  console.log(response);
}).catch((err)=>{
  reject(err)
})






})

}



};
