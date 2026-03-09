"use client"

import React from "react"
import type { UserT } from "@/types/user.type"
import { getBackgroundColor, getUserInitials } from "@/lib/avatarUtils"

type AvatarSize = "sm" | "md" | "lg"

interface UserAvatarProps {
  user: UserT
  size?: AvatarSize
  className?: string
  refreshTrigger?: number
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
}

export default function UserAvatar({
  user,
  size = "md",
  className = "",
  refreshTrigger,
}: UserAvatarProps) {
  if (user.type !== "seed" && user.avatar_url) {
    return (
      <AvatarWrapper size={size} className={className}>
        <img
          src={user.avatar_url}
          alt={user.name ?? "User"}
          className="w-full h-full object-cover"
          key={`${user.avatar_url}-${refreshTrigger || 0}`} // Add key to force re-render when avatar URL changes or refresh is triggered
        />
      </AvatarWrapper>
    )
  }

  if (user.type === "seed") {
    return (
      <AvatarWrapper
        size={size}
        className={className}
        style={{ backgroundColor: getBackgroundColor(user) }}
      >
        {getUserInitials(user)}
      </AvatarWrapper>
    )
  }

  return null
}

function AvatarWrapper({
  size,
  className,
  style,
  children,
}: {
  size: AvatarSize
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-medium overflow-hidden ${SIZE_CLASSES[size]} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  )
}
