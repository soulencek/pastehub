package routes

import (
	"pastehub-api/config"
	"pastehub-api/controllers"
	"pastehub-api/middlewares"
	"pastehub-api/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPasteRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	svc := services.NewPasteService(db)
	ctrl := controllers.NewPasteController(svc)

	jwtKey := cfg.JWTKey
	auth := middlewares.AuthMiddleware(jwtKey)

	r.POST("/paste", auth, ctrl.CreatePaste)
	r.GET("/paste/:id", ctrl.GetPaste)
	r.PUT("/paste/:id", auth, ctrl.UpdatePaste)
	r.DELETE("/paste/:id", auth, ctrl.DeletePaste)
	r.GET("/pastes", ctrl.ListPastes)
	r.GET("/user/:id/pastes", ctrl.ListUserPastes)

}
