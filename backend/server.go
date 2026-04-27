package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

func main() {
	e := echo.New()
	e.Pre(addSlashToTopPath)
	e.Pre(middleware.AddTrailingSlash())

	g := e.Group("/study-notes")

	// e.Filesystem = os.DirFS(".")
	api := g.Group("/api")

	// test
	api.GET("/", func(c *echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	//

	//
	RegisterList(api)
	//

	// frotend
	g.GET("/*", func(c *echo.Context) error {
		path := "./dist/" + c.Param("*")
		path = strings.TrimRight(path, "/")
		fmt.Println(path)
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
