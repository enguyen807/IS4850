var app = angular.module('BlueOceanRestaurant',[firebase])
//this is dependencies injection you have to do like this

//get the firebase URL and store it like this

var  BOR = firebase.database() 
//then store it in $scope variable i.e 

$scope.data=$firebaseArray(BOR)


$scope.EditBtn=function(da){
$scope.Name=da.name;
$scope.age=da.age;
$scope.id=da.$id;
//this is unique id which generated when you insert the data.
}