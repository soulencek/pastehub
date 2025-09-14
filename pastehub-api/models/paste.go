package models

import "time"

type Paste struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	User      *User     `gorm:"foreignKey:UserID" json:"user"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	EditedAt  time.Time `json:"edited_at" gorm:"autoUpdateTime"`
}
