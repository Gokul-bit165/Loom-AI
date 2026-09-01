import { TOKENS } from './tokens';
import { AlertCircle, Inbox, Loader2, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No Records Found',
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        padding: '36px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: TOKENS.colors.surface.cardAlt,
          border: `1px solid ${TOKENS.colors.surface.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: TOKENS.colors.text.muted,
        }}
      >
        <Inbox size={18} />
      </div>

      <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: TOKENS.colors.text.primary, margin: 0 }}>
        {title}
      </h4>

      <p style={{ fontSize: '12px', color: TOKENS.colors.text.secondary, maxWidth: '400px', margin: 0 }}>
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
          style={{ marginTop: '8px', fontSize: '11.5px', padding: '4px 12px' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Service Telemetry Error',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      style={{
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: TOKENS.radius.md,
        padding: '24px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <AlertCircle size={24} color="#DC2626" />

      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B', margin: 0 }}>
        {title}
      </h4>

      <p style={{ fontSize: '12px', color: '#B91C1C', maxWidth: '450px', margin: 0 }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary"
          style={{
            marginTop: '8px',
            borderColor: '#FCA5A5',
            color: '#991B1B',
            background: '#FFFFFF',
            fontSize: '11.5px',
            padding: '4px 12px',
          }}
        >
          <RefreshCw size={12} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading manufacturing telemetry...' }: LoadingStateProps) {
  return (
    <div
      style={{
        background: TOKENS.colors.surface.card,
        border: `1px solid ${TOKENS.colors.surface.border}`,
        borderRadius: TOKENS.radius.md,
        padding: '40px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}
    >
      <Loader2 size={24} color="#2563EB" className="animate-spin" />
      <span style={{ fontSize: '12.5px', color: TOKENS.colors.text.secondary, fontWeight: 500 }}>
        {message}
      </span>
    </div>
  );
}
