const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const darkmode = require("darkmode-js");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use('/public/icons/', express.static('./public/icons'));

app.locals._ = _;
mongoose.connect("mongodb+srv://fub_1932:temp-1932@cluster0.dtqtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majorityco/ursesDB");

const options = {
  bottom: '64px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#000', // default: '#fff'
  saveInCookies: true, // default: true,
  label: '🌓', // default: ''
  autoMatchOsTheme: true // default: true
}
const dark = new darkmode(options);
dark.showWidget();

const courseSchema = {
  stage:String,
  name: String,
  primaryUrl: String,
  secondaryUrl: [],
  referencesUrl: [],
  referencesImgs: []
};

const Course = mongoose.model("course", courseSchema);

app.get("/", function(req, res) {
  getNames();
        res.render("home", {
          names: names
        });

});

app.get("/courses/:customCourseName", function(req, res) {
  const customCourseName = (req.params.customCourseName);

  Course.findOne({
    name: customCourseName
  }, function(err, foundCourse) {
    if (!err) {
      if (!foundCourse) {
        //Create a new list
        res.render("notfound", {
          names:names,
          courseTitle: _.startCase(customCourseName)
        });
      } else {
        //Show an existing list
        res.render("course", {
          names: names,
          name: _.startCase(foundCourse.name),
          primaryUrl: foundCourse.primaryUrl,
          secondaryUrl: foundCourse.secondaryUrl,
          referencesUrl: foundCourse.referencesUrl,
          referencesImgs: foundCourse.referencesImgs
        });
      }
    } else {
      console.log("err");
    }
  });

});

app.get("/create/main", function(req, res) {

        res.render("create", {
          names: names
        });
      getNames();

});

app.post("/create/main", function(req, res) {
  const input = req.body;
  const course = new Course({
    name: _.kebabCase(input.name),
    primaryUrl: input.primary,
    secondaryUrl: input.secondary,
    referencesUrl: input.references,
    secondaryImgs: input.secondaryimg,
    referencesImgs: input.referencesimg
  });
  course.save();
  res.render("success", {
    names:names,
    courseTitle: _.startCase(input.name)
  });
getNames();
});



app.get("/create/:customCourseName", function(req, res) {

  const customCourseName = (req.params.customCourseName);
  Course.findOne({
    name: customCourseName
  }, function(err, foundCourse) {
    if (!err) {
      if (!foundCourse) {
        //Create a new list
        res.render("notfound", {
          names: names,
          courseTitle: _.startCase(customCourseName)
        });
      } else {
        //Show an existing list
        res.render("add", {
          names: names,
          deceratedTitle: _.startCase(foundCourse.name),
          courseTitle: foundCourse.name,
          primaryUrl: foundCourse.primaryUrl,
          secondaryUrl: foundCourse.secondaryUrl,
          referencesUrl: foundCourse.referencesUrl,
          referencesImgs: foundCourse.referencesImgs
        });
      }
    } else {
      console.log("err");
    }
  });
getNames();
});

app.post("/create/:courseTitle", function(req, res) {
  const courseTitle = req.params.courseTitle;
  Course.updateOne({
      name: courseTitle
    }, {
      $set: req.body
    },
    function(err) {
      if (!err) {
        res.render("success", {
          names:names,
          courseTitle: _.startCase(courseTitle)
        });
      } else {
        res.send(err);
      }
    }
  );
getNames();
});

app.get("/craete/:courseTitle/delete", function(req,res){
  res.send("fuckkkkkkkkkkkk")
})

app.post("/create/:courseTitle/delete", function(req, res){
  const nameToDelete= req.params.courseTitle;
  console.log(nameToDelete);

  Course.findOneAndDelete({name:nameToDelete}, function(err){
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }else {
      console.log(err);
    }
  });
getNames();
});

var names=[];
function getNames(){
  Course.find({}, function sub(err, foundCourses) {
    if (!err) {
      if (!foundCourses) {
        res.render("notfound", {
          names:names,
          courseTitle: ""
        });
      } else {
          names= foundCourses.map(course => course.name);
      }
    } else {
      console.log("err");
    }
  });
};

app.listen(3000, function() {
  getNames();
  console.log("Server started on port 3000");
});





// app.post("/create/:courseTitle", function(req, res){
//   const courseTitle =(req.params.courseTitle);
//   const input=req.body;
//   console.log(input);
//   const course=new Course({
//   name: courseTitle,
//   primaryUrl: input.primaryUrl,
//   secondaryUrl:input.secondaryUrl,
//   referencesUrl:input.referencesUrl,
//   referencesImgs: input.referencesimg
// });
// course.save();
// res.redirect("/");
// });
// app.post("/create", function(req, res){
//   const input=req.body;
//   const course=new Course({
//   name: input.selection,
//   primaryUrl: input.primary,
//   secondaryUrl:input.secondary,
//   referencesUrl:input.references,
//   secondaryImgs:input.secondaryimg,
//   referencesImgs: input.referencesimg
// });
// course.save();
// res.redirect("/");
// });
//
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const _ = require("lodash");
//
// const app = express();
//
// app.set('view engine', 'ejs');
//
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
//
// mongoose.connect("mongodb://localhost:27017/coursesDB");
//
// const courseSchema={
//   name:String,
//   primaryUrl:String,
//   secondaryUrl:[],
//   referencesUrl:[],
//   referencesImgs:[]
// }
// const Course = mongoose.model("course",courseSchema);
//
// const stageSchema ={
//   name:String,
//   courses:[courseSchema]
// }
// const Stage=mongoose.model("stage", stageSchema);
//
//
// app.get("/", function(req,res){
//   res.render("home");
// });
//
// app.get("/courses/:customCourseName", function(req, res){
//     const customCourseName =(req.params.customCourseName);
//
//     Course.findOne({name: customCourseName}, function(err, foundCourse){
//       if (!err){
//         if (!foundCourse){
//           //Create a new list
//           res.render("notfound", {courseTitle: _.startCase(customCourseName)});
//         } else {
//           //Show an existing list
//           res.render("course", {
//             courseTitle: _.startCase(foundCourse.name),
//             primary: foundCourse.primaryUrl,
//             references:foundCourse.referencesUrl,
//             refImg:foundCourse.referencesImgs
//           });
//         }
//       }else{
//         console.log("err");
//       }
//     });
//
// });
//
// app.get("/create/main", function(req, res){
//   res.render("create");
// });
//
// app.get("/create/:customCourseName", function(req, res){
//
//   const customCourseName =(req.params.customCourseName);
//   Course.findOne({name: customCourseName}, function(err, foundCourse){
//     if (!err){
//       if (!foundCourse){
//         //Create a new list
//         res.render("notfound", {courseTitle: _.startCase(customCourseName)});
//       } else {
//         //Show an existing list
//         res.render("add", {
//           courseTitle: _.startCase(foundCourse.name),
//           primary: foundCourse.primaryUrl,
//           secondary: foundCourse.secondaryUrl,
//           references:foundCourse.referencesUrl,
//           refImg:foundCourse.referencesImgs
//         });
//       }
//     }else{
//       console.log("err");
//     }
//   });
// });
//
// app.post("/create/:courseTitle", function(req, res){
//   const courseTitle =(req.params.courseTitle);
//   const input=req.body;
//   const course=new Course({
//   name: courseTitle,
//   primaryUrl: input.primary,
//   secondaryUrl:input.secondary,
//   referencesUrl:input.references,
//   secondaryImgs:input.secondaryimg,
//   referencesImgs: input.referencesimg
// });
// course.save();
// res.redirect("/");
// })
//
// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });
