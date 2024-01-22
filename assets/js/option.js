let data = []
let selectedItem
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    data = await res.json()
    console.log(data)
    selectedItem = data.DrinkItems[selectedIndex]
    makeList()
}
const selectedIndex = getQuery()

console.log(selectedIndex)
function getQuery() {
    const query = location.search.split("=")
    return query[1]
}

function makeList() {
    const style = selectedItem.IsIceOption == true ? "display:none" : ""
    const checked = selectedItem.IsIceOption == true ? "checked" : ""

    document.querySelector("#makeList").innerHTML = ` 
        <img src="${selectedItem.Src}" alt="" width="100" height="130" >
        <div>${selectedItem.Name}</div>
        <span>${selectedItem.Price}</span>원
        <div>옵션 선택
            <div class="options">
                <input id="hot" type="radio" name="option" value = "false">
                <label for="hot"  style="${style}">Hot</label>
                <input id="ice" type="radio" name="option" value = "true" ${checked}>
                <label for="ice" >Ice</label>
            </div>   
        </div>
        <button id="addButton" type = "button">장바구니에 담기</button>
    `
}

function putItemToCart() {
    let optionByCustomer = document.querySelector("form").option.value
    selectedItem.IsIceOption = optionByCustomer == "true" ? true : false

    if (optionByCustomer == "") {
        alert("옵션을 선택해 주세요")
        return
    }

    if (!confirm("장바구니에 추가하시겠습니까?")) {
        return
    }

    const localStorageData = JSON.parse(localStorage.getItem("cartItems"))
    const cartItems = localStorageData == undefined ? [] : localStorageData

    const foundIndex = cartItems.findIndex(function (a) {
        return (
            a.Id == selectedItem.Id && a.IsIceOption == selectedItem.IsIceOption
        )
    })

    if (foundIndex == -1) {
        cartItems.push({
            Id: selectedItem.Id,
            Count: selectedItem.Count,
            IsIceOption: selectedItem.IsIceOption,
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
    openCartPagePopUp()
}

document.addEventListener("click", function (e) {
    if (e.target.id == "addButton") {
        putItemToCart(selectedIndex)
    }
})

function openCartPagePopUp() {
    window.open("http://localhost:8080/cart", "fullscreen=yes")
    self.close()
}
