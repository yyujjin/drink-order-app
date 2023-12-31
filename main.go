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
		Id    int    `json:Id`
		Name  string `json:"Name"`
		Price int    `json:"Price"`
		Src   string `json:"Src"`
		Count int    `json:"Count"`
	}

	var drinkItems = []drinkItem{
		{1, "아메리카노", 4500, "../assets/images/Americano.png", 1},
		{2, "카라멜 마끼아또", 6500, "../assets/images/CaramelMacchiato.png", 1},
		{3, "민트초코 프라페", 6500, "../assets/images/MintChocolate Frappe.png", 1},
		{4, "자몽 스무디", 5000, "../assets/images/Grapefruit Smoothie.png", 1},
		{5, "카페 모카", 6000, "../assets/images/CafeMocha.png", 1},
		{6, "레몬 에이드", 5000, "../assets/images/LemonAde.png", 1},
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
	var totalCountList = make(map[int]int)
	r.GET("/getDrinkItems", func(c *gin.Context) {
		var maxValue int
		var maxId int = 5 // TODO 이후에 동적으로 변경
		for id, count := range totalCountList {
			if count > maxValue {
				maxValue = count
				maxId = id
			}
		}

		fmt.Println(maxId)
		fmt.Println("토탈", totalCountList)

		type response struct {
			DrinkItems []drinkItem
			MaxId      int
		}

		Response := response{
			drinkItems, maxId,
		}
		fmt.Println(Response)
		//{"drinkItems": [], "maxId": 5}
		c.JSON(200, Response)
	})

	//겟드링크에서 js로 값을 2개 보내야해서 이걸 보내려면 구조체를 만들어야하나을 이용해야하고
	//드링크 아이템이랑 maxid를 같이 내보내삼.

	r.POST("/sendCartItems", func(c *gin.Context) {
		var cartItems []drinkItem
		if err := c.BindJSON(&cartItems); err != nil {
			return
		}
		fmt.Println(cartItems)
		for index := range cartItems {

			totalCountList[cartItems[index].Id] = totalCountList[cartItems[index].Id] + cartItems[index].Count
		}
		fmt.Println("토탈카운트", totalCountList)
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

}
