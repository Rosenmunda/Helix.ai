import type { Protein, ModelMetrics, Prediction, Drug, Paper } from '../types';
import { executeInference } from './predictionEngine';


const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1';

// Comprehensive mock database of proteins for Mock Mode fallback
const MOCK_PROTEINS: Protein[] = [
  {
    id: 1,
    name: 'TP53',
    protein_id: 'P04637',
    gene_name: 'TP53',
    pli_score: 0.99,
    uniprot_id: 'P04637',
    features: { degree_centrality: 0.85, betweenness_centrality: 0.92, sequence_length: 393, expression_level: 0.78 }
  },
  {
    id: 2,
    name: 'BRCA1',
    protein_id: 'P38398',
    gene_name: 'BRCA1',
    pli_score: 0.98,
    uniprot_id: 'P38398',
    features: { degree_centrality: 0.72, betweenness_centrality: 0.65, sequence_length: 1863, expression_level: 0.54 }
  },
  {
    id: 3,
    name: 'EGFR',
    protein_id: 'P00533',
    gene_name: 'EGFR',
    pli_score: 0.99,
    uniprot_id: 'P00533',
    features: { degree_centrality: 0.79, betweenness_centrality: 0.78, sequence_length: 1210, expression_level: 0.88 }
  },
  {
    id: 4,
    name: 'TNF',
    protein_id: 'P01375',
    gene_name: 'TNF',
    pli_score: 0.92,
    uniprot_id: 'P01375',
    features: { degree_centrality: 0.82, betweenness_centrality: 0.84, sequence_length: 233, expression_level: 0.95 }
  },
  {
    id: 5,
    name: 'APOE',
    protein_id: 'P02649',
    gene_name: 'APOE',
    pli_score: 0.85,
    uniprot_id: 'P02649',
    features: { degree_centrality: 0.61, betweenness_centrality: 0.52, sequence_length: 317, expression_level: 0.71 }
  },
  {
    id: 6,
    name: 'AKT1',
    protein_id: 'P31749',
    gene_name: 'AKT1',
    pli_score: 0.97,
    uniprot_id: 'P31749',
    features: { degree_centrality: 0.88, betweenness_centrality: 0.89, sequence_length: 480, expression_level: 0.82 }
  },
  {
    id: 7,
    name: 'GAPDH',
    protein_id: 'P04406',
    gene_name: 'GAPDH',
    pli_score: 0.99,
    uniprot_id: 'P04406',
    features: { degree_centrality: 0.94, betweenness_centrality: 0.95, sequence_length: 335, expression_level: 0.99 }
  },
  {
    id: 8,
    name: 'OR2T11',
    protein_id: 'Q8NH01',
    gene_name: 'OR2T11',
    pli_score: 0.01,
    uniprot_id: 'Q8NH01',
    features: { degree_centrality: 0.05, betweenness_centrality: 0.02, sequence_length: 312, expression_level: 0.05 }
  },
  {
    id: 9,
    name: 'MYC',
    protein_id: 'P01106',
    gene_name: 'MYC',
    pli_score: 0.96,
    uniprot_id: 'P01106',
    features: { degree_centrality: 0.83, betweenness_centrality: 0.80, sequence_length: 439, expression_level: 0.91 }
  },
  {
    id: 10,
    name: 'INS',
    protein_id: 'P01308',
    gene_name: 'INS',
    pli_score: 0.45,
    uniprot_id: 'P01308',
    features: { degree_centrality: 0.41, betweenness_centrality: 0.35, sequence_length: 110, expression_level: 0.60 }
  },
  {
    id: 11,
    name: 'IL6',
    protein_id: 'P05231',
    gene_name: 'IL6',
    pli_score: 0.88,
    uniprot_id: 'P05231',
    features: { degree_centrality: 0.74, betweenness_centrality: 0.68, sequence_length: 212, expression_level: 0.85 }
  },
  {
    id: 12,
    name: 'VEGFA',
    protein_id: 'P15692',
    gene_name: 'VEGFA',
    pli_score: 0.94,
    uniprot_id: 'P15692',
    features: { degree_centrality: 0.77, betweenness_centrality: 0.71, sequence_length: 232, expression_level: 0.89 }
  },
  {
    id: 13,
    name: 'MTOR',
    protein_id: 'P42345',
    gene_name: 'MTOR',
    pli_score: 0.99,
    uniprot_id: 'P42345',
    features: { degree_centrality: 0.91, betweenness_centrality: 0.93, sequence_length: 2549, expression_level: 0.86 }
  },
  {
    id: 14,
    name: 'HSP90AA1',
    protein_id: 'P07900',
    gene_name: 'HSP90AA1',
    pli_score: 0.99,
    uniprot_id: 'P07900',
    features: { degree_centrality: 0.92, betweenness_centrality: 0.90, sequence_length: 732, expression_level: 0.97 }
  },
  {
    id: 15,
    name: 'TAS2R38',
    protein_id: 'P59533',
    gene_name: 'TAS2R38',
    pli_score: 0.05,
    uniprot_id: 'P59533',
    features: { degree_centrality: 0.08, betweenness_centrality: 0.04, sequence_length: 338, expression_level: 0.08 }
  }
];

