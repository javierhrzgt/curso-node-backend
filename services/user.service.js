const boom = require('@hapi/boom');
const { pool } = require('../libs/postgres');

class UserService {
  constructor() {}

  async create(data) {
    return data;
  }

  async find() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM tasks');
      return result.rows;
    } catch (error) {
      console.error('Error en query', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async findOne(id) {
    return { id };
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
}

module.exports = UserService;
