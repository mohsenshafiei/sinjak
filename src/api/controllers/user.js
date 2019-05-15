const User = require('../models/user');

exports.login = (req, res, next) => {
  User.findOne({ username: req.body.username }).exec()
  .then( user => {
    if (user && user.length < 1) {
      return res.status(401).json({
        message: "Authentication Failed"
      });
    }
    bcrypt.compare(req.body.password, user.password, function(err, result) {
      if (err) {
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
      if (result) {
        const token = jwt.sign({
          username: user.username,
          userId: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        }
        );
        return res.status(200).json({
          message: "Authentication Successful",
          token: token
        });
      } else {
        return res.status(401).json({
          message: "Authentication Failed"
        });
      }
    });
  })
  .catch( err => {
    console.log(err);
    res.status(500).json(err);
  })
};

exports.logout = (req, res, next) => {
  res.status(200).json({
    message: 'Logout API!',
  });
};

exports.signup = (req, res, next) => {
  User.find({email: req.body.email}).exec()
  .then( user => {
    if (user.length >= 1) {
      return res.status(409).json( {
        message: 'E-Mail address already exist'
      });
    } else {
      User.find({username: req.body.username}).exec()
      .then( (profile) => {
        if (profile.length >= 1) {
          return res.status(409).json( {
            message: 'Username already exist'
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                email: req.body.email,
                name: req.body.name,
                last_name: req.body.last_name
              });
              user
              .save()
              .then( (result) => {
                console.log(result);
                res.status(201).json({
                  message: 'User Created'
                });
              })
              .catch((err) => res.status(500).json(err));
            }
          });
        }
      })
    }
  })
};

exports.changePassword = (req, res, next) => {
  res.status(200).json({
    message: 'Change Password API!',
  });
};

exports.forgetPassword = (req, res, next) => {
  res.status(200).json({
    message: 'Forget Password API!',
  });
};

exports.profile = (req, res, next) => {
  User
  .findOne({_id: req.params.profileId})
  .select('name')
  .exec()
  .then( (result) => res.status(200).json(result))
  .catch( (err) => res.status(500).json(err));
};

exports.deleteUser = (req, res, next) => {
  User.remove({_id: req.params.id}).exec()
  .then( result => {
    res.status(200).json({
      message: 'User Deleted'
    })
  })
  .catch( (err) => res.status(500).json(err));
};
