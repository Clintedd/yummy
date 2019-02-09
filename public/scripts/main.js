'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = {};
var searchedAll = [];
var dietSelected = 'none';
var maxTimeSelected = 'none';
var ingredientsTitle =

// On form submit, call the getMainInfo function
app.mainSearchEvent = function () {
    $('#form-search-main').on('submit', function (e) {
        e.preventDefault();
        app.getMainInfo();
        app.searchedTitle(searchedAll);
        $('header').css('height', '100vh');
        $('.searched-ingredient').css('display', 'flex');
        app.scrollToTop();
        this.reset();
    });
};

app.scrollToTop = function () {
    $('html,body').animate({
        scrollTop: $(".recipe").offset().top
    }, 1000);
};

// When the function is called, use the value of searched input, checked allergies, checked diets, checked time to get recipe info from Yummly API
app.getMainInfo = function () {
    var searchedIngredient = $('#form-search-main').children('input[type=search]').val();
    if (searchedIngredient) {
        var oneSearch = $('input[name=ingredient]').val();
        $('.searched-ingredient').append('<li>' + oneSearch + '</li>');
        searchedAll.push(oneSearch);
    }

    var allergiesAll = [];
    var checkedAllergies = $('.allergies input[type=checkbox]').filter($('input:checked'));
    allergiesAll.push.apply(allergiesAll, _toConsumableArray(checkedAllergies));
    var allergySelected = [];
    for (var i = 0; i < allergiesAll.length; i++) {
        allergySelected.push(allergiesAll[i].value);
    }

    dietSelected = $('.diets input[type=radio]').filter($('input:checked')).val();
    // console.log(dietSelected);

    maxTimeSelected = $('.duration input[type=radio]').filter($('input:checked')).val();
    // console.log(maxTimeSelected);


    app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected);
};

app.searchedTitle = function (searchedAll) {
    // console.log(searchedAll);
    $('#recipes').empty();
};

// Get data from Yummly API with all the info inputed
app.getRecip = function (searchedAll, allergySelected, dietSelected, maxTimeSelected) {
    $.ajax({
        url: 'http://api.yummly.com/v1/api/recipes',
        dataType: 'json',
        data: {
            _app_id: '1d2af616',
            _app_key: 'ff279905f6336ced45e39d38f120592e',
            maxResult: 12,
            q: searchedAll,
            allowedAllergy: allergySelected,
            maxTotalTimeInSeconds: maxTimeSelected,
            allowedDiet: dietSelected
        }
    }).then(function (res) {
        console.log(res);
        var ajaxResult = res;
        app.showResult(ajaxResult);
    });
};

var eachRecip = void 0;

// Display the data recieved and attach each recipes to the recipes section
app.showResult = function (ajaxResult) {
    var arrayOfRecip = ajaxResult.matches;
    console.log(arrayOfRecip);

    arrayOfRecip.forEach(function (item) {
        var recipTitle = $('<h4 class="recipe-title">').text(item.recipeName);
        var recipUniqueTitle = $('<h6 class="recipe-unique">').text(item.sourceDisplayName);

        var imageUrl = item.imageUrlsBySize['90'].split('=')[0];
        var recipImage = $('<img class="recipe-img">').attr('src', imageUrl);
        var recipAnchor = $('<a href="https://www.yummly.com/recipe/' + item.id + '" target="_blank"></a>').append(recipImage);

        var ingredientsTitle = $('<a href="https://www.yummly.com/recipe/' + item.id + '" class="ingredients-title" target="_blank">').text('Ingredients');

        // const ingredients = $('<ul class="ingredients-all">')
        // const ingredient = item.ingredients.forEach(function(ingredient) {
        //     const eachLi = $('<li class="ingredients-each">').text(ingredient);
        //     ingredients.append(eachLi);
        // })

        var duration = item.totalTimeInSeconds / 60;
        var durationInMin = $('<h6 class="duration-each">').text('Time: ' + duration + ' minutes');

        // $('.ingredients-title').on('click', function() {
        //     const indexOf = $('.ingredients-title').index(this);
        //     const ingredientsAll = arrayOfRecip[indexOf].ingredients;
        //     console.log(ingredientsAll);
        // })

        var eachRecip = $('<div>').addClass('recipe-item').append(recipTitle, recipUniqueTitle, recipAnchor, durationInMin, ingredientsTitle);

        $('#recipes').append(eachRecip);
    });
};

app.checkboxToggle = function () {
    $('.allergies label').click(function () {
        $(this).toggleClass('active');
    });
};

app.dietsToggle = function (dietSelected) {
    $('.diets input[type=radio]').change(function () {
        $('.diets label').removeClass('active');
        if (this.checked) {
            $(this).next().toggleClass('active');
            dietSelected = $(this).val();
            if (searchedAll.length === 0 && allergySelected.length === 0 && dietSelected === "none" && maxTimeSelected === "none") {
                $('#recipes').hide();
            }
        }

        app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected);
    });
};

app.durationToggle = function (maxTimeSelected) {
    $('.duration input[type=radio]').change(function () {
        $('.duration label').removeClass('active');
        if (this.checked) {
            $(this).next().toggleClass('active');
            maxTimeSelected = $(this).val();
            if (searchedAll.length === 0 && allergySelected.length === 0 && dietSelected === "none" && maxTimeSelected === "none") {
                $('#recipes').hide();
            }
        }

        app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected);
    });
};

app.widthHandler = function () {
    $(window).resize(function () {
        if ($(window).width() < 350) {
            console.log($(window).width());
            app.smallWidth();
        }
    });
};

app.smallWidth = function () {
    $('header').css('height', 'auto');
    $('footer').css('height', 'auto');
};

// init function
app.init = function () {
    app.mainSearchEvent();
    app.checkboxToggle();
    app.dietsToggle();
    app.durationToggle();
    app.widthHandler();
};

$(function () {
    app.init();
});