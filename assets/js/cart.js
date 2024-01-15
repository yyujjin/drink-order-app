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
        const style = foundItem.Option == 0 ? "" : "display:none"
        // 선택된 옵션이 날아가지 않게 고정시킴 
        const checkedHot = cartItems[i].Option == 1 ? "checked" : ""
        const checkedIce = cartItems[i].Option == 2 ? "checked" : ""
       
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
                    <input id="hot${i}" type="radio" name="option${i}" value="1" data-index=${i} ${checkedHot} >
                    <label for="hot${i}" style="${style}" >Hot</label>
                    <input id="ice${i}" type="radio" name="option${i}" value="2"data-index=${i} ${checkedIce}  >
                    <label for="ice${i}" style="${style}" >Ice</label>
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
    } else if (e.target.closest("#list-button")) {  //closest 배움
        location.href = "http://localhost:8080/list"
        //이벤트 리스너도 다르게 적용함
        //TODO 로컬스토리지도 변경 하기
    } else if (e.target.id.startsWith("hot")) {
        cartItems[e.target.dataset.index].Option = 1
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    } else if (e.target.id.startsWith("ice")) {
        cartItems[e.target.dataset.index].Option = 2
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
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
    if (cartItems==null) {
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
    //만약 option=0이면 alert $ return
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].Option == 0) {
            alert("옵션을 선택해주세요.")
            return
        }
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












// document.addEventListener("DOMContentLoaded", function () {
//     for (let i = 0; i < items.length; i++) {
//         const savedOption = JSON.parse(localStorage.getItem("cartItems"));
//         if (savedOption !== null) {
//             document.querySelector(`input[name="option${i}"][value="${savedOption[i].Option}"]`).checked = true;
//         }
//     }
// });