const instance = axios.create({
    baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/',
    timeout: 5000,
  });

instance.interceptors.response.use(
    (response) => {
      if(response.data.status){
        return Promise.resolve(response.data);
      }else{
        alert(response.data.message)
        return Promise.reject();
      }
    },
    (error) => {
      if(error.response.status === 404){
        console.log(error.response.data.message)
      }else{
        alert(error.response.data.message)
      }
      return Promise.reject();
    }
  );

export default instance;