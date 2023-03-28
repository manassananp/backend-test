const Service = require("../services/user.service");

const methods = {
  async getUsers(req, res) {
    try {
      let result = await Service.getUsers(req, res);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async getUserById(req, res) {
    try {
      let result = await Service.getUserById(req.params.id, res);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
  async createUser(req, res) {
    try {
      let result = await Service.createUser(req, res);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async updateUser(req, res) {
    try {
      let result = await Service.updateUser(req.params.id, res);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async deleteUser(req, res) {
    try {
      let result = await Service.getUserById(req.params.id, res);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};
module.exports = { ...methods };
