package main

import (
	"net/http"
	"regexp"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v5"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUserRoutes(g *echo.Group, usersDB UsersDB) {
	g.POST("/logout", func(c *echo.Context) error {
		setLogoutCookie(c)
		return c.NoContent(http.StatusOK)
	})
	g.PATCH("/password", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		// get
		type request struct {
			Password string `json:"password"` // 8~32バイト 文字種制限なし
		}
		req := new(request)
		if err := c.Bind(req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
		}
		// valid
		if !checkUserInfo(userID, req.Password) {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid format")
		}
		// hash
		passwordHash, err := hashPassword(req.Password)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid password format")
		}
		// save
		err = usersDB.ChangePasswordHash(c.Request().Context(), userID, passwordHash)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid")
		}
		return c.NoContent(http.StatusOK)
	})
	g.DELETE("", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		err = usersDB.Delete(c.Request().Context(), userID)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "failed")
		}
		setLogoutCookie(c)
		return c.NoContent(http.StatusOK)
	})
}

func RegisterAuthRoutes(g *echo.Group, usersDB UsersDB) {
	g.POST("/new", func(c *echo.Context) error {
		// get
		type request struct {
			UserID   string `json:"user_id"`  // 3~16字 半角英数字
			Password string `json:"password"` // 8~32バイト 文字種制限なし
		}
		req := new(request)
		if err := c.Bind(req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
		}
		// valid
		if !checkUserInfo(req.UserID, req.Password) {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid format")
		}
		// hash
		passwordHash, err := hashPassword(req.Password)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid password format")
		}
		// save
		err = usersDB.Create(c.Request().Context(), req.UserID, passwordHash)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid userid") // useridの重複か
		}
		return c.NoContent(http.StatusOK)
	})
	g.POST("/login", func(c *echo.Context) error {
		// get
		type request struct {
			UserID   string `json:"user_id"`  // 3~16字 半角英数字
			Password string `json:"password"` // 8~32バイト 文字種制限なし
		}
		req := new(request)
		if err := c.Bind(req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
		}
		// valid
		if !checkUserInfo(req.UserID, req.Password) {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid format")
		}
		// auth
		user, err := usersDB.GetUser(c.Request().Context(), req.UserID)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		// jwt
		exp := time.Now().Add(AppConfig.JwtExpires)
		claims := JwtClaims{
			UserID: user.UserID,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(exp),
				IssuedAt:  jwt.NewNumericDate(time.Now()),
				NotBefore: jwt.NewNumericDate(time.Now()),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString([]byte(AppConfig.JwtSecret))
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "auth failed")
		}
		// cookie
		cookie := http.Cookie{
			Path:     "/study-notes",
			Name:     AppConfig.JwtCookieName,
			Value:    tokenString,
			Expires:  exp,
			HttpOnly: AppConfig.IsProduction, // XSS 対策：JavaScript からアクセス不可
			Secure:   true,                   // HTTPS 通信のみ
			SameSite: http.SameSiteLaxMode,   // CSRF 対策
		}
		c.SetCookie(&cookie)
		return c.NoContent(http.StatusOK)
	})
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func GetUser(c *echo.Context) (string, error) {
	userID, ok := c.Get(AppConfig.ContextUserIDKey).(string)
	if !ok {
		return "", echo.ErrUnauthorized
	}
	return userID, nil
}

func checkUserInfo(userID string, password string) bool {
	var re = regexp.MustCompile(`^[A-Za-z0-9]{3,16}$`)
	if !re.MatchString(userID) {
		return false
	}
	if !(len(password) >= 8 && len(password) <= 32) {
		return false
	}
	return true
}

func setLogoutCookie(c *echo.Context) {
	cookie := http.Cookie{
		Path:     "/study-notes",
		Name:     AppConfig.JwtCookieName,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: AppConfig.IsProduction, // XSS 対策：JavaScript からアクセス不可
		Secure:   true,                   // HTTPS 通信のみ
		SameSite: http.SameSiteLaxMode,   // CSRF 対策
	}
	c.SetCookie(&cookie)
}
