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
		Src string
	}

	var drinkItems = []drinkItem{
		{"아메리카노", 4500,"../assets/images/Americano.png"},
		{"카라멜 마끼아또", 6500,"../assets/images/CaramelMacchiato.png"},
		{"민트초코 프라페", 6500,"../assets/images/MintChocolate Frappe.png"},
		{"자몽 스무디", 5000,"../assets/images/Grapefruit Smoothie.png"},
		{"카페 모카", 6000,"../assets/images/CafeMocha.png"},
		{"레몬 에이드", 5000,"../assets/images/LemonAde.png"},
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
		fmt.Println(id)
		cartItems = append(cartItems, drinkItems[id])
		fmt.Println(cartItems)
	})

	r.GET("/getCartItems", func(c *gin.Context) {
		c.JSON(200, cartItems)
		})

	r.DELETE("/deleteItem/:id", func (c *gin.Context) {
		id,err:= strconv.Atoi (c.Param("id"))  
		// fmt.Println(id, err)
		if err != nil {
			c.IndentedJSON(http.StatusNotFound, gin.H{"message": "올바르지 않은 접근입니다."})
			return
		}
		for index := range cartItems {
			if index == id {
				cartItems = append(cartItems[:index],cartItems[index+1:]...)
				return  
			}
		}
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
	})
	


	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
