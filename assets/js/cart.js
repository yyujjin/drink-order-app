

getCartItems()
async function getCartItems() {
    const res = await fetch("http://localhost:8080/getCartItems")
    const items = await res.json()
    console.log(items)
    makeDrinkList(items)
}


function makeDrinkList(items) {
    const orderList = document.querySelector("#order-list")
// orderList.innerHTML = ""
    for (let i = 0; i < items.length; i++) {
        orderList.innerHTML += 
        `<div class="lists"  id="${firstList(i)}">
            <div class="drink-image" >
                <img  src="../assets/images/no-image.jpg" width="100" height="100" alt="">
            </div>
            <ul>
                <li>품명 : ${items[i].Name}</li>  
                <li>가격 : ${items[i].Price}원</li>    
                <li>수량 : 1 개</li>      
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



function firstList(i) {
if (i==0) {
    return "first-list"
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
        getCartItems()
    } catch (error) {
        console.error("네트워크 오류:", error)
    }
}
 