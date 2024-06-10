import cloudinary from "cloudinary";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { Image } from "../models/images.model.js";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imagePath) {
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    throw error;
  }
}

async function uploadImagesFromDirectory(directory) {
  try {
    const files = await fs.readdir(directory);
    const uploadedImages = [];

    for (const file of files) {
      const imagePath = path.join(directory, file);
      try {
        const existingImage = await Image.findOne({ localPath: imagePath });

        if (existingImage) {
          // Image already exists in database, skip uploading
          uploadedImages.push(existingImage.cloudinaryUrl);
          console.log(
            `Image already exists in database. Using Cloudinary URL: ${existingImage.cloudinaryUrl}`
          );
        } else {
          // Image doesn't exist in database, upload to Cloudinary
          const cloudinaryUrl = await uploadImage(imagePath);

          const newImage = new Image({
            localPath: imagePath,
            cloudinaryUrl: cloudinaryUrl,
          });

          await newImage.save();
          uploadedImages.push(cloudinaryUrl);
          console.log(`Uploaded and saved image: ${imagePath}`);
        }
      } catch (error) {
        console.error(`Error processing image ${file}:`, error);
      }
    }

    console.log("All processed images:", uploadedImages.length);
    return uploadedImages;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

async function getAllPublicIds() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 1000,
    });
    const publicIds = result.resources.map((resource) => resource.public_id);
    return publicIds;
  } catch (error) {
    console.error("Error fetching public IDs:", error);
    throw error;
  }
}

export { uploadImage, uploadImagesFromDirectory, getAllPublicIds };
