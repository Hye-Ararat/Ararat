import axios from 'axios';

export default async function SignUp(firstName, lastName, username, email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      await axios.post(`/api/v1/auth/signup`, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password
      });
    } catch (error) {
      return reject(Error('An error occured while creating the user'));
    }
    return resolve("Success");
  })
}