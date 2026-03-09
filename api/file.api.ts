import { AuthResponseT } from "@/types/auth.type";
import apiConfig from "./apiConfig";

export const getSignedUrl = async (
  fileName: string,
  fileType: string,
  updateUrl?: string
): Promise<AuthResponseT> => {
  try {
    const payload: any = {
      contentType: fileType,
      folder: "avatars",
    };

    if (updateUrl) payload.updateUrl = updateUrl;

    const res = await apiConfig.post(`files/presigned-url`, payload);
    return res.data;
  } catch (e: any) {
    return {
      success: false,
      message: "Failed to get upload URL",
      error: e.response?.data?.message || e.message,
    };
  }
};

export const uploadFileToS3 = async (
  presignedPostData: any, // Contains url and fields from the presigned post
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; url?: string; message?: string }> => {
  try {
    // Create FormData with presigned POST fields
    const formData = new FormData();
    
    // Add all fields from the presigned post
    Object.keys(presignedPostData.fields).forEach(key => {
      formData.append(key, presignedPostData.fields[key]);
    });
    
    // Add the actual file
    formData.append('file', file);
    
    // Upload file to S3 using the presigned URL
    const response = await fetch(presignedPostData.url, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      // Construct public URL using the key from fields
      // The public URL is typically https://bucket-name.s3.region.amazonaws.com/key
      const key = presignedPostData.fields.key;
      const s3Endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || 's3.amazonaws.com';
      const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'demo-img-upload-s3';
      const publicUrl = `https://${bucketName}.${s3Endpoint}/${key}`;
      return { success: true, url: publicUrl };
    } else {
      return { success: false, message: 'Failed to upload file to storage' };
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to upload file' };
  }
};