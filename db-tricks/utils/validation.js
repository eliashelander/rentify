const validateNewUser = (userInput) => {
  const { name, email } = userInput;
  const userDetails = {};
  // first time we guess the first and last name
  const firstName = name.match(/([^\s]*)/);
  const lastNames = name.match(/\s(.*)/);
  userDetails.name = name;
  userDetails.first_name = firstName ? firstName[1] : name;
  userDetails.last_name = lastNames ? lastNames[1] : name;
  userDetails.email = email;
  userDetails.details = {};
  return userDetails;
}

const validateUser = (id, userInput) => {
  const { name, first_name, last_name, details } = userInput;
  if (name.trim() === '' || first_name.trim() === '' || last_name.trim() === '') throw Error('Invalid name');
  const userDetails = {};
  userDetails.id = Number(id);
  userDetails.name = name;
  userDetails.first_name = first_name;
  userDetails.last_name = last_name;
  userDetails.details = JSON.stringify(details);
  console.log(userDetails);
  return userDetails;
}

module.exports = { validateUser, validateNewUser }