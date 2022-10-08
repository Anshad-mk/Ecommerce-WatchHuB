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
}



};
