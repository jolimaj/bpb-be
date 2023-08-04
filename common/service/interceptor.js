const axios = require("axios");

class AxiosInterceptor {
  constructor(config) {
    this.clientConfig = config;
    this.instance = axios.create();
  }

  #configure(config) {
    config.baseURL = this.clientConfig.baseURL;

    this.clientConfig.headers?.forEach((e) => {
      Object.entries(e).forEach((obj) => {
        const [key, value] = obj;
        config.headers[key] = value;
      });
    });

    return config;
  }

  get axios() {
    const { instance } = this;

    instance.interceptors.request.use(
      async (config) => this.#configure(config),
      (error) => this.#error(error)
    );

    instance.interceptors.response.use(
      (response) => {
        console.log(`AxiosResponse ${JSON.stringify(response?.data)}`);
        return response.data;
      },
      (error) => this.#error(error)
    );

    return instance;
  }

  #error(error) {
    console.log(`AxiosError ${JSON.stringify(error)}`);
    console.log(`AxiosError ${JSON.stringify(error?.response?.data)}`);
    return Promise.reject(error);
  }
}

module.exports = AxiosInterceptor;
