const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, { Recipe }) => {
      const allRecipes = await Recipe.find();
      return allRecipes;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }

      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: 'favourites',
        model: 'Recipe'
      });

      return user;
    },
    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    }
  },
  Mutation: {
    addRecipe: async (
      root,
      { name, category, description, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        category,
        description,
        instructions,
        username
      }).save();
      return newRecipe;
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
      return { token: createToken(user, process.env.SECRET, '1hr') };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({ username, email, password }).save();
      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    }
  }
};
