'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { today, inr, fmtMinutes, rupee } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';

export default function ImportPage() {
  const [templateDate, setTemplateDate] = useState(today());
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setResult(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.uploadShiftFile(file);
      setResult(res);
      setFile(null);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed. Please check file format.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 80px' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--atm-header)', marginBottom: 4 }}>
          Import Daily Shift Data
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink-700)' }}>
          Download pre-formatted templates for Shift 1, 2, and 3, enter real factory numbers, and upload Excel (.xlsx) or CSV files.
        </p>
      </div>

      {/* ── Section 1: Template Download ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>1. Download Shift 1, 2, 3 Data Template</span>
          <span style={{ fontSize: '0.6875rem', opacity: 0.9 }}>3 shifts per machine</span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '0.875rem', color: 'var(--ink-700)', marginBottom: 14 }}>
            The template generates 3 rows (Shift 1, 2, 3) for every active machine in the mill for the selected date. Fill in target, actual, breaks, and downtime.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-500)', marginBottom: 4, textTransform: 'uppercase' }}>
                Target Date
              </label>
              <input
                type="date"
                value={templateDate}
                onChange={e => setTemplateDate(e.target.value)}
                style={{
                  padding: '7px 10px',
                  border: '1px solid var(--atm-border)',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: 'var(--ink-900)',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <a
                href={api.getTemplateDownloadUrl('xlsx', templateDate)}
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
                download
              >
                📥 Download Excel (.xlsx) Template
              </a>
              <a
                href={api.getTemplateDownloadUrl('csv', templateDate)}
                className="btn btn-outline"
                style={{ textDecoration: 'none' }}
                download
              >
                📥 Download CSV Template
              </a>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', background: 'var(--ink-100)', padding: '8px 12px', borderRadius: 4 }}>
            <strong>Template Columns:</strong> <code>date</code>, <code>shift</code> (1, 2, 3), <code>machine_id</code>, <code>department</code>, <code>machine_type</code>, <code>fabric_style</code>, <code>target_qty</code>, <code>actual_qty</code>, <code>running_hours</code>, <code>warp_breaks</code>, <code>weft_breaks</code>, <code>downtime_minutes</code>, <code>breakdown_reason</code>, <code>revenue</code>
          </div>
        </div>
      </div>

      {/* ── Section 2: Upload Real Data ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          2. Upload Completed Excel or CSV
        </div>
        <div className="card-body">
          <form onSubmit={handleUpload}>
            <div
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              style={{
                border: dragActive ? '2px dashed var(--atm-header)' : '2px dashed var(--atm-border)',
                borderRadius: 6,
                padding: '28px 16px',
                textAlign: 'center',
                background: dragActive ? 'var(--atm-accent)11' : '#fcfcfc',
                cursor: 'pointer',
                marginBottom: 16,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📄</div>
              {file ? (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--ink-900)' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', marginTop: 2 }}>
                    {(file.size / 1024).toFixed(1)} KB · Ready to upload
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--ink-900)' }}>
                    Click to select or drag & drop Excel (.xlsx) / CSV file here
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-500)', marginTop: 4 }}>
                    Supports single-day 3-shift data and multi-day reports
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', borderRadius: 4, color: 'var(--critical)', fontSize: '0.875rem', marginBottom: 14 }}>
                <strong>Error:</strong> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!file || uploading}
              style={{ width: '100%' }}
            >
              {uploading ? 'Processing & Ingesting Shifts…' : '🚀 Ingest Shift Data into Database'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Section 3: Upload Result Summary ── */}
      {result && (
        <div className="card" style={{ border: '2px solid var(--ok-border)' }}>
          <div className="card-header" style={{ background: 'var(--ok)', display: 'flex', justifyContent: 'space-between' }}>
            <span>✓ Ingestion Successful</span>
            <span style={{ fontSize: '0.75rem' }}>Batch #{result.batch_id}</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: '8px 10px', background: 'var(--ok-bg)', borderRadius: 4, border: '1px solid var(--ok-border)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase' }}>Shifts Ingested</div>
                <div className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ok)' }}>
                  {result.shifts_covered?.join(', ') || '1, 2, 3'}
                </div>
              </div>

              <div style={{ padding: '8px 10px', background: 'var(--ink-100)', borderRadius: 4, border: '1px solid var(--atm-border)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase' }}>Machines Updated</div>
                <div className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {result.unique_machines}
                </div>
              </div>

              <div style={{ padding: '8px 10px', background: 'var(--ink-100)', borderRadius: 4, border: '1px solid var(--atm-border)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase' }}>Production Records</div>
                <div className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {result.production_records_ingested}
                </div>
              </div>

              <div style={{ padding: '8px 10px', background: 'var(--ink-100)', borderRadius: 4, border: '1px solid var(--atm-border)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase' }}>Total Output</div>
                <div className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink-900)' }}>
                  {inr(result.total_actual_quantity)} m
                </div>
              </div>

              <div style={{ padding: '8px 10px', background: 'var(--critical-bg)', borderRadius: 4, border: '1px solid var(--critical-border)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--ink-500)', textTransform: 'uppercase' }}>Downtime Events</div>
                <div className="num" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--critical)' }}>
                  {result.breakdown_events_ingested} ({fmtMinutes(result.total_downtime_minutes)})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                View Updated Morning Brief
              </Link>
              <Link href="/operations" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                View Operations Table
              </Link>
              <Link href="/breakdown" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>
                View Breakdown Pareto
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
