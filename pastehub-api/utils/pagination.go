package utils

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

// ParsePagination reads query parameters `page`, `limit`, `sortField`, `sortOrder`
// and returns validated values with defaults.
func ParsePagination(c *gin.Context, defaultLimit int, defaultSortField, defaultSortOrder string) (page int, limit int, sortField, sortOrder string) {
	limitStr := c.DefaultQuery("limit", strconv.Itoa(defaultLimit))
	pageStr := c.DefaultQuery("page", "1")
	sortField = c.DefaultQuery("sortField", defaultSortField)
	sortOrder = c.DefaultQuery("sortOrder", defaultSortOrder)

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err = strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = defaultLimit
	}

	// Ensure sortOrder is valid
	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = defaultSortOrder
	}

	return page, limit, sortField, sortOrder
}
