package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
)

var sampleSummaries = []NoteSummary{
	{
		Id:        "note-001",
		Title:     "Hello",
		UpdatedAt: time.Date(2026, 4, 27, 9, 0, 0, 0, time.UTC),
	},
	{
		Id:        "note-002",
		Title:     "Goメモ",
		UpdatedAt: time.Date(2026, 4, 27, 10, 30, 0, 0, time.UTC),
	},
}

var sampleDetail = NoteDetail{
	Id:        "note-001",
	Title:     "Hello",
	Content:   "hogehoge",
	UpdatedAt: time.Date(2026, 4, 27, 9, 0, 0, 0, time.UTC),
	CreatedAt: time.Date(2026, 4, 27, 9, 0, 0, 0, time.UTC),
}

// 登録用公開関数
func RegisterNoteRoutes(g *echo.Group) {
	g.GET("/list", serveNotesList)
	g.POST("/new", createNewNote)
	g.GET("", serveNote)
	g.PATCH("", updateNote)
	g.DELETE("", deleteNote)
}

// 各エンドポイント
func serveNotesList(c *echo.Context) error {
	fmt.Println("note list")
	return c.JSON(http.StatusOK, sampleSummaries)
}
func createNewNote(c *echo.Context) error {
	type response struct {
		Id string `json:"id"`
	}
	return c.JSON(http.StatusOK, response{
		Id: "idddd",
	})
}
func serveNote(c *echo.Context) error {
	id := c.QueryParam("id")
	fmt.Println("note detail" + id)
	return c.JSON(http.StatusOK, sampleDetail)
}
func updateNote(c *echo.Context) error {
	type request struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	id := c.QueryParam("id")
	u := new(request)
	if err := c.Bind(u); err != nil {
		return err
	}
	fmt.Println("update note", id, u)
	return c.NoContent(200)
}
func deleteNote(c *echo.Context) error {
	id := c.QueryParam("id")
	fmt.Println("delete", id)
	return c.NoContent(200)
}
