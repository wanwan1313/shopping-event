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
    console.log(order_arr);
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
}

//訂單功能
async function orderAction(event) {
  event.preventDefault();
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

let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});
