package validators

import (
	"errors"
	"strings"
)

func ValidatePaste(title, content string) error {
	title = strings.ReplaceAll(title, "\n", "")
	title = strings.ReplaceAll(title, "\r", "")

	if strings.TrimSpace(title) == "" {
		return errors.New("title cannot be empty")
	}
	if len(title) > 30 {
		return errors.New("title must be 30 characters or fewer")
	}
	if strings.TrimSpace(content) == "" {
		return errors.New("content cannot be empty")
	}
	if len(content) > 5000 {
		return errors.New("content must be 5000 characters or fewer")
	}
	return nil
}
