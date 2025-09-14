package utils

import "github.com/gin-gonic/gin"

type ErrorResponse struct {
	Error string `json:"error"`
}

func JSONError(c *gin.Context, status int, msg string) {
	c.JSON(status, ErrorResponse{Error: msg})
}
