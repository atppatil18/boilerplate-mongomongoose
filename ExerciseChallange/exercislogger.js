const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

require('dotenv').config()
require('dotenv').config({
    path: `${__dirname}/sample.env`
  })
/*
const dbUrl = process.env.MONGO_URI;
mongoose.connect(dbUrl, {useNewUrlParser: true, unUnifiedTopology: true});


const Schema = mongoose.Schema

//Creating schemas
const userSchema = new Schema({
  username:{type: String, required: true}
});

const worklogSchema = new Schema({
  userid:{type: String, required: true},
  description:{type: String, required: true},
  duration:{type: Number, required: true},
  date: {type: String, required: true}
});


//Creating model
const User = mongoose.model("User", userSchema);
const Log = mongoose.model("Log", worklogSchema);
*/


var users = []
var logs = {}

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
const body = req.body
const name = body["username"]
//console.log("Name sent ", name)
const id = (new Date()).getTime();
const eachUser = {
  username: name,
  _id: id.toString()
}
////console.log("User added ",eachUser)
users.push(eachUser)
res.json(eachUser)
/*
if(!isNaN(name)){
  const createUser = (done) => {
  const newUser = new User({username: name})
  newUser.save((err, data) => {
    if(err) return res.send("Unable to add name with err: "+err)
    console.log("Name added: "+data)
    done(null,data)
  });


  createUser(name);

}

}
*/

});


app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id.toString()
  const idInUsers = function(id, users)  {
    for(let i = 0 ; i < users.length; i++){
      if (users[i]._id === id){
        return users[i];
      }
    }
    return null;
  };

var userObj = idInUsers(id, users)
if( userObj != null){
  var des = req.body.description
  var dur = req.body.duration
  var date = req.body.date

  dur = Number(dur)
  if(isNaN(dur)){
    res.send("Duration is not a number")
  }
  //date = Date.parse(date);
  //console.log("Date: ",date)
  //if(isNaN(date)){
 //   res.send("Invalid Date")
  //}else{
    //var validDate = new Date(date);
    //var dateOptions = {weekday:'short', month: 'short', day: '2-digit' , year: 'numeric'}
    //const formatDate = validDate.toLocaleDateString('en-US', dateOptions)
    //const dateString = formatDate.toString()
    //const cleanDate = dateString.split(",").join("")
    if(date == null){
      date = (new Date()).toDateString();
    }
    const ddate = new Date(Date.parse(date))


    const getLogArrayForUser = function(id){
      var idsWithLogs = Object.keys(logs)
      for(let i = 0 ; i < idsWithLogs.length; i++ ){
        if(idsWithLogs[i] === id){
          return logs[id]
        }
      }
      return null
    }

    var logArr = getLogArrayForUser(id)
    var newLog = {
      description: des,
      duration: dur,
      date: ddate.toDateString() //cleanDate
    }
    if(logArr != null){
      logArr.push(newLog)
      logs[id] = logArr
    }else{
      var zeroArray = []
      zeroArray.push(newLog)
      logs[id] = zeroArray
    }

    //{"_id":"61fd6298cbe88c34a5c3b534","username":"aa","date":"Sat Jan 01 2022","duration":22,"description":"as"}
    var jsonResponse = {
      _id: userObj["_id"],
      username: userObj["username"],
      date: ddate.toDateString(),//cleanDate,
      duration: dur,
      description: des
    }
    //console.log(logs)
    res.json(jsonResponse)
  //}
}


})


app.get('/api/users', (req, res) => {
  res.json(users)
});

app.get('/api/logs', (req, res) => {
  res.json(logs)
});
///api/users/1644005176783/log
app.get('/api/users/:_id/logs', (req,res) =>{
  const {from, to, limit} = req.query
  //console.log("From ", from)
  //console.log("To ", to)
  //console.log("Limit ", limit)
  const id = req.params._id.toString()
  const idInUsers = function(id, users)  {
    for(let i = 0 ; i < users.length; i++){
      if (users[i]._id === id){
        return users[i];
      }
    }
    return null;
  };
  //const id = req.params._id.toString()
//console.log("Found ", id )
var userObj = idInUsers(id, users)
if( userObj != null){

  const getLogArrayForUser = function(id){
      var idsWithLogs = Object.keys(logs)
      for(let i = 0 ; i < idsWithLogs.length; i++ ){
        if(idsWithLogs[i] === id){
          return logs[id]
        }
      }
      return []
    }

    var logArr = getLogArrayForUser(id)

    if(from != null)
    logArr = logArr.filter(function(each) {
      //console.log(Date.parse(each["date"]))
      //console.log(Date.parse(from))

      if((new Date(Date.parse(each["date"]))).getTime() >= (new Date(Date.parse(from))).getTime()){
        //console.log("Matched from Date for ", each["date"])
        return each
      }
    })

    if(to != null)
    logArr = logArr.filter(function(each) {
      //console.log(Date.parse(each["date"]))
      //console.log(Date.parse(from))

      if((new Date(Date.parse(each["date"]))).getTime() <= (new Date(Date.parse(to))).getTime()){
        //console.log("Matched from Date for ", each["date"])
        return each
      }
    })

    if(limit != null){
      const s = logArr.length - limit
      for(let i = 0 ; i < s ; i++){
        logArr.pop()
      }
    }


    var jsonResponse = {
      _id: userObj["_id"],
      username: userObj["username"],
      count: logArr.length,
      log: logArr
    }
    //console.log("-->",jsonResponse)
    res.json(jsonResponse)
}else{
  res.send("User not found")
}
})






const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
