const cartButton = document.querySelector("#cart-button")
cartButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/cart"
})

const drinks = document.querySelectorAll(".drinks")
for (let i = 0; i < drinks.length; i++) {
    drinks[i].addEventListener("click", function () {
        putItemToCart(i)
    })
}

let drinkItems = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    drinkItems = await res.json()
}

let cartItems = []
async function putItemToCart(i) {
    const confirmPut = confirm("장바구니에 추가하시겠습니까?")
    if (!confirmPut) {
        return
    }
    try {
        // await fetch(`http://localhost:8080/addToCart/${i}`, {
        //     method: "POST",
        // })
        const findItem = cartItems.findIndex(function (a) {
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
        console.error("네트워크 오류:", error)
    }
}

//버튼을 클릭했을 때 로컬스토리지에 담겼고
//만약 중복된게 있다면 그값이 온전히 담기는게 아니라
//값 변경
