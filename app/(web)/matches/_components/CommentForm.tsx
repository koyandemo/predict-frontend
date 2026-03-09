"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { Skeleton } from "../../../../components/ui/skeleton"
import { EmojiPicker } from "../../../../components/EmojiPicker"

interface CommentFormProps {
  onSubmit: (content: string) => void
  isSubmitting?: boolean
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const [content, setContent] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    onSubmit(content.trim())
    setContent("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-300">
      <div className="flex gap-3">
        <Textarea
          placeholder="Share your prediction or thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-muted/50 border-border resize-none min-h-[80px] md:min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/50"
          maxLength={1000}
          ref={textareaRef}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EmojiPicker 
            onEmojiSelect={(emoji) => {
              const textarea = textareaRef.current;
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newText = content.substring(0, start) + emoji + content.substring(end);
                setContent(newText);
                
                setTimeout(() => {
                  textarea.selectionStart = start + emoji.length;
                  textarea.selectionEnd = start + emoji.length;
                  textarea.focus();
                }, 0);
              }
            }}
          />
          <span className={`text-xs transition-colors duration-200 ${content.length > 900 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {content.length}/1000 characters
          </span>
        </div>
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          size="sm"
          className="gap-1 md:gap-2 text-sm md:text-base transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
        >
                    {isSubmitting ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden xs:inline">Post Comment</span>
              <span className="xs:hidden">Post</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}