const { models }= require('../libs/sequelize')

class User {

 async byEmail(email) {
  const rta = await models.User.findOne({
    where: { email }
  });
  return rta
  }
}

module.exports = User;
