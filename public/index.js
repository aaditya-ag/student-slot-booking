/*++++++++++++++++++++++++++++++++++
++++++++Utility functions+++++++++++
++++++++++++++++++++++++++++++++++++*/

//Finds dates which lie between T + 4hours and T + 7days
function isValidDate(timeSlot){
    var d = new Date();
    var timeNow = d.getTime();
    var hours = 60 * 60 * 1000;
    var days = hours * 24;
    if(timeSlot >= timeNow + 4*hours && timeSlot <= timeNow + 7*days){
        return true;
    }
    return false;
}


function clearCourses(){
    let courses = $("#courses");
    courses.empty();
    courses.append('<option disabled>Choose Course</option>');
    courses.prop('selectedIndex', 0);
    clearDates();
}

function clearDates(){
    let dates = $("#dates");
    dates.empty();
    dates.append('<option disabled>Choose Dates</option>');
    dates.prop('selectedIndex', 0);
    clearSlots();
}

function clearSlots(){
    let slots = $("#slots");
    slots.empty();
    slots.append('<option disabled>Choose Time Slot</option>');
    slots.prop('selectedIndex', 0);
}

function validatePhone(){
    var text = document.getElementById("pno").value;
    var regx = /^[6-9]\d{9}$/ ;
    if(regx.test(text))
        return true;
    else
        return false;
}

//++++++++++Utility functions end++++++++++++

const url = "https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec";
get_Data();


async function get_Data(){
    const response = await fetch(url);
    const data = await response.json();  
    
    let courses = $("#courses");
    clearCourses();
    let dates = $("#dates");
    let slots = $("#slots");
    
    
    $.each(data,function(i,option){
        courses.append($('<option></option>').text(option.course_name));
    })


    $("#courses").on("change",function(){
        var course_name = $("#courses :selected").text();
        
        clearDates();

        $.each(data,function(i,option){
            if(option.course_name === course_name){
                var setOfDates = new Set();
                for(var i =0;i<option.slots.length;i++){
                    if(isValidDate(Number(option.slots[i].slot))){
                        var date = new Date(Number(option.slots[i].slot));
                        setOfDates.add(date.toDateString());
                    }
                }
                for(const item of setOfDates){
                    dates.append($('<option></option>').text(item));
                }
            }
        });
    });

    $("#dates").on("change",function(){

        clearSlots();


        var selectedDate = $("#dates :selected").text();
        var course_name = $("#courses :selected").text();
        $.each(data,function(i,option){
            if(option.course_name === course_name){
                for(var i = 0;i<option.slots.length;i++){                        
                        var date = new Date(Number(option.slots[i].slot));
                        if(isValidDate(Number(option.slots[i].slot)) && selectedDate == date.toDateString()){
                            slots.append($('<option></option>').text(date.toTimeString()));
                        }
                }
            }
        });

    });

    
    $('form').on('submit',function(e){
        e.preventDefault();
        if(validatePhone() === false){
            alert("Please correct Phone number");
            return;
        }
        var formData = new FormData( this );
        fetch("/",{
            method: 'post',
            body: formData
        }).then(function(response){
            response = response.text();
            return response;
        }).then(function(text){
            alert(text);
            $('form')[0].reset();
            clearCourses();
        });    
    });
    

}