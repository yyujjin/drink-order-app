package main

import (
	"drink-order-app/src/controllers"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")
	r.Static("/assets", "./assets")

	r.GET("/list", func(c *gin.Context) {
		c.HTML(http.StatusOK, "list.html", gin.H{})
	})
	r.GET("/cart", func(c *gin.Context) {
		c.HTML(http.StatusOK, "cart.html", gin.H{})
	})
	r.GET("/option", func(c *gin.Context) {
		c.HTML(http.StatusOK, "option.html", gin.H{})
	})

	// controllers/drink.go
	r.GET("/getDrinkItems", controllers.GetDrinkItems)

	r.POST("/orderDrinkItems", controllers.OrderDrinkItems)

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")

}
