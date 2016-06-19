package main

// Test server app from cucumber-api

import (
	"database/sql"
	"db"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

var dbase *sql.DB

func sayHello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!\n")
}

// Giving main a flag of '--create' will simply create a skeleton database and exit
func main() {
	dbPath := getDBFilepath()
	if len(os.Args) > 1 && os.Args[1] == "--reset-db" {
		os.Remove(dbPath)
		err := db.CreateSkelDB(dbPath)
		if err != nil {
			fmt.Println(err)
		}
		return
	}

	dbase, err := db.OpenDB(dbPath)
	setGlobalDatabase(dbase)

	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/users", handleUser)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func setGlobalDatabase(d *sql.DB) {
	dbase = d
}

func getDBFilepath() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	return filepath.Join(dir, "db", "test.db")
}
