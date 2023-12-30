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
        //상수는 스코프안에서의 값만 안바뀌면됨
        //현재 for 안이니까 한번돌때마다 새로만들어지는거임
        //파운드 인덱스도 요소 하나하나씩 도는것
        //상황에 따라 쓰면되고 인덱스를 찾고 싶다면 findindex , 요소 그 자체를 찾고싶다면 find 함수 쓰면 됨 
        const foundItem = drinkItems.find(function(a) {
            //여기서 foundIndex는 변수로 선언해야되는거지? 상수선언해도 되는데 왜지 값이 바뀌는데?
            return a.Id == items[i].Id
        })
        console.log(foundItem)
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
            </ul>
        </div>`
    }
    totalPrice()
}

// function index() {
//     return drinkItems.findIndex(function (a) { //여기서 리턴은 함수 값을 리턴할때 사용 
//         return a.Id == items[i].Id  // 여기서 리턴은 문법 => 리턴한 값이 파인드인덱스에 담김.
//     })
// }

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
    items.splice(i,1)
    console.log(items)
    localStorage.setItem("cartItems", JSON.stringify(items))
    makeDrinkList()
   // 로컬 스토리지에서 클릭한 아이템 제거한 후 다시 저장
   //['아아']
}
//토탈금액 잘 나오게 하기
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
//플러스 버튼 누르면 로컬스토리지 카운트 올라가게 하기
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
