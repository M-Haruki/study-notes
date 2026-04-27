package main

import "time"

// クライアントに送る概要データ
type NoteSummary struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updated_at"`
}

// クライアントに送る詳細データ
type NoteDetail struct {
	NoteSummary
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// DBの完全なデータ
type Note struct {
	NoteDetail
	UserID string `json:"-"`
}

type User struct {
	ID           string    `json:"-"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"-"`
}

//  `json:"-"`をつけることで、誤ってクライアントに送りそうになっても送られない
