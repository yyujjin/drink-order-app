package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")
	r.Static("/assets", "./assets")

	//필드/ 데이터타입/ 컨텐츠타입
	type drinkItem struct {
		Name  string `json:"Name"`
		Price int    `json:"Price"`
		Src   string `json:"Src"`
		Count int    `json:"Count"`
	}
// 이렇게 적음으로써 이 구조체는 json만 담을 수 있음 

	//데이터를 body에 담아서 서버로 보내는 방법에는 form 태그,제이슨 등등이 있는데 

	var drinkItems = []drinkItem{
		{"아메리카노", 4500, "../assets/images/Americano.png", 1},
		{"카라멜 마끼아또", 6500, "../assets/images/CaramelMacchiato.png", 1},
		{"민트초코 프라페", 6500, "../assets/images/MintChocolate Frappe.png", 1},
		{"자몽 스무디", 5000, "../assets/images/Grapefruit Smoothie.png", 1},
		{"카페 모카", 6000, "../assets/images/CafeMocha.png", 1},
		{"레몬 에이드", 5000, "../assets/images/LemonAde.png", 1},
	}
	var cartItems = []drinkItem{}

	r.GET("/list", func(c *gin.Context) {
		c.HTML(http.StatusOK, "list.html", gin.H{})
	})
	r.GET("/cart", func(c *gin.Context) {
		c.HTML(http.StatusOK, "cart.html", gin.H{})
	})

	r.GET("/getCartItems", func(c *gin.Context) {
		c.JSON(200, cartItems)
	})

	r.GET("/getDrinkItems", func(c *gin.Context) {
		c.JSON(200, drinkItems)
	})

	r.POST("/addToCart/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		cartItems = append(cartItems, drinkItems[id])
		fmt.Println(cartItems)
	})

	r.POST("/sendCartItems", func(c *gin.Context) {
		fmt.Println("정상")
		var cartItems []drinkItem //js에서 배열로 넘겨줬기때문에 배열로 객체를 받아야한다.
		if err := c.BindJSON(&cartItems); err != nil { //BindJSON => 제이슨을 객체로 바꿔주는거 ,실행하면 에러를 무조건 반환하는 함수 
			// 실행해서 에러를 err변수에 담고 만약 err에 값이 담겼으면 return해라 는 거  
			// err := c.BindJSON(&cartItems)
			// if err != nil {

			// }
			// return 이걸 줄여쓴거 
		}
		fmt.Println(cartItems)
	})

	r.DELETE("/deleteItem/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "올바르지 않은 접근입니다."})
			return
		}
		for index := range cartItems {
			if index == id {
				cartItems = append(cartItems[:index], cartItems[index+1:]...)
				return
			}
		}
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")

	// 리스트에서 음료를 추가 1 -> 장바구니에 담기 위해 서버에 추가
	// 사용자가 장바구니에서 수량을 변경 5 -> 서버 X . 클라 내부적으로 수량 변경
	// 주문하기 버튼을 누르면 최종 수량을 서버로 전달

}
