import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="relative z-20 mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a3412]">ClubConnect</p>
        <h1 className="mt-3 font-display text-3xl text-[#1e3a5f]">This screen could not load</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Refresh the page with Ctrl+Shift+R. If it stays blank, sign out of the demo and open the home page again.
        </p>
        <button
          type="button"
          className="sun-cta mt-8 rounded-full px-8 py-3 text-sm font-semibold text-white"
          onClick={() => window.location.reload()}
        >
          Reload ClubConnect
        </button>
      </div>
    );
  }
}
