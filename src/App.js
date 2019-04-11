import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const SERVER = 'http://localhost:5000/recipes/';

function RecipeForm({ addRecipe }) {

    const handleSubmit = e => {
        e.preventDefault();
        addRecipe({
            recipe: e.target.recipe.value,
            ingredients: e.target.ingredients.value.split(','),
            steps: e.target.steps.value.split(',')
        });
    };

    return (
        <form onSubmit={handleSubmit} className="formAddRecipe">
            <div>
                <label htmlFor="recipe">Recipe</label>
                <input
                    type="text"
                    name="recipe"
                    placeholder="The recipe name..." />
            </div>
            <div>
                <label htmlFor="ingredients">Ingredients</label>
                <input
                    type="text"
                    name="ingredients"
                    size="25" />
            </div>
            <div>
                <label htmlFor="steps">Steps</label>
                <input
                    type="text"
                    name="steps"
                    size="25" />
            </div>
            <div>
                <input type="submit" value="Insert" />
            </div>
        </form>
    )
}

function Recipe({ recipe, index, updateRecipe }) {

    const editRecipe = (e, recipe) => {
        e.preventDefault();
        console.log(recipe);
        const updatedRecipe = recipe;
        updatedRecipe.isInEdit = !recipe.isInEdit;
        console.log(updatedRecipe);
        updateRecipe(index, updatedRecipe);
    }

    const display = () => {
        console.log(recipe);
        if (recipe.isInEdit) {
            return <div>{recipe.recipe}
                <button onClick={e => editRecipe(e, recipe)}>Edit</button>
            </div>
        } else {
            return <div key={index} className="gridRecipe">
                <div>
                    <h2>{recipe.recipe}</h2>
                    <button onClick={e => editRecipe(e, recipe)}>Edit</button>
                </div>
                <div>
                    <h3>Ingredients</h3>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                    </ul>
                </div>
                <div>
                    <h3>Steps</h3>
                    <ol>
                        {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                    </ol>
                </div>
            </div>
        }

    }
    return (
        display()
    )
}

function App() {
    const [recipes, setRecipes] = useState([]);

    // Fetch data once
    useEffect(() => {
        axios.get(SERVER)
            .then(res => {
                setRecipes(res.data)
            })
            .catch(err => console.log(err));

    }, 1);

    const addRecipe = (recipe) => {
        const newRecipes = [...recipes, recipe];
        setRecipes(newRecipes);
    }

    const updateRecipe = (index, recipe) => {
        const newRecipes = [...recipes];
        newRecipes.slice(index, 1);
        newRecipes.push(recipe);
        setRecipes(newRecipes);
    }

    return (
        <div className="container">
            <RecipeForm addRecipe={addRecipe} />
            <div className="grid">
                {recipes.map((recipe, index) => (
                    <Recipe
                        key={index}
                        index={index}
                        recipe={recipe}
                        updateRecipe={updateRecipe} />
                ))}
            </div>
        </div>
    );
}

export default App;
