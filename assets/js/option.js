//일단 드링크 리스트를 가지고 있어야할것같음
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

//장바구니에 추가하기 버튼을 누르면 실행되는 코드
function putItemToCart() {
    // 미션: 문자열 트루를 불리언 으로 타입 바꾸기
    let optionByCustomer = selectedItem.IsIceOption = document.querySelector("form").option.value
    selectedItem.IsIceOption = optionByCustomer == "true" ? true : false //주문하기를 눌렀을 때의 값을 가져와야해서 함수안에 넣어줌

    if (optionByCustomer == "") {
        alert("옵션을 선택해 주세요")
        return
    }

    if (!confirm("장바구니에 추가하시겠습니까?")) {
        return
    }

    const localStorageData = JSON.parse(localStorage.getItem("cartItems"))
    const cartItems = localStorageData == undefined ? [] : localStorageData

    // 유저가 선택한 옵션이 카트아이템에 있는지
    // 있다면 카운트만 증가 / 없으면 요소를 추가
    // selectedItem.IsIceOption = 트루 => 얘는 사장님이 아이스만 판매하겠다. 유저 선택한게 아님
    // selectedItem.IsIceOption = 폴스 => 아이스 혹은 핫 선택 가능 // 여기까진 내가 설정한거고
    //내가 가져와야하는값은 유저가 폴스에서 선택한값을 가져와야 함 => 그래서 value 속성이 필요함
    const foundIndex = cartItems.findIndex(function (a) {
        return (
            a.Id == selectedItem.Id && a.IsIceOption == selectedItem.IsIceOption
        )
    })

    if (foundIndex == -1) {
        cartItems.push({
            Id: selectedItem.Id,
            Count: selectedItem.Count,
            IsIceOption: selectedItem.IsIceOption, // 여기서 안만들고 CART에서 선택하며 추가하도록 함
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
    // else if (e.target.id == "hot") {
    //     selectedItem.IsIceOption = false //그냥 값을 바꿔버려 왜냐면 어파치 창은 일회용이니까.
    //     console.log(data.DrinkItems)
    // } else if (e.target.id == "ice") {
    //     selectedItem.IsIceOption = true
    //     console.log(data.DrinkItems)
    // }
})

function openCartPagePopUp() {
    window.open("http://localhost:8080/cart", "fullscreen=yes")
    self.close()
}
