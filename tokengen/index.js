const jwt = require('jsonwebtoken');
console.log("Generating token...")
const SHOPIFY_APP_HOST = "https://demoshopifyapp.datacue.co"
const DASHBOARD_URL = "http://localhost:8080"
let mode = "normal";
if (process.argv.length == 3) {
    newMode = process.argv[2];
    if (["normal", "onboarding", "need-setup"].includes(newMode)) {
        mode = newMode
    }
}
const sub = {
    "apikey": `${mode}-datacue-dev-store.myshopify.com`,
    "auth_provider": "shopify",
    "first_name": "test",
    "last_name": "user",
    "session_id": "123",
    "subscription_id": "123",
    "user_id": mode
}
const token = jwt.sign({ iss: SHOPIFY_APP_HOST, sub, aud: DASHBOARD_URL, ctx: {} }, "lorem-ipsem", { expiresIn: 6000 });
console.log("1. Run npm run serve to launch the frontend - verify that frontend is running on port 8080")
switch (mode) {
    case "normal":
        console.log("2. You chose normal mode - you will login straight to the dashboard. Other options (node index.js 'onboarding' or 'need-setup'")
        break;
    case "onboarding":
        console.log("2. You chose onboarding mode - you will start with the new user onboarding screen.")
        break;
    case "need-setup":
        console.log("2. You chose new-setup mode - you will see additional setup screen once you login.")
        break;
    default:
        break;
}
console.log(`Visit http://localhost:8080/shopify-login#${token}`)
