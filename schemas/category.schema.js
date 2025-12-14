// schemas/category.schema.js
import Joi from 'joi';

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(50).trim();
const description = Joi.string().max(200).trim();
const image = Joi.string().uri();
const slug = Joi.string()
  .lowercase()
  .trim()
  .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/); // formato: electronics, home-garden
const parentId = Joi.string().uuid().allow(null); // Para categorías anidadas
const isActive = Joi.boolean();
const order = Joi.number().integer().min(0); // Para ordenar categorías

const createCategorySchema = Joi.object({
  name: name.required(),
  description: description,
  image: image,
  slug: slug,
  parentId: parentId,
  isActive: isActive.default(true),
  order: order,
});

const updateCategorySchema = Joi.object({
  name: name,
  description: description,
  image: image,
  slug: slug,
  parentId: parentId,
  isActive: isActive,
  order: order,
}).min(1);

const getCategorySchema = Joi.object({
  id: id.required(),
});

export { createCategorySchema, updateCategorySchema, getCategorySchema };
