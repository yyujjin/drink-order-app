let data = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    data = await res.json()
    console.log(data)
    makeDrinkList()
}
let cartItems = JSON.parse(localStorage.getItem("cartItems"))
console.log(cartItems)

function makeDrinkList() {
    const orderList = document.querySelector("#order-list")
    orderList.innerHTML = ""

    if (cartItems == null) {
        return
    }
    for (let i = 0; i < cartItems.length; i++) {
        const foundItem = data.DrinkItems.find(function (a) {
            return a.Id == cartItems[i].Id
        })
        const selectedOption = cartItems[i].IsIceOption == true ? "Ice" : "Hot"
        orderList.innerHTML += `<div class="lists">
            <div class="drink-image" >
                <img src="${foundItem.Src}" width="60" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${foundItem.Name}</li>  
                <li>가격 : ${foundItem.Price} 원</li>    
                <li>수량 : <button class="minusCounts" data-index=${i} >-</button>${cartItems[i].Count}개
                <button class="plusCounts" data-index=${i}>+</button></li>
                <p>${selectedOption}</p>
                <button class="delete-buttons" data-index=${i}>x</button>
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
    } else if (e.target.id == "total-pay") {
        orderDrinkItems()
    } else if (e.target.closest("#list-button")) {
        location.href = "http://localhost:8080/list"
    }
})
async function deleteList(i) {
    const confirmDelete = confirm("삭제하시겠습니까?")
    if (!confirmDelete) {
        return
    }
    cartItems.splice(i, 1)
    console.log(cartItems)
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    makeDrinkList()
}

function totalPrice() {
    let total = 0
    if (cartItems == null) {
        document.querySelector("#totalPay").innerHTML = total
        return
    }
    for (let i = 0; i < cartItems.length; i++) {
        const foundItem = data.DrinkItems.find(function (a) {
            return a.Id == cartItems[i].Id
        })
        total += cartItems[i].Count * foundItem.Price
    }
    document.querySelector("#totalPay").innerHTML = total
}

async function orderDrinkItems() {
    if (!confirm("주문하시겠습니까?")) {
        return
    }

    await fetch(`http://localhost:8080/orderDrinkItems`, {
        method: "POST",
        body: JSON.stringify(cartItems),
    })
    cartItems = null
    localStorage.clear("cartItems")
    makeDrinkList()
    totalPrice()
}

function plusCount(selectedIndex) {
    cartItems[selectedIndex].Count += 1
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    makeDrinkList()
}

function minusCount(selectedIndex) {
    if (cartItems[selectedIndex].Count == 1) {
        alert("최소 주문 수량입니다.")
        return
    }
    cartItems[selectedIndex].Count -= 1
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
    makeDrinkList()
}
