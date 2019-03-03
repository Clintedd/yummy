'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = {};
var searchedAll = [];
var allergySelected = [];
var dietSelected = 'none';
var maxTimeSelected = 'none';
var storedResult = void 0;

// On form submit, call the getMainInfo function
app.mainSearchEvent = function () {
    $('#form-search-main').on('submit', function (e) {
        e.preventDefault();
        app.getMainInfo();
        app.searchedTitle(searchedAll);
        app.scrollToTopRecipe();
        app.headerHeightVH();
        app.widthHandlerSubmitted();
        $('#search').blur();
        this.reset();
        $('label').removeClass('active');
    });
};

app.scrollToTopRecipe = function () {
    $('html,body').animate({
        scrollTop: $(".recipe").offset().top
    }, 800);
};

app.scrollToTopHeader = function () {
    $('html,body').animate({
        scrollTop: $("header").offset().top
    }, 800);
};

app.headerHeightVH = function () {
    $('header').css('height', '100vh');
};

app.updateIngredients = function () {
    if (searchedAll.length > 0) {
        $('.searched-ingredient').text('Searched Ingredients:');
        for (var i = 0; i < searchedAll.length; i++) {
            $('.searched-ingredient').append('<span class="searched-each">' + searchedAll[i] + '</span>');
        }
    }
};

// When the function is called, use the value of searched input, checked allergies, checked diets, checked time to get recipe info from Yummly API
app.getMainInfo = function () {
    var searchedIngredient = $('input[type=search]').val();
    if (searchedIngredient) {
        console.log('hiiii');
        var oneSearch = $('input[name=ingredient]').val();
        $('.searched-ingredient').append('<span class="searched-each">' + oneSearch + '</span>');
        searchedAll.push(oneSearch);
    }

    var allergiesAll = [];
    var checkedAllergies = $('.allergies input[type=checkbox]').filter($('input:checked'));
    allergiesAll.push.apply(allergiesAll, _toConsumableArray(checkedAllergies));
    for (var i = 0; i < allergiesAll.length; i++) {
        allergySelected.push(allergiesAll[i].value);
    }

    dietSelected = $('.diets input[type=radio]').filter($('input:checked')).val();

    maxTimeSelected = $('.duration input[type=radio]').filter($('input:checked')).val();

    $('.searched-ingredient').css('display', 'flex');
    $('.recipe-wrapper').css('display', 'block');
    app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected);
    app.updateIngredients();
};

app.searchedTitle = function (searchedAll) {
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
        app.indIngredients(ajaxResult);
    });
};

// Display the data recieved and attach each recipes to the recipes section
app.showResult = function (ajaxResult) {
    var arrayOfRecip = ajaxResult.matches;

    arrayOfRecip.forEach(function (item) {
        var $recipeName = item.recipeName;
        var $recipeUnique = item.sourceDisplayName;
        var $imageUrl = item.imageUrlsBySize;
        var $itemId = item.id;
        var $totalSeconds = item.totalTimeInSeconds;

        //Generating dynamic html with JavaScript;
        var recipTitle = $('<h4 class="recipe-title">').text($recipeName);
        var recipUniqueTitle = $('<h6 class="recipe-unique">').text($recipeUnique);

        var imageUrl = $imageUrl['90'].split('=')[0];
        var recipImage = $('<img class="recipe-img">').attr('src', imageUrl);
        var recipAnchor = $('<a href="https://www.yummly.com/recipe/' + $itemId + '" target="_blank"></a>').append(recipImage);

        var ingredientsTitle = $('<p class="ingredients-title" target="_blank">').text('Ingredients');

        var duration = $totalSeconds / 60;
        var durationInMin = $('<h6 class="duration-each">').text('Time: ' + duration + ' minutes');

        var divIngDur = $('<div class="ing-dur">').append(durationInMin, ingredientsTitle);

        var eachRecip = $('<div>').addClass('recipe-item').append(recipTitle, recipUniqueTitle, recipAnchor, divIngDur);

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
        }
    });
};

app.durationToggle = function (maxTimeSelected) {
    $('.duration input[type=radio]').change(function () {
        $('.duration label').removeClass('active');
        if (this.checked) {
            $(this).next().toggleClass('active');
            maxTimeSelected = $(this).val();
            console.log('hi');
        }
    });
};

app.updateRecipe = function () {
    $(document).on('click', '.searched-each', function () {
        var $itemToRemove = this.innerHTML;
        $(this).remove();

        var filteredSearch = searchedAll.filter(function (item) {
            return $itemToRemove !== item;
        });

        searchedAll = filteredSearch;
        $('#recipes').empty();

        if (filteredSearch.length === 0) {
            $('#recipes').empty();
            $('.searched-ingredient').empty();
            $('.searched-ingredient').text('Please search an ingredient');
            app.scrollToTopHeader();
        } else {
            app.getRecip(filteredSearch, allergySelected, dietSelected, maxTimeSelected);
            app.scrollToTopRecipe();
        }
    });
};

app.widthHandler = function () {
    $(window).resize(function () {
        if ($(window).width() < 350) {
            $('header').css('height', 'auto');
        } else {
            $('header').css('height', '96vh');
        }
    });
};

app.widthHandlerSubmitted = function () {
    $(window).resize(function () {
        if ($(window).width() < 350) {
            $('header').css('height', 'auto');
        } else {
            app.headerHeightVH();
        }
    });
};

var clicked = false;

app.indIngredients = function (ajaxResult) {
    var arrayOfRecip = ajaxResult.matches;
    $(document).on('click', '.ingredients-title', function () {
        console.log(clicked);
        if (clicked === false) {
            var indexOf = $('.ingredients-title').index(this);
            var ingredientsAll = arrayOfRecip[indexOf].ingredients;
            var ingredientsUL = $('<ul class=ingredients-ul>');

            for (var i = 0; i < ingredientsAll.length; i++) {
                var ingredientsInd = $('<li class="ingredients-each">').text('' + ingredientsAll[i]);
                ingredientsUL.append(ingredientsInd);
            }

            $(this.parentElement).append(ingredientsUL);
            clicked = true;
        } else if (clicked === true) {
            $('.ingredients-ul').on('click', app.hideIngredients());
        }
    });
};

app.hideIngredients = function () {
    $('.ingredients-ul').css('display', 'none');
    clicked = false;
};

// init function
app.init = function () {
    app.mainSearchEvent();
    app.checkboxToggle();
    app.dietsToggle();
    app.durationToggle();
    app.widthHandler();
    app.updateRecipe();
};

$(document).ready(function () {
    app.init();
});