//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { update } = require("lodash");

const homeStartingContent = "Welcome to TechTime, a blog site where anyone can learn or post about technology! Find a post explaining a tech topic you want to learn about, or create a post to explain a topic you're passionate about."
const aboutContent =
  "Welcome to TechTime! The world of tech can be vast and daunting for first-time learners. So much of the content online is aimed towards a more advanced audience, making technological innovations difficult for beginners to understand. This site was created to help complete beginners better understand various tech concepts. Using the Feynman Technique, anyone can make a post explaining a tech topic in a beginner-friendly way. By posting about the lastest tech news, or exciting tech concepts, you can help us spread knowledge while cementing your own knowledge. Adapted from a challenge for www.appbrewery.com.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  likes: Number
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find(function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    likes: 0
  });

  post.save(function (err, post, number) {
    if (!err) {
      res.redirect("/");
    }
  });
});


// app.post("/posts/:postName", function(req, res){
//   const id = req.params.postName;
//   let likes = 0;
//   Post.findById(id, function(err, post){
//     if (!err){
//       likes = post.likes;
//     }
//   });
//   Post.findByIdAndUpdate({id}, {"likes":likes+1}, function(err, post){
//     if(!err){
//       res.render("post", {
//         id:id,
//         title: post.title,
//         content: post.content,
//         likes: post.likes +1,
//       });
//     }
//   })
// });

app.get("/posts/:postName", function (req, res) {
  const id = req.params.postName;

  Post.findById(id, function (err, post) {
    if (!err) {
      res.render("post", {
        id:id,
        title: post.title,
        content: post.content,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
