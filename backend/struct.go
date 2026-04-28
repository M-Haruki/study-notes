package main

import "time"

// クライアントに送る概要データ
type NoteSummary struct {
	Id        string    `json:"id"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updated_at"`
}

// クライアントに送る詳細データ
type NoteDetail struct {
	Id        string    `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	UpdatedAt time.Time `json:"updated_at"`
	CreatedAt time.Time `json:"created_at"`
}

// DBの完全なデータ
type Note struct {
	UserId    string    `json:"-"`
	Id        string    `json:"-"`
	Title     string    `json:"-"`
	Content   string    `json:"-"`
	UpdatedAt time.Time `json:"-"`
	CreatedAt time.Time `json:"-"`
}

type User struct {
	Id           string    `json:"-"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"-"`
}

//  `json:"-"`をつけることで、誤ってクライアントに送りそうになっても送られない
