package config

import (
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Config struct {
	PORT         string
	JWTKey       string
	DatabasePath string
}

func LoadConfig() *Config {
	return &Config{
		PORT:         getEnv("PORT", "8080"),
		JWTKey:       getEnv("JWT_KEY", "secret_key"),
		DatabasePath: getEnv("DB_PATH", "pastes.db"),
	}
}

func InitDB(path string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}
	return db
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
