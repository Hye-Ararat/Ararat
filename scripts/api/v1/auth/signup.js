import axios from 'axios';

async function SignUp(name, surname, username, email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      var auth_response = await axios.post(`/api/v1/client/auth/signup`, {
        name: name,
        surname: surname,
        username: username,
        email: email,
        password: password,
      });
    } catch (error) {
      return reject(Error('An error occured while sending the request'));
    }
    
      auth_response = auth_response.data;
      if (auth_response.status === 'Success') {
        return resolve('Success');
      } else{
      return reject(Error('An error occured while creating the user'));
    }
  });
}
export default SignUp;
