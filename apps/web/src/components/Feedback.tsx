export function LoadingState() {
  return (
    <p role="status" className="p-6 text-stone-500">
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
    <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-900">
      <p>{message}</p>
      {retry && (
        <button className="action" onClick={retry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
