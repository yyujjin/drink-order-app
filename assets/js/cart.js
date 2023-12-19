const goToListButton = document.querySelector("#list-button")
goToListButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/list"
})

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
        orderList.innerHTML += `<div class="lists"  id="${adjustSpacing(i)}">
            <div class="drink-image" >
                <img src="${items[i].Src}" width="60" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${items[i].Name}</li>  
                <li>가격 : ${items[i].Price} 원</li>    
                <li>수량 : <button class="minusCounts" >-</button>${
                    items[i].Count
                }개
                <button class="plusCounts" >+</button></li>      
                <button class="delete-buttons">x</button>
            </ul>
        </div>`
    }
    const deleteButtons = document.querySelectorAll(".delete-buttons")
    const plusCounts = document.querySelectorAll(".plusCounts")
    const minusCounts = document.querySelectorAll(".minusCounts")
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function () {
            deleteList(i)
        })
        plusCounts[i].addEventListener("click", function () {
            plusCount(i)
        })
        minusCounts[i].addEventListener("click", function () {
            minusCount(i)
        })
    }
    getTotalPrice()
}

function adjustSpacing(i) {
    if (i == 0) {
        return "first-list"
    }
}

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
        getTotalPrice()
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
}

getTotalPrice()
function getTotalPrice() {
    // items에 있는 객체의 count와 prcie를 계산
    // 각 객체의 count * price 한 값을 모두 더하기!
    // 숙제!!
  
    // 실행하면 에러나니깐 일단 주석 처리
    // const totalPrice = document.querySelector("span")
    // totalPrice.innerHTML = `${price}`
}

function plusCount(selectedIndex) {
    // 기존 count에서 +1 한 값을 다시 저장하기
    items[selectedIndex].Count += 1 
    console.log(items[selectedIndex])
    makeDrinkList()
}

async function minusCount(i) {
    try {
        await fetch(`http://localhost:8080/minusCount/${i}`, {
            method: "PUT",
        })
        getCartItems()
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
}
