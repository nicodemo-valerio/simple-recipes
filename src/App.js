import React, { useState } from 'react';

function Recipe({ recipe, index }) {
    return (
        <div>{recipe.recipe}</div>
    )
}

function RecipeForm({ addRecipe }) {
    const [value, setValue] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        console.log(value);
        addRecipe(value);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
        </form>
    )
}

function App() {
    const [recipes, setRecipes] = useState([
        {
            recipe: 'Bread'
        },
        {
            recipe: 'Ramen'
        },
        {
            recipe: 'Cake'
        }
    ]);

    const addRecipe = (recipe) => {
        const newRecipes = [...recipes, { recipe }];
        setRecipes(newRecipes);
    }

    return (
        <div>
            <RecipeForm addRecipe={addRecipe} />
            {recipes.map((recipe, index) => (
                <Recipe key={index} index={index} recipe={recipe} />
            ))}
        </div>
    );
}

export default App;
