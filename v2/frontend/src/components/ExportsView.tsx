import React, { useEffect, useState } from 'react';
import { fetchWhatsAppSummary } from '../api';
import { PageHeader, FilterBar, TOKENS } from '../design-system';
import { FileText, MessageSquare, Download, Printer, Copy, Check } from 'lucide-react';

export const ExportsView: React.FC = () => {
  const [date] = useState('2026-07-31');
  const [unit, setUnit] = useState('ATM');
  const [whatsappText, setWhatsappText] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWhatsApp();
  }, [date, unit]);

  async function loadWhatsApp() {
    setLoading(true);
    try {
      const res = await fetchWhatsAppSummary(unit, date);
      setWhatsappText(res.text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.spacing[4], paddingBottom: TOKENS.spacing[6] }}>
      <PageHeader
        title="Reports & Executive Exports Dispatch"
        subtitle="Formatted daily report generator, executive WhatsApp broadcast messages, and operations Excel exports."
        unit="ATM Main Shed"
        date="31-Jul-2026"
      />

      <FilterBar
        filters={[
          {
            id: 'unit',
            label: 'Operating Unit',
            value: unit,
            options: [{ label: 'Ashok Textile Mills (ATM)', value: 'ATM' }],
            onChange: setUnit,
          },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: TOKENS.spacing[4] }}>
        {/* WhatsApp 6-Line Summary */}
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '16px 18px',
            boxShadow: TOKENS.shadows.card,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#059669" />
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                  Executive WhatsApp Dispatch
                </h4>
              </div>
              <button className="btn-secondary" onClick={handleCopyWhatsApp} style={{ fontSize: '11.5px', padding: '3px 8px' }}>
                {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <p style={{ fontSize: '12px', color: TOKENS.colors.text.muted, margin: '0 0 12px 0' }}>
              6-line plain text format (no markdown characters). Verified for mobile executive messaging.
            </p>

            <pre
              style={{
                backgroundColor: TOKENS.colors.surface.cardAlt,
                border: `1px solid ${TOKENS.colors.surface.border}`,
                borderRadius: TOKENS.radius.sm,
                padding: '12px 14px',
                fontFamily: TOKENS.typography.fontMono,
                fontSize: '12px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                color: TOKENS.colors.text.primary,
              }}
            >
              {loading ? 'Generating summary...' : whatsappText}
            </pre>
          </div>
        </div>

        {/* Printable HTML Daily Report & Excel Export */}
        <div
          style={{
            background: TOKENS.colors.surface.card,
            border: `1px solid ${TOKENS.colors.surface.border}`,
            borderRadius: TOKENS.radius.md,
            padding: '16px 18px',
            boxShadow: TOKENS.shadows.card,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileText size={16} color="#2563EB" />
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0, color: TOKENS.colors.text.primary }}>
                Daily Weaving Report & Raw Data Exports
              </h4>
            </div>
            <p style={{ fontSize: '12px', color: TOKENS.colors.text.muted, margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Generates standalone HTML report with embedded print CSS matching ATM mill layout. Opens in browser for 1-click PDF printing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href={`/api/v2/exports/daily-report-html?unit=${unit}&date=${date}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ justifyContent: 'center', textDecoration: 'none', padding: '8px' }}
            >
              <Printer size={14} />
              <span>Open Print-Ready Daily Report</span>
            </a>

            <a
              href={`/api/v2/exports/operations-xlsx?unit=${unit}&date=${date}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ justifyContent: 'center', textDecoration: 'none', padding: '8px' }}
            >
              <Download size={14} />
              <span>Download Operations Data (.xlsx)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
