package validators

import (
	"errors"
	"regexp"
	"unicode"
)

func ValidateUsername(username string) error {
	if len(username) < 4 || len(username) > 30 {
		return errors.New("username must be between 4 and 30 characters")
	}
	valid := regexp.MustCompile(`^[a-zA-Z0-9_]+$`)
	if !valid.MatchString(username) {
		return errors.New("username can only contain letters, numbers, underscores")
	}
	return nil
}

func ValidatePassword(password string) error {
	if len(password) < 8 || len(password) > 72 {
		return errors.New("password must be 8-72 characters long")
	}
	var hasUpper, hasLower, hasNumber, hasSpecial bool
	for _, c := range password {
		switch {
		case unicode.IsUpper(c):
			hasUpper = true
		case unicode.IsLower(c):
			hasLower = true
		case unicode.IsNumber(c):
			hasNumber = true
		case unicode.IsPunct(c) || unicode.IsSymbol(c):
			hasSpecial = true
		}
	}
	if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		return errors.New("password must include uppercase, lowercase, number, and special character")
	}
	return nil
}
