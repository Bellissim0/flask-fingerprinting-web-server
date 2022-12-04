from flask import Flask, render_template
import requests


app = Flask(__name__)

@app.route("/")
def hello():
    r = requests.get("http://127.0.0.1:35001/api/hello")
    message = r.json()["message"]
    return render_template("helloworld.html", message=message)