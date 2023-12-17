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
	}

	var drinkItems = []drinkItem{
		{"아메리카노", 4500},
		{"카라멜 마끼아또", 6500},
		{"민트초코 프라페", 6500},
		{"자몽 스무디", 5000},
		{"카페 모카", 6000},
		{"레몬 에이드", 5000},
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


	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
