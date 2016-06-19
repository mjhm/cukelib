// routes.go contains handlers for the various routes of the server

package main

import (
	"db"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"user"
	"util"
)

// handleNotFound serves a 404 to the client
func handleNotFound(w http.ResponseWriter, req *http.Request) {
	errResponse := "{ \"error\" : \"Not Found\" }"
	w.WriteHeader(http.StatusNotFound)
	setJsonMimeType(w)
	fmt.Fprintf(w, errResponse)
}

// handleServerError serves a 500 server error to the client with the given error string
func handleServerError(errString string, w http.ResponseWriter, req *http.Request) {
	errResponse := "{ \"error\" : \"Server Error: " + errString + "\" }"
	w.WriteHeader(http.StatusInternalServerError)
	setJsonMimeType(w)
	fmt.Fprintf(w, errResponse)
}

func handleBadRequest(errString string, w http.ResponseWriter, req *http.Request) {
	errResponse := "{ \"error\" : \"Bad Request: " + errString + "\" }"
	w.WriteHeader(http.StatusBadRequest)
	setJsonMimeType(w)
	fmt.Fprintf(w, errResponse)
}

func setJsonMimeType(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}

func handleUser(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		handleUserGet(w, req)
	} else if req.Method == "POST" {
		handleUserPost(w, req)
	} else if req.Method == "DELETE" {
		handleUserDelete(w, req)
	}
}

func handleUserGet(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	if len(req.Form) == 0 { //wants all users
		filters := make(map[string]string)
		allUsers, err := db.FindUsersBy(dbase, filters)
		if err != nil {
			handleServerError(util.ErrorToString(err), w, req)
		} else {
			if allUsers == nil {
				allUsers = make([]user.User, 0)
			}
			data, err := json.Marshal(allUsers)
			if err != nil {
				handleServerError(util.ErrorToString(err), w, req)
				return
			}
			setJsonMimeType(w)
			w.Write(data)
		}
	} else { //wants to filter users
		filters := make(map[string]string)
		name, nameOk := req.Form["name"]
		age, ageOk := req.Form["age"]
		id, idOk := req.Form["id"]
		if nameOk {
			if len(name) > 1 {
				handleBadRequest("please provide only one name", w, req)
				return
			}
			filters["name"] = name[0]
		}
		if ageOk {
			if len(age) > 1 {
				handleBadRequest("please provide only one age", w, req)
				return
			}
			_, err := strconv.Atoi(age[0])
			if err != nil {
				handleBadRequest("please have age be an int!", w, req)
				return
			}
			filters["age"] = age[0]
		}
		if idOk {
			if len(id) > 1 {
				handleBadRequest("please provide only one id", w, req)
				return
			}
			_, err := strconv.Atoi(id[0])
			if err != nil {
				handleBadRequest("please have id be an int!", w, req)
				return
			}
			filters["id"] = id[0]
		}
		users, err := db.FindUsersBy(dbase, filters)
		if err != nil {
			handleServerError(util.ErrorToString(err), w, req)
			return
		}
		if users == nil {
			users = make([]user.User, 0)
		}
		data, err := json.Marshal(users)
		if err != nil {
			handleServerError(util.ErrorToString(err), w, req)
			return
		}
		setJsonMimeType(w)
		w.Write(data)
	}
}

func handleUserPost(w http.ResponseWriter, req *http.Request) {
	if req.Header.Get("Content-Type") == "application/json" { //receive JSON payload
		var newUser user.User
		decoder := json.NewDecoder(req.Body)
		err := decoder.Decode(&newUser)
		if err != nil {
			handleBadRequest(util.ErrorToString(err), w, req)
			return
		}
		err = db.CommitUser(dbase, &newUser)

		data, err := json.Marshal(newUser)
		if err != nil {
			handleServerError(util.ErrorToString(err), w, req)
			return
		}
		setJsonMimeType(w)
		w.Write(data)
		return
	}

	// Received url encoded payload
	req.ParseForm()

	name, nameOk := req.PostForm["name"]
	ageStr, ageOk := req.PostForm["age"]
	if nameOk && ageOk && len(ageStr) == 1 && len(name) == 1 {
		age, err := strconv.Atoi(ageStr[0])
		if err != nil {
			handleBadRequest("age needs an int", w, req)
			return
		}
		newUser := user.NewUser(name[0], age)
		db.CommitUser(dbase, &newUser)

		data, err := json.Marshal(newUser)
		if err != nil {
			handleServerError(util.ErrorToString(err), w, req)
			return
		}
		setJsonMimeType(w)
		w.Write(data)
	} else {
		handleBadRequest("Please provide a single name and age to post form", w, req)
	}
}

func handleUserDelete(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()
	id, idOK := req.Form["id"]
	if idOK && len(id) == 1 {
		idInt, err := strconv.Atoi(id[0])
		if err != nil {
			handleBadRequest("id needs an int", w, req)
			return
		}

		numRows, err := db.DeleteUser(dbase, idInt)
		if err != nil {
			handleServerError(util.ErrorToString(err), w, req)
			return
		}

		setJsonMimeType(w)
		if numRows > 0 {
			fmt.Fprintf(w, "{ \"Success\": true }")
		} else {
			fmt.Fprintf(w, "{ \"Success\": false }")
		}

	} else {
		handleBadRequest("please provide a single id to delete", w, req)
	}

}
