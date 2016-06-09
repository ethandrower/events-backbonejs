from flask import Flask, request
from flask.ext.restful import Resource, Api
import pymongo
from pymongo import MongoClient
from flask import jsonify
import uuid


app = Flask(__name__)
api = Api(app)

client = MongoClient('localhost', 2800)
db = client.rolodextor


class Venue(Resource):

  def get(self, venue_id):
    rel = db.relationships.find_one({"venue_id": rel_id})
    return jsonify({"result" : dumps(relationship)})    

# Don't need these other ones quite yet, will add to db manually.
"""
  def post(self, rel_id):
    rel = {"name" : request.form["name"], "relationship": "default", "email" request.form["email"], "last-spoken": request.form["last-spoken"], "alert": request.form["alert"], "interval": request.form["interval"] }

    rel  = { 'relationship_id': request.form['rel_id'] }
    result = db.relationships.insert(rel)
    return jsonify({"result": result})

  def put(self, rel_id):
    data = request.get_json()
    res = db.relationships.update({'relationship_id': rel_id}, {'$set': data }
    return jsonify({"result": res }) 

  def delete(self, rel_id):
    db.relationships.remove({"relationship_id" : rel_id })
    return jsonify({"result": "success"})
"""

#api end point to return all venues (for homepage)
class AllVenues(Resource):
  #ultimately will also be able to take filters (prioritize list of venues returned)
  def get(self):

    venues = db.venues.find({{})
    return = jsonify({"result" : dumps(venues)})


class Booking(Resource):
  def get(self, booking_id):
    pass   # not neeeded quite yet.


  def post(self):  # for creating a new booking
    booking_id = str(uuid.uuid4())
    booking = {"booking_id": booking_id, "booking_date": request.form["date"], "booking_venue": request.form["venue_id"], "booking_memberslist", {}, "booking_member_estimate": request.form["estimated_guests"], "booking_user": request.form["user_id"] } 
  
    res  = db.bookings.insert(booking)
    return jsonify({"result": dumps(res)})

class User(Resource):
  def get(self, user_id):
    pass

  def post(self):
    user_id = str(uuid.uuid4())
    user = {"user_id" : user_id, "user_phone": request.form["phone"] }
    res = db.users.insert(user)
    return jsonify({"result" : dumps(res)})





api.add_resource(Venue, '/<string:venue_id>')
api.add_resource(AllVenues, '/')
api.add_resource(Booking, '/')


if __name == '__main__':
  app.run(debug=True)


