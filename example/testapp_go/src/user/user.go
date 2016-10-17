package user

// File with basic user structs

// a simple Users which has simple fields
type User struct {
	Id   int64  `json:"id"` //unique identifier from the database
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func NewUser(name string, age int) User {
	return User{
		Name: name,
		Age:  age,
	}
}
