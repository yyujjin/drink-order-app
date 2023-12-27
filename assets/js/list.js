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
    //웬만하면 const로 선언해주삼
    //로컬스토리지에 값이 비어있으면 언디파인드가 넘어옴
    //로컬스토리지가 비어이으면 카트아이템스는 빈 배열로 초기화

    // const isAddingToCart = confirm("장바구니에 추가하시겠습니까?")
    //confirm에서 반환된 트루or폴스 값이 const에 담기는 거 => 줄여서
    //모든 함수는 호출되면 값이 반환된다.
    ///그래서 굳이 변수에 담아주지않고 함수호출을 해서 그 리턴값을 사용하면된다 => 짧을 때는 줄여서쓰고
    //상황에 따라 코드가 너무 길면 변수에 담아서 보는게 낫고 굳이 변수에 안담아도 된다싶은 짧은 코드는 그냥 쓰면 된다
    if (!confirm("장바구니에 추가하시겠습니까?")) {
        return
    }
    //try,catch => 예외처리하는 문법 - fetch가 있을때만 쓴다.

    const data = JSON.parse(localStorage.getItem("cartItems"))
    //const 선언만해서는 안되고 let은 선언만 가능
    // let cartItems 변수를 쓴 이유는 뒤에 값이 뭐가 들어올지 모르니까  1.
    // if (data == undefined) {
    //     cartItems = []
    // } else {
    //     cartItems = data
    // }
    //삼항연산
    // let cartItems
    // data == undefined ? (cartItems = []) : (cartItems = data)
    //더 간단하게 하려면
    //변수에 바로 할당을 할 때 참 거짓에 할당될 값만 적어주면 됨
    //삼항연산을 했을 때 위에 1. IF 처럼 LET으로 선언안하고 바로 값이 들어갈수있으니까 CONST로 바꿔쓸수있음.
    const cartItems = data == undefined ? [] : data
    const foundIndex = cartItems.findIndex(function (a) {
        return a.Id == drinkItems[i].Id
        //findindex 함수란? 조건값이 일치하면 인덱스를 반환해주는 함수,배열에만 사용가능
    })

    if (foundIndex == -1) {
        //여기서 필요한 객체만 넘겨야되는데
        cartItems.push({
            Id: drinkItems[i].Id,
            Count: drinkItems[i].Count,
        })
    } else {
        cartItems[foundIndex].Count += 1
    }

    console.log(cartItems)
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    const isMovingToCart = confirm(
        "추가가 완료 되었습니다! 장바구니로 이동하시겠습니까?"
    )
    if (!isMovingToCart) {
        return
    }
    location.href = "http://localhost:8080/cart"
}

// 로컬스토리지에 담긴 값으로 장바구니 화면 구현 하고 API 삭제하기

//그럼 완전 생처음에는 키값을 넣어줘야하나? ㄴㄴ 없으면 undifined 로 넘어옴
//제이슨은 객체형식으로 데이터를 저장하는거 그래서 저기 josn해준거임
//객체가 여러개일때는 배열로 묶어주는게 문법
