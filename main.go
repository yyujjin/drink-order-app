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

	type drinkItem struct {
		Name  string
		Price int
		Src   string
		Count int
	}

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

	r.POST("/addToCart/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		for i := 0; i < len(cartItems); i++ {
			if drinkItems[id].Name == cartItems[i].Name {
				cartItems[i].Count += 1
				cartItems[i].Price += drinkItems[id].Price
				fmt.Println(cartItems)
				return
			}
		}
		cartItems = append(cartItems, drinkItems[id])
		fmt.Println(cartItems)
	})

	r.GET("/getCartItems", func(c *gin.Context) {
		c.JSON(200, cartItems)
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

	r.GET("/getTotalPrice", func(c *gin.Context) {
		var totalPrice int
		for index := range cartItems {  

		totalPrice += cartItems[index].Price
		}
		fmt.Println(totalPrice)
		c.JSON(200, totalPrice)
	})

	r.PUT("/plusCount/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		cartItems[id].Count += 1
		for index,value := range drinkItems { 
			if cartItems[id].Name == drinkItems[index].Name {
				cartItems[id].Price += value.Price
				c.Redirect(http.StatusFound, "/getTotalPrice")
				return
			}
		}
	})

	r.PUT("/minusCount/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		if cartItems[id].Count ==1 {
			return
		}
		cartItems[id].Count -= 1
		for index,value := range drinkItems { 
			if cartItems[id].Name == drinkItems[index].Name {
				cartItems[id].Price -= value.Price
				c.Redirect(http.StatusFound, "/getTotalPrice")
				return
			}
		}
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")

	// 리스트에서 음료를 추가 1 -> 장바구니에 담기 위해 서버에 추가 
	// 사용자가 장바구니에서 수량을 변경 5 -> 서버 X . 클라 내부적으로 수량 변경
	// 주문하기 버튼을 누르면 최종 수량을 서버로 전달

}
