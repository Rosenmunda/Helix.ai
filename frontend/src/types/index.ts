export interface Protein {
  id: number;
  name: string;
  protein_id?: string;
  gene_name?: string;
  pli_score?: number;
  uniprot_id?: string;
  features?: Record<string, number>;
  is_essential?: boolean | null;
}

export interface ModelMetrics {
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  test_set_size?: number;
  training_date?: string;
  version?: string;
}

export interface Prediction {
  id: number;
  protein_id: number;
  model_type: string;
  prediction: 'Essential' | 'Non-Essential';
  confidence: number;
  execution_time_ms: number;
  created_at?: string;
}

export interface Drug {
  name: string;
  drug_bank_id?: string;
  approval_status: string;
  type?: string;
  source: string;
}

export interface Paper {
  pubmed_id: string;
  title: string;
  journal?: string;
  publication_year?: number;
  abstract?: string;
  doi?: string;
}
