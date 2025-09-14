package middlewares

import (
	"net/http"
	"pastehub-api/utils"

	"github.com/gin-gonic/gin"
)

const UserIDKey = "user_id"
const AuthHeader = "Authorization"

func AuthMiddleware(jwtKey string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader(AuthHeader)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			c.Abort()
			return
		}
		claims, err := utils.ParseJWT(token, jwtKey)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}
		c.Set(UserIDKey, claims.UserID)
		c.Next()
	}
}
