package main

import (
	"log"
	"pastehub-api/config"
	"pastehub-api/middlewares"
	"pastehub-api/models"
	"pastehub-api/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	db := config.InitDB(cfg.DatabasePath)

	// Auto-migrate tables
	if err := db.AutoMigrate(&models.User{}, &models.Paste{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Gin release mode
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Security headers & rate limiter
	r.Use(middlewares.SecurityHeaders())
	r.Use(middlewares.RateLimiter(5, 10))

	// Register routes
	routes.RegisterUserRoutes(r, db, cfg)
	routes.RegisterPasteRoutes(r, db, cfg)

	log.Println("Server running on", cfg.PORT)
	log.Fatal(r.Run(":" + cfg.PORT))
}
