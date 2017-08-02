from flask_wtf import Form
from wtforms import RadioField,StringField, BooleanField,SubmitField ,widgets, SelectMultipleField,TextField,SelectField
from wtforms.validators import DataRequired
from jinja2  import Markup
import os


class book_form(Form):
	 name    = TextField('Search')
	 submit  = SubmitField(Markup('<i class="glyphicon glyphicon-search"></i>'))


