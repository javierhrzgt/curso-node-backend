// services/categories.service.js
import { faker } from '@faker-js/faker';
import boom from '@hapi/boom';

class CategoriesService {
  constructor() {
    this.categories = [];
    this.generate();
  }

  async generate() {
    const limit = 20;
    for (let i = 0; i < limit; i++) {
      this.categories.push({
        id: faker.string.uuid(),
        name: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        image: faker.image.url(),
        slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
        isActive: faker.datatype.boolean(),
        order: i,
      });
    }
  }

  async create(data) {
    // Verificar que el slug sea único
    const existingCategory = this.categories.find(
      (cat) => cat.slug === data.slug,
    );
    if (existingCategory) {
      throw boom.conflict('Slug already exists.');
    }

    const newCategory = {
      id: faker.string.uuid(),
      ...data,
      isActive: data.isActive !== undefined ? data.isActive : true,
      order: this.categories.length,
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  async find() {
    return this.categories;
  }

  async findOne(id) {
    const category = this.categories.find((item) => item.id === id);
    if (!category) {
      throw boom.notFound('Category not found.');
    }
    if (!category.isActive) {
      throw boom.conflict('Category is inactive.');
    }
    return category;
  }

  async update(id, changes) {
    const index = this.categories.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('Category not found.');
    }

    // Verificar slug único si se actualiza
    if (changes.slug) {
      const existingCategory = this.categories.find(
        (cat) => cat.slug === changes.slug && cat.id !== id,
      );
      if (existingCategory) {
        throw boom.conflict('Slug already in use.');
      }
    }

    const category = this.categories[index];
    this.categories[index] = {
      ...category,
      ...changes,
    };
    return this.categories[index];
  }

  async delete(id) {
    const index = this.categories.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('Category not found.');
    }
    this.categories.splice(index, 1);
    return { id };
  }
}

export default CategoriesService;
