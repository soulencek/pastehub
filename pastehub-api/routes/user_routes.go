package routes

import (
	"pastehub-api/config"
	"pastehub-api/controllers"
	"pastehub-api/middlewares"
	"pastehub-api/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterUserRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	jwtKey := cfg.JWTKey

	svc := services.NewUserService(db, jwtKey)
	ctrl := controllers.NewUserController(svc)

	auth := middlewares.AuthMiddleware(jwtKey)

	// Auth routes
	r.POST("/register", ctrl.Register)
	r.POST("/login", ctrl.Login)

	// User info
	r.GET("/user", auth, ctrl.GetUser)
	r.GET("/user/:id", ctrl.GetUserByID)
}
