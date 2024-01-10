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
// const foundIndex = cartItems.findIndex(function (a) {
//     return a.Id == data[i].Id
// })

function makeDrinkItemList() {
    document.querySelector("#drinkList").innerHTML = ""
    for (let i = 0; i < data.DrinkItems.length; i++) {
        // TODO 삼항연산자로 변경
        let style
        if (data.MaxId == 0 && i == 0) {
            style = ""
        } else if (data.DrinkItems[i].Id == data.MaxId) {
            style = ""
        } else {
            style = "display:none"
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
        return a.Id == data[i].Id
    })

    if (foundIndex == -1) {
        cartItems.push({
            Id: data[i].Id,
            Count: data[i].Count,
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
