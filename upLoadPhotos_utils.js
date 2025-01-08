const uploadPhotos = async (files) => {
  try {
    // 檢查 files 是否存在
    if (!files || files.length === 0) {
      return [];
    }

    // 確保 files 是陣列
    const fileArray = Array.isArray(files) ? files : [files];

    const uploadPromises = fileArray.map(async (file) => {
      try {
        // 這裡是你的照片上傳邏輯
        // 例如上傳到 Firebase Storage 或其他服務
        const imageUrl = await uploadToStorage(file);
        return imageUrl;
      } catch (error) {
        console.error('Error uploading individual file:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null);
  } catch (error) {
    console.error('Error in uploadPhotos:', error);
    return [];
  }
};

// 假設這是你的實際上傳邏輯
const uploadToStorage = async (file) => {
  // 這裡實現你的具體上傳邏輯
  // 返回上傳後的 URL
  return "uploaded_url";
}

module.exports = {
  uploadPhotos
};