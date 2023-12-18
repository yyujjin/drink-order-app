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

async function putItemToCart(i) {
    const confirmPut = confirm("장바구니에 추가하시겠습니까?")
    if (!confirmPut) {
        return
    }
    try {
        await fetch(`http://localhost:8080/addToCart/${i}`, {
            method: "POST",
        })
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
