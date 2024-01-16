//일단 드링크 리스트를 가지고 있어야할것같음
let data = []
getDrinkItems()
async function getDrinkItems() {
    const res = await fetch("http://localhost:8080/getDrinkItems")
    data = await res.json()
    console.log(data)
    makeList()
}
//list.js 에서 선택된 index의 값을 쿼리로 넘겨서 option.js에서 그 값에 해당하는 메뉴작성
const selectedIndex = getQuery()

console.log(selectedIndex)
function getQuery() {
    const query = location.search.split("=")
    return query[1]
}

function makeList() {
    document.querySelector(
        "#makeList"
    ).innerHTML = ` <img src="${data.DrinkItems[selectedIndex].Src}" alt="" width="100" height="130" >
<div>${data.DrinkItems[selectedIndex].Name}</div>
<span>${data.DrinkItems[selectedIndex].Price}</span>원
<div>옵션 선택
    <div class="options">
        <input id="hot" type="radio" name="option" value="1">
        <label for="hot" >Hot</label>
        <input id="ice" type="radio" name="option" value="2" >
        <label for="ice" >Ice</label>
    </div>   
</div>
<button id="addButton" >장바구니에 담기</button>`
}

//장바구니에 추가하기 버튼을 누르면 실행되는 코드
function putItemToCart() {
    if (!confirm("장바구니에 추가하시겠습니까?")) {
        return
    }

    const localStorageData = JSON.parse(localStorage.getItem("cartItems"))
    const cartItems = localStorageData == undefined ? [] : localStorageData

    const foundIndex = cartItems.findIndex(function (a) {
        return a.Id == data.DrinkItems[selectedIndex].Id
    })
    if (
        foundIndex == -1 ||
        data.DrinkItems[selectedIndex].Option != cartItems[foundIndex].Option
    ) {
        cartItems.push({
            Id: data.DrinkItems[selectedIndex].Id,
            Count: data.DrinkItems[selectedIndex].Count,
            Option: data.DrinkItems[selectedIndex].Option, // 여기서 안만들고 CART에서 선택하며 추가하도록 함
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
