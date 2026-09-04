import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { TOKENS } from '../design-system';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Loom AI UI Boundary Caught Error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            background: '#FFFFFF',
            border: `1px solid ${TOKENS.colors.surface.borderStrong}`,
            borderRadius: TOKENS.radius.md,
            boxShadow: TOKENS.shadows.card,
            margin: '20px auto',
            maxWidth: '600px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <AlertTriangle size={24} color="#DC2626" />
          </div>

          <h3
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#991B1B',
              margin: '0 0 8px 0',
            }}
          >
            {this.props.fallbackTitle || 'Component Encountered a Render Issue'}
          </h3>

          <p
            style={{
              fontSize: '13px',
              color: TOKENS.colors.text.secondary,
              margin: '0 0 16px 0',
              lineHeight: 1.5,
              maxWidth: '460px',
            }}
          >
            {this.state.error?.message || 'An unexpected rendering error occurred while computing industrial metrics.'}
          </p>

          <button
            onClick={this.handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              background: TOKENS.colors.brand[700],
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <RefreshCw size={13} /> Try Re-rendering View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
