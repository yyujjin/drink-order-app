const cartButton = document.querySelector("#cart-button")
cartButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/cart"
})

let drinkItems = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    drinkItems = await res.json()
}

const drinks = document.querySelectorAll(".drinks")
for (let i = 0; i < drinks.length; i++) {
    drinks[i].addEventListener("click", function () {
        putItemToCart(i)
    })
}


function putItemToCart(i) {
    //배열, 객체는 const로 선언해도 내부 값을 바꿀 수 있음. 
    //const로 해봤자 값이 바뀌는데 let으로 해도 되는거 아니야? 라고 생각할 수 있지만 
    // let a = []
    // a = 2 // 변수는 배열로 선언했더라도 숫자를 넣어주면 값이 바뀌는데 상수로 선언하면 이걸 막아줌. 
    const cartItems = JSON.parse(localStorage.getItem("cartItems"))
    const confirmPut = confirm("장바구니에 추가하시겠습니까?")
    if (!confirmPut) {
        return
    }
    try {
        let findItem = cartItems.findIndex(function (a) {
            return a.Name == drinkItems[i].Name
        })

        if (findItem == -1) {
            cartItems.push(drinkItems[i])
        }else {
            cartItems[findItem].Count += 1
        }
        console.log(cartItems)
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
    const confirmPut2 = confirm(
        "추가가 완료 되었습니다! 장바구니로 이동하시겠습니까?"
    )
    if (!confirmPut2) {
        return
    }
    try {
        location.href = "http://localhost:8080/cart"
    } catch (error) {
        console.error("네트워크 오류:", error)ㅇ
    }
}

// 로컬스토리지에 담긴 값으로 장바구니 화면 구현 하고 API 삭제하기 
