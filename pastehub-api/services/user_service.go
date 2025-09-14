package services

import (
	"pastehub-api/models"
	"pastehub-api/utils"
	"pastehub-api/validators"

	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	DB     *gorm.DB
	JWTKey string
}

func NewUserService(db *gorm.DB, jwtKey string) *UserService {
	return &UserService{DB: db, JWTKey: jwtKey}
}

func (s *UserService) Register(username, password string) error {
	if err := validators.ValidateUsername(username); err != nil {
		return err
	}
	if err := validators.ValidatePassword(password); err != nil {
		return err
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user := models.User{Username: username, Password: string(hashed)}
	return s.DB.Create(&user).Error
}

func (s *UserService) Login(username, password string) (string, error) {
	var user models.User
	if err := s.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return "", err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", err
	}
	token, err := utils.GenerateJWT(user.ID, s.JWTKey, time.Hour)
	return token, err
}

func (s *UserService) GetByID(id uint) (*models.User, error) {
	var user models.User
	if err := s.DB.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
