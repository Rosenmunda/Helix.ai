import modelData from './model_weights_and_features.json';

// Type definitions for model weights
interface GCNWeights {
  conv1_weight: number[][];
  conv1_bias: number[];
  conv2_weight: number[][];
  conv2_bias: number[];
}

interface GraphSAGEWeights {
  conv1_lin_l_weight: number[][];
  conv1_lin_l_bias: number[];
  conv1_lin_r_weight: number[][];
  conv2_lin_l_weight: number[][];
  conv2_lin_l_bias: number[];
  conv2_lin_r_weight: number[][];
}

interface GATWeights {
  conv1_weight: number[][];
  conv1_bias: number[];
  conv1_att_src: number[][][];
  conv1_att_dst: number[][][];
  conv2_weight: number[][];
  conv2_bias: number[];
  conv2_att_src: number[][][];
  conv2_att_dst: number[][][];
}

interface ModelWeightsAndFeatures {
  X: number[][];
  edges: [number, number][];
  gcn: GCNWeights;
  graphsage: GraphSAGEWeights;
  gat: GATWeights;
}

const data = modelData as unknown as ModelWeightsAndFeatures;

// Matrix Helper Functions
function transpose(A: number[][]): number[][] {
  const M = A.length;
  const N = A[0].length;
  const B: number[][] = Array.from({ length: N }, () => new Array(M));
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      B[j][i] = A[i][j];
    }
  }
  return B;
}

function matmul(A: number[][], B: number[][]): number[][] {
  const M = A.length;
  const N = A[0].length;
  const K = B[0].length;
  const C: number[][] = Array.from({ length: M }, () => new Array(K).fill(0));
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < K; j++) {
      let sum = 0;
      for (let k = 0; k < N; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

function addBias(X: number[][], b: number[]): number[][] {
  return X.map(row => row.map((val, j) => val + b[j]));
}

function relu(X: number[][]): number[][] {
  return X.map(row => row.map(val => Math.max(0, val)));
}

function leakyRelu(x: number, negativeSlope: number = 0.2): number {
  return x >= 0 ? x : x * negativeSlope;
}

function softmax(X: number[][]): number[][] {
  return X.map(row => {
    const max = Math.max(...row);
    const exps = row.map(val => Math.exp(val - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(exp => exp / sum);
  });
}

// 1. GCN Inference Engine
export function runGCN(X: number[][], edges: [number, number][], weights: GCNWeights): number[][] {
  const N = X.length;
  
  // Normalized Adjacency
  const A: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  for (const [u, v] of edges) {
    A[u][v] = 1.0;
  }
  
  const d = A.map(row => row.reduce((a, b) => a + b, 0));
  const A_norm: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (A[i][j] > 0 && d[i] > 0 && d[j] > 0) {
        A_norm[i][j] = A[i][j] / Math.sqrt(d[i] * d[j]);
      }
    }
  }
  
  // Layer 1: ReLU(A_norm * X * W1^T + b1)
  const W1_T = transpose(weights.conv1_weight);
  const X_W1 = matmul(X, W1_T);
  const conv1 = matmul(A_norm, X_W1);
  const h1 = relu(addBias(conv1, weights.conv1_bias));
  
  // Layer 2: A_norm * h1 * W2^T + b2
  const W2_T = transpose(weights.conv2_weight);
  const h1_W2 = matmul(h1, W2_T);
  const conv2 = matmul(A_norm, h1_W2);
  const h2 = addBias(conv2, weights.conv2_bias);
  
  return softmax(h2);
}

// 2. GraphSAGE Inference Engine
export function runGraphSAGE(X: number[][], edges: [number, number][], weights: GraphSAGEWeights): number[][] {
  const N = X.length;
  
  // A without self-loops for aggregation
  const A: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  for (const [u, v] of edges) {
    if (u !== v) {
      A[u][v] = 1.0;
    }
  }
  
  const d = A.map(row => row.reduce((a, b) => a + b, 0));
  const A_mean: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (A[i][j] > 0 && d[i] > 0) {
        A_mean[i][j] = A[i][j] / d[i];
      }
    }
  }
  
  // Layer 1
  const W1_l_T = transpose(weights.conv1_lin_l_weight);
  const W1_r_T = transpose(weights.conv1_lin_r_weight);
  const h1_l = addBias(matmul(X, W1_l_T), weights.conv1_lin_l_bias);
  const h1_r = matmul(A_mean, matmul(X, W1_r_T));
  const h1 = relu(h1_l.map((row, i) => row.map((val, c) => val + h1_r[i][c])));
  
  // Layer 2
  const W2_l_T = transpose(weights.conv2_lin_l_weight);
  const W2_r_T = transpose(weights.conv2_lin_r_weight);
  const h2_l = addBias(matmul(h1, W2_l_T), weights.conv2_lin_l_bias);
  const h2_r = matmul(A_mean, matmul(h1, W2_r_T));
  const h2 = h2_l.map((row, i) => row.map((val, c) => val + h2_r[i][c]));
  
  return softmax(h2);
}

