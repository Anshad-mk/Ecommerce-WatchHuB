const db = require("../config/connection");
const { ObjectId } = require("mongodb");
const Mycollection = require("../config/collections");
const collections = require("../config/collections");

module.exports = {
   adminLogin: (admin_credentials) => {
       return new Promise(async (resolve, reject) => {
      const check = await db
        .get()
        .collection(Mycollection.Admin_Colloctions)
        .findOne({ email: admin_credentials.email });

      const emailerr = "enter valid email id";
      const passerr = "enter valid password";
      if (check) {
        
        if (check.email == admin_credentials.email) {
          if (check.password == admin_credentials.password) {
           check.status = true;
            console.log('succes');
            resolve(check);
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


  viewAllOrders:()=>{
    return new Promise((resolve,reject)=>{
      db.get
    })
  }


};