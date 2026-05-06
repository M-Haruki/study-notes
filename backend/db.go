package main

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func newDB() (*sqlx.DB, error) {
	return sqlx.Connect("postgres", "user=postgres password=pass dbname=study-notes sslmode=disable host=postgres port=5432")
}

func setupDatabase(ctx context.Context, db *sqlx.DB) error {
	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	query1 := `
    CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(16) PRIMARY KEY CHECK(char_length(user_id) <= 16),
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
		`
	query2 := `
		CREATE TABLE IF NOT EXISTS notes (
        note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id VARCHAR(16) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
				title TEXT NOT NULL DEFAULT '',
				content TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    `
	if _, err := tx.Exec(query1); err != nil {
		return err
	}
	if _, err := tx.Exec(query2); err != nil {
		return err
	}
	return tx.Commit()
}

type Note struct {
	UserID    string    `db:"user_id"`
	NoteID    uuid.UUID `db:"note_id"`
	Title     string    `db:"title"`
	Content   string    `db:"content"`
	UpdatedAt time.Time `db:"updated_at"`
	CreatedAt time.Time `db:"created_at"`
}
type NoteSmall struct {
	UserID    string    `db:"user_id"`
	NoteID    uuid.UUID `db:"note_id"`
	Title     string    `db:"title"`
	UpdatedAt time.Time `db:"updated_at"`
}
type NoteKey struct {
	UserID string    `db:"user_id"`
	NoteID uuid.UUID `db:"note_id"`
}
type NoteUpdateInput struct {
	UserID  string    `db:"user_id"`
	NoteID  uuid.UUID `db:"note_id"`
	Title   string    `db:"title"`
	Content string    `db:"content"`
}
type User struct {
	UserID       string    `db:"user_id"`
	PasswordHash string    `db:"password_hash"`
	CreatedAt    time.Time `db:"created_at"`
}

type UsersDB interface {
	Create(ctx context.Context, userID string, passwordHash string) error
	ChangePasswordHash(ctx context.Context, userID string, passwordHash string) error
	Delete(ctx context.Context, userID string) error
	GetUser(ctx context.Context, userID string) (User, error)
}

type NotesDB interface {
	Create(ctx context.Context, userID string) (uuid.UUID, error)
	Update(ctx context.Context, noteInput NoteUpdateInput) error
	Delete(ctx context.Context, noteInput NoteKey) error
	GetNote(ctx context.Context, noteInput NoteKey) (*Note, error)
	GetNotes(ctx context.Context, userID string) ([]NoteSmall, error)
}

type usersDB struct {
	db *sqlx.DB
}

type notesDB struct {
	db *sqlx.DB
}

func NewUsersDB(db *sqlx.DB) UsersDB {
	return &usersDB{db: db}
}

func NewNotesDB(db *sqlx.DB) NotesDB {
	return &notesDB{db: db}
}

// user
func (d *usersDB) Create(ctx context.Context, userID string, passwordHash string) error {
	const query = "INSERT INTO users (user_id, password_hash) VALUES ($1, $2) RETURNING user_id"
	err := d.db.GetContext(ctx, &userID, query, userID, passwordHash)
	return err
}

func (d *usersDB) ChangePasswordHash(ctx context.Context, userID string, passwordHash string) error {
	const query = "UPDATE users SET password_hash = $1 WHERE user_id = $2"
	res, err := d.db.ExecContext(ctx, query, passwordHash, userID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("not found")
	}
	return nil
}

func (d *usersDB) Delete(ctx context.Context, userID string) error {
	const query = "DELETE FROM users WHERE user_id = $1"
	res, err := d.db.ExecContext(ctx, query, userID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("not found")
	}
	return nil
}

func (d *usersDB) GetUser(ctx context.Context, userID string) (User, error) {
	const query = "SELECT * FROM users WHERE user_id = $1"
	var user User
	err := d.db.GetContext(ctx, &user, query, userID)
	return user, err
}

// note
func (d *notesDB) Create(ctx context.Context, userID string) (uuid.UUID, error) {
	const query = "INSERT INTO notes (user_id) VALUES ($1) RETURNING note_id"
	var noteID uuid.UUID
	err := d.db.GetContext(ctx, &noteID, query, userID)
	return noteID, err
}

func (d *notesDB) Update(ctx context.Context, noteInput NoteUpdateInput) error {
	const query = "UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE user_id = $3 AND note_id = $4"
	res, err := d.db.ExecContext(ctx, query, noteInput.Title, noteInput.Content, noteInput.UserID, noteInput.NoteID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("not found")
	}
	return nil
}

func (d *notesDB) Delete(ctx context.Context, noteInput NoteKey) error {
	const query = "DELETE FROM notes WHERE user_id = $1 AND note_id = $2"
	res, err := d.db.ExecContext(ctx, query, noteInput.UserID, noteInput.NoteID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("not found")
	}
	return nil
}

func (d *notesDB) GetNote(ctx context.Context, noteInput NoteKey) (*Note, error) {
	const query = "SELECT * FROM notes WHERE user_id = $1 AND note_id = $2"
	var note Note
	err := d.db.GetContext(ctx, &note, query, noteInput.UserID, noteInput.NoteID)
	return &note, err
}

func (d *notesDB) GetNotes(ctx context.Context, userID string) ([]NoteSmall, error) {
	const query = "SELECT user_id, note_id, title, updated_at FROM notes WHERE user_id = $1 ORDER BY updated_at DESC"
	var notes []NoteSmall
	err := d.db.SelectContext(ctx, &notes, query, userID)
	return notes, err
}
