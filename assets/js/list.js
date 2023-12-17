const drinks = document.querySelectorAll(".drinks")
console.log(drinks)
for (let i=0; i<drinks.length; i++) {
    drinks[i].addEventListener("click",function(){
        putCart(i)
    })
}


const cartButton = document.querySelector("#cart-button")
cartButton.addEventListener("click", function () {
    location.href = "http://localhost:8080/cart"
})


async function putCart(i) {
    const confirmPut = confirm("장바구니에 추가하시겠습니까?")
    if (!confirmPut) {
        return
    }
    alert("추가가 완료되었습니다!")
    try {
        //main.go 에 post 라우터 만들고 장바구니 배열 따로 생성하기
        //쿼리스트링으로 i 넘겨서 배열에 저장하고 i의 정보대로 화면에 나타나게 하기
        //배열만들고 id 넣기 
        await fetch(`http://localhost:8080/temp/${i}`, {
            method: "POST",
        })
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
}