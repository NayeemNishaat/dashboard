package main

import (
	"fmt"
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
	const apikey = "test.myshopify.com"
	const email = "soraya@datacue.co"

	mySigningKey := []byte("lorem-ipsem")
	sUser := User{
		ID:        "1234",
		FirstName: "Soraya",
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
	fmt.Println("http://localhost:8080/shopify-login/c29yYXlh#" + ss)
}
