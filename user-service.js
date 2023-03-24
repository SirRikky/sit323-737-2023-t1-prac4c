const fs = require('fs');
const path = require('path');

// Load user data from file
const userDataPath = path.join(__dirname, 'user.json');
const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));

// Find user by ID
function findUserByUsername(username) {
  const users = userData.users;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return users[i];
    }
  }
  return null;
}

module.exports = {
  findUserByUsername
};