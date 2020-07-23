import axios from 'axios';

export default class Recipe{

    constructor(id)
    {
        this.id = id;
    }

    async  getRecipe(){
        const key = 'fd687833812548bf9d36830e22f223c3';
        try{
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeIngredients=true`);
        this.result = res;
        this.title = res.data.title;
        this.image = res.data.image;
        this.sourceUrl = res.data.sourceUrl;
        this.readyInMinutes=res.data.readyInMinutes;
        this.ingredients = res.data.extendedIngredients.map(function(cur)
        {
            return cur.name;
        });
        this.Amount = res.data.extendedIngredients.map(function(cur)
        {
            return cur.original;

        });
        }catch(error)
        {
            alert("Can't access to Recipe ...api");
        }

    };
    callServing()
    {
        this.servings =4;
    }

    parseIngredients()
    {
        const unitsLlong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];

        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];

        const newIngrdients = this.Amount.map(function(el)
        {
            let ingredient = el.toLowerCase();
            unitsLlong.forEach((unit,i)=>
            {
                ingredient = ingredient.replace(unit,unitsShort[i]);

            });
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            let objIng;
            const ingredientArr = ingredient.split(' ');
            let i;
            let units=[];

            for(i=0;i<ingredientArr.length;i++)
            {
                if(parseInt(ingredientArr[i],10))
                {
                    units.push(ingredientArr[i]);
                }
                else if(ingredientArr[i]==='to')
                {
                    continue;
                }
                else
                {

                    objIng ={
                        count : units,
                        countfloat : eval(units.join('+')),
                        unit : ingredientArr[i],
                        ingredient:ingredientArr.slice(i+1).join(' ')
                    }
                  
                    break;
                }
            }
            return objIng;
        });
        this.Amount = newIngrdients;

    }
    updateServing(type)
    {
        const newServing = type==='dec'?this.servings-1 : this.servings+1;
        this.Amount.forEach(ing=>
            {
                ing.countfloat *=(newServing/this.servings);
            });
            this.servings = newServing;
    }

}
