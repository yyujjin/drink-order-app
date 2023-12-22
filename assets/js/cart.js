const goToListButton = document.querySelector("#list-button")
goToListButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/list"
})

//async = 비동기방식
let items
getCartItems()
async function getCartItems() {
    const res = await fetch("http://localhost:8080/getCartItems")
    items = await res.json()
    console.log(items)
    makeDrinkList()
}

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
                <li>수량 : <button class="minusCounts" data-index=${i} >-</button>${
                    items[i].Count
                }개
                <button class="plusCounts" data-index=${i}>+</button></li>      
                <button class="delete-buttons" data-index=${i}>x</button>
            </ul>
        </div>`
    }
    totalPrice()
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-buttons")) {
        deleteList(event.target.dataset.index)
    } else if (event.target.classList.contains("plusCounts")) {
        plusCount(event.target.dataset.index)
    } else if (event.target.classList.contains("minusCounts")) {
        minusCount(event.target.dataset.index) //html에서 data 속성 가지고 오는 법 data-index(개발자 맘)
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
    document.querySelector("#totalPay").innerHTML=`${total}`
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
