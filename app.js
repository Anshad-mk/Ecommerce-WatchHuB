let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let hbs=require('express-handlebars')
let session = require('express-session')
let db=require('./config/connection')
let fileUpload=require('express-fileupload')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const { handlebars } = require('hbs');
const Handlebars = require('handlebars');
db.connect((err)=>{
  if(err){
console.log(err);
  }else{
    console.log('database connected successfully');
  }
})
const app = express();






app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// app.use((req,res, next)=>{
//   if(req.session.errmsg){
//     session.errmsg=req.session.errmsg;
//   }
//   delete req.session.message;
//   next()
// })

app.use(session({
  secret:"Key", 
  resave:false,
  saveUninitialized:true
  
}) )  
 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/',
helpers: {
  // Function to do basic mathematical operation in handlebar
  math: function (lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue,
      "<": lvalue < rvalue,
      ">": lvalue > rvalue,
      "!=":lvalue != rvalue,

    }[operator];
  },
  stringCompare: function (value1, value2) {
    if (value1 == value2) {
      return true
    }
    else {
      return false
    }
  }
}

}))
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
  
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{er:true});
});


module.exports = app;

