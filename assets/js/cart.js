//isIceOption bool `json:"isIceOption"`  ture = ice  false = hot or select
let data = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    data = await res.json() //JSON.parse 역할 함. 객체로 변환돼서 담김.
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
        //option 선택할 수 있는 음료에만 radio 표시하기
        //id와 label for에 i를 넣어서 다른 id 생성했고
        //name명도 변경해줌
        // const style = foundItem.Option == 0 ? "" : "display:none"
        // 선택된 옵션이 날아가지 않게 고정시킴
        const checkedHot = cartItems[i].IsIceOption == false ? "checked" : ""
        const checkedIce = cartItems[i].IsIceOption == true ? "checked" : ""

        orderList.innerHTML += `<div class="lists">
            <div class="drink-image" >
                <img src="${foundItem.Src}" width="60" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${foundItem.Name}</li>  
                <li>가격 : ${foundItem.Price} 원</li>    
                <li>수량 : <button class="minusCounts" data-index=${i} >-</button>${cartItems[i].Count}개
                <button class="plusCounts" data-index=${i}>+</button></li>
                <div class="options">
                    <input id="hot${i}" type="radio" name="option${i}"  ${checkedHot} >
                    <label for="hot${i}" >Hot</label>
                    <input id="ice${i}" type="radio" name="option${i}" ${checkedIce}  >
                    <label for="ice${i}" >Ice</label>
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
        // TODO API명 변경
        method: "POST",
        body: JSON.stringify(cartItems),
    })
    //주문하기 눌렀을 때 장바구니 비우기
    cartItems = null
    localStorage.clear("cartItems")
    // localStorage.setItem("cartItems", JSON.stringify(items))
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