const MOCK_PROTEINS_GRAPH: Protein[] = [
  {
    id: 1,
    name: 'ARF5',
    protein_id: '9606.ENSP00000000233',
    gene_name: 'ARF5',
    pli_score: 0.85,
    uniprot_id: 'P84085',
    features: { degree_centrality: 0.0017, betweenness_centrality: 0.000009, sequence_length: 350, expression_level: 0.000013 }
  },
  {
    id: 2,
    name: 'ACAP1',
    protein_id: '9606.ENSP00000158762',
    gene_name: 'ACAP1',
    pli_score: 0.15,
    uniprot_id: 'Q15027',
    features: { degree_centrality: 0.00025, betweenness_centrality: 0.0, sequence_length: 740, expression_level: 0.0000009 }
  },
  {
    id: 3,
    name: 'COPA',
    protein_id: '9606.ENSP00000357048',
    gene_name: 'COPA',
    pli_score: 0.95,
    uniprot_id: 'P53621',
    features: { degree_centrality: 0.002, betweenness_centrality: 0.00014, sequence_length: 1224, expression_level: 0.000019 }
  },
  {
    id: 4,
    name: 'RAB11FIP3',
    protein_id: '9606.ENSP00000262305',
    gene_name: 'RAB11FIP3',
    pli_score: 0.35,
    uniprot_id: 'O75154',
    features: { degree_centrality: 0.00138, betweenness_centrality: 0.00008, sequence_length: 750, expression_level: 0.0000034 }
  },
  {
    id: 5,
    name: 'COPB2',
    protein_id: '9606.ENSP00000329419',
    gene_name: 'COPB2',
    pli_score: 0.99,
    uniprot_id: 'P35606',
    features: { degree_centrality: 0.0027, betweenness_centrality: 0.00078, sequence_length: 900, expression_level: 0.00057 }
  }
];

const MOCK_MODEL_METRICS: ModelMetrics[] = [
  {
    type: 'GCN',
    accuracy: 0.924,
    precision: 0.910,
    recall: 0.905,
    f1_score: 0.907,
    roc_auc: 0.958,
    test_set_size: 2500,
    training_date: '2026-06-20T10:30:00Z',
    version: 'v2.1.0'
  },
  {
    type: 'GraphSAGE',
    accuracy: 0.901,
    precision: 0.887,
    recall: 0.879,
    f1_score: 0.883,
    roc_auc: 0.934,
    test_set_size: 2500,
    training_date: '2026-06-18T14:15:00Z',
    version: 'v1.8.1'
  },
  {
    type: 'GAT',
    accuracy: 0.885,
    precision: 0.862,
    recall: 0.850,
    f1_score: 0.856,
    roc_auc: 0.912,
    test_set_size: 2500,
    training_date: '2026-06-15T08:00:00Z',
    version: 'v1.4.2'
  },
  {
    type: 'GraphTheory',
    accuracy: 0.912,
    precision: 0.898,
    recall: 0.892,
    f1_score: 0.895,
    roc_auc: 0.942,
    test_set_size: 2500,
    training_date: '2026-06-22T09:00:00Z',
    version: 'v1.0.0'
  }
];

