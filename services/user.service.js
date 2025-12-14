// services/users.service.js
import { faker } from '@faker-js/faker';
import boom from '@hapi/boom';
import bcrypt from 'bcrypt';

class UsersService {
  constructor() {
    this.users = [];
    this.generate();
  }

  async generate() {
    const limit = 10; // Menos usuarios que productos
    for (let i = 0; i < limit; i++) {
      this.users.push({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        password: await bcrypt.hash('Password123', 10), // Hash de contraseña por defecto
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number(),
        role: faker.helpers.arrayElement(['customer', 'admin']),
        status: 'active',
        emailVerified: faker.datatype.boolean(),
        createdAt: faker.date.past(),
      });
    }
  }

  async create(data) {
    // Verificar si el email ya existe
    const existingUser = this.users.find((user) => user.email === data.email);
    if (existingUser) {
      throw boom.conflict('Email already registered.');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = {
      id: faker.string.uuid(),
      ...data,
      password: hashedPassword,
      role: 'customer', // Por defecto
      status: 'active',
      emailVerified: false,
      createdAt: new Date(),
    };

    this.users.push(newUser);

    // No retornar la contraseña
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async find() {
    // No retornar contraseñas
    return this.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id) {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw boom.notFound('User not found.');
    }
    if (user.status === 'suspended') {
      throw boom.forbidden('User is suspended.');
    }

    // No retornar la contraseña
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email) {
    const user = this.users.find((item) => item.email === email);
    if (!user) {
      throw boom.notFound('User not found.');
    }
    return user; // Retorna con password para login
  }

  async update(id, changes) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('User not found.');
    }

    // Si se actualiza la contraseña, hashearla
    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
    }

    // Si se actualiza el email, verificar que no exista
    if (changes.email) {
      const existingUser = this.users.find(
        (user) => user.email === changes.email && user.id !== id,
      );
      if (existingUser) {
        throw boom.conflict('Email already in use.');
      }
    }

    const user = this.users[index];
    this.users[index] = {
      ...user,
      ...changes,
    };

    // No retornar la contraseña
    const { password, ...userWithoutPassword } = this.users[index];
    return userWithoutPassword;
  }

  async delete(id) {
    const index = this.users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('User not found.');
    }
    this.users.splice(index, 1);
    return { id };
  }

  // Método específico para verificar contraseña (útil para login)
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default UsersService;
