const app = {};
const searchedAll = [];
let dietSelected = 'none';
let maxTimeSelected = 'none';

// On form submit, call the getMainInfo function
app.mainSearchEvent = function() {
    $('#form-search-main').on('submit', function(e) {
        e.preventDefault();
        app.getMainInfo();
    })
}

// When the function is called, use the value of searched input, checked allergies, checked diets, checked time to get recipe info from Yummly API
app.getMainInfo = function () {
    const searchedIngredient = $('#form-search-main').children('input[type=search]').val();
    if (searchedIngredient) {
        const oneSearch = $('input[name=ingredient]').val();
        $('ul').append(`<li>${oneSearch}</li>`);
        searchedAll.push(oneSearch);
    }

    const allergiesAll = [];
    const checkedAllergies = $('.allergies input[type=checkbox]').filter($('input:checked'));
    allergiesAll.push(...checkedAllergies);
    const allergySelected = [];
    for (var i = 0; i < allergiesAll.length; i++) {
        allergySelected.push(allergiesAll[i].value);
    }


    dietSelected = $('.diets input[type=radio]').filter($('input:checked')).val();
    console.log(dietSelected);

    maxTimeSelected = $('.duration input[type=radio]').filter($('input:checked')).val();
    console.log(maxTimeSelected);


    app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected);
}

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
    }).then((res) => {
        console.log(res);
        const ajaxResult = res;
        app.showResult(ajaxResult);
    })
}

// Display the data recieved and attach each recipes to the recipes section
app.showResult = function(ajaxResult) {
    const arrayOfRecip = ajaxResult.matches;
    console.log(arrayOfRecip);
    arrayOfRecip.forEach(function (item){
        const recipTitle = $('<h3 class="recipe-title">').text(item.recipeName);
        const recipUniqueTitle = $(`<h4 class="recipe-unique">`).text(item.sourceDisplayName);

        const imageUrl = item.imageUrlsBySize['90'].split('=')[0];
        const recipImage = $(`<img class="recipe-img">`).attr('src', imageUrl);

        
        const eachRecip = $(`<div>`).addClass('recipe-item').append(recipTitle, recipUniqueTitle, recipImage);

        $('#recipes').append(eachRecip);
    })
}



// init function
app.init = function () {
    app.mainSearchEvent();
}


$(function () {
    app.init();
});
