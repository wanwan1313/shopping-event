import api from "./api.js";
const orderList = document.querySelector("table.orderPage-table");
const discardAllBtn = document.querySelector("a.discardAllBtn");

//畫面初始化
let order_arr = [];
init();

async function init() {
  try {
    const order_data = await api.getOrderList();
    order_arr = order_data.orders;
    // console.log(order_arr);
    renderOrder(order_arr);
  } catch (e) {}
}

//訂購清單樣板
const allListTpl = (orderTpl) => {
  if (orderTpl) {
    return `
        <thead>
            <tr>
                <th>訂單編號</th>
                <th>聯絡人</th>
                <th>聯絡地址</th>
                <th>電子郵件</th>
                <th>訂單品項</th>
                <th>訂單日期</th>
                <th>訂單狀態</th>
                <th>操作</th>
            </tr>
        </thead>
        ${orderTpl}
    `;
  } else {
    return `<tr>目前尚無訂購清單</tr>`;
  }
};
const orderTpl = (item) => {
  let titleHtml = "";
  item.products.forEach((el) => {
    titleHtml += `<p>${el.title}</p>`;
  });
  return `
    <tr>
        <td>${item.id}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td style="width:150px">
            ${titleHtml}
        </td>
        <td style="width:120px">${
          new Date(item.createdAt).toISOString().split("T")[0]
        }</td>
        <td class="orderStatus" style="width:100px">
            <a href="#" data-id="${item.id}" data-action="edit" data-status="${
    item.paid
  }">${item.paid ? "已付款" : "未處理"}</a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${
              item.id
            }" data-action="delete">
        </td>
    </tr>`;
};

//產生訂購清單畫面
function renderOrder(data) {
  let allHtml = "";
  data.forEach((e) => {
    allHtml += orderTpl(e);
  });
  orderList.innerHTML = allListTpl(allHtml);
  renderChart()
}

//訂單功能
async function orderAction(event) {
  event.preventDefault();
  if(!event.target.getAttribute("data-action")) return false;
  switch (event.target.getAttribute("data-action")) {
    case "delete": {
      try {
        const order_data = await api.deleteOrderItem(
          event.target.getAttribute("data-id")
        );
        order_arr = order_data.orders;
        renderOrder(order_arr);
        alert(`已成功將訂單編號:${event.target.getAttribute("data-id")}刪除`);
      } catch (e) {}
      break;
    }
    case "edit": {
      if (event.target.getAttribute("data-status") === "false") {
        const data = {
          id: event.target.getAttribute("data-id"),
          paid: true,
        };
        const order_data = await api.editOrderList({ data });
        order_arr = order_data.orders;
        renderOrder(order_arr);
        alert(
          `已成功將訂單編號:${event.target.getAttribute(
            "data-id"
          )}狀態更改為已付款`
        );
      }
      break;
    }
  }
}

//清除全部訂單
async function deleteAll(){
    event.preventDefault();
    try{
        const order_data = await api.deleteAllOrder()
        order_arr = [];
        renderOrder(order_arr);
        alert(order_data.message)
    }catch(e){}
}

//監聽事件
orderList.addEventListener("click", orderAction);
discardAllBtn.addEventListener("click", deleteAll);


function renderChart(){
  console.log(order_arr)
  let totalObj = {};
  order_arr.forEach( el => {
    el.products.forEach( el => {
      if(!totalObj[el.title]){
        totalObj[el.title] = 1;
      }else{
        totalObj[el.title] += el.quantity;
      }
    })
  })
  Object.entries(totalObj)
  c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns:Object.entries(totalObj),
      colors: {
        "Louvre 單人床架": "#D3E4CD",
        "Charles 系列儲物組合": "#99A799",
        "Charles 雙人床架": "#F2DDC1",
        "Louvre 雙人床架／雙人加大": "#E2C2B9",
        "Jordan 雙人床架／雙人加大": "#B8E4F0",
        "Antony 雙人床架／雙人加大": "#98BAE7",
        "Antony 遮光窗簾": "#FFAFAF",
        "Antony 床邊桌": "#00A19D",
      },
    },
  });
}
