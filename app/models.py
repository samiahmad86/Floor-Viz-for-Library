from app import db

class Books_Data(db.Model):
    Title = db.Column(db.String(140),primary_key=True)
    Category = db.Column(db.String(25))
    Shelf = db.Column(db.String(100))
    Copies = db.Column(db.Integer)
    
    def __repr__(self):
        return '<Books_Data %r>' % (self.Title)


