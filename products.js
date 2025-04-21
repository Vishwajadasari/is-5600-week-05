const fs = require('fs').promises;
const path = require('path');
const cuid = require('cuid');
const db = require('./db');

const productsFile = path.join(__dirname, 'data/full-products.json');

// Define our Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }], 
});

/**
 * List products
 * @param {*} options 
 * @returns 
 * @param {Object} query
 * @returns {Promise<Object[]>}
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, tag } = options;

  const data = await fs.readFile(productsFile)
  return JSON.parse(data)
  // Read the product data
  const products = JSON.parse(data)
    .filter(product => {
      // If no tag is provided, return the product
      if (!tag) {
        return product
        return product;
      }

      return product.tags.find(({ title }) => title == tag)
      // Filter products by tag
      return product.tags.find(({ title }) => title === tag);
    })
    .slice(offset, offset + limit) // Slice the products
    .slice(offset, offset + limit); // Slice the products

  // Use Mongoose to query the database if a tag is provided
  const query = tag ? {
    tags: {
      $elemMatch: {
        title: tag
      }
    }
  } : {};

  // Fetch from the database
  const dbProducts = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit);

  return dbProducts.length > 0 ? dbProducts : products;
}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function get(id) {
  const products = JSON.parse(await fs.readFile(productsFile))
async function get(_id) {
  const product = await Product.findById(_id);
  return product;
}

  // Loop through the products and return the product with the matching id
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i]
    }
  }
/**
 * Create a new product
 * @param {Object} fields
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const product = await new Product(fields).save();
  return product;
}

/**
 * Edit a product
 * @param {String} _id
 * @param {Object} change
 * @returns {Promise<Object>}
 */
async function edit(_id, change) {
  const product = await get(_id);

  // If no product is found, return null
  return null;
  if (!product) {
    return null;
  }

  // Update product fields
  Object.keys(change).forEach(function (key) {
    product[key] = change[key];
  });

  await product.save();
  return product;
}

/**
 * Delete a product
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function destroy(_id) {
  return await Product.deleteOne({ _id });
}

module.exports = {
  list,
  get
} 
  get,
  create,
  edit,
  destroy
};