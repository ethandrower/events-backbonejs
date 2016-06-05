

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

	var venue1 = new Venue({
		name:" First Venue",
		neighborhood: "River North",
		type: "Club",
		descriptionBrief: " Come out and spend your money at our club"
	
	});
	
	var venue2 = new Venue({
		name:" Second Venue",
		neighborhood: "WrigleyVille",
		type: "Bar",
		descriptionBrief: " Come out and spend your money at our bar"
	
	});
	
	var venueCollection = Backbone.Collection.extend({
		model: Venue
	});

	var appVenues = new venueCollection;
	appVenues.add(venue1);
	appVenues.add(venue2);
	console.log("venues have been added to collection:");

	console.log(venue1);


var PubSub = function() {
	this.events = _.extend({}, Backbone.Events);
};
var pubSub = new PubSub();



//views

	var AllVenuesView = Backbone.View.extend({
		el: '#main-container',

		initialize: function() {
		// get data but we have it loaded so just render
		this.render();
		},

		render: function() {
			console.log("in render All venues");
			this.$el.html('');

			appVenues.each(function(model){

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
			console.log("button booked!!");
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
		}
		



	});


	var app =  new AllVenuesView;
	var clickedVenueView = new clickedVenueView();
	var lbookingFormView = new bookingFormView();



});