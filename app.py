import datetime
import os
import uuid
from datetime import datetime

import requests
from flask import Flask, jsonify, redirect, render_template, request, session
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker

from flask_session import Session

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)  


#set os environment variable
os.environ["DATABASE_URL"] = "postgresql://postgres:postgres@localhost:5432/test"

if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))

db = scoped_session(sessionmaker(bind=engine))

@app.route("/")
def index():
    return redirect("/login")

# Login Page
@app.route("/login", methods=["GET", "POST"])
def login():
    try:
                
        if session.get("user_id"):
            return render_template("index.html",message="",user_name=session.get("user_name"), user_email=session.get("user_email"), user_id=session.get("user_id"))  
        
        if request.method == "POST":
            loginEmail = request.form.get("email")
            loginPassword = request.form.get("password")
        
            result = db.execute(text("SELECT * FROM users WHERE email = :email AND password=:password"), {"email":loginEmail, "password":loginPassword}).fetchone()
            
            if result is None:
                return render_template("login.html", message="Invalid email or password.")
            
            session["user_id"] = result[0]
            session["user_email"] = result[1]
            session["user_name"] = result[2]

            return redirect("/")
    
        if request.method == "GET":
            return render_template("login.html")
        
    except SQLAlchemyError as e:
        print(str(e))
  


# Register Page
@app.route("/register", methods=["GET", "POST"])
def register():
    
    if session.get("user_id"):
        return redirect("/login")
    
    if request.method == "POST":
        registerUsername = request.form.get("username")
        registerEmail = request.form.get("email")
        registerPassword = request.form.get("password")
        userid = str(uuid.uuid4())

        userquery = text("SELECT * FROM users WHERE username = :username")
        emailquery = text("SELECT * FROM users WHERE email = :email")
    
        userExists = db.execute(userquery, {"username": registerUsername}).fetchone() 
        emailExists = db.execute(emailquery, {"email": registerEmail}).fetchone() 
    
        if not userExists and not emailExists:
            db.execute(text("INSERT INTO users (id,email,username, password) VALUES (:id,:email,:username, :password)"), {"id":userid,"email":registerEmail,"username":registerUsername, "password":registerPassword})
            db.commit()
            
            session["user_id"] = userid
            session["user_name"] = registerUsername
            session["user_email"] = registerEmail
            
            return redirect("/")
        
        return render_template("signup.html", message="User with username or email already exists.")
    if request.method == "GET":
        return render_template("signup.html")

#Home Page
@app.route("/home", methods=["GET", "POST"])
def home():
    if session.get("user_id") is None:
        return redirect("/login")
    
    if request.method == "GET":
        return render_template("index.html", user_name=session.get("user_name"))


# Profile Page
@app.route("/profile", methods=["GET", "POST"])
def profile():
    
    if session.get("user_id") is None:
        return redirect("/login")
    
    if request.method == "POST":
        
        profileUpdateUsername = request.form.get("username")
        userid = session.get("user_id")
        profileUpdatePassword = request.form.get("password")

        userquery = text("SELECT * FROM users WHERE id = :id")
        
        userExists = db.execute(userquery, {"id":userid}).fetchone()
        
        if userExists:
            
            if userExists[2] == profileUpdateUsername:
                profileUpdateUsername = userExists[2]
            else:
                profileUpdateUsername = profileUpdateUsername
            
            if profileUpdatePassword is not None and profileUpdatePassword != "":
                profileUpdatePassword = profileUpdatePassword
            else:
                profileUpdatePassword = userExists[3]
                
            db.execute(text("UPDATE users SET username = :username, password = :password WHERE id = :id"), {"username": profileUpdateUsername,"password":profileUpdatePassword, "id": userid})
            db.commit()
            
            session["user_id"] = userid
            session["user_name"] = profileUpdateUsername
            
            return redirect("/home")
        
        return render_template("profile.html", message="User with username already exists.", user_name=session.get("user_name"), user_email=session.get("user_email"), user_id=session.get("user_id"))
        
    if request.method == "GET":
        return render_template("profile.html", user_name=session.get("user_name"), user_email=session.get("user_email"), user_id=session.get("user_id"))


# Get Police Stations Data
@app.route('/api/police-stations', methods=['GET'])
def get_police_stations_data():
    # Forward request to the actual API
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/9aeefa17-27e8-4dd9-b74d-80f7f9eb85ac/resource/c0176e24-8b76-4bb2-96fa-61cc1af2a065/download/police-facility-locations-4326.geojson"
    url = f"{base_url}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())  # Return API data as JSON
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    


# Get City Vehicle Charging Stations
@app.route('/api/vehicle-charging-stations', methods=['GET'])
def get_vehicle_charging_stations_data():
    # Forward request to the actual API
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/city-operated-electric-vehicle-charging-station-map/resource/dcd8f6fc-dd41-4f9d-a4d8-dd4ef19915fd/download/city-operated-electric-vehicle-charging-station-map-4326.geojson"
    url = f"{base_url}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())  # Return API data as JSON
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


# Get Cafeto Data
@app.route('/api/cafeto-data', methods=['GET'])
def get_cafeto_data():
    # Forward request to the actual API
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/3b605a2e-f3bf-4b2b-b972-c0829b2788f5/resource/aa839e97-df7f-4c65-8aba-d336bb3c8f06/download/cafe-to-locations-4326.geojson"
    url = f"{base_url}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())  # Return API data as JSON
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    

# Get Air Conditioned Places Data
@app.route('/api/air-conditioned-places', methods=['GET'])
def get_air_conditioned_data():
    # Forward request to the actual API
    base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/4aab06c4-9689-4e2c-9476-18ffee312640/resource/f0d66bc3-16cb-4491-97af-0fae10913666/download/air-conditioned-and-cool-spaces-4326.geojson"
    url = f"{base_url}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return jsonify(response.json())  # Return API data as JSON
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


# Logout Page
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# Run the app
if __name__ == '__main__':
    app.run(debug=True)