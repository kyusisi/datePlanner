import { Component } from 'react';
import type { ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <main className="mx-auto max-w-lg p-8" role="alert">
          <h1>화면을 불러오지 못했어요</h1>
          <button className="action" onClick={() => window.location.reload()}>
            다시 불러오기
          </button>
        </main>
      );
    return this.props.children;
  }
}
