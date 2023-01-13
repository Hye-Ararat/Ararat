interface LoginResult {
  authorization: string
}

export default async function Login(email: string, password: string) : Promise<LoginResult> {
  return new Promise(async (resolve, reject) => {
      fetch("/api/v1/auth/login" , {
          method: "POST",
          
          body: JSON.stringify({
              email,
              password
          }),
          cache: "no-cache"
          
      }).then(async res => {
          let dat = res;
          let body = await res.json();
          if (dat.status != 200) return reject(body.metadata);
          return resolve(body.metadata)
      }).catch(err => {
          return reject(err)
      })      
  })
}