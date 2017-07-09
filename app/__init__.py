from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import random
import os

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

def filter_shuffle(seq):
    try:
        result = list(seq)
        random.shuffle(result)
        return result
    except:
        return seq

app.jinja_env.filters['shuffle'] = filter_shuffle

from app import views, models

