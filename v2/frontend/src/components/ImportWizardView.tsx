import React, { useState } from 'react';
import { uploadIngestPreview, uploadIngestCommit, rollbackBatch } from '../api';
import type { PreviewResponse, CommitResponse } from '../api';
import { UploadCloud, FileSpreadsheet, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

export const ImportWizardView: React.FC = () => {
  const [templateCode, setTemplateCode] = useState('MILL_DAILY_PREP_WIDE');
  const [unit, setUnit] = useState('ATM');
  const [workDate, setWorkDate] = useState('2026-07-31');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [commitResult, setCommitResult] = useState<CommitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [rollbackStatus, setRollbackStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(null);
      setCommitResult(null);
      setErrorMsg(null);
    }
  };

  const handleGeneratePreview = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await uploadIngestPreview(selectedFile, templateCode, unit, workDate);
      setPreview(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to parse sheet.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommitBatch = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await uploadIngestCommit(selectedFile, templateCode, unit, workDate, 'clerk_ravi');
      setCommitResult(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to commit batch.');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    if (!commitResult?.import_batch_id) return;
    setLoading(true);
    try {
      const res = await rollbackBatch(commitResult.import_batch_id);
      setRollbackStatus(`Batch #${res.import_batch_id} successfully rolled back. Historical records restored.`);
      setCommitResult(null);
      setPreview(null);
    } catch (e: any) {
      setErrorMsg(e.message || 'Rollback failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Production Sheet Ingestion Wizard</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Upload shift production sheets with live validation, mathematical EFFI % cross-check, and lossless supersede history.
            </p>
          </div>
        </div>

        {/* Step 1: Configuration */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Sheet Layout Template
            </label>
            <select className="input-field" style={{ width: '100%' }} value={templateCode} onChange={(e) => setTemplateCode(e.target.value)}>
              <option value="MILL_DAILY_PREP_WIDE">MILL_DAILY_PREP_WIDE (ATM Preparatory Report)</option>
              <option value="LOOM_LONG_FORMAT">LOOM_LONG_FORMAT (Standard Per-Loom Tabular)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Operating Unit
            </label>
            <select className="input-field" style={{ width: '100%' }} value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="ATM">Ashok Textile Mills (ATM)</option>
              <option value="VPN" disabled>VPN (Job Work - Read Only)</option>
              <option value="CVF" disabled>CVF (Job Work - Read Only)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Shift Date
            </label>
            <input
              type="date"
              className="input-field"
              style={{ width: '100%' }}
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
            />
          </div>
        </div>

        {/* Dropzone */}
        <div style={{
          border: '2px dashed var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          textAlign: 'center',
          backgroundColor: 'var(--bg-page)',
          marginBottom: 20,
        }}>
          <UploadCloud size={36} color="var(--primary-navy)" style={{ margin: '0 auto 8px auto' }} />
          <div style={{ fontSize: 14, fontWeight: 600 }}>Select Excel (.xlsx) or CSV shift report</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {selectedFile ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : 'Drag and drop or browse from computer'}
          </div>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="sheet-upload"
          />
          <label htmlFor="sheet-upload" className="btn btn-outline" style={{ marginTop: 14, display: 'inline-flex' }}>
            <FileSpreadsheet size={15} /> Browse File
          </label>
        </div>

        {errorMsg && (
          <div style={{ padding: 12, backgroundColor: 'var(--danger-red-bg)', color: 'var(--danger-red)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16 }}>
            <strong>Validation Error:</strong> {errorMsg}
          </div>
        )}

        {rollbackStatus && (
          <div style={{ padding: 12, backgroundColor: 'var(--success-green-bg)', color: 'var(--success-green)', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16 }}>
            {rollbackStatus}
          </div>
        )}

        {selectedFile && !preview && !commitResult && (
          <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={handleGeneratePreview} disabled={loading}>
              {loading ? 'Validating...' : 'Validate & Preview Sheet'} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Step 2: Live Preview Diff */}
      {preview && !commitResult && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Ingest Validation Preview & Diff</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>{preview.summary}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            <div style={{ padding: 12, backgroundColor: 'var(--success-green-bg)', borderRadius: 'var(--radius-md)', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--success-green)' }}>NEW INSERTS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success-green)' }}>{preview.to_insert.length}</div>
            </div>

            <div style={{ padding: 12, backgroundColor: 'var(--warning-amber-bg)', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning-amber)' }}>SUPERSEDE / UPDATES</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning-amber)' }}>{preview.to_update.length}</div>
              <div style={{ fontSize: 10.5, color: '#92400E' }}>Lossless: Old rows preserved</div>
            </div>

            <div style={{ padding: 12, backgroundColor: 'var(--danger-red-bg)', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--danger-red)' }}>REJECTIONS</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--danger-red)' }}>{preview.to_reject.length}</div>
            </div>
          </div>

          {/* Rejection Details if any */}
          {preview.to_reject.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger-red)', marginBottom: 8 }}>
                Rejected Rows (Must be fixed before committing)
              </h4>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Error Code</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.to_reject.map((r, idx) => (
                      <tr key={idx}>
                        <td>Row {r.row_index}</td>
                        <td style={{ color: 'var(--danger-red)', fontWeight: 600 }}>{r.error_code}</td>
                        <td>{r.error_detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button className="btn btn-outline" onClick={() => setPreview(null)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCommitBatch}
              disabled={loading || (preview.to_insert.length === 0 && preview.to_update.length === 0)}
            >
              <CheckCircle2 size={15} /> Confirm & Commit Batch to Production
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Committed Result & Lossless Rollback */}
      {commitResult && (
        <div className="card" style={{ borderLeft: '4px solid var(--success-green)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--success-green)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} /> Batch Committed Successfully
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-main)', marginTop: 6 }}>
                Import Batch ID: <strong>#{commitResult.import_batch_id}</strong> · Accepted Records: <strong>{commitResult.accepted}</strong>
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                All records tagged with batch #{commitResult.import_batch_id}. History is audit-tracked.
              </p>
            </div>

            <button className="btn btn-danger" onClick={handleRollback} disabled={loading} style={{ fontSize: 12 }}>
              <RotateCcw size={14} /> One-Click Lossless Rollback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
