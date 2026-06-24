import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: 600,
          margin: '80px auto',
          padding: '32px',
          textAlign: 'center',
          background: 'var(--card-bg)',
          borderRadius: 16,
          border: '1px solid var(--border)',
        }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
