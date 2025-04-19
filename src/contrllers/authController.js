const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");
const { hasSubscribers } = require("diagnostics_channel");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "",
    },
  })
);
exports.getLogin = (req, res, next) => {
  const error = req.flash("error")[0];
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: error,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("User does not exist");
        req.flash("error", "Invalid Email or Password.");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid Email or Password.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
  const error = req.flash("error")[0];
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage: error,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, first_name, last_name, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "User with email already exist.");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            username: email,
            email: email,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name,
            cart: {
              items: [],
              cartTotal: 0,
            },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "shop@node-compileClient.com",
            subject: "Signup Suceess",
            html: "<h1>You successfully signed up!</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  const error = req.flash("error")[0];
  res.render("auth/reset", {
    path: "/reset-password",
    docTitle: "Reset Password",
    errorMessage: error,
  });
};

exports.postResetPassword = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with the email found");
          return res.redirect("/reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: email,
          from: "shop@node-compileClient.com",
          subject: "Password Reset",
          html: `<p>You requested to password reset.</p>
								<p>Click this <a href="localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
								<p></p>`,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getUpdatePassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      const error = req.flash("error")[0];
      res.render("auth/new-password", {
        path: "/reset",
        docTitle: "Reset Password",
        token: token,
        errorMessage: error,
        userId: user._id.toString(),
      });
    })
    .catch((err) => console.log(err));
};

exports.postUpdatePassword = (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const cpassword = req.body.confirm_password;
  const passwordToken = req.body.token;
  let resetUser;
  if (password != cpassword) {
    req.flash("error", "Pasword and confirm password does not matched");
    return res.redirect("/reset-password");
  }

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      console.log(user);
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      return res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

exports.getChangePassword = (req, res, next) => {
  const token = req.params.token;
  if (req.user) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        const error = req.flash("error")[0];
        return res.render("auth/change-password", {
          path: "/change-password",
          docTitle: "Change Password",
          token: token,
          errorMessage: error,
          userId: user._id.toString(),
        });
      })
      .catch((err) => console.log(err));
  } else {
    return res.redirect("/");
  }
};

exports.postChangePassword = (req, res, next) => {
  const { old_password, new_password } = req.body;
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/change-password");
      }
      return bcrypt
        .compare(old_password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            console.log(doMatch);
            return bcrypt
              .hash(new_password, 12)
              .then((hashedPassword) => {
                user.password = hashedPassword;
                return user.save();
              })
              .then(() => {
                req.flash("success", "Password changed successfully.");
                return res.redirect("/");
              });
          }
          req.flash("error", "Old password does not match.");
          res.redirect("/change-password");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};
