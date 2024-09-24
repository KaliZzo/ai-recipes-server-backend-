const express = require("express");
const router = express.Router();
const { zodResponseFormat } = require("openai/helpers/zod");
const { z } = require("zod");
const path = require("path");
const OpenAI = require("openai");
const fs = require('fs')

const query = {
    "dietary": {
        "vegetarian": true,
        "vegan": true,
        "glutenFree": false,
        "dairyFree": false,
        "kosher": false
    },
    "cuisine": [
        "Italian",
        "Japanese"
    ],
    "course": [
        "Appetizer"
    ],
    "prepTime": {
        "min": 0,
        "max": 120
    },
    "calories": {
        "min": 0,
        "max": 1000
    },
    "ingredients": [
        "flour",
        "oil",
        "onion"
    ]
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const userPrompt = `provide maximum of 4 recipes that can be made only with the following instructions, You cannot use any ingredients that are not on this list:`;
const systemPrompt = `you are a chef that knows all the recipes in the world. and you are asked to provide a recipe that can be made with the following ingredients:`;

async function getRecipes(query) {
  try {
    const RecipeSchema = z.object({
      recipes: z.array(
        z.object({
          recipeName: z.string(),
          description: z.string().optional(),
          ingredients: z.array(
            z.object({
              ingredientId: z.string(),
              name: z.string(),
              quantity: z.string(),
              unit: z.string(),
            })
          ),
          instructions: z.array(
            z.object({
              stepNumber: z.number(),
              description: z.string(),
            })
          ),
          preparationTime: z.number(),
          cookingTime: z.number(),
          servings: z.number(),
          cuisineType: z.string(),
          difficultyLevel: z.string(),
          tags: z.array(z.string()).optional(),
          imageUrl: z.string().optional(),
        })
      )
    });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `${systemPrompt} ${query.ingredients}` },
        {
          role: "user",
          content: `${userPrompt} ${query}`,
        },
      ],
      response_format: zodResponseFormat(RecipeSchema, "myRecipes"),
    });

    const myRecipes = completion.choices[0].message.parsed;
    return myRecipes;
  } catch (err) {
    console.log(err);
  }
}

router.post("/", (req, res) => {
    const query = req.body;
    const generate = async () => {
        const result = await getRecipes(query);
        res.json(result).status(200);
    };
    generate();
});



router.get("/", (req, res) => {});
router.patch("/", (res, req) => {});
router.delete("/", (res, req) => {});

module.exports = router;
