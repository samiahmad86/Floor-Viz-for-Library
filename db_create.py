#!flask/bin/python
from app import app,db,models
import os
import json
from collections import defaultdict
import re

db.create_all()
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
				
	for key in book_info:
		u=models.Books_Data(Title = key, Category = book_info[key][0], Shelf = book_info[key][1],Copies=book_info[key][2])
		db.session.add(u)
	db.session.commit()			
		
