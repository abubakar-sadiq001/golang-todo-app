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

	DB, err = sql.Open("mysql", os.Getenv("MYSQL_DSN"))
	if err != nil {
		log.Fatal(err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to MySQL")

}
