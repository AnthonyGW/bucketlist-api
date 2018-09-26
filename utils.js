'use strict';

// verify the entire signup form
function verifySignup(body){
  if( !body.email || !body.username || !body.password || !body.confirmPassword )
    return createError("All fields required.", 400);

  if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(body.email))
    return createError("Incorrect email format.", 400);
  
  if(body.password !== body.confirmPassword)
    return createError("Passwords do not match.", 400);

  return true;
}

// generate an error with a custom message and status code
function createError(message, status){
  var err = new Error(message);
  err.status = status;
  return err;
}

module.exports.verifySignup = verifySignup;