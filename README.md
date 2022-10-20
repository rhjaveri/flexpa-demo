# flexpa-demo

## Running the backend server 
The backend is a REST API built using Flask. There is a single endpoint, /flexpa-access, used to exchange the publishableKey for an access_token through Flexpa.

Before you can run the server, you'll want to set up a Python virtual environment and download the Flask API 
```
$ cd flexpa-server
$ python3 -m venv flexpa-env
$ source flexpa-env/bin/activate
$ pip install -r requirements.txt
```
Next, you need to add an .env to the flexpa-server folder. 
In an .env file, add the secret key retrieved from your Flexpa Organization Account
- SECRET_KEY=sk_test_YOUR_SECRET_KEY

Now you can run the Flask API and it will listen to requests from your frontend (which we are about to set up)!
```
$ flask run
```

## Running the frontend
The font is a React application built using Create-React-App. 

To get started, first download all npm packages and set up the environment 
```
$ cd flexpa-challenge
$ npm install 
```
In an .env file in this folder, add the following variables
- REACT_APP_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
- REACT_APP_SERVER_URL=http://127.0.0.1:5000
- REACT_APP_FHIR_URL=https://api.flexpa.com/fhir

Now you can run the React App and try out Flexpa Link!
```
$ npm start
```


