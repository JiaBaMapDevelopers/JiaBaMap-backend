const User = require("../models/usersModel");
const { Storage } = require("@google-cloud/storage");

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
  const id = req.params.id;

  try {
    if (!id) {
      res.status(400).json({ message: "Id is required" });
      return;
    }

    let url = undefined;
    if (req.file) {
      //TODO upload photo to GCS
      const storage = new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID,
      });
      const bucketName = process.env.BUCKET_NAME;
      const fileName = encodeURIComponent(req.file.originalname);
      const objectName = `user/${id}/${fileName}`;
      await storage.bucket(bucketName).file(objectName).save(req.file.buffer);
      url = `${process.env.GOOGLE_CLOUD_STORAGE_BASE_URL}${bucketName}/${objectName}`;
    }

    const userProfile = await User.findByIdAndUpdate(
      id,
      {
        ...req.body,
        profilePicture: url,
        updatedAt: new Date(),
      },
      { new: true }, //回傳已更新的結果
    );
    res.json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Cannot update this profile" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};