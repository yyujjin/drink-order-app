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
		var maxId int
		for id, count := range totalCountList {
			if count > maxValue {
				maxValue = count
				maxId = id
			}

		}
		fmt.Println(maxId)
		fmt.Println("토탈", totalCountList)
		c.JSON(200, drinkItems)
	})

	r.POST("/sendCartItems", func(c *gin.Context) {
		fmt.Println("정상")
		var cartItems []drinkItem
		if err := c.BindJSON(&cartItems); err != nil {
			return
		}
		// TODO for range
		//totalCountList[cartItems[0].Id] = cartItems[0].Count
		fmt.Println(cartItems)
		//[{id: 1, count: 3}, 2, 5]
		//[{id: 1, count: 2}, 2, 5]
		for index := range cartItems {
			//totalCountList = append(totalCountList,cartItems[index].)

			//카운터를 누적시킨다....

			// 버튼을 눌렸을 때 카트아이템스가 넘어오고 토탈카운트리스트에 담기는데
			//만약 토탈카운트리스트아이디랑 카트아아팀의 아이디가 있다면 그 아이디의 밸류값을 카운트아이템의 카운트만큼 플러스시켜라
			// 토탈 카운트리스트에 현재 아이템의 아이디가 없다면 새로운 키 추가
			//그게아니라면 토탈카운트리스트의 기존 값에  카트아이템의 카운트 누적시켜라

			// totalCountList {1: 5, 2: 1}
			// cartItems : {1:1}, {2: 2}

			// after totalCountList: {1:6},{2:3}
			// cartItems : {1:1}, {4: 1}

			// after totalCountList: {1:7 2:3 4:1}
			totalCountList[cartItems[index].Id] += cartItems[index].Count
			//totalCountList[cartItems[index].Id] = totalCountList[cartItems[index].Id]+cartItems[index].Count

			//fmt.Println(totalCountList[cartItems[index].Id]) //값 가져옴

		}
		fmt.Println("83", totalCountList)
		// {1: 5, 2: 1, 5: 1}
		// {1: 5} 이런색으로 키는 아이디, 벨류는 카운트가 담
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
