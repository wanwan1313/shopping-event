function loading(show) {
  const loading_wrap = document.querySelector(".loading");
  if (show) {
    const loading = document.querySelector(".img-loading");
    loading.style.left = `${window.innerWidth / 2}px`;
    loading.style.top = `${window.innerHeight / 2 + window.scrollY}px`;
    loading_wrap.style.display = "block";
  } else {
    loading_wrap.style.display = "none";
  }
}

const instance = axios.create({
  baseURL: "https://livejs-api.hexschool.io/api/livejs/v1/",
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    loading(true)
    return config;
  },
  (error) => {
    loading(false)
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    loading(false)
    if (response.data.status) {
      return Promise.resolve(response.data);
    } else {
      alert(response.data.message);
      return Promise.reject();
    }
  },
  (error) => {
    loading(false)
    if (error.response.status === 404) {
      console.log(error.response.data.message);
    } else {
      alert(error.response.data.message);
    }
    return Promise.reject();
  }
);

export default instance;
