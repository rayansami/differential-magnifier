document.addEventListener('DOMContentLoaded', function() {
    
    //Invoked for Zoom In
    document.getElementById('zoomIn').addEventListener('click', function(){
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {zoom: "Plus"}, function(response) {
              console.log(response.farewell);
            });
        });  
    });

    //Invoked for Zoom Out
    document.getElementById('zoomOut').addEventListener('click', function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {zoom: "Minus"}, function(response) {
              console.log(response.farewell);
            });
        });  
    });
});
