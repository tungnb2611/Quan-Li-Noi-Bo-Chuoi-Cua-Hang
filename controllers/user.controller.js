var mysql = require('mysql')
var con = require('../mysql-connection')
const shortid = require('shortid')
var md5 = require('md5')

module.exports.index = function (req, res) {
    con.query('SELECT * FROM users', function (err, result) { // retrieve data 
    if (err) throw err;
    res.render('./users/users', { users: result});

  });
};

module.exports.create = function (req, res) {
  res.render('./users/create')
};

module.exports.viewUser = function(req, res){
  var id = req.params.id;
  con.query('SELECT * FROM users WHERE id = ?', id, function (err, result) { 
  if (err) throw err;
  res.render('./users/viewUser', { users: result});
});
};

module.exports.postCreate = function (req, res) {
  req.body.id = shortid.generate(); //generate random id
  //validation
  var errors = [];
  if(!req.body.username){
    errors.push("Username is required");
  }
  if(!req.body.password){
    errors.push("Password is required");
  }
  if(!req.body.name){
    errors.push("name is required");
  }
  if(!req.body.dateofbirth){
    errors.push("dob is required");
  }
  if(!req.body.gender){
    errors.push("gender is required");
  }
  if(!req.body.phone){
    errors.push("phone is required");
  }
  if(!req.body.idcard){
    errors.push("idcard is required");
  }
  if(!req.body.address){
    errors.push("address is required");
  }
  if(!req.body.datein){
    errors.push("datein is required");
  }
  if(errors.length){
    res.render('./users/create', {
      errors: errors,
      values: req.body
    });
    return;
  }
  var values = [
  req.body.id, 
  req.body.username, 
  md5(req.body.password), 
  req.body.name, 
  req.body.dateofbirth,
  req.body.gender,
  req.body.phone,
  req.body.idcard,
  req.body.address,
  req.body.datein
  ]; // create an array that include user inputs 
  console.log(req.body) //test
    con.query('INSERT INTO users (id, username, password, name, dateofbirth, gender, phone, idcard, address, datein) VALUES (?)',[values], function(err, result){
        if(err) throw err;
            console.log("1 record inserted"); //checked
        });
  res.redirect('/users')// update added dream
};


module.exports.search = function (req, res) {
  var q = req.query.q;
  con.query('SELECT * FROM users', function (err, result) { // retrieve data 
    if (err) throw err;
    var matchedUsers = result.filter(function(user){
      return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render('./users/users', { users: matchedUsers});

  });
};
module.exports.delete =  function(req, res){
  var id = req.params.id;
 con.query('DELETE FROM users WHERE id = ?',id, function (err, result){
  if (err) throw err;
  res.redirect('/users');

 });
};

module.exports.edit = function(req, res){
  var id = req.params.id; 
  con.query('SELECT * FROM users WHERE id = ?',id, function (err, result){
    if (err) throw err;
    res.render('./users/editUser', {users : result});
});
};
module.exports.postEdit =  function(req, res){
  
  con.query('UPDATE users SET username = ? ,password = ?, name=?, dateofbirth=?, gender=?, phone=?, idcard=?, address=?, datein=?  WHERE id =? ',[req.body.username, md5(req.body.password), req.body.name, req.body.dateofbirth, req.body.gender, req.body.phone, req.body.idcard, req.body.address, req.body.datein, req.params.id],  function(err, result){
    if (err) throw err;
    res.redirect('/users');
  });
};



