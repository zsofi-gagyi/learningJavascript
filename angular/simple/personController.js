angular.module('firstApp', [])
    .controller('personController', function () {
        var person = this;
        person.name = "";

        person.getName = function () {
            return person.name.toUpperCase();
        };

        person.calculateBMI = function () {
            let weight = parseInt(person.weight);
            let height = parseInt(person.height) / 100;

            let maybeBMI = weight / (height * height);

            return maybeBMI ? "Your BMI is " + maybeBMI
                : "To calculate your BMI, please give your height and weight";
        };
    });