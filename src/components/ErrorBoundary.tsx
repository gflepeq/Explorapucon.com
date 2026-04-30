import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: "" };

  static getDerivedStateFromError(err: Error) {
    return { hasError: true, error: err.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Error inesperado</h1>
            <p className="text-sm text-slate-600 mb-4">{this.state.error}</p>
            <details className="text-left bg-slate-100 rounded-lg p-4 text-xs text-slate-700 mb-6 overflow-auto max-h-40">
              <summary className="font-semibold cursor-pointer mb-2">Ver detalles técnicos</summary>
              <pre className="whitespace-pre-wrap">{this.state.error}</pre>
            </details>
            <button
              onClick={() => { this.setState({ hasError: false, error: "" }); window.location.reload(); }}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3"
            >
              🔄 Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
