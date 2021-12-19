import axios from "./request.js";

const api_path = "wanwan1313";
const token = "pipsINPwtLgXEUStGVgB0JQllrv2";

const api = {
  getProducts: async function () {
    const res = await axios({
      method: "get",
      url: `customer/${api_path}/products`,
    });
    return Promise.resolve(res);
  },
  getCartProducts: async function () {
    const res = await axios({
      method: "get",
      url: `customer/${api_path}/carts`,
    });
    return Promise.resolve(res);
  },
  addCartItem: async function (data) {
    const res = await axios({
      method: "post",
      url: `customer/${api_path}/carts`,
      data,
    });
    return Promise.resolve(res);
  },
  editCartItem: async function (data) {
    const res = await axios({
      method: "patch",
      url: `customer/${api_path}/carts`,
      data,
    });
    return Promise.resolve(res);
  },
  deleteCartItem: async function (cartId) {
    const res = await axios({
      method: "delete",
      url: `customer/${api_path}/carts/${cartId}`,
    });
    return Promise.resolve(res);
  },
  deleteCartAll: async function () {
    const res = await axios({
      method: "delete",
      url: `customer/${api_path}/carts`,
    });
    return Promise.resolve(res);
  },
  createOrder: async function (data) {
    const res = await axios({
      method: "post",
      url: `customer/${api_path}/orders`,
      data
    });
    return Promise.resolve(res);
  },
  getOrderList: async function() {
    const res = await axios({
      method: "get",
      url: `admin/${api_path}/orders`,
      headers:{
        'Authorization': token
      }
    })
    return Promise.resolve(res);
  },
  deleteOrderItem: async function(orderId){
    const res = await axios({
      method: "delete",
      url: `admin/${api_path}/orders/${orderId}`,
      headers:{
        'Authorization': token
      }
    })
    return Promise.resolve(res);
  },
  editOrderList:async function(data){
    const res = await axios({
      method: "put",
      url: `admin/${api_path}/orders`,
      data,
      headers:{
        'Authorization': token
      }
    })
    return Promise.resolve(res);
  },
  deleteAllOrder: async function(){
    const res = await axios({
      method: "delete",
      url: `admin/${api_path}/orders`,
      headers:{
        'Authorization': token
      }
    })
    return Promise.resolve(res);
  },
};

export default api;
