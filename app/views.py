from flask import render_template, flash, redirect, url_for,g,request
from app import app,db,models
from .forms import book_form
import json
import os
from pprint import pprint
import sqlite3
from collections import defaultdict
import re


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
	# making search datalist
	book_info={}
	total_copies=0
	filename = os.path.join(app.static_folder, 'books_data_i10.json')
	with open(filename) as book_data:
		data = json.load(book_data)
		for book in data['Books']:
			if(book['title'] is not "" and book['genres'] is not ""):
				Hci_WL=['HCI','usability','Interface','Human-Computer Interaction']
				Hci_WL=re.compile("|".join(Hci_WL))

				SoftSkills_WL=['SoftSkills','Soft Skills']
				SoftSkills_WL=re.compile("|".join(SoftSkills_WL))

				Ee_WL=['Electr','Schaltung','Elektr','Arduino','EE']
				Ee_WL=re.compile("|".join(Ee_WL))

				Cs_WL=['Computer Science','CS']
				Cs_WL=re.compile("|".join(Cs_WL))

				Apple_WL=['Apple','OS X','Mac','Cocoa']
				Apple_WL=re.compile("|".join(Apple_WL))

				Math_WL=['Math','Statistic']
				Math_WL=re.compile("|".join(Math_WL))

				Ftd_WL=['Demenz','FTD']
				Ftd_WL=re.compile("|".join(Ftd_WL))

				History_WL=['Geschichte','History']
				History_WL=re.compile("|".join(History_WL))

				if(Hci_WL.search(book['genres'])):
					category = "HCI"
				elif(SoftSkills_WL.search(book['genres'])):
					category = "SoftSkills"
				elif(Ee_WL.search(book['genres'])):
					category = "EE"
				elif(Cs_WL.search(book['genres'])):
					category = "CS"
				elif(Apple_WL.search(book['genres'])):
					category = "Apple"
				elif(Math_WL.search(book['genres'])):
					category = "Math"
				elif(History_WL.search(book['genres'])):
					category = "History"
				elif(Ftd_WL.search(book['genres'])):
					category = "FTD"
	          
				if(book['title'] in book_info):
					book_info[book['title']][2]=book_info[book['title']][2]+1
					total_copies=total_copies+1
				else:
					total_copies=total_copies+1
					book_info[book['title']]=[category,book['shelves'],1]
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
			str(form.name.data)
			if(str(form.name.data) in book_info):
				book_found=True
				searched=True
				name=str(form.submit.data)
				category=str(book_info[str(form.name.data)][0])
			else:
				flash("Please enter a book name from the drop down only")
			
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