const app = {};
const searchedAll = [];
let dietSelected = 'none';
let maxTimeSelected = 'none';

// On form submit, call the getMainInfo function
app.mainSearchEvent = function() {
    $('#form-search-main').on('submit', function(e) {
        e.preventDefault();
        app.getMainInfo();
        app.searchedTitle(searchedAll);
        this.reset();
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
    // console.log(dietSelected);

    maxTimeSelected = $('.duration input[type=radio]').filter($('input:checked')).val();
    // console.log(maxTimeSelected);


    app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected);
}

app.searchedTitle = function(searchedAll) {
    // console.log(searchedAll);
    $('#recipes').empty();

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
        const recipTitle = $('<h4 class="recipe-title">').text(item.recipeName);
        const recipUniqueTitle = $(`<h6 class="recipe-unique">`).text(item.sourceDisplayName);

        const imageUrl = item.imageUrlsBySize['90'].split('=')[0];
        const recipImage = $(`<img class="recipe-img">`).attr('src', imageUrl);

        const ingredientsTitle = $('<p class="ingredients-title">').text('Ingredients');

        const ingredients = $('<ul class="ingredients-all">')
        const ingredient = item.ingredients.forEach(function(ingredient) {
            const eachLi = $('<li class="ingredients-each">').text(ingredient);
            ingredients.append(eachLi);
        })

        const duration = (item.totalTimeInSeconds / 60);
        const durationInMin = $('<h6 class="duration-each">').text(`Time: ${duration} minutes`);

        
        const eachRecip = $(`<div>`).addClass('recipe-item').append(recipTitle, recipUniqueTitle, recipImage, durationInMin, ingredientsTitle, ingredients);

        $('#recipes').append(eachRecip);
    })
}

app.checkboxToggle = function() {
    $('.allergies label').click(function() {
        $(this).toggleClass('active');
    })
}

app.dietsToggle = function(dietSelected) {
    $('.diets input[type=radio]').change(function () {
        $('.diets label').removeClass('active');    
        if (this.checked) {
            $(this).next().toggleClass('active');
            dietSelected = $(this).val()
            if (searchedAll.length === 0 && allergySelected.length === 0 && dietSelected === "none" && maxTimeSelected === "none") {
                $('#recipes').hide()
            }
        }
        

        app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected)
    })
}

app.durationToggle = function(maxTimeSelected) {
    $('.duration input[type=radio]').change(function () {
        $('.duration label').removeClass('active');    
        if (this.checked) {
            $(this).next().toggleClass('active');
            maxTimeSelected = $(this).val()
            if (searchedAll.length === 0 && allergySelected.length === 0 && dietSelected === "none" && maxTimeSelected === "none") {
                $('#recipes').hide()
            }
        }

        app.getRecip(searchedAll, allergySelected, dietSelected, maxTimeSelected)
    })
}



// init function
app.init = function () {
    app.mainSearchEvent();
    app.checkboxToggle();
    app.dietsToggle();
    app.durationToggle();
}


$(function () {
    app.init();
});
