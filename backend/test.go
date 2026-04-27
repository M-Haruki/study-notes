package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
)

var sampleSummaries = []NoteSummary{
	{
		ID:        "note-001",
		Title:     "Hello",
		UpdatedAt: time.Date(2026, 4, 27, 9, 0, 0, 0, time.UTC),
	},
	{
		ID:        "note-002",
		Title:     "Goメモ",
		UpdatedAt: time.Date(2026, 4, 27, 10, 30, 0, 0, time.UTC),
	},
}

func RegisterList(g *echo.Group) {
	g.GET("/list/", func(c *echo.Context) error {
		return c.JSON(http.StatusOK, sampleSummaries)
	})
}
