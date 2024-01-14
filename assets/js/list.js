const cartButton = document.querySelector("#cart-button")
cartButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/cart"
})

let data
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    data = await res.json()
    console.log(data)
    makeDrinkItemList()
}

function makeDrinkItemList() {
    document.querySelector("#drinkList").innerHTML = ""
    for (let i = 0; i < data.DrinkItems.length; i++) {
        let style = data.DrinkItems[i].Id == data.MaxId ? "" : "display:none"
        if (data.MaxId == 0 && i == 0) { // 주문된 상품이 하나도 없으면 아메리카노를 베스트로 표시
            style = ""
        }

        document.querySelector(
            "#drinkList"
        ).innerHTML += `<button class="drinks">
            <img
            src="${data.DrinkItems[i].Src}"
            width="60"
            height="95"
            alt=""
        />
        <span>${data.DrinkItems[i].Name}</span>
        <img
                    id="bestIcon"
                    src="../assets/images/best-icon.jpg"
                    alt=""
                    style="${style}"
                />
        </button>`
    }
    const drinks = document.querySelectorAll(".drinks")
    for (let i = 0; i < drinks.length; i++) {
        drinks[i].addEventListener("click", function () {
            putItemToCart(i)
        })
    }
}

const drinks = document.querySelectorAll(".drinks")
for (let i = 0; i < drinks.length; i++) {
    drinks[i].addEventListener("click", function () {
        putItemToCart(i)
    })
}

function putItemToCart(i) {
    if (!confirm("장바구니에 추가하시겠습니까?")) {
        return
    }

    const localStorageData = JSON.parse(localStorage.getItem("cartItems"))
    const cartItems = localStorageData == undefined ? [] : localStorageData

    const foundIndex = cartItems.findIndex(function (a) {
        return a.Id == data.DrinkItems[i].Id
    })

    if (foundIndex == -1) {
        cartItems.push({
            Id: data.DrinkItems[i].Id,
            Count: data.DrinkItems[i].Count,
            Option : data.DrinkItems[i].Option, // 일단 기본 값 설정해둠 
        })
    } else {
        cartItems[foundIndex].Count += 1
    }

    console.log(cartItems)
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    if (!confirm) {
        ;("추가가 완료 되었습니다! 장바구니로 이동하시겠습니까?")
        return
    }
    location.href = "http://localhost:8080/cart"
}
