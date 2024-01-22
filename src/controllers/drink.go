package controllers

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

type drinkItem struct {
	Id          int    `json:Id`
	Name        string `json:"Name"`
	Price       int    `json:"Price"`
	Src         string `json:"Src"`
	Count       int    `json:"Count"`
	IsIceOption bool   `json:"IsIceOption"` //ture = ice  false = select or hot
}

var drinkItems = []drinkItem{
	{1, "아메리카노", 4500, "../assets/images/Americano.png", 1, false},
	{2, "카라멜 마끼아또", 6500, "../assets/images/CaramelMacchiato.png", 1, false},
	{3, "민트초코 프라페", 6500, "../assets/images/MintChocolate Frappe.png", 1, true},
	{4, "자몽 스무디", 5000, "../assets/images/Grapefruit Smoothie.png", 1, true},
	{5, "카페 모카", 6000, "../assets/images/CafeMocha.png", 1, false},
	{6, "레몬 에이드", 5000, "../assets/images/LemonAde.png", 1, true},
}

var totalCountList = make(map[int]int)

func GetDrinkItems(c *gin.Context) {
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

	type response struct {
		DrinkItems []drinkItem
		MaxId      int
	}

	Response := response{
		drinkItems, maxId,
	}
	fmt.Println(Response)
	c.JSON(200, Response)
}

func OrderDrinkItems(c *gin.Context) {
	var cartItems []drinkItem
	if err := c.BindJSON(&cartItems); err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("카트아이템", cartItems) 
	for index := range cartItems {
		totalCountList[cartItems[index].Id] = totalCountList[cartItems[index].Id] + cartItems[index].Count
	}
	fmt.Println("토탈카운트", totalCountList)
}
