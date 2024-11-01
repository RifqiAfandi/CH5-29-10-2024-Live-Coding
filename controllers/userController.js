const { Users } = require("../models");
const { Op, where } = require("sequelize");

const findUsers = async (req, res, next) => {
  try {
    const {
      userName,
      userAge,
      userAddress,
      userRole,
      page=1,
      limit=10
    } = req.query

    const offset = (page-1) * limit;

    const condition = {};
    if (userName) condition.name = {[Op.iLike]: `%${userName}%`};
    if (userAge) condition.userAge = {[Op.iLike]: `%${userAge}%`};
    if (userAddress) condition.userAddress = {[Op.iLike]: `%${userAddress}%`};
    if (userRole) condition.userRole = {[Op.iLike]: `%${userRole}%`};

    const users = await Users.findAndCountAll({
      where: condition,
      limit: limit,
      offset: offset,
    });

    totalData = users.count;
    totalPages = Math.ceil(totalData/limit);

    res.status(200).json({
      status: "Success",
      data: {
        totalData,
        totalPages,
        currentaPages: page,
        users,
      },
    });
  } catch (err) {}
};

const findUserById = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {}
};

const updateUser = async (req, res, next) => {
  const { name, age, role, address, shopId } = req.body;
  try {
    await Users.update(
      {
        name,
        age,
        role,
        address,
        shopId,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "Success",
      message: "sukses update user",
    });
  } catch (err) {}
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.params.id,
      },
    });

    await Users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "sukses delete user",
    });
  } catch (err) {}
};

module.exports = {
  findUsers,
  findUserById,
  updateUser,
  deleteUser,
};
