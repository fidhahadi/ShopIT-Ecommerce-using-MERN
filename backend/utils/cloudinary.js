
const cloudinary = require('cloudinary')
const dotenv = require('dotenv');

dotenv.config({ path: 'backend/config/config.env' })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

//upload an avatar
exports.upload_file = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file,
            (result) => {
                resolve({
                    public_id: result.public_id,
                    url: result.url,
                });
            },
            {
                resource_type: "auto",
                folder,
            }
        );
    });
};



exports.delete_file = async (file) => {
    const res = await cloudinary.uploader.destroy(file);

    if (res?.resullt === "ok") return true;
};