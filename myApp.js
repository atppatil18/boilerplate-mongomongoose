require('dotenv').config({
    path: `${__dirname}/sample.env`
  })
const dbUrl = process.env.MONGO_URI;
var mongoose = require('mongoose');

mongoose.connect(dbUrl, {useNewUrlParser: true, unUnifiedTopology: true});


const Schema = mongoose.Schema
const personSchema = new Schema({
  name:{type: String, required: true},
  age: Number,
  favoriteFoods: [String]
});
// Below line create model
const Person = mongoose.model("Person", personSchema);



const createAndSavePerson = (done) => {
    const atulPatil = new Person({name: "Atul", age: 25, favoriteFoods:["A", "B", "C"]})
    atulPatil.save(function(err, data){
      if(err) return console.log(err)
      done(null, data)
    });
  //done(null /*, data*/);
};

var arrayOfPeople = [
{name: "Akshay", age: 25, favoriteFoods:["A", "B", "C"]},
{name: "Atul", age: 25, favoriteFoods:["A", "B", "C"]},
{name: "Dev", age: 25, favoriteFoods:["A", "B", "C"]}
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, people){
    if(err) return console.log(err)
    else {
      done(null , people);
    }
  });

};

const findPeopleByName = (personName, done) => {
  done(null /*, data*/);
};

const findOneByFood = (food, done) => {
  done(null /*, data*/);
};

const findPersonById = (personId, done) => {
  done(null /*, data*/);
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  done(null /*, data*/);
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  done(null /*, data*/);
};

const removeById = (personId, done) => {
  done(null /*, data*/);
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  done(null /*, data*/);
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  done(null /*, data*/);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
