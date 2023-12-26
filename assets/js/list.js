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
    //로컬스토리지에 값이 비어있으면 언디파인드가 넘어옴
    //로컬스토리지가 비어이으면 카트아이템스는 빈 배열로 초기화

    const confirmPut = confirm("장바구니에 추가하시겠습니까?")
    if (!confirmPut) {
        return
    }
    try {
        const data = JSON.parse(localStorage.getItem("cartItems"))
        //const 선언만해서는 안되고 let은 선언만 가능
        let cartItems
        if (data == undefined) {
            cartItems = []
        } else {
            cartItems = data
        }
        const findItem = cartItems.findIndex(function (a) {
            return a.Id == drinkItems[i].Id
            //findindex 함수란? 조건값이 일치하면 인덱스를 반환해주는 함수,배열에만 사용가능
        })
        if (findItem == -1) {
            //여기서 필요한 객체만 넘겨야되는데
            cartItems.push({
                Id: drinkItems[i].Id,
                Count: drinkItems[i].Count,
            })
        } else {
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

// 로컬스토리지에 담긴 값으로 장바구니 화면 구현 하고 API 삭제하기

//그럼 완전 생처음에는 키값을 넣어줘야하나? 
//제이슨은 객체형식으로 데이터를 저장하는거 그래서 저기 josn해준거임 
//객체가 여러개일때는 배열로 묶어주는게 문법 