// 3. GAT Inference Engine
export function runGAT(X: number[][], edges: [number, number][], weights: GATWeights): number[][] {
  const N = X.length;
  
  // Layer 1
  const W1_T = transpose(weights.conv1_weight);
  const y1 = matmul(X, W1_T); // [N, 64]
  
  // Reshape y1 to [N, 4, 16]
  const y1_reshaped: number[][][] = Array.from({ length: N }, () =>
    Array.from({ length: 4 }, () => new Array(16))
  );
  for (let i = 0; i < N; i++) {
    for (let h = 0; h < 4; h++) {
      for (let c = 0; c < 16; c++) {
        y1_reshaped[i][h][c] = y1[i][h * 16 + c];
      }
    }
  }
  
  // Calculate attention inputs: g_src1 and g_dst1 of shape [N, 4]
  const g_src1: number[][] = Array.from({ length: N }, () => new Array(4).fill(0));
  const g_dst1: number[][] = Array.from({ length: N }, () => new Array(4).fill(0));
  for (let i = 0; i < N; i++) {
    for (let h = 0; h < 4; h++) {
      let sumSrc = 0;
      let sumDst = 0;
      for (let c = 0; c < 16; c++) {
        sumSrc += y1_reshaped[i][h][c] * weights.conv1_att_src[0][h][c];
        sumDst += y1_reshaped[i][h][c] * weights.conv1_att_dst[0][h][c];
      }
      g_src1[i][h] = sumSrc;
      g_dst1[i][h] = sumDst;
    }
  }
  
  // Calculate attention matrix alpha1 of shape [N, N, 4]
  const alpha1: number[][][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => new Array(4).fill(0))
  );
  
  const scores1: number[][][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => new Array(4).fill(-1e9))
  );
  
  for (const [u, v] of edges) {
    for (let h = 0; h < 4; h++) {
      scores1[u][v][h] = leakyRelu(g_src1[u][h] + g_dst1[v][h], 0.2);
    }
  }
  
  // Softmax scores1 over dim 0 (source nodes u for each target node v)
  for (let v = 0; v < N; v++) {
    for (let h = 0; h < 4; h++) {
      // Find max for stability
      let maxVal = -1e9;
      for (let u = 0; u < N; u++) {
        if (scores1[u][v][h] > maxVal) {
          maxVal = scores1[u][v][h];
        }
      }
      
      let sumExp = 0;
      const exps: number[] = new Array(N);
      for (let u = 0; u < N; u++) {
        const expVal = Math.exp(scores1[u][v][h] - maxVal);
        exps[u] = expVal;
        sumExp += expVal;
      }
      
      for (let u = 0; u < N; u++) {
        alpha1[u][v][h] = exps[u] / (sumExp || 1.0);
      }
    }
  }
  
  // Aggregate: out1[v][h][c] = sum_u alpha1[u][v][h] * y1_reshaped[u][h][c]
  const out1_reshaped: number[][][] = Array.from({ length: N }, () =>
    Array.from({ length: 4 }, () => new Array(16).fill(0))
  );
  for (let v = 0; v < N; v++) {
    for (let h = 0; h < 4; h++) {
      for (let c = 0; c < 16; c++) {
        let sum = 0;
        for (let u = 0; u < N; u++) {
          if (alpha1[u][v][h] > 1e-6) {
            sum += alpha1[u][v][h] * y1_reshaped[u][h][c];
          }
        }
        out1_reshaped[v][h][c] = sum;
      }
    }
  }
  
  // Flatten out1_reshaped to [N, 64] and add bias, then apply ReLU
  const h1: number[][] = Array.from({ length: N }, () => new Array(64));
  for (let v = 0; v < N; v++) {
    for (let h = 0; h < 4; h++) {
      for (let c = 0; c < 16; c++) {
        const idx = h * 16 + c;
        h1[v][idx] = Math.max(0, out1_reshaped[v][h][c] + weights.conv1_bias[idx]);
      }
    }
  }
  
  // Layer 2 (1 head, 2 channels)
  const W2_T = transpose(weights.conv2_weight);
  const y2 = matmul(h1, W2_T); // [N, 2]
  
  // Reshape y2 to [N, 1, 2]
  const y2_reshaped: number[][][] = Array.from({ length: N }, () => [new Array(2)]);
  for (let i = 0; i < N; i++) {
    for (let c = 0; c < 2; c++) {
      y2_reshaped[i][0][c] = y2[i][c];
    }
  }
  
  const g_src2: number[][] = Array.from({ length: N }, () => [0]);
  const g_dst2: number[][] = Array.from({ length: N }, () => [0]);
  for (let i = 0; i < N; i++) {
    let sumSrc = 0;
    let sumDst = 0;
    for (let c = 0; c < 2; c++) {
      sumSrc += y2_reshaped[i][0][c] * weights.conv2_att_src[0][0][c];
      sumDst += y2_reshaped[i][0][c] * weights.conv2_att_dst[0][0][c];
    }
    g_src2[i][0] = sumSrc;
    g_dst2[i][0] = sumDst;
  }
  
  const alpha2: number[][][] = Array.from({ length: N }, () => [[0]]);
  const scores2: number[][][] = Array.from({ length: N }, () => [[-1e9]]);
  for (const [u, v] of edges) {
    scores2[u][v][0] = leakyRelu(g_src2[u][0] + g_dst2[v][0], 0.2);
  }
  
  for (let v = 0; v < N; v++) {
    let maxVal = -1e9;
    for (let u = 0; u < N; u++) {
      if (scores2[u][v][0] > maxVal) {
        maxVal = scores2[u][v][0];
      }
    }
    
    let sumExp = 0;
    const exps: number[] = new Array(N);
    for (let u = 0; u < N; u++) {
      const expVal = Math.exp(scores2[u][v][0] - maxVal);
      exps[u] = expVal;
      sumExp += expVal;
    }
    
    for (let u = 0; u < N; u++) {
      alpha2[u][v][0] = exps[u] / (sumExp || 1.0);
    }
  }
  
  const out2_reshaped: number[][] = Array.from({ length: N }, () => new Array(2).fill(0));
  for (let v = 0; v < N; v++) {
    for (let c = 0; c < 2; c++) {
      let sum = 0;
      for (let u = 0; u < N; u++) {
        if (alpha2[u][v][0] > 1e-6) {
          sum += alpha2[u][v][0] * y2_reshaped[u][0][c];
        }
      }
      out2_reshaped[v][c] = sum;
    }
  }
  
  const h2: number[][] = out2_reshaped.map(row => row.map((val, c) => val + weights.conv2_bias[c]));
  
  return softmax(h2);
}

