package main

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Pre(addSlashToTopPath)
	e.Pre(middleware.RemoveTrailingSlash())

	// db
	db, err := newDB()
	if err != nil {
		e.Logger.Error("failed to connect database", "error", err)
	}
	defer db.Close()
	if err := setupDatabase(context.Background(), db); err != nil {
		e.Logger.Error("failed to setup database", "error", err)
	}
	usersDB := NewUsersDB(db)
	notesDB := NewNotesDB(db)

	// echo
	g := e.Group("/study-notes")
	api := g.Group("/api")

	// temp
	api.POST("/testdata", func(c *echo.Context) error {
		userID, _ := usersDB.Create(c.Request().Context(), "xxxxx")
		notesDB.Create(c.Request().Context(), userID)
		notesDB.Create(c.Request().Context(), userID)
		return c.JSON(http.StatusOK, map[string]string{
			"id": userID.String(),
		})
	})

	// backend
	RegisterNoteRoutes(api.Group("/note"), notesDB)

	// frotend
	g.GET("*", func(c *echo.Context) error {
		path := "./dist" + c.Param("*")
		path = strings.TrimRight(path, "/")
		if _, err := os.Stat(path); err == nil {
			return c.File(path)
		}
		return c.File("dist/index.html")
	})

	// run server
	if err := e.Start(":1323"); err != nil {
		e.Logger.Error("failed to start server", "error", err)
	}
}

// フロントエンドのルートだけ、スラッシュがなければリダイレクトする
// (フロントの仕組み上スラッシュなしではレンダリングに失敗する)
// https://echo.labstack.com/docs/cookbook/middleware
func addSlashToTopPath(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		p := c.Request().URL.Path
		if p == "/study-notes" {
			return c.Redirect(301, "/study-notes/")
		}
		return next(c)
	}
}
