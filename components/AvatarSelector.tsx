"use client"

import { useState } from "react"
import { Camera, Upload} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { getSignedUrl, uploadFileToS3 } from "@/api/file.api"
import { updateUserProfile } from "@/api/user.api"


interface AvatarSelectorProps {
  currentAvatar?: string
  onAvatarChange: (avatarUrl: string) => void
  onAvatarUpdateSuccess?: () => void // Called when avatar update is successful
}

export function AvatarSelector({ currentAvatar, onAvatarChange, onAvatarUpdateSuccess }: AvatarSelectorProps) {
  const { token, setUser } = useAuth()
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)
      
      try {
        // Get signed URL from server
        const signedUrlResponse = await getSignedUrl(
          file.name,
          file.type,
          previewUrl && !previewUrl.startsWith('data:') ? previewUrl : undefined
        );
        
        if (signedUrlResponse.success && signedUrlResponse.data) {
          // Upload file to S3 using the presigned POST form
          const uploadResult = await uploadFileToS3(
            signedUrlResponse.data,
            file,
            (progress) => setUploadProgress(progress)
          );
          if (uploadResult.success && uploadResult.url) {
            setPreviewUrl(uploadResult.url)
            onAvatarChange(uploadResult.url)
            
            // Automatically save the avatar URL to the database
            try {
              const response = await updateUserProfile({ avatar_url: uploadResult.url });
              if (response.success && response.user) {
                // Update the auth context with the new user data
                setUser(response.user);
                
                // Update localStorage with the new user data
                localStorage.setItem("user", JSON.stringify(response.user));
                
                // Call the success callback if provided
                if (onAvatarUpdateSuccess) {
                  onAvatarUpdateSuccess();
                }
                
                // As a fallback, force a refresh to ensure image updates
                setTimeout(() => {
                  window.location.reload();
                }, 1000); // Small delay to ensure state updates first
              } 
            } catch (error) {
              console.error('Error updating avatar in database:', error);
            }
            
            // Always call onAvatarChange to update the UI
            onAvatarChange(uploadResult.url);
          } else {
            throw new Error(uploadResult.message || 'Failed to upload file');
          }
        } else {
          throw new Error(signedUrlResponse.message || 'Failed to get upload URL');
        }
      } catch (error) {
        console.error("Error uploading file:", error)
        // Fallback to local preview if upload fails
        const reader = new FileReader()
        reader.onload = async (e) => {
          const result = e.target?.result as string
          setPreviewUrl(result)
          onAvatarChange(result)
          
          // Also try to save the avatar URL to the database with the local preview
          try {
            const response = await updateUserProfile({ avatar_url: result });
            if (response.success && response.user) {
              // Update the auth context with the new user data
              setUser(response.user);
              
              // Update localStorage with the new user data
              localStorage.setItem("user", JSON.stringify(response.user));
            
              if (onAvatarUpdateSuccess) {
                onAvatarUpdateSuccess();
              }
              
              // As a fallback, force a refresh to ensure image updates
              setTimeout(() => {
                window.location.reload();
              }, 1000); // Small delay to ensure state updates first
            } else {
              console.log('Fallback avatar update not successful or no user returned:', response);
            }
          } catch (saveError) {
            console.error('Error updating avatar in database:', saveError);
          }
          
          // Always call onAvatarChange to update the UI
          onAvatarChange(result);
        }
        reader.readAsDataURL(file)
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
  }

  // Default avatar options
  const defaultAvatars = [
    "/football-fan-avatar-1.jpg",
    "/football-fan-avatar-2.jpg",
    "/football-fan-avatar-3.jpg",
  ]

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  key={previewUrl} // Add key to force re-render when preview URL changes
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
          </div>
          <div className="relative">
            <label className="cursor-pointer">
              <span className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1 md:gap-2">
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
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}