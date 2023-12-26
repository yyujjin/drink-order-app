const goToListButton = document.querySelector("#list-button")
goToListButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/list"
})
//이거 밑에 추가하기 
//js는 함수먼저 호출이던가?
//async = 비동기방식
//이걸 API가 아니라 로컬스토리지에 있는 정보로 재구현하는걸로 바꾸기 
let items = JSON.parse(localStorage.getItem("cartItems"))
// function makeCartList() {
   
//     // let items = localStorage.getItem(JSON.parse("cartItems"))
//     // JSON.parse(items)
//     console.log(items)
//     makeDrinkList()
// }

// makeCartList()
// getCartItems()
// async function getCartItems() {
//     const res = await fetch("http://localhost:8080/getCartItems") //await => 데이터를 가지고 온후에 밑에 코드 실행
//     items = await res.json()
//     console.log(items)
    makeDrinkList(items)
// }


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
//화면을 켰을때가 아닌 클릭했을 때 실행되는 함수들 
//event라는 변수이름자체도 길어서 e로 많이 씀. e라는 변수에 evnet라는 객체가 담김. 
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-buttons")) {
        deleteList(e.target.dataset.index)
    } else if (e.target.classList.contains("plusCounts")) {
        plusCount(e.target.dataset.index)
    } else if (e.target.classList.contains("minusCounts")) {
        minusCount(e.target.dataset.index) //html에서 data 속성 가지고 오는 법 data-index(개발자 맘)
    } else if (e.target.id = "total-pay") {
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

//localStorage의 특징
//문자열로만 저장가능
//중복된 KEY 허용 안함 / 중복된 키가 있을경우 덮어씀.
//영구적으로 저장가능


// key-value 형식으로 풀어서 여러 개를 저장할 수도 있지만,
// 객체를 통째로 저장하려면 JSON.stringify()를 사용해 객체를 그대로 문자열화 해주어야 한다.
//이렇게 됐을 때 [{이것도 다 문자인지 }]???
// function sendCartItems() {
//     localStorage.setItem("cartItems",JSON.stringify(items))
// }



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