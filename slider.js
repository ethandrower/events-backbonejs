


//slider script
 
console.log("before load");
 $("img.mySlides").load(function () { console.log("slides loaded");	showDivs(1); });



var slideIndex = 1;

//showDivs(slideIndex);
function plusDivs(n) {
	showDivs(slideIndex += n);
}

function showDivs(n) {
	console.log("show divs called");
	var i;
	var x = document.getElementsByClassName("mySlides");
	if ( n > x.length) { slideIndex = 1;}
	if ( n < 1 ) { slideIndex = x.length } 

	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";


	}
	

	  x[slideIndex-1].style.display = "block";


}

function initLoadSlider(){

var myLoop = setInterval(timer, 100);

	function timer() {
		var x = document.getElementsByClassName("mySlides");
		if (undefined !== x &&  x.length > 0 )
		{
		  x[slideIndex-1].style.display = "block";
		  window.clearInterval(myLoop);
		}
		console.log("in interval yo");
	}

}