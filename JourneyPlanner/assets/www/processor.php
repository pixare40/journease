<?php   
 
function getData($url){                          
	$ch = curl_init(); // Initiating the request
	$username = "39fd0a28-b175-4f86-9dab-fbda465d0f3f";  // Type Your API Key between double quotations
	$password = "";   // Leave the password empty
	curl_setopt($ch, CURLOPT_URL, $url); // Setting the URL
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_USERPWD, "$username:$password"); //Authentication
	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC); //Authentication
	$output = curl_exec($ch); // Running the request
	$info = curl_getinfo($ch);   // Request Information
	curl_close($ch); // Closing the request
 
	return $output; 
}
 
$FeedUID      = "7c60e7f4-20ff-11e3-857c-fcfb53959281";  // Ipswich data feed UID, provided in Weather Data in the Portal               
$dataStream = "0"; // Temperature Data Stream
$url   = "http://api.stride-project.com/" . "sensors/feeds/" .  $FeedUID . "/datastreams/" . $dataStream;  // The feed URL
$XML_output     = getData($url); // XML Output
$Array_outputut = json_decode(json_encode((array)simplexml_load_string($XML_output)),true); // Array Output
 
echo "<hr/>XML Output<hr/>";
print_r($XML_output);
echo "<br/><br/><br/><hr/>Array Output<hr/>";
print_r($Array_outputut);
 
?>
	  