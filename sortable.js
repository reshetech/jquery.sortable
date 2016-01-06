$(function () {
    var couple, dataCollector;
    
    var nbsp = String.fromCharCode(160);
    
    function collectData() {
        var checkedItems = {}, 
            counter      = 0,
            sink         = couple.find('.sink');

        sink.find('li').each(function(){
            
            var li = $(this),
                id = li.attr('data-id');
            
            if(id > 0) {
                checkedItems[counter] = li.attr("data-id");
                counter++;
            }
        });
        
        
        couple.find('.data-collector').val(JSON.stringify(checkedItems, null));
    }
    
    function removeSourceActive(item) {
        item.removeClass("active");
        item.find("span").addClass("glyphicon-unchecked").removeClass("glyphicon-check");
    }
    
    function removeSinkActive(item) {
        item.removeClass("active");
        item.attr('data-id','0');
        item.text('').text(nbsp);
    }
    
    function findMatchingSource(ul) {
        var wrapper = ul.closest('.couple-wrapper');
        var source  = wrapper.find('ul.source');
        
        return source;
    }
    
    function buildSink(ul,array) {
        var build='';
        ul.html('');
        
        $.each(array, function( index, value ) {
          build += '<li class="list-group-item" data-id="'+value['id']+'">'+value['text']+'</li>';
        });


        ul.append(build);
    }
    
    function reOrder(ul,li,action) {
        
        var selectedId = li.attr('data-id');

        var array         = [];
        var selectedIndex = 0;
        var id;
        var ci            = 0;
        ul.children('li').each(function(){
            var li     = $(this),
                values = [],
                id     = li.attr('data-id');
                
            if(id == selectedId) selectedIndex = ci;
                
            values['id']  = id;
            values['text']= li.text();
   
            array.push(values);
             
            ci++;
        });
           
        
        if(action == "up") {
            // Save the above selected item before splicing it out
            //  and inserting it back at its right position. 
            var savedItemAboveSelected = array[selectedIndex-1];
            
            // Return if no item above the selected item.
            if(typeof(savedItemAboveSelected) === "undefined" ) return false;
            
            array.splice(selectedIndex-1, 1);
            array.splice(selectedIndex, 0, savedItemAboveSelected);
        } else {
            // Return if no item after the selected item.
            if(typeof(array[selectedIndex+1]) === "undefined") return false;
            
            // Save the selected item before splicing it out
            //  and inserting it back at its right position.
            var savedItemSelected    = array[selectedIndex];
            array.splice(selectedIndex, 1);
            array.splice(selectedIndex+1, 0, savedItemSelected);
        }
        
        
        buildSink(ul,array);
    }
    
    function remove(ul,li) {
        var liId = li.attr('data-id');
        if(liId < 1) return false;
        
        
        var matchingSource = findMatchingSource(ul);
        
        matchingSource.children('li').each(function(idx, li){
            var li = $(li);
            
            if(li.hasClass("active") && li.attr('data-id') == liId) {
                removeSourceActive(li);
            }
        });
        
        removeSinkActive(li);
    }

    $('.source').on('click','li', function(event) {
        event.preventDefault();

        var selected    = $(this),
            selectedTxt = selected.text(),
            selectedId  = selected.data('id');
            
            
        couple        = selected.closest('.couple-wrapper');
        dataCollector = couple.find('.data-collector');


        if(selected.hasClass("active")) {
            removeSourceActive(selected);
        } else {
            selected.addClass("active");
            selected.find("span").removeClass("glyphicon-unchecked").addClass("glyphicon-check");
        }
        
       
        var sink    = couple.find('ul.sink');
          
        var foundOne= false;  
            
        sink.children('li').each(function () {
            var li    = $(this);
            
            if(li.attr('data-id') == 0 && !foundOne) {
                li.text(selectedTxt);
                li.attr('data-id',selectedId);
                foundOne = true;
            }   
        });
        
        collectData()
    });
    
    var sinkLi,
        sinkUl;
    
    $('.sink').on('click','li', function(e) {
        e.preventDefault();
        
        var selected = $(this),
        selectedTxt  = selected.text(),
        selectedId   = selected.data('id');
        
        sinkLi       = selected;
        sinkUl       = selected.closest('ul');
        
        couple       = selected.closest('.couple-wrapper');
        dataCollector= couple.find('.data-collector');

        if(selected.hasClass("active")) {
            selected.removeClass("active");
        } else {
            selected.addClass("active");
        }
        
        collectData();
    });
    
    
    $('.activeBtns').on('click',function(e){
        e.preventDefault();
        
        var btn     = $(this);
        
        
        couple       = btn.closest('.couple-wrapper');
        dataCollector= couple.find('.data-collector');
        
        
        var action  = btn.attr('data-action');
        
        if(typeof(sinkLi) === "undefined" )
        {
            alert('נא לבחור פריט שעליו תתבצע הפעולה.');
        }
        else
        {
            if(action == 'remove') {
                remove(sinkUl,sinkLi);
            } else {
                reOrder(sinkUl,sinkLi,action);
            }
        
            collectData(); 
        }
    });
}); 
