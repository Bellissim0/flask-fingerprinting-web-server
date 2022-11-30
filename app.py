from flask import Flask, render_template


app = Flask(__name__)

@app.route("/")
def hello():
    message = "Hello, World"
    return render_template("helloworld.html", message=message)