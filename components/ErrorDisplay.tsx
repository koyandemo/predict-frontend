
interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorDisplay({ 
  error, 
  onRetry = () => window.location.reload(), 
  retryText = "Retry",
  className = ""
}: ErrorDisplayProps) {
  return (
    <div className={`bg-destructive/20 border border-destructive/30 rounded-lg p-4 text-center ${className}`}>
      <p className="text-destructive">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm text-primary hover:underline"
      >
        {retryText}
      </button>
    </div>
  );
}