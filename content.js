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
    let hostName = window.location.hostname.substring(4);
    let fileName = hostName + ".txt";

    init();
    registerEvents();
    
    function zoomIn(){
    
    }
    
    function zoomOut(){
    
    }

    // traverse the dom elements
    function getNodes(element){
        if(element.localName != undefined){        
            let tempCombine = element.localName; // HTML Tag name
            let styles = window.getComputedStyle(element);
            if(tempCombine == 'img'){                
                tempCombine = tempCombine + ',width:'+ styles.width+ ',height:'+styles.height; // img, Width by Height
            }
            else{
                tempCombine = tempCombine + ','+ styles.fontSize;
            }            
            console.log(tempCombine);
            data.push(tempCombine);
        }

        element.childNodes.forEach(el => {            
            getNodes(el);
        }); 
    }

    function initiateMagnification(e){
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

    function init(){
        //TODO: Will get the current zoom level dynamically later. Setting hard coded value for zoom to 100%.
        let zoom = 100;
        $(document.body).css('zoom', zoom.toString()+'%'); 
        
        getNodes(document);
        // For first phase
        download();

    }

    function registerEvents(){
        // For 2nd phase
        document.onkeydown = document.onkeyup = initiateMagnification;
    }
}();
