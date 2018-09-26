'use strict';

var error_types = {
  "email is in use": /^E11000 duplicate key error.+email_1/g,
  "username is in use": /^E11000 duplicate key error.+username_1/g
};

// verify the entire signup form
function verifySignup(body){
  if( !body.email.replace(/\s+/g, '')
      || !body.username.replace(/\s+/g, '')
      || !body.password
      || !body.confirmPassword )
    return {status: false, error: createError("All fields required.", 400)};

  if(!/^\w+?\.?\w+@[a-zA-Z0-9_]+?\.[a-zA-Z]{2,3}$/.test(body.email))
    return {status: false, error: createError("Incorrect email format.", 400)};
  
  if(body.password !== body.confirmPassword)
    return {status: false, error: createError("Passwords do not match.", 400)};

  return {status: true};
}

// refactor error messages
function refactorError(error){
  for(var error_type in error_types){
    if(error.message.search(error_types[error_type]) !== -1){
      error.message = error_type;
      error.status = 400;
    };
  }
  return error;
}

// generate an error with a custom message and status code
function createError(message, status){
  var err = new Error(message);
  err.status = status;
  return err;
}

module.exports.verifySignup = verifySignup;
module.exports.createError = createError;
module.exports.refactorError = refactorError;
