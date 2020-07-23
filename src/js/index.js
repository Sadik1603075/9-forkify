import Search from './models/Search';
import {elements,renderLoader,clearLoader} from './views/base';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import Likes from './models/Likes'


/** Global State of the app
 * - Search object
 * - current recipe object
 * - shopping list object
 * -liked recipes.
 */

 const state = {};

 

 const controlList = ()=>
 {
	 if(!state.list)
	   state.list = new List();

	   state.recipe.Amount.forEach(el=>
		{
			const item =state.list.addItems(el.countfloat,el.unit,el.ingredient);
			listView.renderItems(item);
		});

 }

 //Handle Delete and update list Item Events

elements.shopping.addEventListener('click',e=>
{
	const id=e.target.closest('.shopping__item').dataset.itemid;
	

	if(e.target.matches('.shopping__delete,.shopping__delete *'))
	{
		state.list.deleteItems(id);
		listView.deleteItems(id);
	}
	else if(e.target.matches('.shopping__count-value'))
	{
		const value = parseFloat(e.target.value,10);
		state.list.updateCount(id,value);
	}

});

 const controlSearch = async()=>
 {
	 //get query from view

	 const query =searchView.getInput() ;
	 if(query)
	 {
		 // New Search object and add to it state
		 state.search = new Search(query);

		 //prepare UI for result
		 searchView.clearInput();
		 searchView.clearResults();
		 renderLoader(elements.searchRes);

		try{
		 //Search for recipes
		 await state.search.getResults();

		 //render results on ui
		 clearLoader();
		 searchView.renderResults(state.search.result);
		}
		catch(err)
		{
			alert('Something wrong with the search..');
			clearLoader();

		}
	 }
 };

 elements.searchFrom.addEventListener('submit',e =>
 {
	 e.preventDefault();
	 controlSearch();
 });
elements.searchResPages.addEventListener('click',function(e)
{
	const btn = e.target.closest('.btn-inline');

	if(btn)
	{
		const goToPage = parseInt(btn.dataset.goto,10);
		searchView.clearResults();
		searchView.renderResults(state.search.result,goToPage);
	}

});


// CONTROL RECIPE
const controlRecipe=async ()=>
{
	const id = window.location.hash.replace('#','');

	renderLoader(elements.recipe);
	recipeView.clearRecipe();

	if(state.search)
	   searchView.highlightSelected(id);
	
    if(id){
	try{
	//create a new repice object
	state.recipe = new Recipe(id);

	//get recipe data
	await state.recipe.getRecipe();
	state.recipe.parseIngredients();

	
	state.recipe.callServing();
	clearLoader();
	recipeView.renderRecipe(
		state.recipe,
		state.likes.isLiked(id)
		);

	}catch(e){
		alert('Error in processing recipe .')

	}
}
};

//Control LIKE

const controlLike=()=>
{
	if(!state.likes) state.likes =new Likes();
	const currentID = state.recipe.id;

	if(!state.likes.isLiked(currentID))
	{
		// User has not liked the current recipe
		// Add like to state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			"Barik 75 Sadik", // Because in our food api there is no author for any recipe.
			state.recipe.image	
			);

		// toggole the Like button
		likesView.toggleLikeBtn(true);

		//Add like to UI list 
		likesView.renderLike(newLike);

	}
	else
	{

		// User HAs liked the current recipe
		// remove like to state
		state.likes.deleteLike(currentID);

		// toggole the Like button
		likesView.toggleLikeBtn(false);

		//remove like to UI list
		likesView.deleteLike(currentID);
	}
likesView.toggleLikeMenu(state.likes.getNumLike());
};

window.addEventListener('load',()=>
{
	state.likes =new Likes();

	//reStoreLike
	state.likes.readStorage();

	//toggle the like menu button
	likesView.toggleLikeMenu(state.likes.getNumLike());
	
	//renderlikes
	state.likes.likes.forEach(like=>
		{
			likesView.renderLike(like);
		});

});

//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);
['hashchange','load'].forEach(e=>window.addEventListener(e,controlRecipe));

elements.recipe.addEventListener('click',e=>
{
		if(e.target.matches('.btn-decrease,.btn-decrease *'))
		{
			if(state.recipe.servings>1)
			  {
				  state.recipe.updateServing('dec');
				  recipeView.updateServingsIngredients(state.recipe);
			  }
			  
		}
		else if(e.target.matches('.btn-increase,.btn-increase *'))
		{
			state.recipe.updateServing('inc');
			recipeView.updateServingsIngredients(state.recipe);
		}
		else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *'))
		{
			controlList();
		}
		else if(e.target.matches('.recipe__love,.recipe__love *'))
		{
			controlLike();
		}
});
//testing
window.l = new List();