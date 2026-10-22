// https://data.moa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx?IsTransData=1&UnitId=037

let marketData = [];
let currentData = [];
let loadStatus = "loading";
const tableBody = document.querySelector(".showList");
const categoryBtns = document.querySelectorAll(".btn-type");
const cropInput = document.querySelector("#crop");
const searchBtn = document.querySelector(".search");
const cropResultText = document.querySelector("#js-crop-name");
const sortSelect = document.querySelector("#js-select");
const sortButtons = document.querySelectorAll(".sort-advanced i");


// 共用函式
function renderMessage(message) {
    tableBody.innerHTML = `
    <tr>
        <td colspan="7" class="text-center p-3">${message}</td>
    </tr>`;
}


// 載入
renderMessage("資料載入中⋯");
// 取得 API 資料
axios.get('https://data.moa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx?IsTransData=1&UnitId=037')
    .then(function (response) {
        loadStatus = "success";
        marketData = response.data;
        renderMessage("請輸入並搜尋想比價的作物名稱 ^＿^");
    })
    .catch(function (error) {
        loadStatus = "error";
        renderMessage("資料載入失敗，請稍後再試。");
        console.error(error);
    });


// 分類
categoryBtns.forEach((button) => {
    button.addEventListener("click", () => {
        if (loadStatus !== "success") {
            return;
        }
        const filteredData = marketData.filter((item) => {
            return item.種類代碼 === button.dataset.type;
        });
        currentData = filteredData;
        renderTable(currentData);
        sortSelect.selectedIndex = 0;
        cropResultText.textContent = "";
    });
});


// 渲染
function renderTable(data) {
    if (data.length === 0) {
        renderMessage("查詢不到當日的交易資訊 QQ");
        return;
    }
    let html = "";
    data.forEach((product) => {
        html += `
        <tr>
            <td>${product.作物名稱}</td>
            <td>${product.市場名稱}</td>
            <td>${product.上價}</td>
            <td>${product.中價}</td>
            <td>${product.下價}</td>
            <td>${product.平均價}</td>
            <td>${product.交易量}</td>
        </tr>`;
    });
    tableBody.innerHTML = html;
}


// 搜尋
searchBtn.addEventListener("click", () => {
    if (loadStatus !== "success") {
        return;
    }
    const keyword = cropInput.value.trim();
    if (keyword === "") {
        alert("請輸入作物名稱");
        return;
    }
    const searchedData = marketData.filter((item) => {
        return item.作物名稱 && item.作物名稱.includes(keyword);
    });
    currentData = searchedData;
    cropResultText.textContent = `查看「${keyword}」的比價結果`;
    renderTable(currentData);
    sortSelect.selectedIndex = 0;
    cropInput.value = "";
});


// 選單排序
sortSelect.addEventListener("change", () => {
    if (currentData.length === 0) {
        return;
    }
    const selectedOption = sortSelect.value;
    let sortKey = "";
    if (selectedOption === "依上價排序") {
        sortKey = "上價";
    } else if (selectedOption === "依中價排序") {
        sortKey = "中價";
    } else if (selectedOption === "依下價排序") {
        sortKey = "下價";
    } else if (selectedOption === "依平均價排序") {
        sortKey = "平均價";
    } else if (selectedOption === "依交易量排序") {
        sortKey = "交易量";
    } else {
        return;
    }
    sortData(sortKey, "down");
});


// 排序
sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (currentData.length === 0) {
            return;
        }
        const sortKey = button.dataset.price;
        const sortDirection = button.dataset.sort;
        sortData(sortKey, sortDirection);
        sortSelect.selectedIndex = 0;
    });
});

function sortData(sortKey, sortDirection) {
    const sortedData = [...currentData];
    if (sortDirection === "up") {
        sortedData.sort((productA, productB) => {
            return productA[sortKey] - productB[sortKey];
        });
    } else if (sortDirection === "down") {
        sortedData.sort((productA, productB) => {
            return productB[sortKey] - productA[sortKey];
        });
    }
    renderTable(sortedData);
}