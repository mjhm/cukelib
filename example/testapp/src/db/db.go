// Package that interfaces with the sqlite database
package db

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"strconv"
	"user"
)

// openDB opens the given sqlite database by filepath.
func OpenDB(filename string) (*sql.DB, error) {
	return sql.Open("sqlite3", filename)
}

// CommitUser commits the given user to the given database.
// No santization of inputs is used, be warned.
func CommitUser(db *sql.DB, user *user.User) error {
	stmt, err := db.Prepare("insert into users values(NULL,?,?)")
	if err != nil {
		return err
	}
	defer stmt.Close()
	res, err := stmt.Exec(user.Name, user.Age)
	if err != nil {
		return err
	}
	user.Id, err = res.LastInsertId()
	if err != nil {
		return err
	}
	return nil
}

// CreateSkelDB creates a skeleton database with one user table and no users.
func CreateSkelDB(filename string) error {
	db, err := OpenDB(filename)
	if err != nil {
		return err
	}
	defer db.Close()

	sqlStmt := `
  create table users (
    id integer primary key,
    name text not null,
    age integer
  )
  `
	_, err = db.Exec(sqlStmt)
	if err != nil {
		return err
	}
	tx, err := db.Begin()
	if err != nil {
		return nil
	}
	tx.Commit()
	return nil
}

// FindUsersBy takes in a database connection and map of filters. It searches the database
// for the users matching the filters and returns a slice of results.
// valid filters are of the form: map{ "name": "john", "age": "23", "id": 7}
// (Or any subset of those keys). A blank filter map will select all users.
// No santization of inputs is used, be warned.
func FindUsersBy(db *sql.DB, filters map[string]string) ([]user.User, error) {
	var retSlice []user.User
	sqlStmt := "select * from users "
	if len(filters) > 0 {
		sqlStmt += "where "
		for key, val := range filters {
			sqlStmt += key + "="
			if key == "name" {
				sqlStmt += "\"" + val + "\""
			} else {
				sqlStmt += val
			}
			sqlStmt += " and "
		}
		sqlStmt = sqlStmt[:len(sqlStmt)-4]
	}

	rows, err := db.Query(sqlStmt)
	if err != nil {
		return retSlice, err
	}
	defer rows.Close()

	for rows.Next() {
		var resUser user.User
		err = rows.Scan(&resUser.Id, &resUser.Name, &resUser.Age)
		if err != nil {
			return retSlice, err
		}
		retSlice = append(retSlice, resUser)
	}
	return retSlice, nil
}

// deleteUser deletes a given user by id.
// It returns error on database error (like no such user with given id).
// Otherwise, it returns the number of users deleted.
func DeleteUser(db *sql.DB, id int) (int64, error) {
	sqlStmt := "DELETE from users where id=" + strconv.Itoa(id)
	res, err := db.Exec(sqlStmt)
	if err != nil {
		return 0, err
	}
	return res.RowsAffected()
}
