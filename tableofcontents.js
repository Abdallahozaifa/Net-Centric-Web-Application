$(document).ready(function(){
    var divHeaderIDS = document.querySelectorAll("div");
    var contentDivHeaderIDS = document.querySelectorAll("#contents > div");
    var collectionOFIDS= document.querySelectorAll("h1,h2");
    var h2Elements = document.querySelectorAll("h2");
    var insideLevel = 1, outsideLevel=collectionOFIDS.length - h2Elements.length;
    for(var i=20;i>0;i--){
        var outsideDiv = document.createElement("div");
        var p = document.createElement("a");
        outsideDiv.appendChild(p);
        p.href = "#" + divHeaderIDS[i-1].id;
        var headerElement = collectionOFIDS[i-1];
        
        if($(headerElement).is('h1')){           
            p.innerHTML = outsideLevel + " " + headerElement.innerHTML;
            outsideLevel--;
            if(contentDivHeaderIDS[i-1] != undefined){
                //console.log(contentDivHeaderIDS[i-2].querySelectorAll("h2").length);
                insideLevel = contentDivHeaderIDS[i-1].querySelectorAll("h2").length;
                console.log(insideLevel);
            }
        }else{
            insideLevel++;
            //console.log(insideLevel);
            p.innerHTML = outsideLevel + "." + insideLevel + " " + headerElement.innerHTML;
            
        }
        //console.log("Element " + headerElement + "has the parent " + headerElement.parentNode);
        document.body.insertBefore(outsideDiv, document.body.firstChild);
    }
    
//    var numofH2s = function(divElement){
//        for(var i=0;i<divElement.children;i++){
           
//        }
//    }    
});
