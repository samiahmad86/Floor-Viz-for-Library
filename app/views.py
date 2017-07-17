from flask import render_template, flash, redirect, url_for,g,request
from app import app,db,models
from .forms import book_form
import json
import os
from pprint import pprint
import sqlite3


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
	form=book_form()
	data = models.Books_Data.query.all()
	ar=[]
	searched =False
	for title in data:
		ar.append(str(title.Title))
		
	if(form.submit.data):
			book_found=False
			col=models.Books_Data.query.filter_by(Title=str(form.name.data)).first()
			if(col is not None):
				book_found=True
				searched=True
			if(book_found==False):
				flash("Book name "+str(form.name.data)+" does not exist in the Library")

	return render_template('index.html',form=form,book_data=ar,searched=searched)

@app.route('/shelf', methods=['GET', 'POST'])
def shelf():
	book=request.form.get('book')
	shelf_name=request.form.get('shelf_name')
	return render_template('shelf.html',book=book,shelf_name=shelf_name)

@app.route('/test', methods=['GET', 'POST'])
def test():
	return render_template('test.html')