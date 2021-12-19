import api from "./api.js";
//DOM
const product = document.querySelector("ul.productWrap");
const productSelect = document.querySelector('select[name="productSelect"]');
const cart = document.querySelector("table.shoppingCart-table");
const form = document.querySelector('form[name="orderForm"]');
const submit = document.querySelector('input[type="submit"]');
const inputs = document.querySelectorAll("input");
//表單驗證
const constraints = {
    name: {
      presence: {
        message: "是必填的欄位",
      },
      length: {
        minimum: 2,
        message: "請輸入正確的姓名",
      },
    },
    phone: {
      presence: {
        message: "是必填的欄位",
      },
      format: {
        pattern: "^[0-9-#()+s]{7,}$",
        message: "請輸入正確的手機格式",
      },
    },
    email: {
      presence: {
        message: "是必填的欄位",
      },
      email: {
        message: "請輸入正確的email格式",
      },
    },
    address: {
      presence: {
        message: "是必填的欄位",
      },
      length: {
        minimum: 6,
        message: "請輸入正確的地址",
      },
    },
};


//畫面初始化
let product_arr = [];
let cart_arr = [];
init();


async function init() {
  try {
    const product_data = await api.getProducts();
    product_arr = product_data.products;
    renderProduct(product_arr);
    const cart_data = await api.getCartProducts();
    cart_arr = cart_data.carts;
    console.log(cart_arr);
    renderCart(cart_arr, cart_data.finalTotal);
  } catch (e) {}
}

//產品樣板
const productCardTpl = (item) => {
  return `
<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}" data-title="${
    item.title}" data-action="add">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price.toLocaleString(
      "en-US"
    )}</del>
    <p class="nowPrice">NT$${item.price.toLocaleString("en-US")}</p>
</li>`;
};
//購物車樣板
const allCartTpl = (productTpl, total) => {
  if (productTpl) {
    return `
        <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
        </tr> 
        ${productTpl}             
        <tr>
            <td>
                <a href="#" class="discardAllBtn" data-action="deleteAll">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
                <p>總金額</p>
            </td>
            <td>NT$${total.toLocaleString("en-US")}</td>
        </tr>
`;
  } else {
    return "<tr>尚未加入商品至購物車喔！</tr>";
  }
};
const cartProductTpl = (item) => {
  return `
<tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$${item.product.price.toLocaleString("en-US")}</td>
    <td><input type="number" value="${
      item.quantity
    }" data-action="editItem" data-id="${item.id}"></td>
    <td>NT$${(item.product.price * item.quantity).toLocaleString("en-US")}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-action="deleteItem" data-id="${
          item.id
        }" data-title="${item.product.title}">
            clear
        </a>
    </td>
</tr>`;
};

//產生產品畫面
function renderProduct(data) {
  let allHtml = "";
  data.forEach((e) => {
    allHtml += productCardTpl(e);
  });
  product.innerHTML = allHtml;
}

//產生購物車畫面
function renderCart(data, price) {
  let allHtml = "";
  data.forEach((e) => {
    allHtml += cartProductTpl(e);
  });
  cart.innerHTML = allCartTpl(allHtml, price);
}

//搜尋產品
function searchProducts(event) {
  switch (event.target.value) {
    case "全部":
      renderProduct(product_arr);
      break;
    default:
      const filter_arr = product_arr.filter(
        (e) => e.category === event.target.value
      );
      renderProduct(filter_arr);
      break;
  }
}

//加入購物車
async function addToCart(event) {
  event.preventDefault();
  if(!event.target.getAttribute("data-action")) return false;
  try {
    const data = {
      productId: event.target.getAttribute("data-id"),
      quantity: 1,
    };
    const cart_data = await api.addCartItem({ data });
    cart_arr = cart_data.carts;
    renderCart(cart_arr, cart_data.finalTotal);
    alert(`已成功將${event.target.getAttribute("data-title")}加入購物車`);
  } catch (e) {}
}

//購物車功能(編輯數量/刪除)
async function CartAction(event) {
  event.preventDefault();
  if(!event.target.getAttribute("data-action")) return false;
  switch (event.target.getAttribute("data-action")) {
    case "deleteItem": {
      try {
        const cart_data = await api.deleteCartItem(
          event.target.getAttribute("data-id")
        );
        cart_arr = cart_data.carts;
        renderCart(cart_arr, cart_data.finalTotal);
        alert(`已成功將${event.target.getAttribute("data-title")}刪除`);
      } catch (e) {}
      break;
    }
    case "deleteAll": {
      try {
        await api.deleteCartAll();
        cart_arr = [];
        renderCart(cart_arr);
        alert(`已清空購物車`);
      } catch (e) {}
      break;
    }
    case "editItem": {
      try {
        const data = {
          id: event.target.getAttribute("data-id"),
          quantity: parseInt(event.target.value),
        };
        const cart_data = await api.editCartItem({ data });
        cart_arr = cart_data.carts;
        renderCart(cart_arr, cart_data.finalTotal);
      } catch (e) {
        event.target.value = 1;
      }
    }
  }
}

//送出訂單+檢查表單
function checkSubmit(event) {
  event.preventDefault();
  const checkList = [
    form.customerName,
    form.customerPhone,
    form.customerEmail,
    form.customerAddress,
    form.tradeWay,
  ];
  checkList.forEach((el) => {
    showError(el.name);
  });
  const error = validate(form, constraints);
  if (error) {
    Object.keys(error).forEach((el) => {
      showError(el, error[el][0].split(" ")[1]);
    });
    return false;
  }
  const data = {
    user: {
      name: checkList[0].value,
      tel: checkList[1].value,
      email: checkList[2].value,
      address: checkList[3].value,
      payment: checkList[4].value,
    },
  };
  sendOrder(data)

}

//檢查input
function checkInput() {
  const name = this.name;
  const error = validate(form, constraints);
  if (error && error[name]) {
    showError(name, error[name][0].split(" ")[1]);
  } else {
    showError(name);
  }
}

//顯示錯誤訊息
function showError(name, error) {
  const text = document.querySelector(`p[data-message="${name}"]`);
  if (error) {
    text.innerText = error;
    return;
  }
  if (text) text.innerText = "";
}

//成功送出表單
async function sendOrder(data){
    try{
        await api.createOrder({data})
        cart_arr = [];
        renderCart(cart_arr);
        form.reset();
        alert(`訂購成功`);
    }catch(e){}
}

//監聽事件
productSelect.addEventListener("change", searchProducts);
product.addEventListener("click", addToCart);
cart.addEventListener("click", CartAction);
submit.addEventListener("click", checkSubmit);
inputs.forEach((el) => {
  el.addEventListener("blur", checkInput);
});
