# DataCue frontend

## How to run

1. Clone the repository in https://github.com/DataCueCo/dashboard.git
2. Run `git checkout v2` to switch to the correct branch **IMPORTANT** (the master and staging branch is outdated)
3. In a separate terminal, run the backend by going to the backend folder. edit the `run_backend.sh` file to point to the right dashboard version according to your OS. if you use Linux, select dashboard_linux.
4. Run `bash run_backend.sh`

The dashboard backend should begin and show you a url like `http://localhost:8080/shopify-login#asdsdsds`

5. Now run `npm install` and `npm run serve`
6. When the dashboard is up and running, paste the above code from step 4 into your browser - this will help you skip the authentication and work directly in the frontend.
