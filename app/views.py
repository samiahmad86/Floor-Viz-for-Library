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
	name=""
	category=""
	for title in data:
		ar.append(title.Title)
		
	if(form.submit.data):
			book_found=False

			col=models.Books_Data.query.filter_by(Title=str(form.name.data)).first()

			if(col is not None):
				book_found=True
				searched=True
				name=str(col.Title)
				category=str(col.Category)
				print(category)
			if(col is  None):
				flash("Please enter a book name from the dropdown only")
			elif(book_found==False):
				flash("Book name "+str(form.name.data)+" does not exist in the Library")

	return render_template('index.html',form=form,book_data=ar,searched=searched,book_name=name,book_category=category)

@app.route('/shelf', methods=['GET', 'POST'])
def shelf():
	book=request.form.get('book')
	cabinet_num = request.form.get('cabinet_num')
	shelf_num = request.form.get('shelf_num')
	cabinet_num_w_book = request.form.get('cabinet_num_w_book')
	return render_template('shelf.html',book=book,cabinet_num = cabinet_num, shelf_num = shelf_num, cabinet_num_w_book = cabinet_num_w_book)

@app.route('/test', methods=['GET', 'POST'])
def test():
	return render_template('test.html')