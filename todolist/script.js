const todoList = [
    {
        content: "整理今日工作進度",
        status: true
    }, {
        content: "回覆客戶電子郵件",
        status: true
    }, {
        content: "準備下午會議資料",
        status: false
    }, {
        content: "更新每月收支報表",
        status: false
    }, {
        content: "整理辦公室文件",
        status: false
    },
];

const todoInput = document.querySelector(".card input");
const addBtn = document.querySelector(".btn_add");
const list = document.querySelector(".list");
const tab = document.querySelector(".tab");
const listFooter = document.querySelector(".list_footer p");
const clearBtn = document.querySelector(".list_footer a");


// 渲染
let currentTab = "全部";
function renderTodoList() {
    let html = "";
    todoList.forEach((item, index) => {
        if (currentTab === "待完成" && item.status === true) {
            return;
        }

        if (currentTab === "已完成" && item.status === false) {
            return;
        }

        html += `
        <li>
        <label class="checkbox" for="">
        <input type="checkbox" data-index="${index}" ${item.status ? 'checked' : ''}/>
        <span>${item.content}</span>
        </label>
        <a href="#" class="delete" data-index="${index}"></a>
        </li>`;
    });
    list.innerHTML = html;

    // 顯示待完成數量
    let count = 0;
    todoList.forEach((item) => {
        if (item.status === false) {
            count++;
        }
    });
    listFooter.textContent = `${count} 個待完成項目`;
}
renderTodoList();


// 新增
function addTodo() {
    const content = todoInput.value.trim();
    if (content === "") {
        alert("請輸入待辦事項");
        return;
    }
    const newTodo = {
        content: content,
        status: false
    };
    todoList.push(newTodo);
    todoInput.value = "";
    renderTodoList();
}

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTodo();
});

todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});


// 刪除
list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        e.preventDefault();
        const index = Number(e.target.getAttribute("data-index"));
        todoList.splice(index, 1);
        renderTodoList();
    }
});


// 狀態
list.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
        const index = Number(e.target.getAttribute("data-index"));
        todoList[index].status = e.target.checked;
        renderTodoList();
    }
});


// 切換
tab.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        tab.querySelectorAll("li").forEach((item) => {
            item.classList.remove("active");
        });
        e.target.classList.add("active");
        currentTab = e.target.textContent.trim();
        renderTodoList();
    }
});


// 清除
clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    for (let i = todoList.length - 1; i >= 0; i--) {
        if (todoList[i].status === true) {
            todoList.splice(i, 1);
        }
    }
    renderTodoList();
});