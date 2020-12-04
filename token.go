package main

import (
	"fmt"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Locale    string `json:"locale"`
	IsPartner bool   `json:"is_partner"`
	IsOwner   bool   `json:"is_owner"`
}

func main() {
	keyStr := os.Getenv("API_SECRET")
	apikey := os.Getenv("STORE_API_KEY")
	email := os.Getenv("USER_EMAIL")
	mySigningKey := []byte(keyStr)
	sUser := User{
		ID:        "2020",
		FirstName: "Shahram",
		LastName:  "Anver",
		Email:     email,
		IsPartner: false,
		IsOwner:   true,
		Locale:    "en",
	}

	// Create the Claims
	claims := &jwt.MapClaims{
		"exp": time.Now().Add(time.Minute * 60).Unix(),
		"sub": apikey,
		"aud": sUser,
		"iss": "shop-app",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(mySigningKey)
	if err != nil {
		panic(err)
	}
	fmt.Println("http://localhost:8080/shopify-login/c2hhaHJhbQ==#" + ss)
}
