package main

import (
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v5"
)

// 登録用公開関数
func RegisterNoteRoutes(g *echo.Group, notesDB NotesDB) {
	g.GET("/list", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		notes, err := notesDB.GetNotes(c.Request().Context(), userID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "user not found")
		}
		type response struct {
			ID        string    `json:"id"`
			Title     string    `json:"title"`
			UpdatedAt time.Time `json:"updated_at"`
		}
		res := make([]response, len(notes))
		for i, n := range notes {
			res[i] = response{ID: n.NoteID.String(), Title: n.Title, UpdatedAt: n.UpdatedAt}
		}
		return c.JSON(http.StatusOK, res)
	})

	g.GET("", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		noteID, err := uuid.Parse(c.QueryParam("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid noteid")
		}
		note, err := notesDB.GetNote(c.Request().Context(), NoteKey{UserID: userID, NoteID: noteID})
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "user not found")
		}
		type resoponse struct {
			ID        string    `json:"id"`
			Title     string    `json:"title"`
			Content   string    `json:"content"`
			UpdatedAt time.Time `json:"updated_at"`
			CreatedAt time.Time `json:"created_at"`
		}
		res := resoponse{
			ID:        note.NoteID.String(),
			Title:     note.Title,
			Content:   note.Content,
			UpdatedAt: note.UpdatedAt,
			CreatedAt: note.CreatedAt,
		}
		return c.JSON(http.StatusOK, res)
	})

	g.POST("/new", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		noteID, err := notesDB.Create(c.Request().Context(), userID)
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "user not found")
		}
		type response struct {
			ID string `json:"id"`
		}
		res := response{
			ID: noteID.String(),
		}
		return c.JSON(http.StatusOK, res)
	})

	g.PATCH("", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		noteID, err := uuid.Parse(c.QueryParam("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid noteid")
		}
		type request struct {
			Title   string `json:"title"`
			Content string `json:"content"`
		}
		req := new(request)
		if err := c.Bind(req); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid request")
		}
		err = notesDB.Update(c.Request().Context(), NoteUpdateInput{UserID: userID, NoteID: noteID, Title: req.Title, Content: req.Content})
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "note not found")
		}
		return c.NoContent(http.StatusOK)
	})

	g.DELETE("", func(c *echo.Context) error {
		userID, err := GetUser(c)
		if err != nil {
			return echo.NewHTTPError(http.StatusUnauthorized, "auth failed")
		}
		noteID, err := uuid.Parse(c.QueryParam("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "invalid noteid")
		}
		err = notesDB.Delete(c.Request().Context(), NoteKey{UserID: userID, NoteID: noteID})
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound, "note not found")
		}
		return c.NoContent(http.StatusNoContent)
	})
}
