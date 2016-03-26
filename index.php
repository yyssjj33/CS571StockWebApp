<?php
header("Access-Control-Allow-Origin: *");
if(!empty($_GET)){
            //$symbol = $_GET['q'];
            $lookup = array_key_exists('lookup', $_GET) ? $_GET['lookup'] : null;
            $quote = array_key_exists('quote', $_GET) ? $_GET['quote'] : null;
            $news = array_key_exists('news', $_GET) ? $_GET['news'] : null;        
    
    
            if($lookup){
                $url_lookup = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=". $lookup;
//                
//                 $content = file_get_contents($url_lookup);
//                 
//                 echo $content;
                $ch = curl_init();
                // Disable SSL verification
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                // Will return the response, if false it print the response
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                // Set the url
                curl_setopt($ch, CURLOPT_URL,$url_lookup);
                // Execute
                $result=curl_exec($ch);
                // Closing
                curl_close($ch);
                echo $result;
             
            }
    
            if($quote){
                
                $url_quote = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=". $quote; 
//                $content = file_get_contents($url_quote);
//                echo $content;
                $ch = curl_init();
              
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
              
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  
                curl_setopt($ch, CURLOPT_URL,$url_quote);
     
                $result=curl_exec($ch);
            
                curl_close($ch);
                echo $result;
                
            }
            
            if($news){
                

                // Replace this value with your account key
                $accountKey = 'pc24CxjPjgMEfhIjTxArauJnhkl/mI/4dBn+0iI5wbw';

                $ServiceRootURL =  'https://api.datamarket.azure.com/Bing/Search/';
                
                $WebSearchURL = $ServiceRootURL . 'v1/News?$format=json&Query=';

                $context = stream_context_create(array(
                    'http' => array(
                        'request_fulluri' => true,
                        'header'  => "Authorization: Basic " . base64_encode($accountKey . ":" . $accountKey)
                    )
                ));

                $request = $WebSearchURL . urlencode( '\'' . $news . '\'');

                

                $response = file_get_contents($request, 0, $context);
                echo($response);
                
            } 

            
            
            
        }
?>