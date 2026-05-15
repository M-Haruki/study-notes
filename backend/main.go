package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
)

type Config struct {
	JwtSecret        string
	JwtCookieName    string
	JwtExpires       time.Duration
	ContextUserIDKey string
	IsProduction     bool
	DatabaseURL      string
}

var AppConfig Config

type JwtClaims struct {
	UserID string `json:"sub"`
	jwt.RegisteredClaims
}

func main() {
	// env
	AppConfig = Config{
		JwtCookieName:    "token",
		ContextUserIDKey: "ContextUserIDKey",
		JwtExpires:       24 * time.Hour,
		JwtSecret:        os.Getenv("JWT_SECRET"),
		DatabaseURL:      os.Getenv("DATABASE_URL"),
	}
	if AppConfig.JwtSecret == "" || AppConfig.DatabaseURL == "" {
		log.Fatal("Invalid Environment")
	}
	switch os.Getenv("ENV") {
	case "production":
		AppConfig.IsProduction = true
	case "development":
		AppConfig.IsProduction = false
	default:
		log.Fatal("ENV is empty")
	}

	// echo init
	e := echo.New()
	e.Pre(middle_addSlashToTopPath)
	e.Pre(middleware.RemoveTrailingSlash())
	if AppConfig.IsProduction {
		e.Use(middleware.Recover())
	}

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

	// routing
	g := e.Group("/study-notes")
	api := g.Group("/api")

	// backend
	api_note := api.Group("/note")
	api_note.Use(middle_auth)
	api_user := api.Group("/user")
	api_user.Use(middle_auth)
	api_auth := api.Group("/auth")
	RegisterNoteRoutes(api_note, notesDB)          // ログイン必須
	RegisterUserRoutes(api_user, usersDB)          // ログイン必須
	RegisterAuthRoutes(api_auth, usersDB, notesDB) // ログイン不要

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
func middle_addSlashToTopPath(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		p := c.Request().URL.Path
		if p == "/study-notes" {
			return c.Redirect(301, "/study-notes/")
		}
		return next(c)
	}
}

func middle_auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c *echo.Context) error {
		// cookie
		cookie, err := c.Cookie(AppConfig.JwtCookieName)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
		}
		tokenString := cookie.Value
		// jwt
		claims := &JwtClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
			if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
				return nil, fmt.Errorf("unexpected signing method: %s", t.Method.Alg())
			}
			return []byte(AppConfig.JwtSecret), nil
		})
		if err != nil || !token.Valid {
			return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
		}
		// set
		c.Set(AppConfig.ContextUserIDKey, claims.UserID)
		return next(c)
	}
}
