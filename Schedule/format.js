$(document).ready(function(){
   setTimeout(function(){ 
       var formatTable = function(){
       var table = $("table");
           //console.log(table);
           columnTwoCell = 9;
           columnThreeCell = [15,21,33,45,51,63,69,81,87,99,105,117,123,135,141,153,159,171,177,189,207,213,225,231,243,249,261,267];
           col3Count = 0;
           cellCount = 1;
           var tagClass = function(){
               table.find('tr').each(function(index, elem){
                  $(this).find('td').each(function(i, elm){
                      $(elm).addClass("cell-" + cellCount);
                      cellCount++;
                      console.log(elm);
                  });
               });
           }();
           table.find('tr').each(function(index, elem){
              $(this).find('td').each(function(i, elm){
                  var cell = $(elm);
                  /**
                  * iterates through the second column
                  */
                  if(cell.hasClass("cell-" + columnTwoCell)){                   
//                      console.log(elm);
                      if(columnTwoCell == 9 || columnTwoCell == 39 || columnTwoCell == 57 || columnTwoCell == 75 || columnTwoCell == 93                         || columnTwoCell == 111 || columnTwoCell == 129 || columnTwoCell == 147 || columnTwoCell == 165 ||                                      columnTwoCell == 201 || columnTwoCell == 219 || columnTwoCell == 237 || columnTwoCell == 255){
                          cell.attr("rowspan", "3");
                      }
                      if(columnTwoCell == 27 || columnTwoCell == 183){
                          cell.attr("rowspan", "2");
                      }
                      columnTwoCell +=6;      
                  }
                  /**
                  * iterates through the third column
                  */
                  if(cell.hasClass("cell-" + columnThreeCell[col3Count])){
                      cell.remove();
                      col3Count++;
                  }
              })
           });
       }();
   }, 1000);
});