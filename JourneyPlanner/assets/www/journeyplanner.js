
function gps_distance(lat1, lon1, lat2, lon2)
{
	// http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2-lat1) * (Math.PI / 180);
    var dLon = (lon2-lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    
    return d;
}


document.addEventListener("deviceready",function(){
	if(navigator.network.connection.type == Connection.NONE){
		$("#internet_connection").text("No Internet Connection")
								.attr("data-icon","delete")
								.button("refresh");
	}
});

var destination_id ="";
var trackerid= null;
var trackinginfo = [];
var api_key = "39fd0a28-b175-4f86-9dab-fbda465d0f3f";
var feedURL = "http://api.stride-project.com/transportapi/7c60e7f4-20ff-11e3-857c-fcfb53959281/train/station/LDS/2014-04-04/18:40/timetable";


$.ajax({
		url:feedURL,
		type:"GET",
		contentType:"appliction/json",
		headers:{"x-api-key":api_key,"Accepts":"application/json"},
		success:function(resdata){
			
			var res = JSON.parse(resdata);
			//$("#stridedisplay").html(resdata);
            //var rprt = "";
            //$.each(res.stops, function (index, value) {

             //   rprt = rprt + "<tr><td>" + value.atcocode + "</td><td>" + value.smscode + "</td><td>" + 
               // value.name + "</td><td>" + value.mode + "</td></tr>";
                //$("#stridedisplay").html(rprt);

            //});
			var datalength = res.length
			$("#stridedisplay").append(datalength);
			var train_data = "";
			for(i=0; i<res.length; i++){
		    	var train_data = "Destination: " + res.departures.all[i].destination_name + 
		    	"Operator: " +  res.departures.all[i].operator;
		    }
			$("#stridedisplay").append (train_data);
				
			

		}
});


$("#startTracking").on('click',function(){
	trackerid = navigator.geolocation.watchPosition(
			//Success
			function(position){
				trackinginfo.push(position);
			},
			
			//Error
			function(error){
				console.log(error);
			},
			
			//Additional Attributes
			
			{frequency:3000, enableHighAccuracy:true});

//Collect journey Destination
destination_id = $("#destination_id").val()

//Hide division

$("#destination_id").hide();
$("#journeystatus").html("Tracking Journey To <strong>"+ destination_id +"</strong>");
});

$("#stopTracking").on('click',function(){
	//Stop Tracking, Destination Reached or stopped by user
	navigator.geolocation.clearWatch(trackerid);
	
	//Save tracking data
	window.localStorage.setItem(destination_id,JSON.stringify(trackinginfo));
	
	//Reset
	var trackerid= null;
	var trackerinfo = null;
	$("#destination_id").val("").show();
	$("#journeystatus").html("You Have Reached your destination<br/>Share on twitter");
	
});

$("#cleardata").on('click',function(){
	window.localStorage.clear();
});
$("#dummy_data").on('click', function(){
	window.localStorage.setItem('DummyArea', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');

});
$("#history").on('pageshow',function(){
	var journeys = window.localStorage.length;
	$("#journeys_recorded").html("<strong>"+journeys+"</strong> Journeys Recorded");
	$("#journeylist").empty();
	for(i=0; i<journeys; i++){
	$("#journeylist").append("<li><a href='#journeydetails' data-ajax='false'>"+ window.localStorage.key(i) + "</a></li>");
	}
	
	$("#journeylist").listview("refresh");
});

$("#journeylist li a").on('click',function(){
	$("#journeydetails").attr("destination_id",$(this).text());
});
$("#journeydetails").on('pageshow',function(){
	var key = $(this).attr("destination_id");
	$("#journeydetails div[data-role='header'] h1").text(key);
	var data = window.localStorage.getItem("DummyArea");
	data = JSON.parse(data);
	//$("#data-display").html(data);
	total_distance = 0;
	
	for(i=0;i<data.length;i++){
		if(i==(data.length-1)){
			break;
		}
		total_distance +=gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i+1].coords.latitude, data[i+1].coords.longitude);
	}
		total_dist_rounded = total_distance.toFixed(2);
		$("#journey_info_info").html("You travelled " + total_dist_rounded + " Kilometers");
		
		//Setting Initial Lattitude and Long for the map
		
		var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

		// Google Map options
		var myOptions = {
	      zoom: 15,
	      center: myLatLng,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

	    // Create the Google Map, set options
	    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	    var trackCoords = [];
	    
	    // Add each GPS entry to an array
	    for(i=0; i<data.length; i++){
	    	trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
	    }
	    
	    // Plot the GPS entries as a line on the Google Map
	    var trackPath = new google.maps.Polyline({
	      path: trackCoords,
	      strokeColor: "#FF0000",
	      strokeOpacity: 1.0,
	      strokeWeight: 2
	    });

	    // Apply the line to the map
	    trackPath.setMap(map);
	   
			
	});
