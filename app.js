

// app for birthday party bookings


$(document).ready(function() {

	var Venue = Backbone.Model.extend({
		defaults: {
			name: "Venue Name",
			neighborhood: "Chicago",
			type: "Bar/Club/Restaurant",
			descriptionBrief: "This is the brief description!"

		}


	});

	var Booking = Backbone.Model.extend({
		

		defaults: {

				"venue" :  "venue passed in somehow...",
				"customer_name": "name",
				"customer_phone": "phone",
				"date": "date",
				"party_type": "type",
				"party_num_people": "number of people",
				"booking_url": "file:///Users/user/Desktop/javascript/birthdays/booking/"

		},
		url: 'http://api-birthdays.boramash.com/booking',
		

		parse: function(data){
			console.log("in parse function for booking");
			
			console.log("data result is " + data.result);
			return jQuery.parseJSON(data.result);
		}
		


	});

	var venue1 = new Venue({
		name:" First Venue Bootstrap",
		neighborhood: "River North",
		type: "Club",
		descriptionBrief: " Come out and spend your money at our club"
	
	});
	
	var venue2 = new Venue({
		name:" Second Venue Bootstrap",
		neighborhood: "WrigleyVille",
		type: "Bar",
		descriptionBrief: " Come out and spend your money at our bar"
	
	});
	
	var venueCollection = Backbone.Collection.extend({
		model: Venue,
		url: 'http://api-birthdays.boramash.com/allvenues',
		
		parse: function(data){
			console.log("in parse function");
			
			console.log("data result is " + data.result);
			return jQuery.parseJSON(data.result);
		}
	});




var appVenues = new venueCollection;



	

	//console.log("app venues length contents : " + appVenues.length);

	appVenues.add(venue1);
	appVenues.add(venue2);
	console.log("venues have been added to collection:");

	//console.log(venue1);


var PubSub = function() {
	this.events = _.extend({}, Backbone.Events);
};
var pubSub = new PubSub();



//views

	var AllVenuesView = Backbone.View.extend({
		el: '#main-container',

		initialize: function() {
		// get data but we have it loaded so just render
		console.log("calling render function of allvenuesview");

		this.listenTo(appVenues, 'reset', this.render);

		appVenues.fetch({reset: true, success: function (model, response, options){
		console.log(appVenues.models.length);
		console.dir("models " + appVenues.models);
		console.dir("reset with model " + model);
		
		//appVenues.reset();


		}

		});

		this.render();
		},

		render: function() {
			console.log("in render All venues");
			this.$el.html('');

			appVenues.each(function(model){
				console.log("rendering a venue...");

				var venue = new SingleVenueView({
					model: model
				});

				this.$el.append(venue.render().el);
			}.bind(this)); // ???

			return this;
		}

	});



	var SingleVenueView = Backbone.View.extend({
	tagName: 'div' ,

	template: _.template($('#venue-template').html()),

	events: {
		"click": "viewClicked"
	},

	render: function(){
		console.log("in render single venue");

		this.$el.html(this.template(this.model.attributes));
		return this;

	},
	viewClicked: function (event) {

		console.log("viewClicked: " + this.model.get("name"));
		console.log("trigger event");
		pubSub.events.trigger("venue:selected", this.model);
		this.remove();

	}

	});


		//single venue load detailed template.
	var clickedVenueView = Backbone.View.extend({
		el: "#main-container",
		tagName: 'div',


		template: _.template($('#detailed-venue-template').html()),

		initialize: function() {
			pubSub.events.on("venue:selected", this.venueSelected, this);

		},
		events: {
			"click #btnBook": "viewChanged"
		},
		render: function() {
			console.log("trying to render the clicked venue!");
			var title = this.model.get("name");
			//need to do more rendering here.  use new template.
			this.$el.html('');

			this.$el.html(this.template(this.model.attributes));

		},
		venueSelected: function(venue) {
			console.log("venue selected called" + venue);
			this.model = venue;
			this.render();
		},
		viewChanged: function () {
			console.log("button  Book Party was clicked");
			pubSub.events.trigger("booking-form:opened", this.model);
			this.remove(); 
			
		}

	}); //end clickedVenueView  e


	// show the form to fill out booking info, date time place etc.
	var bookingFormView = Backbone.View.extend({
		el: "#booking-form-container",
		tagName: 'div',

		template: _.template($('#booking-form-template').html()),

		initialize: function(){
			pubSub.events.on("booking-form:opened", this.venueToBook, this);
			this.$el.html('');

		},
		events: {
			"click #btnConfirmBook" : "bookingConfirmed"
		},

		render: function () {
			console.log("rendering the booking form view, for confirmation");
			
			console.log("model is "  + this.model);
			this.$el.html(''); //reset html;
			this.$el.html(this.template(this.model.attributes));
			//this.$el.show();
			this.$("#datepicker").datepicker({

			});
			//this.$el.html(this.template(this.model.attributes));

		},
		venueToBook: function(venue) {
			console.log("bookingFormView received message from pubSub, trying to render form...");

			//this is called on the click of the previous view button
			this.model = venue; //grab model from the calling func
			this.render(); // render the template with our new model in place.
		},

		bookingConfirmed: function() {
			//this is called when the confirm button is clicked, will send off to server.
			//get form vars here

			var bookingModel = new Booking({

				"venue" :  "venue passed in somehow...",
				"customer_name": $("#customer_name").val(),
				"customer_phone": $("#customer_phone").val(),
				"date": $("#datepicker").val(),
				"party_type": $("#party_type").val(),
				"party_num_people": $("#party_num_people").val(),
				"booking_url": "origin"


			});
			console.log("cid before save is " + bookingModel.cid);
			console.log("id before save is " +  bookingModel.id);
			//create a new model to hold a 'booking'  (bookingModel)
			//save that the web service
			//trigger event change view
			console.log("btnConfirmBook clicked!");
			
			bookingModel.save(null, {  success: function (model, response, options){


				

				//this one works!
				console.log("response booking id " + response.booking_id);



				
				//something is up with setting it...
				bookingModel.set("booking_url", "file:///Users/user/Desktop/javascript/birthdays/booking/" + response.booking_id ) ;
				bookingModel.save(null, {success: function(model, response, options){
					
					console.log("booking model url after save " + bookingModel.get("booking_url"));
					pubSub.events.trigger("booking-confirmed:opened", bookingModel);
				}


				});


			

			 //drop this view since we are changing to the next.
			}


			});
		
			this.remove();

		}
		

	});


	var confirmationPage = Backbone.View.extend({
		el: "#confirmation-page-container",
		tagName: 'div',

		template: _.template($('#confirmation-page-template').html()),
		initialize: function(){
			pubSub.events.on("booking-confirmed:opened", this.showBookingConfirmation, this);
			console.log("In init of confirmation page...");
			this.$el.html('');

		},
		events: {
			//"click #btnConfirmBook" : "bookingConfirmed"
		},

		render: function () {
			console.log("rendering the booking form view, for confirmation");
			
			console.log("model is "  + this.model);
			this.$el.html(''); //reset html;
			this.$el.html(this.template(this.model.attributes));

		},

		//called via pubsub subscription
		showBookingConfirmation: function(booking) {
			console.log("in show bookingconfirmation method");
			
			this.model = booking;
			console.log("bootking url passed to conf page view is " + booking.get("booking_url"));

			this.render();
		}


	});

var guestRegisterView = Backbone.View.extend({
		el: "#guest-register-container",
		tagName: 'div',

		template: _.template($('#guest-register-template').html()),

		initialize: function(){
			pubSub.events.on("guest-register:opened", this.getBooking, this);
			this.$el.html('');

		},
		events: {
			"click #btnConfirmBook" : "bookingConfirmed"
		},

		render: function () {
			console.log("rendering the booking form view, for confirmation");
			
			console.log("model is "  + this.model);
			this.$el.html(''); //reset html;
			this.$el.html(this.template(this.model.attributes));
			//this.$el.show();
			


		},getBooking: function(booking) {
			console.log("bookingFormView received message from pubSub, trying to render form...");

			//this is called on the click of the previous view button
			this.model = booking; 
			this.render(); 
		}
	});

	// guest sign up view (custom link)
	/* this will be @ route    birthdays/home.html/party/:id_of_party
		the route will need to grab the right party by id from the web service
		then load the view passing that model into  the view.
		*/

	var myRouter = Backbone.Router.extend({

		initialize: function() {
			//init a view for the guest sign up "event page view" 
		},
		routes: {
			"eventpage/:id" : "loadeventpage"
		},
		loadeventpage: function(booking_id) {
			//this.view_we_inited.render()  
			
			// fetch model with the id  from teh route
			console.log("router has been called! booking id is " + booking_id);
			
			this.booking = new Booking({id: booking_id});
			this.booking.fetch( {data: {"booking_id": booking_id}, success: function(model, response, options) {

				pubSub.events.trigger("guest-register:opened", this.booking);

				}
			});

		}


	});

	 var router = new myRouter;
	/* router.on('route:loadeventpage', function(post_id){
	 	console.log("sload event route called");

	 	alert("id passed was " + post_id);


	 }); */

	 Backbone.history.start();

	var app =  new AllVenuesView;
	//AllVenuesView.render();

	var clickedVenueView = new clickedVenueView();
	var bookingFormView = new bookingFormView();
	var bookingConfirmationView = new confirmationPage();



});