const goToListButton = document.querySelector("#list-button")
goToListButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/list"
})

let drinkItems = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    drinkItems = await res.json()
    makeDrinkList()
}
let items = JSON.parse(localStorage.getItem("cartItems"))

function makeDrinkList() {
    const orderList = document.querySelector("#order-list")
    orderList.innerHTML = ""
    for (let i = 0; i < items.length; i++) {
        const foundItem = drinkItems.find(function (a) { //이걸 따로 함수로 빼려면?
            return a.Id == items[i].Id
        })
        orderList.innerHTML += `<div class="lists">
            <div class="drink-image" >
                <img src="${foundItem.Src}" width="60" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${foundItem.Name}</li>  
                <li>가격 : ${foundItem.Price} 원</li>    
                <li>수량 : <button class="minusCounts" data-index=${i} >-</button>${items[i].Count}개
                <button class="plusCounts" data-index=${i}>+</button></li>      
                <button class="delete-buttons" data-index=${i}>x</button>
                <p>Hit!</p>
            </ul>
        </div>`
    }
    totalPrice()
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-buttons")) {
        deleteList(e.target.dataset.index)
    } else if (e.target.classList.contains("plusCounts")) {
        plusCount(e.target.dataset.index)
    } else if (e.target.classList.contains("minusCounts")) {
        minusCount(e.target.dataset.index)
    } else if ((e.target.id = "total-pay")) {
        sendCartItems()
    }
})

async function deleteList(i) {
    const confirmDelete = confirm("삭제하시겠습니까?")
    if (!confirmDelete) {
        return
    }
    items.splice(i, 1)
    console.log(items)
    localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
}

function totalPrice() {
    let total = 0
    for (let i = 0; i < items.length; i++) {
        const foundItem = drinkItems.find(function (a) { 
            return a.Id == items[i].Id
        })
        total += items[i].Count * foundItem.Price 
    }
    document.querySelector("#totalPay").innerHTML = total
    console.log(total)
}

async function sendCartItems() {
    await fetch(`http://localhost:8080/sendCartItems`, {
        // TODO API명 변경
        method: "POST",
        body: JSON.stringify(items),
    })
}
//플러스 버튼눌렀을 때 items 값 갱신시키고 로컬스토리지에 업뎃
function plusCount(selectedIndex) {
    items[selectedIndex].Count += 1
    localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
}

//마이너스 버튼눌렀을 때 items 값 갱신시키고 로컬스토리지에 업뎃
function minusCount(selectedIndex) {
    //수량이 1미만이면 작동 막는 코드
    if (items[selectedIndex].Count==1) {
        return
    } 
    items[selectedIndex].Count -= 1
    localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
}



//토탈금액 잘 나오게 하기
 //플러스 버튼 누르면 로컬스토리지 카운트 올라가게 하기
//마이너스 버튼 누르면 로컬스토리지 카운트 내려가게 하기
//카운트가 1미만이 되면 작동 멈추기