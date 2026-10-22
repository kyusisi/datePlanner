export function LoadingState() {
  return (
    <p role="status" className="loading-state">
      화면을 불러오는 중이에요…
    </p>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div role="alert" className="error-state">
      <p>{message}</p>
      {retry && (
        <button className="action" onClick={retry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
