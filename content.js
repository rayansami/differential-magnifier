/*    
    Control = 17
    Shift = 16
    Up-Arrow = 38
    Down-Arrow = 40

    To Zoom-in Press: Ctrl + Shift + Up-Arrow 
    To Zoom-out Press: Ctrl + Shift + Down-Arrow 
*/

let differentialMagnifier = function (){
    let data = [];
    const elementAttrType = {
        ID: 1,
        CLASS: 0
    };

    let hostName = window.location.hostname.substring(4);    
    let map = [];

    init();
    registerEvents();

    // We do not need the elements that do not contain texts or images
    function isValidElement(elementName){
        let unwantedElements = ["html","script","title","style","noscript","link","meta","head"]
        return unwantedElements.includes(elementName); //Returns true if elementName is included in the list
    }

    // Traverse the dom elements
    function getNodes(element){       
        if(element.localName != undefined){        
            let tagName = element.localName; // HTML Tag name            

            // Check if it is a valid element for text. TODO: Do it for images too    
            if(tagName == "img"){
                /*
                    Adds custom class on every image tag   
                    This allows us to impose transform scale on them             
                */
                // TODO: add image sizewise filter
                $(element).addClass("zoom3947");
            }   

            if(!isValidElement(tagName) && element.textContent.length > 0){
                let fontSize = parseFloat(window.getComputedStyle(element).fontSize.replace("px",""));     

                // Check if ID exists. If not then put the type as class
                let elementGetterAttrType = (element.id.length) > 0 ? elementAttrType.ID : elementAttrType.CLASS;
                
                // If ID exists take the ID name. If not then take class names
                let elementGetterAttrName = (element.id.length) > 0 ? element.id : element.className

                /*
                    Create a JSON with the following properties:
                    # class/id 
                    # name_of_id/class
                    # font_size 
                */ 
                let objData = {                
                    "FontSize": fontSize,                           // Float value of font size
                    "ElementGetterAttrType": elementGetterAttrType, // 1 or 0
                    "ElementGetterAttrName": elementGetterAttrName  // Name of classes of id                   
                };

                // Push the objects
                if(elementGetterAttrType === elementAttrType.ID){
                    //If ID is available push the JSON                    
                    data.push(objData);
                }                      
                                
                /* 
                   In the array of Json, pushing the Class elements only once. 
                   That's why I am cheking if a particular class is already existed in the array of JSON 
                */
                if(elementGetterAttrType === elementAttrType.CLASS){
                    //If ID is not available check if the classnames have been pushed before
                    let isClassAttrExistsAlready = 0;                    
                    for(i= 0 ;i< data.length; i++){                        
                        if(data[i].ElementGetterAttrName === elementGetterAttrName){
                            isClassAttrExistsAlready = 1;
                            break;
                        }
                    }

                    if(!isClassAttrExistsAlready){                        
                        data.push(objData);
                    }
                }                
            }        
        }

        // Recusively traverse the childnodes
        element.childNodes.forEach(el => {            
            getNodes(el);
        }); 
    }

    // Apply the newly calculated fontsize to the doc
    function applyOnDocument(obj){
        if(obj.ElementGetterAttrType === elementAttrType.ID){
            let element = document.getElementById(obj.ElementGetterAttrName)            
            element.style.fontSize = obj.FontSize.toFixed(2).toString()+"px";
        }
        else{
            let elements = document.getElementsByClassName(obj.ElementGetterAttrName)
            console.log("Elements count:"+ elements.length);
            for(elm = 0; elm < elements.length ; elm++){                
                elements[elm].style.fontSize = obj.FontSize.toFixed(2).toString()+"px";
            }            
        }
    }

    function zoomIn(){
        console.log('hit Zoomin');
        // Iterate through the data object and calculate the font size
        for(i=0; i < data.length ; i++){
            // Generate a random number
            let randomFactor = Math.random();         
            console.log("Previous Font size:"+ data[i].FontSize);
            // Add that random value to all the fonts in the object array
            data[i].FontSize =  data[i].FontSize + randomFactor;            
            applyOnDocument(data[i]);
        }        
    }
    
    function zoomOut(){
        console.log('hit Zoomout');
        for(i=0; i < data.length ; i++){
            let randomFactor = Math.random();         
            console.log("Previous Font size:"+ data[i].FontSize);
            data[i].FontSize =  data[i].FontSize - randomFactor;            
            applyOnDocument(data[i]);
        }        
    }    

    function init(){
        //TODO: Will get the current zoom level dynamically later. Setting hard coded value for zoom to 100%.
        let zoom = 100;
        $(document.body).css('zoom', zoom.toString()+'%'); 
        
        // Traverse through the dom elements
        getNodes(document);

        /* For first phase */
        //download();
        
        /* For checking Json obejct values*/
        checkJson();
        
    }

    // For controlling zoom from extension UI. 
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        if(request.zoom == "Plus"){
            zoomIn();
        }
        
        if(request.zoom == "Minus"){
            zoomOut();
        }            
        
        if (request.zoom == "Plus" || request.zoom == "Minus")
            sendResponse({farewell: "working"});
    });

    function registerEvents(){
        // When user press keys to zoom in/zoom out
        document.onkeydown = document.onkeyup = function (e) {
            e = e || window.event;
        
            console.log(e.keyCode);
            map[e.keyCode] = e.type == 'keydown';
        
            if( map[17] && map[16] && map[38]){
                zoomIn();
            }  
            else if(map[17] && map[16] && map[40])
            {
                zoomOut();
            }                 
        };


        // This will add css transform scale to all the images 
        // Used like zoomed image while hovering
        $(document).ready(function(){
            $(".zoom3947").hover(function(){
                $(this).css("transform","scale(1.5)");
            },function(){
                $(this).css("transform","scale(1)");
            });
        });
    }
}();
