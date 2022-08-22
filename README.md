# DataCue frontend

## How to run

### Backend
1. In a separate terminal, run the backend by going to the backend folder `cd backend`. 
2. There are multiple builds of the dashboard for each OS. Edit the `run_backend.sh` file to point to the right dashboard version according to your OS. e.g. if you use Linux, change the file to run `dashboard_linux`
3. Run `bash run_backend.sh` it will set the right ENV variables to run the backend in demo mode.
4. The dashboard backend should begin and show you a url like `http://localhost:8080/shopify-login#asdsdsds`

### Frontend

1. Run `npm install` and `npm run serve`
2. Paste the URL you got from the backend (step 4) into your browser. It will automatically log you in to the frontend.


