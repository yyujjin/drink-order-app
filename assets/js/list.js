const cartButton = document.querySelector("#cart-button")
cartButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/cart"
})

let drinkItems = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    drinkItems = await res.json()
    console.log(drinkItems)
    makeDrinkItemList()
}

function makeDrinkItemList() {
    document.querySelector("#drinkList").innerHTML = ""
    for (let i = 0; i < drinkItems.length; i++) {
        document.querySelector(
            "#drinkList"
        ).innerHTML += `<button class="drinks">
            <img
            src="${drinkItems[i].Src}"
            width="60"
            height="95"
            alt=""
        />
        <span>${drinkItems[i].Name}</span<
        <img
                    id="bestIcon"
                    src="../assets/images/best-icon.jpg"
                    alt=""
                />
        </button>`
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

    const data = JSON.parse(localStorage.getItem("cartItems"))
    const cartItems = data == undefined ? [] : data

    const foundIndex = cartItems.findIndex(function (a) {
        return a.Id == drinkItems[i].Id
    })

    if (foundIndex == -1) {
        cartItems.push({
            Id: drinkItems[i].Id,
            Count: drinkItems[i].Count,
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
