const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: { type: String, required: true },
    description: { type: String },
    ingredients: [
      {
        ingredientId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: String, required: true },
        unit: { type: String, required: true },
      },
    ],
    instructions: [
      {
        stepNumber: { type: Number, required: true },
        description: { type: String, required: true },
      },
    ],
    preparationTime: { type: Number, required: true },
    cookingTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    cuisineType: { type: String, required: true },
    difficultyLevel: { type: String, required: true },
    tags: { type: [String] },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const CollectionSchema = new Schema(
  {
    collectionName: { type: String, required: true },
    recipesInside: [RecipeSchema],
  },
  { timestamps: true }
);

const FavoriteSchema = new Schema(
  {
    favoriteRecipes: [RecipeSchema],
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [FavoriteSchema],
    collections: [CollectionSchema],
  },
  {
    timestamps: true,
  }
);

RecipeSchema.virtual("filter").get(function () {
  return {
    recipeName: this.recipeName,
    description: this.description,
    ingredients: this.ingredients,
    instructions: this.instructions,
    preparationTime: this.preparationTime,
    cookingTime: this.cookingTime,
    servings: this.servings,
    cuisineType: this.cuisineType,
    difficultyLevel: this.difficultyLevel,
    tags: this.tags,
    imageUrl: this.imageUrl,
  };
});

const User = mongoose.model("User", UserSchema);
const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = {
  User,
  Recipe,
};
