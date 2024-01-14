// const goToListButton = document.querySelector("#list-button")
// goToListButton.addEventListener("click", function () {
//     location.href = "http://localhost:8080/list"
// })

let data = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    data = await res.json() //JSON.parse 역할 함. 객체로 변환돼서 담김.
    console.log(data)
    makeDrinkList()
}
let items = JSON.parse(localStorage.getItem("cartItems"))
console.log(items)

function makeDrinkList() {
    const orderList = document.querySelector("#order-list")
    orderList.innerHTML = ""

    if (items == null) {
        return
    }
    for (let i = 0; i < items.length; i++) {
        const foundItem = data.DrinkItems.find(function (a) {
            return a.Id == items[i].Id
        })
        console.log(foundItem.Option)
        //option 선택할 수 있는 음료에만 radio 표시하기
        const style = foundItem.Option == 0 ? "" : "display:none"
        orderList.innerHTML += `<div class="lists">
            <div class="drink-image" >
                <img src="${foundItem.Src}" width="60" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${foundItem.Name}</li>  
                <li>가격 : ${foundItem.Price} 원</li>    
                <li>수량 : <button class="minusCounts" data-index=${i} >-</button>${items[i].Count}개
                <button class="plusCounts" data-index=${i}>+</button></li>
                <div class="options">
                    <input id="hot" type="radio" name="option" value="0" data-index=${i}>
                    <label for="hot" style="${style}" >hot</label>
                    <input id="ice" type="radio" name="option" value="1"data-index=${i}>
                    <label for="ice" style="${style}" >ice</label>
                </div>   
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
    }else if(e.target.id == "hot") {
        items[e.target.dataset.index].Option = 1
        console.log(items)
    }else if(e.target.id == "ice") {
        items[e.target.dataset.index].Option = 2
        console.log(items)
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
        const foundItem = data.DrinkItems.find(function (a) {
            return a.Id == items[i].Id
        })
        total += items[i].Count * foundItem.Price
    }
    document.querySelector("#totalPay").innerHTML = total
}

async function orderDrinkItems() {
    if (!confirm("주문하시겠습니까?")) {
        return
    }
    await fetch(`http://localhost:8080/orderDrinkItems`, {
        // TODO API명 변경
        method: "POST",
        body: JSON.stringify(items),
    })
    items = null
    localStorage.clear("cartItems")
    // localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
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

