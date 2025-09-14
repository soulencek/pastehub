package controllers

import (
	"net/http"
	"strconv"

	"pastehub-api/middlewares"
	"pastehub-api/services"
	"pastehub-api/utils"

	"github.com/gin-gonic/gin"
)

type PasteController struct {
	Service *services.PasteService
}

func NewPasteController(s *services.PasteService) *PasteController {
	return &PasteController{Service: s}
}

// CreatePaste handles POST /paste
func (pc *PasteController) CreatePaste(c *gin.Context) {
	userIDVal, exists := c.Get(middlewares.UserIDKey)
	if !exists {
		utils.JSONError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	userID := userIDVal.(uint)

	var req struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	paste, err := pc.Service.Create(userID, req.Title, req.Content)
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	c.JSON(http.StatusOK, paste)
}

// GetPaste handles GET /paste/:id
func (pc *PasteController) GetPaste(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid paste ID")
		return
	}

	paste, err := pc.Service.GetByID(uint(id))
	if err != nil {
		utils.JSONError(c, http.StatusNotFound, "Paste not found")
		return
	}

	c.JSON(http.StatusOK, paste)
}

// UpdatePaste handles PUT /paste/:id
func (pc *PasteController) UpdatePaste(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid paste ID")
		return
	}

	userIDVal, exists := c.Get(middlewares.UserIDKey)
	if !exists {
		utils.JSONError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	userID := userIDVal.(uint)

	paste, err := pc.Service.GetByID(uint(id))
	if err != nil {
		utils.JSONError(c, http.StatusNotFound, "Paste not found")
		return
	}
	if paste.UserID != userID {
		utils.JSONError(c, http.StatusForbidden, "Not authorized to edit this paste")
		return
	}

	var req struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := pc.Service.Update(paste, req.Title, req.Content); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Paste updated successfully"})
}

// DeletePaste handles DELETE /paste/:id
func (pc *PasteController) DeletePaste(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid paste ID")
		return
	}

	userIDVal, exists := c.Get(middlewares.UserIDKey)
	if !exists {
		utils.JSONError(c, http.StatusUnauthorized, "User not authenticated")
		return
	}
	userID := userIDVal.(uint)

	paste, err := pc.Service.GetByID(uint(id))
	if err != nil {
		utils.JSONError(c, http.StatusNotFound, "Paste not found")
		return
	}
	if paste.UserID != userID {
		utils.JSONError(c, http.StatusForbidden, "Not authorized to delete this paste")
		return
	}

	if err := pc.Service.Delete(uint(id)); err != nil {
		utils.JSONError(c, http.StatusInternalServerError, "Failed to delete paste")
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Paste deleted successfully"})
}

// ListPastes handles GET /pastes?page=&limit=&sortField=&sortOrder=
func (pc *PasteController) ListPastes(c *gin.Context) {
	page, limit, sortField, sortOrder := utils.ParsePagination(c, 10, "edited_at", "desc")

	data, hasNext, err := pc.Service.ListPastes(page, limit, sortField, sortOrder)
	if err != nil {
		utils.JSONError(c, 500, "Failed to retrieve pastes")
		return
	}

	c.JSON(200, gin.H{
		"data":        data,
		"page":        page,
		"limit":       limit,
		"sortField":   sortField,
		"sortOrder":   sortOrder,
		"hasNextPage": hasNext,
	})
}

// ListUserPastes handles GET /user/:id/pastes
func (pc *PasteController) ListUserPastes(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		utils.JSONError(c, 400, "Invalid user ID")
		return
	}

	page, limit, sortField, sortOrder := utils.ParsePagination(c, 10, "edited_at", "desc")

	data, hasNext, err := pc.Service.ListUserPastes(uint(userID), page, limit, sortField, sortOrder)
	if err != nil {
		utils.JSONError(c, 500, "Failed to retrieve user's pastes")
		return
	}

	c.JSON(200, gin.H{
		"data":        data,
		"page":        page,
		"limit":       limit,
		"sortField":   sortField,
		"sortOrder":   sortOrder,
		"hasNextPage": hasNext,
	})
}
