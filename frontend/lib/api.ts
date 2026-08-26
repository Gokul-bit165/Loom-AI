import {
  AskAssistantResponse,
  BreakdownRankingData,
  ProductionVarianceData,
  RevenueSummaryData,
  StandardApiResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMsg = `API request failed with status ${res.status}`;
    try {
      const errorObj = await res.json();
      if (errorObj?.error?.message) {
        errorMsg = errorObj.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Q1 Production
  async getProductionVariance(params?: {
    date?: string;
    department?: string;
    machine_type?: string;
    machine_id?: string;
    shift?: number;
  }): Promise<StandardApiResponse<ProductionVarianceData>> {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    if (params?.department) query.set('department', params.department);
    if (params?.machine_type) query.set('machine_type', params.machine_type);
    if (params?.machine_id) query.set('machine_id', params.machine_id);
    if (params?.shift) query.set('shift', params.shift.toString());

    return fetchJson(`${API_BASE_URL}/api/production/variance?${query.toString()}`);
  },

  // Q5 Breakdown
  async getBreakdownRanking(params?: {
    period?: 'today' | 'month';
    date?: string;
    department?: string;
    machine_type?: string;
    machine_id?: string;
  }): Promise<StandardApiResponse<BreakdownRankingData>> {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.date) query.set('date', params.date);
    if (params?.department) query.set('department', params.department);
    if (params?.machine_type) query.set('machine_type', params.machine_type);
    if (params?.machine_id) query.set('machine_id', params.machine_id);

    return fetchJson(`${API_BASE_URL}/api/breakdown/ranking?${query.toString()}`);
  },

  // Q21 Revenue
  async getRevenueSummary(params?: {
    date?: string;
    department?: string;
    machine_id?: string;
    fabric_style?: string;
  }): Promise<StandardApiResponse<RevenueSummaryData>> {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    if (params?.department) query.set('department', params.department);
    if (params?.machine_id) query.set('machine_id', params.machine_id);
    if (params?.fabric_style) query.set('fabric_style', params.fabric_style);

    return fetchJson(`${API_BASE_URL}/api/revenue/summary?${query.toString()}`);
  },

  // AI Assistant
  async askAssistant(payload: {
    question: string;
    date?: string;
    department?: string;
    machine_id?: string;
  }): Promise<AskAssistantResponse> {
    return fetchJson(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
