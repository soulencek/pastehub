package controllers

import (
	"net/http"
	"strconv"
	"time"

	"pastehub-api/middlewares"
	"pastehub-api/services"
	"pastehub-api/utils"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	Service *services.UserService
}

func NewUserController(s *services.UserService) *UserController {
	return &UserController{Service: s}
}

// Register handles POST /register
func (uc *UserController) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := uc.Service.Register(req.Username, req.Password); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// Login handles POST /login
func (uc *UserController) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	token, err := uc.Service.Login(req.Username, req.Password)
	if err != nil {
		utils.JSONError(c, http.StatusUnauthorized, "Invalid credentials")
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "expires_in": int(time.Hour.Seconds())})
}

// GetUser handles GET /user (current user)
func (uc *UserController) GetUser(c *gin.Context) {
	userIDVal, exists := c.Get(middlewares.UserIDKey)
	if !exists {
		utils.JSONError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	userID := userIDVal.(uint)

	user, err := uc.Service.GetByID(userID)
	if err != nil {
		utils.JSONError(c, http.StatusNotFound, "User not found")
		return
	}

	c.JSON(http.StatusOK, user)
}

// GetUserByID handles GET /user/:id
func (uc *UserController) GetUserByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := uc.Service.GetByID(uint(id))
	if err != nil {
		utils.JSONError(c, http.StatusNotFound, "User not found")
		return
	}

	c.JSON(http.StatusOK, user)
}
