var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../model/user');
var Marker = require('../model/markers');

// GET route for reading data
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/../../build/index.html'));
});

//  //now  we can set the route path & initialize the API
//  router.get('/', function (req, res) {
//   res.json({ message: 'API Initialized!' });
// });

// app.get("*", (req, res) => {
// });

//POST route for updating data
router.post('/', function (req, res, next) {
  console.log("sign up request received");
  // confirm that user typed same password twice
  if (req.body.password !== req.body.verifyPassword) {
    console.log("Passwords do not match \n" + req.body.password + "\n" + req.body.verifyPassword);
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  // Create user when signing up
  if (req.body.email && req.body.password && req.body.verifyPassword) {
    var userData = {
      email: req.body.email,
      password: req.body.password,
    }
    User.create(userData, function (error, user) {
      if (error) {
        console.error("Unable to create user");
        return next(error);
      } else {
        req.session.userId = user._id;
        console.log("New user created");
        return res.redirect(req.headers.origin);
      }
    });
  }
  else {
    console.log("All fields required");
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

router.post('/login', function (req, res, next) {
  console.log("login requested received");
  // Log in authentication when logging in
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      console.log("Attempting to authenticate " + req.body.email + " and " + req.body.password);
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect(req.headers.origin);
      }
    });
  }
  else {
    console.log("Error: email and password does not exist");
  }
});

router.post('/database/marker/add', function (req, res, next) {
  let marker = req.body;
  let markerData = {
    id: marker.id,
    lat: marker.lat,
    lng: marker.lng,
    title: marker.title,
    loc: marker.loc,
    startTime: marker.startTime,
    endTime: marker.endTime,
    moreInfo: marker.moreInfo,
  }
  Marker.create(markerData, (error) => {
    if (error) {
      console.error("Unable to create marker");
      return next(error);
    } else {
      return res.send(JSON.stringify({ status: 200, message: "Successfully added marker to database" }));
    }
  });
});

router.post('/database/marker/update/:id', function (req, res, next) {
  Marker.findById(req.params.id, function (err, marker) {
    if (err) {
      console.error("Unable to find marker");
      return next(err);
    }
    else {
      let newData = req.body;
      marker.title = newData.title;
      marker.loc = newData.loc;
      marker.startTime = newData.startTime;
      marker.endTime = newData.endTime;
      marker.moreInfo = newData.moreInfo;
      marker.save(function (err, updateMarker) {
        if (err) {
          console.error("Unable to update marker");
          return next(err);
        }
      });
      return res.send(JSON.stringify({ status: 200, message: "Successfully update marker in database" }));
    }
  });
});

router.delete('/database/marker/delete/:id', function (req, res, next) {
  Marker.findByIdAndRemove(req.params.id, (err, marker) => {
    const response = {
      status: 200,
      marker: marker,
    }
    return res.send(JSON.stringify(response));
  });
});

router.get('/database/markers', function (req, res, next) {
  Marker.find(function (err, markers) {
    if (err) return res.send(JSON.stringify({ status: 500, message: "Failed to get markers" }));
    return res.send(JSON.stringify({ status: 200, markers: markers }));
  });
});

router.get('/database/marker/delete/special/:id', function (req, res, next) {
  Marker.find(function (err, markers) {
    for (let marker of markers) {
      if (marker.id === req.params.id) {
        console.log("foo");
        Marker.findByIdAndRemove(marker._id, (err, marker) => {
          const response = {
            status: 200,
            marker: marker,
          }
          return res.send(JSON.stringify(response));
        });
        return;
      }
    }
    return res.send(JSON.stringify({ status: 500, message: "Failed to find marker" }))    
  });
});

// router.get('/profile', function (req, res, next) {
//   console.log(req.session);
//   if (!req.session.userId) {
//     console.log("User ID null");
//     return res.redirect('/');
//   }

//   User.findById(req.session.userId)
//     .exec(function (error, user) {
//       if (error) {
//         return next(error);
//       } else {
//         if (user === null) {
//           var err = new Error('Not authorized! Go back!');
//           err.status = 400;
//           return next(err);
//         } else {
//           return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
//         }
//       }
//     });
// });

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect(req.headers.origin);
      }
    });
  } else {
    return res.redirect(req.headers.origin);
  }
});

module.exports = router;


// //adding the /comments route to our /api router
// router.route('/comments')
//   //retrieve all comments from the database
//   .get(function (req, res) {
//     //looks at our Comment Schema
//     Comment.find(function (err, comments) {
//       if (err)
//         res.send(err);
//       //responds with a json object of our database comments.
//       res.json(comments)
//     });
//   })
//   //post new comment to the database
//   .post(function (req, res) {
//     var comment = new Comment();
//     (req.body.author) ? comment.author = req.body.author : null;
//     (req.body.text) ? comment.text = req.body.text : null;
//     (req.body.lat) ? comment.lat = req.body.lat : null;
//     (req.body.lon) ? comment.lon = req.body.lon : null;

//     comment.save(function (err) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'Comment successfully added!' });
//     });
//   });

// //Adding a route to a specific comment based on the database ID
// router.route('/comments/:comment_id')
//   //The put method gives us the chance to update our comment based on the ID passed to the route
//   .put(function (req, res) {
//     Comment.findById(req.params.comment_id, function (err, comment) {
//       if (err)
//         res.send(err);
//       //setting the new author and text to whatever was changed. If nothing was changed
//       // we will not alter the field.
//       (req.body.author) ? comment.author = req.body.author : null;
//       (req.body.text) ? comment.text = req.body.text : null;
//       (req.body.lat) ? comment.lat = req.body.lat : null;
//       (req.body.lon) ? comment.lon = req.body.lon : null;
//       //save comment
//       comment.save(function (err) {
//         if (err)
//           res.send(err);
//         res.json({ message: 'Comment has been updated' });
//       });
//     });
//   })
//   //delete method for removing a comment from our database
//   .delete(function (req, res) {
//     //selects the comment by its ID, then removes it.
//     Comment.remove({ _id: req.params.comment_id }, function (err, comment) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'Comment has been deleted' })
//     })
//   });

