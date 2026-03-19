package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	dsn := "root:" + os.Getenv("DB_PASSWRD") + "@tcp(localhost:3306)/todo_db"

	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to MySQL")

}
