const User = require("../models/usersModel");

//依id取得使用者資料
const getProfile = async (req, res) => {
  const { id } = req.params.id;
  try {
    const userProfile = await User.findById({ _id: id });
    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ message: "Cannot get userProfile" });
  }
};

//更新使用者資料
const updateProfile = async (req, res) => {
  const { id } = req.params.id;

  try {
    if (!id) {
      res.status(400).json({ message: "Id is required" });
      return;
    }

    const userProfile = await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true }, //回傳已更新的結果
    );
    res.json(userProfile);
  } catch (err) {
    res.status(400).json({ message: "Cannot update this profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
