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
        const foundItem = drinkItems.find(function (a) {
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
                <p>BEST</p>
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
    const image = document.querySelector("#myImage")
    console.log(total)
}

async function sendCartItems() {
    await fetch(`http://localhost:8080/sendCartItems`, {
        // TODO API명 변경
        method: "POST",
        body: JSON.stringify(items),
    })
}

function plusCount(selectedIndex) {
    items[selectedIndex].Count += 1
    localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
}

function minusCount(selectedIndex) {
    if (items[selectedIndex].Count == 1) {
        alert("최소 주문 수량입니다.")
        return
    }
    items[selectedIndex].Count -= 1
    localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
}
