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
    let fileName = hostName + ".txt";
    let map = [];

    init();
    registerEvents();

    // We do not need the elements that will not contain texts or images
    function isValidElement(elementName){
        let unwantedElements = ["html","script","title","style","noscript","link","meta","head"]
        return unwantedElements.includes(elementName); //Returns true if elementName is included in the list
    }

    // Traverse the dom elements
    function getNodes(element){       
        if(element.localName != undefined){        
            let tagName = element.localName; // HTML Tag name
            /*
                Create a JSON with the following properties:
                # class/id 
                # name_of_id/class
                # font_size 
            */ 

            // Check if it is a valid element for text. TODO: Do it for images too        
            if(!isValidElement(tagName) && element.textContent.length > 0){
                let fontSize = parseFloat(window.getComputedStyle(element).fontSize.replace("px",""));     

                // Check if ID exists. If not then put the type as class
                let elementGetterAttrType = (element.id.length) > 0 ? elementAttrType.ID : elementAttrType.CLASS;
                
                // If ID exists take the ID name. If not then take class names
                let elementGetterAttrName = (element.id.length) > 0 ? element.id : element.className

                let objData = {                
                    "FontSize": fontSize,                           // Float value of font size
                    "ElementGetterAttrType": elementGetterAttrType, // 1 or 0
                    "ElementGetterAttrName": elementGetterAttrName  // Name of classes of id                   
                };

                /* In the array of Json, pushing the Class elements only once. 
                   That's why I am cheking if a particular class is already existed in the array of JSON 
                */
                if(elementGetterAttrType === elementAttrType.ID){
                    //If ID is available push the JSON
                    //console.log('Class push')
                    data.push(objData);
                }                                
                
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
                        //console.log('Class push')
                        data.push(objData);
                    }
                }                
            }        
        }

        element.childNodes.forEach(el => {            
            getNodes(el);
        }); 
    }

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
        console.log('hit Zoomin')
        for(i=0; i < data.length ; i++){
            let randomFactor = Math.random();         
            console.log("Previous Font size:"+ data[i].FontSize);
            data[i].FontSize =  data[i].FontSize+randomFactor;            
            applyOnDocument(data[i])
        }        
    }
    
    function zoomOut(){
    
    }    

    function download(){        
        let file = new Blob([data.join('\n')],{type:"text/plain"});
    
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    /*Temporary function to check Json object value. TODO: Delete it after everything works*/
    function checkJson(){
        for(i= 0 ;i< data.length; i++){
            console.log(data[i]);
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
    }
}();
