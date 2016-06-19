package user

// File with basic user structs

// a simple Users which has simple fields
type User struct {
	Id   int64 //unique identifier from the database
	Name string
	Age  int
}

func NewUser(name string, age int) User {
	return User{
		Name: name,
		Age:  age,
	}
}
