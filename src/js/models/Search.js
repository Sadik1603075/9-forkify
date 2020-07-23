import axios from 'axios';

export default class Search
{
    constructor(query)
    {
        this.query = query;
    }

async  getResults()
{
	const proxy = '';
	const key = 'fd687833812548bf9d36830e22f223c3';
	try{
		const res = await axios(`https://api.spoonacular.com/food/products/search?query=${this.query}&apiKey=${key}`);
	this.result = res.data.products;
	console.log(this.result);
	}catch(error)
	{
		alert(error);
	}
}
};