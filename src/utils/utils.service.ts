import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'



@Injectable()
export class UtilsService {

// Get the Cloudinary credentials
    saveImage = async (img_path: string) => {
        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
        })

        //Get file from request
        const sourceFile = img_path

        // Get the secure URL of the uploaded file
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(sourceFile, { resource_type: 'auto' })

        const secureUrl = response.secure_url

        return secureUrl
    }

}
