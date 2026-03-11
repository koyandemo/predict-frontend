function MatchResultFallbackView({ displayStatus }: { displayStatus: string }) {
  if (displayStatus === "postponed") {
    return (
      <p className="text-center text-sm text-orange-500">
        This match has been postponed. New date will be announced soon.
      </p>
    );
  }

  if (displayStatus === "scheduled") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Match scheduled
      </p>
    );
  }

  if (displayStatus === "kickOffSoon") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Match will be start soon.
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      Match information not available
    </p>
  );
}

export default MatchResultFallbackView;
