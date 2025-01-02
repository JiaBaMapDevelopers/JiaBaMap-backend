const User = require("../models/usersModel");

//依id取得使用者資料
const getProfile = async (req, res) => {
  const { id } = req.params;
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

const addFavorites = async (req, res) => {
  const { id } = req.params;
  const { placeId } = req.body;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  if (!user.favorites.includes(placeId)) {
    user.favorites.push(placeId); 
    await user.save(); 
  }
  res.status(200).json({ message: 'Restaurant added to favorites', favorites: user.favorites });
};

const delFavorites = async (req, res) => {
  const { id } = req.params;
  const { placeId } = req.body;

  
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.favorites = user.favorites.filter((id) => id != placeId);
  await user.save();
  res.status(200).json({ message: 'Restaurant removed from favorites', favorites: user.favorites });
  
}

module.exports = {
  getProfile,
  updateProfile,
  addFavorites,
  delFavorites,
};
