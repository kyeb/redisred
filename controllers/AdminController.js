var redirectModel = require('../models/Redirect');
module.exports = function(redis) {
  var Redirect = redirectModel(redis);
  var AdminController = {};

  AdminController.getAllRedirects = function(req, res) {
    Redirect.getAll(function(err, redirects) {
      if (err)
        res.status(500).send(err);
      else {
        redirects.sort(function(a,b){
          var a_key = a.key.toLowerCase();
          var b_key = b.key.toLowerCase();
          return a_key.localeCompare(b_key);
        });
        res.status(200).render('admin/redirects', { redirects: redirects, token: req.csrfToken() });
      }
    });
  };

  AdminController.createRedirect = function(req, res) {
    var redirectKey = req.body.redirect_key;
    var redirectUrl = req.body.redirect_url;
    if (redirectKey && redirectUrl) {
      Redirect.create(redirectKey, redirectUrl, function(err, redirect) {
        if (err)
          res.status(500).send(err);
        else
          res.redirect('/admin/redirects');
      });
    } else {
      res.status(400).send("Something went wrong. Did you include all of the parameters?");
    }
  };

  AdminController.deleteRedirect = function(req, res) {
    var redirectKey = req.body.redirect_key;
    if (redirectKey) {
      Redirect.delete(redirectKey, function(err) {
        if (err)
          res.status(500).send(err);
        else
          res.redirect('/admin/redirects');
      });
    } else {
      res.status(400).send("Something went wrong. Did you include all of the parameters?");
    }
  };

  return AdminController;
};