// Master Prediction Executor
export interface InferenceResult {
  prediction: 'Essential' | 'Non-Essential';
  confidence: number;
}

export function executeInference(proteinId: number, modelType: 'ML' | 'GNN' | 'Graph'): InferenceResult {
  const proteinIndex = proteinId - 1; // 1-indexed to 0-indexed
  const N = data.X.length;
  if (proteinIndex < 0 || proteinIndex >= N) {
    throw new Error('Protein index out of bounds');
  }
  
  let probs: number[][];
  if (modelType === 'GNN') {
    probs = runGCN(data.X, data.edges as [number, number][], data.gcn);
  } else if (modelType === 'Graph') {
    probs = runGraphSAGE(data.X, data.edges as [number, number][], data.graphsage);
  } else {
    // ML maps to GAT
    probs = runGAT(data.X, data.edges as [number, number][], data.gat);
  }
  
  const nodeProbs = probs[proteinIndex];
  // Class 1 is Essential, Class 0 is Non-Essential
  const isEssential = nodeProbs[1] >= nodeProbs[0];
  const confidence = isEssential ? nodeProbs[1] : nodeProbs[0];
  
  return {
    prediction: isEssential ? 'Essential' : 'Non-Essential',
    confidence: parseFloat(confidence.toFixed(3))
  };
}
