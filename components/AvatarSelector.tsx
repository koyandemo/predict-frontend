"use client";

import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { getSignedUrl, uploadFileToS3 } from "@/apiConfig/file.api";
import { updateUserProfile } from "@/apiConfig/user.api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { UserT } from "@/types/user.type";

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
}

export function AvatarSelector({
  currentAvatar,
  onAvatarChange,
}: AvatarSelectorProps) {
  const { data: session, update } = useSession();
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const saveAvatarToProfile = async (avatarUrl: string) => {
    const response = await updateUserProfile({ avatar_url: avatarUrl });
    if (response.success && response.data) {
      await update({
        ...session,
        user: {
          ...(session?.user as UserT),
          name: response.data.name || session?.user.name,
          avatar_url: response.data.avatar_url || session?.user.avatar_url,
          team_id: response.data.team_id || session?.user.team_id,
        },
      });
      onAvatarChange(response.data.avatar_url || avatarUrl);
    }
  };

  const handleUpload = async (file: File) => {
    const signedUrlResponse = await getSignedUrl(
      file.name,
      file.type,
      previewUrl && !previewUrl.startsWith("data:") ? previewUrl : undefined
    );

    if (!signedUrlResponse.success || !signedUrlResponse.data) {
      throw new Error(signedUrlResponse.message || "Failed to get upload URL");
    }
   
    const uploadResult = await uploadFileToS3(
      signedUrlResponse.data,
      file,
      (progress) => setUploadProgress(progress)
    );
    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(uploadResult.message || "Upload failed");
    }
    
    return uploadResult.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrl = await handleUpload(file);

      setPreviewUrl(uploadedUrl);
      onAvatarChange(uploadedUrl);

      await saveAvatarToProfile(uploadedUrl);
    } catch (err) {
      console.error("Upload error:", err);

      setError(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="cursor-pointer">
            <span className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </>
              )}
            </span>

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG or GIF (max 2MB)
          </p>

          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
