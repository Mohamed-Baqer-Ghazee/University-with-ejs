
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/coursesDB");

const courseSchema={
  name:String,
  primaryUrl:String,
  secondaryUrl:[],
  referencesUrl:[],
  referencesImgs:[]
}
const Course = mongoose.model("course",courseSchema);

const stageSchema ={
  name:String,
  courses:[courseSchema]
}
const Stage=mongoose.model("stage", stageSchema);


app.get("/", function(req,res){
  res.render("home");
});

app.get("/courses/:customCourseName", function(req, res){
    const customCourseName =(req.params.customCourseName);

    Course.findOne({name: customCourseName}, function(err, foundCourse){
      if (!err){
        if (!foundCourse){
          //Create a new list
          res.render("notfound", {courseTitle: _.startCase(customCourseName)});
        } else {
          //Show an existing list
          res.render("course", {
            courseTitle: _.startCase(foundCourse.name),
            primary: foundCourse.primaryUrl,
            references:foundCourse.referencesUrl,
            refImg:foundCourse.referencesImgs
          });
        }
      }else{
        console.log("err");
      }
    });

});

app.get("/create/main", function(req, res){
  res.render("create");
});


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

app.get("/create/:customCourseName", function(req, res){

  const customCourseName =(req.params.customCourseName);
  Course.findOne({name: customCourseName}, function(err, foundCourse){
    if (!err){
      if (!foundCourse){
        //Create a new list
        res.render("notfound", {courseTitle: _.startCase(customCourseName)});
      } else {
        //Show an existing list
        res.render("add", {
          deceratedTitle:_.startCase(foundCourse.name),
          courseTitle: foundCourse.name,
          primaryUrl: foundCourse.primaryUrl,
          secondaryUrl: foundCourse.secondaryUrl,
          referencesUrl:foundCourse.referencesUrl,
          referencesImgs:foundCourse.referencesImgs
        });
      }
    }else{
      console.log("err");
    }
  });
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

app.post("/create/:courseTitle", function(req, res){
  const courseTitle=req.params.courseTitle;
  Course.update(
    {name: courseTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.render("success",{courseTitle: _.startCase(courseTitle)});
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});





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
