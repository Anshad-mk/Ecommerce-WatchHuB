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


  viewAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.orders_Colloction).find({}).sort({ Date: -1 }).toArray().then((result) => {
        resolve(result)
        // console.log(result);

      }).catch((err) => {
        reject(err)
      });
    })
  },

  weekOrderCuount: () => {
    return new Promise((resolve, reject) => {
      db.get().collection(Mycollection.orders_Colloction).aggregate([

        {
          $match: {
            date: {
              $gte: new Date(new Date() - 60 * 60 * 24 * 1000 * 7)
            }
          }
        },
        {
          $unwind: '$products'
        },
        {
          $project: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
            dayOfWeek: { $dayOfWeek: "$date" },
          }
        },
        {
          $group: {
            _id: '$dayOfWeek',
            count: { $sum: 1 },
            detail: { $first: '$$ROOT' }
          }
        },
        {
          $sort: { detail: 1 }
        }
      ]).toArray().then((value) => {
        resolve(value)
        console.log(value);
      }).catch((err) => {
        reject(err)
      })



    })
  },
  MonthOrderCuount:()=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.orders_Colloction).aggregate([
                  
        {
            $match:{ date:{
                    $gte: new Date(new Date() - 60*60*24*1000*30)
                }
            }
        },
        {
            $unwind:'$products'
        },
        {
            $project:{
                year: { $year: "$date" },
                month: { $month: "$date" },
                day: { $dayOfMonth: "$date" },
                dayOfWeek: { $dayOfWeek: "$date" },
            }
        },
        {
            $group:{
                _id:'$dayOfWeek',
                count:{$sum:1},
                detail:{$first:'$$ROOT'}
            }
        },
        {
            $sort:{detail:1}
        }
  ]).toArray().then((value)=>{
    resolve(value)
    console.log(value);
  }).catch((err)=>{
    reject(err)
  })
  
        
     
    })
  },

  YearOrderCuount:()=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.orders_Colloction).aggregate([
                  
        {
            $match:{ date:{
                    $gte: new Date(new Date() - 60*60*24*1000*365)
                }
            }
        },
        {
            $unwind:'$products'
        },
        {
            $project:{
                year: { $year: "$date" },
                month: { $month: "$date" },
                day: { $dayOfMonth: "$date" },
                dayOfWeek: { $dayOfWeek: "$date" },
            }
        },
        {
            $group:{
                _id:'$dayOfWeek',
                count:{$sum:1},
                detail:{$first:'$$ROOT'}
            }
        },
        {
            $sort:{detail:1}
        }
  ]).toArray().then((value)=>{
    resolve(value)
    console.log(value);
  }).catch((err)=>{
    reject(err)
  })
  
        
     
    })
  },
  statusUpdate:(OrderID,status)=>{
    console.log(status,"haiii");
    return new Promise((resolve,reject)=>{
      db.get().collection(Mycollection.orders_Colloction).updateOne({_id:ObjectId(OrderID)},
      {$set:{status:status.status}}).then((response)=>{
        resolve(response)
      }).catch((err)=>{
        reject(err)
      })
    })
  }



};