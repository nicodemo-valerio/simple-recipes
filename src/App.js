import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

//const SERVER = 'http://localhost:5000/recipes/';
const SERVER = 'https://nameless-temple-74743.herokuapp.com/recipes/';

function RecipeForm({ addRecipe }) {

    const handleSubmit = e => {
        e.preventDefault();
        addRecipe({
            recipe: e.target.recipe.value,
            ingredients: e.target.ingredients.value.split(','),
            steps: e.target.steps.value.split(','),
            isInEdit: false
        });
        e.target.recipe.value = e.target.ingredients.value = e.target.steps.value = '';
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
                    placeholder="Separate with a comma..."
                    size="25" />
            </div>
            <div>
                <label htmlFor="steps">Steps</label>
                <input
                    type="text"
                    name="steps"
                    placeholder="Separate with a comma..."
                    size="25" />
            </div>
            <div>
                <input type="submit" value="Insert" />
            </div>
        </form>
    )
}

function Recipe({ recipe, index, updateRecipe, deleteRecipe }) {

    const handleSubmit = e => {
        e.preventDefault();
        updateRecipe({
            _id: recipe._id,
            recipe: e.target.recipe.value,
            ingredients: e.target.ingredients.value.split(','),
            steps: e.target.steps.value.split(','),
            isInEdit: false
        });
    };

    const onClickEdit = recipe => {
        const updatedRecipe = recipe;
        updatedRecipe.isInEdit = !recipe.isInEdit;
        updateRecipe(updatedRecipe);
    }

    const onChangeRecipe = e => {
        const updatedRecipe = recipe;
        updatedRecipe.recipe = e.target.value;
        updateRecipe(updatedRecipe);
    }

    const onChangeIngredients = e => {
        const updatedRecipe = recipe;
        updatedRecipe.ingredients = e.target.value.split(',');
        updateRecipe(updatedRecipe);
    }

    const onChangeSteps = e => {
        const updatedRecipe = recipe;
        updatedRecipe.steps = e.target.value.split(',');
        updateRecipe(updatedRecipe);
    }

    const recipeForm = () => {
        return <form key={index} onSubmit={handleSubmit} className="formAddRecipe">
            <div>
                <label htmlFor="recipe">Recipe</label>
                <input
                    type="text"
                    name="recipe"
                    value={recipe.recipe}
                    onChange={e => onChangeRecipe(e)} />
            </div>
            <div>
                <label htmlFor="ingredients">Ingredients</label>
                <input
                    type="text"
                    name="ingredients"
                    value={recipe.ingredients}
                    size="25"
                    onChange={e => onChangeIngredients(e)} />
            </div>
            <div>
                <label htmlFor="steps">Steps</label>
                <input
                    type="text"
                    name="steps"
                    value={recipe.steps}
                    size="25"
                    onChange={e => onChangeSteps(e)} />
            </div>
            <div>
                <input type="submit" value="Update" />
            </div>
        </form>
    }

    const recipeView = () => {
        return <div key={index} className="gridRecipe">
            <div>
                <h2>{recipe.recipe}</h2>
                <button onClick={() => onClickEdit(recipe)}>Edit</button>
                <button onClick={() => deleteRecipe(recipe)}>Delete</button>
            </div>
            <div>
                <h3>Ingredients</h3>
                <ul>
                    {recipe.ingredients.map((ingredient, index) =>
                        <li key={index}>{ingredient}</li>)}
                </ul>
            </div>
            <div>
                <h3>Steps</h3>
                <ol>
                    {recipe.steps.map((step, index) =>
                        <li key={index}>{step}</li>)}
                </ol>
            </div>
        </div>
    }

    const displayRecipes = () => {
        if (recipe.isInEdit) {
            return recipeForm();
        } else {
            return recipeView();
        }
    }

    return (
        displayRecipes()
    )
}

function App() {
    const [recipes, setRecipes] = useState([]);

    const sortByName = (recipeA, recipeB) => {
        const nameA = recipeA.recipe;
        const nameB = recipeB.recipe;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    // Fetch data once
    useEffect(() => {
        axios.get(SERVER)
            .then(res => {
                setRecipes(res.data.sort(sortByName));
            })
            .catch(err => console.log(err));

    }, 1);

    const addRecipe = (recipe) => {
        axios.post(SERVER, recipe)
            .then(res => {
                setRecipes([...recipes, res.data].sort(sortByName));
            })
            .catch(err => console.log(err));
    }

    const updateRecipe = recipe => {
        axios.put(`${SERVER}${recipe._id}`, recipe)
            .then(res => {
                const newRecipes = [...recipes].filter(element => recipe._id !== element._id);
                newRecipes.unshift(res.data);
                setRecipes(newRecipes.sort(sortByName));
            })
            .catch(err => console.log(err));
    }

    const deleteRecipe = recipe => {
        axios.delete(`${SERVER}${recipe._id}`)
            .then(res => {
                const newRecipes = [...recipes].filter(element => recipe._id !== element._id);
                setRecipes(newRecipes);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="container">
            <h1>{recipes.length} simple recipes</h1>
            <RecipeForm addRecipe={addRecipe} />
            <div className="grid">
                {recipes.map((recipe, index) => (
                    <Recipe
                        key={index}
                        index={index}
                        recipe={recipe}
                        addRecipe={addRecipe}
                        updateRecipe={updateRecipe}
                        deleteRecipe={deleteRecipe} />
                ))}
            </div>
        </div>
    );
}

export default App;