const MOCK_DRUGS: Record<string, Drug[]> = {
  TP53: [
    { name: 'APR-246 (Eprenetapopt)', drug_bank_id: 'DB12340', approval_status: 'Experimental', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Kevetrin', drug_bank_id: 'DB12891', approval_status: 'Experimental', type: 'Small Molecule', source: 'ChEMBL' },
    { name: 'Nutlin-3', drug_bank_id: 'DB08142', approval_status: 'Experimental', type: 'Small Molecule', source: 'UniProt' }
  ],
  EGFR: [
    { name: 'Erlotinib', drug_bank_id: 'DB01044', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Gefitinib', drug_bank_id: 'DB00317', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Osimertinib', drug_bank_id: 'DB09330', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Cetuximab', drug_bank_id: 'DB00002', approval_status: 'Approved', type: 'Biotech', source: 'UniProt' }
  ],
  BRCA1: [
    { name: 'Olaparib', drug_bank_id: 'DB09074', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Niraparib', drug_bank_id: 'DB11762', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Talazoparib', drug_bank_id: 'DB11760', approval_status: 'Approved', type: 'Small Molecule', source: 'ChEMBL' }
  ],
  TNF: [
    { name: 'Infliximab', drug_bank_id: 'DB00065', approval_status: 'Approved', type: 'Biotech', source: 'DrugBank' },
    { name: 'Adalimumab', drug_bank_id: 'DB00051', approval_status: 'Approved', type: 'Biotech', source: 'DrugBank' },
    { name: 'Etanercept', drug_bank_id: 'DB00005', approval_status: 'Approved', type: 'Biotech', source: 'UniProt' }
  ],
  APOE: [
    { name: 'Probucol', drug_bank_id: 'DB01254', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Bexarotene', drug_bank_id: 'DB00307', approval_status: 'Approved', type: 'Small Molecule', source: 'ChEMBL' }
  ],
  AKT1: [
    { name: 'Capivasertib', drug_bank_id: 'DB12349', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Ipatasertib', drug_bank_id: 'DB12613', approval_status: 'Experimental', type: 'Small Molecule', source: 'ChEMBL' }
  ],
  GAPDH: [
    { name: 'Konicamin', drug_bank_id: 'DB13042', approval_status: 'Experimental', type: 'Small Molecule', source: 'UniProt' }
  ],
  VEGFA: [
    { name: 'Bevacizumab', drug_bank_id: 'DB00112', approval_status: 'Approved', type: 'Biotech', source: 'DrugBank' },
    { name: 'Ranibizumab', drug_bank_id: 'DB01270', approval_status: 'Approved', type: 'Biotech', source: 'DrugBank' },
    { name: 'Pazopanib', drug_bank_id: 'DB06589', approval_status: 'Approved', type: 'Small Molecule', source: 'ChEMBL' }
  ],
  MTOR: [
    { name: 'Sirolimus (Rapamycin)', drug_bank_id: 'DB00877', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Everolimus', drug_bank_id: 'DB01590', approval_status: 'Approved', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Temsirolimus', drug_bank_id: 'DB06287', approval_status: 'Approved', type: 'Small Molecule', source: 'ChEMBL' }
  ],
  HSP90AA1: [
    { name: 'Tanespimycin', drug_bank_id: 'DB05244', approval_status: 'Experimental', type: 'Small Molecule', source: 'DrugBank' },
    { name: 'Ganetespib', drug_bank_id: 'DB12093', approval_status: 'Experimental', type: 'Small Molecule', source: 'ChEMBL' }
  ]
};

const MOCK_RESEARCH: Record<string, Paper[]> = {
  TP53: [
    { pubmed_id: '12821644', title: 'Surviving the cellular storm: The role of TP53 in cancer and longevity', journal: 'Nature Reviews Cancer', publication_year: 2023, abstract: 'TP53 gene encodes a tumor suppressor protein containing transcriptional activation, DNA binding, and oligomerization domains. It responds to diverse cellular stresses to regulate target genes, thereby inducing cell cycle arrest, biogenesis, senescence, or apoptosis.', doi: '10.1038/nrc.2023.41' },
    { pubmed_id: '30248491', title: 'p53: 40 years of research and clinical translations', journal: 'Cell Death & Differentiation', publication_year: 2021, abstract: 'As the most frequently mutated gene in human cancers, TP53 continues to lead oncology research. We review cell-autonomous and non-autonomous functionalities identified over four decades.', doi: '10.1038/s41418-020-00707-x' }
  ],
  EGFR: [
    { pubmed_id: '15118073', title: 'EGFR mutations in lung cancer and their therapeutic implications', journal: 'New England Journal of Medicine', publication_year: 2022, abstract: 'Somatic mutations in the tyrosine kinase domain of the epidermal growth factor receptor (EGFR) gene lead to hyper-activation of cell growth signals. EGFR inhibitors show dramatic clinical responses in patients carrying these mutations.', doi: '10.1056/NEJMoa040938' }
  ],
  BRCA1: [
    { pubmed_id: '9473183', title: 'A strong candidate for the breast and ovarian cancer susceptibility gene BRCA1', journal: 'Science', publication_year: 2020, abstract: 'A molecular analysis of BRCA1 mutations in familial breast cancer lineages shows high chromosomal instability and double strand break repair deficiencies.', doi: '10.1126/science.7939683' }
  ],
  TNF: [
    { pubmed_id: '11545648', title: 'Tumor necrosis factor: a multifunctional cytokine in health and disease', journal: 'Immunological Reviews', publication_year: 2023, abstract: 'TNF is a pleiotropic cytokine playing dual roles in host defense and systemic inflammatory pathogenesis. Anti-TNF biopharmaceuticals have transformed rheumatology.', doi: '10.1111/imr.12023' }
  ]
};

export class APIClient {
  private useMock: boolean = true;
  public onConnectionChange?: (mock: boolean) => void;

  constructor() {
    this.checkBackendConnection();
  }

  private async checkBackendConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${API_BASE.replace('/api/v1', '')}/health`, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('Successfully connected to Essential Proteins Backend. Live Mode active.');
        this.useMock = false;
        if (this.onConnectionChange) this.onConnectionChange(false);
      } else {
        console.warn('Backend returned error health status. Fallback to Mock Mode.');
        this.useMock = true;
        if (this.onConnectionChange) this.onConnectionChange(true);
      }
    } catch (e) {
      console.warn('Backend is unreachable. Running in local Mock Mode.');
      this.useMock = true;
      if (this.onConnectionChange) this.onConnectionChange(true);
    }
  }

  isMockMode() {
    return this.useMock;
  }

  setMockMode(enable: boolean) {
    this.useMock = enable;
  }

  async searchProteins(query: string, limit: number = 20, modelType: string = 'GNN'): Promise<{ data: { results: Protein[]; count: number; query: string } }> {
    if (this.useMock) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 200));
      const cleanQuery = query.trim().toUpperCase();
      const sourceList = modelType === 'GraphTheory' ? MOCK_PROTEINS_GRAPH : MOCK_PROTEINS;
      
      const filtered = sourceList.filter(p => 
        p.name.toUpperCase().includes(cleanQuery) || 
        (p.gene_name && p.gene_name.toUpperCase().includes(cleanQuery)) ||
        (p.protein_id && p.protein_id.toUpperCase().includes(cleanQuery))
      ).slice(0, limit);

      return {
        data: {
          results: filtered,
          count: filtered.length,
          query
        }
      };
    }

    const response = await fetch(`${API_BASE}/proteins/search?q=${encodeURIComponent(query)}&limit=${limit}&model_type=${modelType}`);
    if (!response.ok) throw new Error('Failed to search proteins');
    const data = await response.json();
    return { data };
  }

  async getProtein(id: number, modelType: string = 'GNN'): Promise<{ data: Protein }> {
    if (this.useMock) {
      await new Promise(r => setTimeout(r, 150));
      const sourceList = modelType === 'GraphTheory' ? MOCK_PROTEINS_GRAPH : MOCK_PROTEINS;
      const protein = sourceList.find(p => p.id === id);
      if (!protein) throw new Error('Protein not found');
      return { data: protein };
    }

    const response = await fetch(`${API_BASE}/proteins/${id}?model_type=${modelType}`);
    if (!response.ok) throw new Error('Failed to fetch protein details');
    const data = await response.json();
    return { data };
  }

  async getModelMetrics(): Promise<{ data: { models: ModelMetrics[] } }> {
    if (this.useMock) {
      await new Promise(r => setTimeout(r, 300));
      return {
        data: {
          models: MOCK_MODEL_METRICS
        }
      };
    }

    const response = await fetch(`${API_BASE}/models/metrics`);
    if (!response.ok) throw new Error('Failed to fetch model metrics');
    const data = await response.json();
    
    // Map object to array and rename key 'auc_roc' to 'roc_auc'
    const models: ModelMetrics[] = Object.entries(data).map(([modelType, metrics]: [string, any]) => ({
      type: modelType as 'GCN' | 'GraphSAGE' | 'GAT' | 'GraphTheory',
      accuracy: metrics.accuracy,
      precision: metrics.precision,
      recall: metrics.recall,
      f1_score: metrics.f1_score,
      roc_auc: metrics.auc_roc,
      test_set_size: 2500,
      version: modelType === 'GCN' ? 'v2.1.0' : modelType === 'GraphSAGE' ? 'v1.8.1' : modelType === 'GAT' ? 'v1.4.2' : 'v1.0.0'
    }));

    return {
      data: {
        models
      }
    };
  }

  async createPrediction(proteinId: number, modelType: string): Promise<{ data: Prediction }> {
    if (this.useMock) {
      // Simulate inference latency
      const latency = modelType === 'GCN' ? 1200 : modelType === 'GraphSAGE' ? 800 : modelType === 'GAT' ? 400 : 950;
      await new Promise(r => setTimeout(r, latency));
      
      const protein = MOCK_PROTEINS.find(p => p.id === proteinId);
      if (!protein) throw new Error('Protein not found');

      const result = executeInference(proteinId, modelType as 'GCN' | 'GraphSAGE' | 'GAT' | 'GraphTheory');
      
      return {
        data: {
          id: Math.floor(Math.random() * 100000),
          protein_id: proteinId,
          model_type: modelType,
          prediction: result.prediction,
          confidence: result.confidence,
          execution_time_ms: latency
        }
      };
    }

    const response = await fetch(`${API_BASE}/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protein_id: proteinId, model_type: modelType })
    });
    if (!response.ok) throw new Error('Failed to create prediction');
    const data = await response.json();
    return { data };
  }

  async getExplanation(predictionId: number): Promise<{ data: { explanation: string } }> {
    if (this.useMock) {
      await new Promise(r => setTimeout(r, 600));
      return {
        data: {
          explanation: ''
        }
      };
    }

    const response = await fetch(`${API_BASE}/predictions/${predictionId}/explanations`);
    if (!response.ok) throw new Error('Failed to fetch explanation');
    const data = await response.json();
    return { data };
  }

  // Generates fallback explanation dynamically when specific one is not predefined
  getFallbackExplanation(name: string, isEssential: boolean, confidence: number, modelType: string): string {
    const specificExplanations: Record<string, string> = {
      TP53: 'TP53 encodes tumor protein p53, a cellular gatekeeper regulating DNA repair, senescence, and apoptosis. Its central regulatory network and critical role in preventing cellular transformation explain its high essentiality classification.',
      BRCA1: 'BRCA1 is an essential component of the homologous recombination DNA repair machinery. The model predicted it as Essential due to its high node centrality in DNA repair interactomes and low redundancy in double-strand break repair pathways.',
      EGFR: 'EGFR is a transmembrane receptor tyrosine kinase regulating cellular proliferation, survival, and differentiation. Its essentiality is driven by its upstream control of core mitogenic and survival cascades like the MAPK and PI3K/AKT pathways.',
      TNF: 'TNF is a critical cytokine mediating systemic inflammation and immune regulation. While essential in multicellular immune responses, individual cell viability under tissue culture conditions may vary, reflecting the confidence score.',
      APOE: 'APOE is crucial for lipid transport and cholesterol metabolism. In cell-autonomous viability models, it exhibits high redundancy, placing it near the threshold of essentiality with moderate confidence.',
      AKT1: 'AKT1 is a central kinase node in the PI3K/Akt/mTOR survival pathway. It phosphorylates key apoptotic regulators. Its deletion causes massive cell-autonomous growth inhibition, confirming its prediction.',
      GAPDH: 'GAPDH is a glycolytic pathway enzyme catalyzing the reaction of glyceraldehyde-3-phosphate. Because glycolysis is fundamental to cellular ATP generation and carbon metabolism, GAPDH behaves as a constitutive housekeeping protein, leading to 99% essentiality confidence.',
      OR2T11: 'OR2T11 is a specialized olfactory receptor. These receptors have highly tissue-restricted expression and are completely redundant for basic cell survival and cell division, aligning perfectly with its predicted Non-Essential status (99% confidence).',
      TAS2R38: 'TAS2R38 is a bitter taste receptor. Similar to other sensory receptors, it is non-essential for cell-autonomous survival and growth, showing low node connectivity and redundant pathways.'
    };

    if (specificExplanations[name]) {
      return specificExplanations[name];
    }

    if (isEssential) {
      return `The protein ${name} is predicted as Essential with ${(confidence * 100).toFixed(1)}% confidence by the ${modelType} engine. This is primarily attributed to its high topological centrality in the human protein-protein interaction (PPI) network and its involvement in core transcriptomic or translational machinery. Its loss represents a lethal cellular disruption.`;
    } else {
      return `The protein ${name} is predicted as Non-Essential with ${(confidence * 100).toFixed(1)}% confidence by the ${modelType} engine. It shows low topological centrality and is localized within a highly peripheral subnet. Functional redundancy in alternative pathways suggests that cellular homeostasis can compensate for its knockdown.`;
    }
  }

  async getDrugs(proteinId: number, modelType: string = 'GNN'): Promise<{ data: { protein_id: number; drug_count: number; drugs: Drug[] } }> {
    const sourceList = modelType === 'Graph' ? MOCK_PROTEINS_GRAPH : MOCK_PROTEINS;
    const protein = sourceList.find(p => p.id === proteinId);
    const geneName = protein?.name || '';

    if (this.useMock) {
      await new Promise(r => setTimeout(r, 400));
      const drugs = MOCK_DRUGS[geneName] || [
        { name: `Candidate-${geneName}-A`, drug_bank_id: 'DB99901', approval_status: 'Experimental', type: 'Small Molecule', source: 'DrugBank (Simulated)' },
        { name: `Candidate-${geneName}-B`, drug_bank_id: 'DB99902', approval_status: 'Approved', type: 'Antibody', source: 'UniProt (Simulated)' }
      ];
      return {
        data: {
          protein_id: proteinId,
          drug_count: drugs.length,
          drugs
        }
      };
    }

    const response = await fetch(`${API_BASE}/drugs/${proteinId}?model_type=${modelType}`);
    if (!response.ok) throw new Error('Failed to fetch drugs');
    const drugs = await response.json();
    
    // Map drug array fields
    const mappedDrugs: Drug[] = drugs.map((d: any) => ({
      name: d.name,
      drug_bank_id: d.drug_bank_id || `DB${d.id}`,
      approval_status: d.phase === 'Approved' ? 'Approved' : 'Experimental',
      type: d.type || 'Small Molecule',
      source: d.source || 'DrugBank'
    }));

    return {
      data: {
        protein_id: proteinId,
        drug_count: mappedDrugs.length,
        drugs: mappedDrugs
      }
    };
  }

  async getResearch(proteinId: number, modelType: string = 'GNN'): Promise<{ data: { protein_id: number; paper_count: number; papers: Paper[] } }> {
    const sourceList = modelType === 'Graph' ? MOCK_PROTEINS_GRAPH : MOCK_PROTEINS;
    const protein = sourceList.find(p => p.id === proteinId);
    const geneName = protein?.name || '';

    if (this.useMock) {
      await new Promise(r => setTimeout(r, 500));
      const papers = MOCK_RESEARCH[geneName] || [
        {
          pubmed_id: String(10000000 + Math.floor(Math.random() * 9000000)),
          title: `Functional characterization and network analysis of ${geneName} in human disease`,
          journal: 'Biomedical Reports',
          publication_year: 2024,
          abstract: `This study presents an in-depth analysis of the interactome around ${geneName}. We demonstrate that its cellular expression correlates with growth rates and verify its network properties in multiple tissue types.`,
          doi: `10.1016/j.biomed.${geneName.toLowerCase()}.2024.012`
        },
        {
          pubmed_id: String(10000000 + Math.floor(Math.random() * 9000000)),
          title: `Targeting the ${geneName} signaling axis for novel drug repurposing screens`,
          journal: 'Drug Discovery Today',
          publication_year: 2025,
          abstract: `We screened a library of FDA-approved compounds to identify agents capable of modulating ${geneName} protein-protein interactions. Several molecules showed promising inhibitory profiles.`,
          doi: `10.1021/ddt.${geneName.toLowerCase()}.2025.105`
        }
      ];
      return {
        data: {
          protein_id: proteinId,
          paper_count: papers.length,
          papers
        }
      };
    }

    const response = await fetch(`${API_BASE}/research/${proteinId}?model_type=${modelType}`);
    if (!response.ok) throw new Error('Failed to fetch research papers');
    const papers = await response.json();
    
    // Map Paper fields to match frontend Paper interface
    const mappedPapers: Paper[] = papers.map((p: any) => ({
      pubmed_id: String(p.id),
      title: p.title,
      journal: p.journal,
      publication_year: p.published_year,
      abstract: `Authors: ${p.authors}. Relevance Score: ${p.relevance_score}`,
      doi: `10.1000/pmid.${p.id}`
    }));

    return {
      data: {
        protein_id: proteinId,
        paper_count: mappedPapers.length,
        papers: mappedPapers
      }
    };
  }

  async getGeminiBrief(proteinId: number, modelType: string, prediction: string, confidence: number): Promise<{ data: { brief: string } }> {
    if (this.useMock) {
      await new Promise(r => setTimeout(r, 600));
      const sourceList = modelType === 'GraphTheory' ? MOCK_PROTEINS_GRAPH : MOCK_PROTEINS;
      const protein = sourceList.find(p => p.id === proteinId);
      const geneName = protein?.name || 'Target Protein';
      return {
        data: {
          brief: `Gemini Sandbox: The protein ${geneName} was evaluated by the ${modelType} model and predicted as ${prediction} with ${(confidence * 100).toFixed(1)}% confidence. It exhibits critical node properties in topological pathways, making it a key regulator for cell-autonomous viability.`
        }
      };
    }

    const response = await fetch(`${API_BASE}/proteins/${proteinId}/gemini-brief?model_type=${modelType}&prediction=${prediction}&confidence=${confidence}`);
    if (!response.ok) throw new Error('Failed to fetch Gemini brief');
    const data = await response.ok ? await response.json() : { brief: "Failed to load Gemini brief from live server." };
    return { data };
  }
}

export default new APIClient();
