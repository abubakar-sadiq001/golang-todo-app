package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func GetTodos(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	rows, err := DB.Query("SELECT id, title, completed FROM todos")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var todos []Todo

	for rows.Next() {
		var t Todo
		err = rows.Scan(&t.ID, &t.Title, &t.Completed)
		if err != nil {
			fmt.Println(err)
			log.Fatal(err)
		}
		todos = append(todos, t)
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(todos); err != nil {
		fmt.Println(err)
	}
}

func CreateTodo(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()

	var todo Todo
	json.NewDecoder(r.Body).Decode(&todo)

	insertStatement, err := DB.Prepare("INSERT INTO todos (title, completed) VALUES (?, ?)")
	if err != nil {
		fmt.Println("There was a problem preparing statement")
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}
	defer insertStatement.Close()

	result, err := insertStatement.Exec(todo.Title, todo.Completed)

	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}

	id, _ := result.LastInsertId()
	todo.ID = int(id)
	fmt.Println(result.RowsAffected())

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(todo)
	if err != nil {
		fmt.Println(err)
	}
}

func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	_, err := DB.Exec("DELETE FROM todos WHERE id=?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Write([]byte("Deleted"))
}

func UpdateTodo(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	var todo Todo
	json.NewDecoder(r.Body).Decode(&todo)

	_, err := DB.Exec("UPDATE todos SET title=?, completed=? WHERE id=?", todo.Title, todo.Completed, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(todo)
	if err != nil {
		fmt.Println(err)
	}

}
