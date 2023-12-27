const goToListButton = document.querySelector("#list-button")
goToListButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/list"
})

let items = JSON.parse(localStorage.getItem("cartItems"))

makeDrinkList(items)

function makeDrinkList() {
    const orderList = document.querySelector("#order-list")
    orderList.innerHTML = ""
    for (let i = 0; i < items.length; i++) {
        orderList.innerHTML += `<div class="lists">
            <div class="drink-image" >
                <img src="${items[i].Src}" width="60" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${items[i].Name}</li>  
                <li>가격 : ${items[i].Price} 원</li>    
                <li>수량 : <button class="minusCounts" data-index=${i} >-</button>${items[i].Count}개
                <button class="plusCounts" data-index=${i}>+</button></li>      
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
    } else if ((e.target.id = "total-pay")) {
        sendCartItems()
    }
})

async function deleteList(i) {
    const confirmDelete = confirm("삭제하시겠습니까?")
    if (!confirmDelete) {
        return
    }
    try {
        await fetch(`http://localhost:8080/deleteItem/${i}`, {
            method: "DELETE",
        })
        getCartItems()
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
}

function totalPrice() {
    let total = 0
    for (let i = 0; i < items.length; i++) {
        total += items[i].Count * items[i].Price
    }
    console.log(total)
}

async function sendCartItems() {
    await fetch(`http://localhost:8080/sendCartItems`, {
        method: "POST",
        body: JSON.stringify(items),
    })
}

function plusCount(selectedIndex) {
    items[selectedIndex].Count += 1
    console.log(items[selectedIndex])
    makeDrinkList()
}

function minusCount(selectedIndex) {
    items[selectedIndex].Count -= 1
    console.log(items[selectedIndex])
    makeDrinkList()
}

localStorage.removeItem("name")
