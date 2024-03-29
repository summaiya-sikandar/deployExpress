var express = require('express');
var router = express.Router();
const userModel= require('./users')
const postModel= require('./post')
const upload= require('./multer')

const passport= require('passport')
const localStrategy= require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Express'});
});
router.get('/login', function(req, res) {
  res.render('login',{error: req.flash('error')});
});
router.get('/feed', function(req, res) {
  res.render('feed',);
});
router.post('/upload', isLoggedIn, upload.single("file") , async function(req, res, next) {
  if(!req.file){
    return res.status(404).send('no file is given')
  }
  const user= await userModel.findOne({ username: req.session.passport.user})
  const post= await postModel.create({
    imageText: req.body.caption,
    image: req.file.filename,
    user: user._id
  })
  user.posts.push(post);
  await user.save();

  res.redirect('/profile');
});

router.get('/profile', isLoggedIn , async function(req, res, next) {
  let user= await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  res.render('profile', {user});
});

router.post('/register',function(req, res) {
  const {username, fullname, email} = req.body;
  const userData = new userModel({username,fullname, email});
  
  userModel.register(userData, req.body.password)
  .then(function(){
  passport.authenticate("local")(req , res, function(){
    res.redirect('/profile')
  })
})
});


router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect: '/login',
  failureFlash: true
}),function(req , res){})

router.get('/logout', function (req, res, next){
  req.logout(function(err){
    if(err) return next(err);
    res.redirect('/login');
  })

})

function isLoggedIn(req , res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');

}
module.exports = router;

