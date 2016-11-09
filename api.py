from flask import Flask, request
from flask.ext.restful import Resource, Api
import pymongo
from pymongo import MongoClient
from flask import jsonify
import uuid
import json


# port 9090 running
# domain is api-birthdays.boramash.com
app = Flask(__name__)
api = Api(app)

client = MongoClient('localhost', 2800)
db = client.birthdays

mailgun_key = ''
mailgun_sandbox = ''
mailgun_url = 'https://api.mailgun.net/{0}'.format(mailgun_sandbox)


class Venue(Resource):

  def get(self, venue_id):
    rel = db.relationships.find_one({"venue_id": venue_id})
    return jsonify({"result" : json.dumps(rel)})    

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
    venues = []
    for ven in  db.venues.find({}, {'_id': False}):
      print(ven) 
      venues.append(ven)
    return  jsonify({"result" : json.dumps(venues)})




class Booking(Resource):
  def get(self):
    res = db.bookings.find_one({"booking_id": request.args["booking_id"]})
    print("res found!" + str(res))
    print("printing reqest args booking_id" + request.args["booking_id"] )  
    val = {}
    #for booking in res:
    #val = booking
    res["_id"] = str(res["_id"])  
    #return jsonify({"result": res})
    return {"result": res } 

  def post(self):  # for creating a new booking
    res = request.get_json()
    print(str(res))
    print(str(request.form))
    for k,v in request.form.items():
      print (k, v) 
    booking_id = str(uuid.uuid4())
    booking = {"booking_id": booking_id, "booking_date": res["date"], "venue": res["venue"], "booking_memberslist": [], "party_num_people": res["party_num_people"], "customer_name": res["customer_name"], "customer_phone": res["customer_phone"], "party_type": res["party_type"]  } 
 
    res  = db.bookings.insert(booking)
    return jsonify({"result": json.dumps(str(res)), "booking_id": booking_id })


  def put(self, booking_id):
    print("booking id is passed ? " + booking_id) 
    print("received put request to update a booking, booking id is : " + request.args["booking_id"]) 
    print("maybe json is sent ? " + request.get_json() )
    return "test return"

  def sendConfirmations(email):
    pass
    # send email to us, and to customer



class User(Resource):
  def get(self, user_id):
    return "success"

  def post(self):
    user_id = str(uuid.uuid4())
    user = {"user_id" : user_id, "user_phone": request.form["phone"] }
    res = db.users.insert(user)
    return jsonify({"result" : dumps(res)})

class BookingUpdate(Resource):
  def put(self):
    print("in put handling for booking update")
    #print("request json is " + request.get_json() ) 
    req = request.get_json()

    db.bookings.update( {"booking_id": request.args["booking_id"] }, { "$set":  {"booking_memberslist" : req["booking_memberslist"]} }) 
    return "success" 



api.add_resource(Venue, '/<string:venue_id>')
api.add_resource(AllVenues, '/allvenues')
api.add_resource(Booking, '/booking')
api.add_resource(BookingUpdate, '/booking-update')

if __name__ == '__main__':
  app.run(port=9090, debug=True)


