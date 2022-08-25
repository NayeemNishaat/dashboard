const jwt = require('jsonwebtoken');
console.log("Generating token...")
const SHOPIFY_APP_HOST = "https://demoshopifyapp.datacue.co"
const DASHBOARD_URL = "http://localhost:8080"
const sub = {
    "apikey": "datacue-dev-store.myshopify.com",
    "auth_provider": "shopify",
    "first_name": "test",
    "last_name": "user",
    "session_id": "123",
    "subscription_id": "123",
    "user_id": "demo"
}
const token = jwt.sign({ iss: SHOPIFY_APP_HOST, sub, aud: DASHBOARD_URL, ctx: {} }, "lorem-ipsem", { expiresIn: 6000 });
console.log("1. Run npm run serve to launch the frontend - verify that frontend is running on port 8080")
console.log(`2. Visit http://localhost:8080/shopify-login#${token}`)
