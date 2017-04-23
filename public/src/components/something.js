var datNtim = angular.module('myApp', ['moment-picker'])
  datNtim.config(['momentPickerProvider', function (momentPickerProvider) {
        momentPickerProvider.options({
            controller:     "myAppCtrl",
            leftArrow:     '&larr;',
            rightArrow:    '&rarr;',
            yearsFormat:   'YYYY',
            monthsFormat:  'MMM',
            daysFormat:    'D',
            hoursFormat:   'h A' ,
            minutesFormat: moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
            hoursStart:       11,
            hoursEnd:         21,
            minutesStep:      15
            
            
        });
    }]);
  datNtim.controller('myAppCtrl', ['$scope', 
  function ($scope) {
    var ctrl = this;
    
    
    ctrl.minDateMoment = moment();
    ctrl.maxDateMoment = moment().add(25, 'day');
  }]);



/* Google Map */
function myMap() {
  var myCenter = new google.maps.LatLng(38.656021, -90.304109);
  var mapProp = {center:myCenter, zoom:12, scrollwheel:false, draggable:false, mapTypeId:google.maps.MapTypeId.ROADMAP};
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  var marker = new google.maps.Marker({position:myCenter});
  var styles = [
    {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#ff0000"
            }
        ]
    }
]
  
marker.setMap(map,'styles',styles);
}
/* Menu Sorter */
function openMenu(evt, menuName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("menu");
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
     tablinks[i].className = tablinks[i].className.replace();
  }
  document.getElementById(menuName).style.display = "block";
 
}
document.getElementById("myLink").click();

$('.list-group-item tablink').on('click','> a', function(e) {
   var $this = $(this);
    $('.list-group-item').find('.active').removeClass('active');
    $this.addClass('active');
    
    
});
/* Smooth Scrolling */
$(document).ready(function(){
  
  $(".navbar a").on('click', function(event) {

    if (this.hash !== "") {
      
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
   
        window.location.hash = hash;
      });
    } // End if
  });
});

