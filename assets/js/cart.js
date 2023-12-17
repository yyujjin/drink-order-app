

getCartItem()
//라우터에 카트라우터에서 배열가져오는 함수 get
async function getCartItem() {
    const res = await fetch("http://localhost:8080/getItems")
    const lists = await res.json()
    console.log(lists)
    makeDrinkList(lists)
}


//카트 라우터에서 저장된 숫자들을 기본 정보데이타에서 뽑아내서 form 으로
//여기 js에 갖다줘서 그 갖다준거를 풀어서 list 작성하는 함수 
function makeDrinkList(lists) {
    const orderList = document.querySelector("#order-list")
// orderList.innerHTML = ""
    for (let i = 0; i < lists.length; i++) {
        orderList.innerHTML += 
        `<div class="lists">
            <div class="drink-image" >
                <img  src="../assets/images/no-image.jpg" width="100" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${아메리카노}</li>  //lists[i].name
                <li>가격 : ${4500}원</li>     //lists[i].price
                <li>수량 : ${1} 개</li>       //lists[i].amount
                <button class="delete-buttons">x</button>
            </ul>
        </div>`
    }
    const deleteButtons = document.querySelectorAll(".deleteButtons")
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function () {
            deleteList(i)
        })
    }
}


//삭제 함수 
async function deleteList (i) {
    const confirmDelete = confirm("삭제하시겠습니까?")
    if (!confirmDelete) {
        return
    }
    try {
        await fetch(`http://localhost:8080/delete/${i}`, {
            method: "DELETE",
        })
        getCartItem()
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
}
 