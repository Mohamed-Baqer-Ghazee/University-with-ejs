require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');

let ligit=0;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use('/public/icons/', express.static('./public/icons'));

app.locals._ = _;
mongoose.connect("mongodb+srv://fub_1932:temp-1932@cluster0.dtqtd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/coursesDB");

const courseSchema = {
  stage: String,
  name: String,
  primaryUrl: String,
  secondaryUrl: [],
  referencesUrl: [],
  referencesImgs: []
};

const userSchema={
  email:String,
  password:String
};

const Course = mongoose.model("course", courseSchema);
const User=new mongoose.model("User",userSchema);

app.get("/", function(req, res) {
  getNames();
  res.render("home", {
    names: names
  });

});

app.get("/login",function(req,res){
  res.render("login", {
    names: names
  });
});

app.post("/login",function(req,res){
  if(req.body.password==process.env.PASSWORD){
    ligit=1;
    res.redirect("/create/main");
  }
  else{
    res.render("notAllowed", {
    names: names
  })
  }
});

// app.get("/register",function(req,res){
//   res.render("register");
// });
//
// app.post("/register",function(req,res){
//   const newUser=new User({
//     email:req.body.email,
//     password: req.body.password
//   });
//   newUser.save(function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       res.render("create");
//     }
//   });
// });

app.get("/courses/:customCourseName", function(req, res) {
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
  if(!ligit){
    res.redirect("/login");}
  else{
  res.render("create", {
    names: names
  })};
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
    names: names,
    courseTitle: _.startCase(input.name)
  });
  getNames();
  ligit=0;
});



app.get("/create/:customCourseName", function(req, res) {
if(!ligit)
{
  res.redirect('/login');
}
else{

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
}
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
          names: names,
          courseTitle: _.startCase(courseTitle)
        });
      } else {
        res.send(err);
      }
    }
  );
  getNames();
  ligit=0;
});

app.get("/craete/:courseTitle/delete", function(req, res) {
  if(!ligit){
    res.redirect('/login');
  }
  else{
    res.send("hello")
  }
})

app.post("/create/:courseTitle/delete", function(req, res) {
  const nameToDelete = req.params.courseTitle;
  console.log(nameToDelete);

  Course.findOneAndDelete({
    name: nameToDelete
  }, function(err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
  getNames();
  ligit=0;
});

app.get("/lectures/", function(req, res) {
  res.send("Sorry, page does not exist yet.");
})

var names = [];

function getNames() {
  Course.find({}, function sub(err, foundCourses) {
    if (!err) {
      if (!foundCourses) {
        res.render("notfound", {
          names: names,
          courseTitle: ""
        });
      } else {
        names = foundCourses.map(course => course.name);
      }
    } else {
      console.log("err");
    }
  });
};

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function() {
  getNames();
  console.log("Server started on port 3000");
});
