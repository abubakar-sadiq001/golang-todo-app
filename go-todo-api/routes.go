package main

import "net/http"

func RegisterRoutes() {

	http.HandleFunc("/todos", GetTodos)
	http.HandleFunc("/todos/create", CreateTodo)
	http.HandleFunc("/todos/delete", DeleteTodo)
	http.HandleFunc("/todos/update", UpdateTodo)
}
