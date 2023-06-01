const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect = function (done) {
    const url = 'mongodb+srv://anshad:Dtp9544554696@cluster0.xmn2vbt.mongodb.net/shopping?retryWrites=true&w=majority';
    const dbname = 'shopping';
    
    mongoClient.connect(url, (err, data) => {
      if (err) return done(err);
      state.db = data.db(dbname);
      done();
    });
  };
  

module.exports.get=function(){
    return state.db
}