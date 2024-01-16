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
<button>장바구니에 담기</button>`
}
