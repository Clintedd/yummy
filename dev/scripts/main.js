const app = {};

let main = [];

app.mainSearchEvent = function () {
    $('#form-search-main').on('submit', function(e) {
        e.preventDefault();
        app.getMainInfo();
    })
    
}

const searchedAll = [];
app.getMainInfo = function () {
    const searchedWord = $('#form-search-main').children('input[type=search]').val();
    if (searchedWord) {
        const oneSearch = $('input[name=ingredient]').val();
        searchedAll.push(oneSearch);
        console.log(searchedAll);
    }
    
    app.getRecip(searchedAll);
}

app.getRecip = function (searchedAll, ingredientExcluded, allergySelected, dietSelected) {
    $.ajax({
        url: 'http://api.yummly.com/v1/api/recipes',
        dataType: 'json',
        data: {
            _app_id: '1d2af616',
            _app_key: 'ff279905f6336ced45e39d38f120592e',
            maxResult: 12,
            q: searchedAll,
            excludedIngredient: ingredientExcluded,
            allowedAllergy: allergySelected,
            allowedDiet: dietSelected
        }
    }).then((res) => {
        console.log(res);
        // const ajaxResult = res;
        // app.showResult(ajaxResult);
    })
}

// app.getRecipes = function (searchTerm, selectedAllergy, selectedDiet) {
//     $.ajax({
//       url: 'http://api.yummly.com/v1/api/recipes',
//       dataType: 'json',
//       data: {
//         _app_id: '0a0c3a8c',
//         _app_key: '3d2d8d9336ff2dd0a5bbd759f25b8a3c',
//         maxResult: 12,
//         q: searchTerm,
//         allowedAllergy: selectedAllergy,
//         allowedDiet: selectedDiet
//       }
//     }).then((res) => {
//       const apiResults = res;
//       app.displayRecipes(apiResults);
  
  
//     });
//   }




app.init = function () {
    app.mainSearchEvent();
    
}


$(function () {
    app.init();
});
