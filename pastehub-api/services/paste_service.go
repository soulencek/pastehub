package services

import (
	"pastehub-api/models"
	"pastehub-api/validators"

	"gorm.io/gorm"
)

type PasteService struct {
	DB *gorm.DB
}

func NewPasteService(db *gorm.DB) *PasteService {
	return &PasteService{DB: db}
}

func (s *PasteService) Create(userID uint, title, content string) (*models.Paste, error) {
	if err := validators.ValidatePaste(title, content); err != nil {
		return nil, err
	}
	paste := models.Paste{UserID: userID, Title: title, Content: content}
	if err := s.DB.Create(&paste).Error; err != nil {
		return nil, err
	}
	return &paste, nil
}

func (s *PasteService) GetByID(id uint) (*models.Paste, error) {
	var paste models.Paste
	if err := s.DB.Preload("User").First(&paste, id).Error; err != nil {
		return nil, err
	}
	return &paste, nil
}

func (s *PasteService) Update(paste *models.Paste, title, content string) error {
	if err := validators.ValidatePaste(title, content); err != nil {
		return err
	}
	paste.Title = title
	paste.Content = content
	return s.DB.Save(paste).Error
}

func (s *PasteService) Delete(id uint) error {
	result := s.DB.Delete(&models.Paste{}, id)
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}

func (ps *PasteService) ListPastes(page, limit int, sortField, sortOrder string) ([]models.Paste, bool, error) {
	var pastes []models.Paste
	order := sortField + " DESC"
	if sortOrder == "asc" {
		order = sortField + " ASC"
	}
	queryLimit := limit + 1
	err := ps.DB.Preload("User").Order(order).Limit(queryLimit).Offset((page - 1) * limit).Find(&pastes).Error
	if err != nil {
		return nil, false, err
	}

	hasNext := len(pastes) > limit
	if hasNext {
		pastes = pastes[:limit]
	}
	for i := range pastes {
		pastes[i].Content = ""
	}
	return pastes, hasNext, nil
}

func (ps *PasteService) ListUserPastes(userID uint, page, limit int, sortField, sortOrder string) ([]models.Paste, bool, error) {
	var pastes []models.Paste
	order := sortField + " DESC"
	if sortOrder == "asc" {
		order = sortField + " ASC"
	}
	queryLimit := limit + 1
	err := ps.DB.Preload("User").Where("user_id = ?", userID).Order(order).Limit(queryLimit).Offset((page - 1) * limit).Find(&pastes).Error
	if err != nil {
		return nil, false, err
	}

	hasNext := len(pastes) > limit
	if hasNext {
		pastes = pastes[:limit]
	}
	for i := range pastes {
		pastes[i].Content = ""
	}
	return pastes, hasNext, nil
}
