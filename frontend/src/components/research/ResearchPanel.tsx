import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { BookOpen, ExternalLink, Clipboard, Check } from 'lucide-react';

export const ResearchPanel: React.FC = () => {
  const { papers, selectedProtein } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!selectedProtein || papers.length === 0) return null;

  const handleCopyCitation = (paper: any) => {
    const authorsStr = 'Research Consortium';
    const yearStr = paper.publication_year ? ` (${paper.publication_year})` : '';
    const journalStr = paper.journal ? ` *${paper.journal}*` : '';
    const doiStr = paper.doi ? ` DOI: ${paper.doi}` : '';
    const pmidStr = paper.pubmed_id ? ` PMID: ${paper.pubmed_id}` : '';
    
    const citation = `${authorsStr}.${yearStr}. "${paper.title}".${journalStr}.${pmidStr}.${doiStr}`;
    
    navigator.clipboard.writeText(citation);
    setCopiedId(paper.pubmed_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="border border-brand-gray/25 dark:border-brand-gray/10 rounded-lg overflow-hidden bg-white dark:bg-[#151622] shadow-sm select-none text-brand-dark dark:text-brand-light">
      
      {/* Header */}
      <div className="bg-brand-light dark:bg-slate-950 px-4 py-2.5 border-b border-brand-gray/20 dark:border-brand-gray/10 flex justify-between items-center text-brand-dark dark:text-white">
        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-brand-crimson dark:text-brand-red" />
          <span>Biomedical Publications Feed</span>
        </span>
        <span className="text-[10px] text-brand-gray dark:text-brand-gray/60 font-semibold">Matched: {papers.length} bibliography items</span>
      </div>

      {/* Bibliography numbered list */}
      <div className="p-4 space-y-4 divide-y divide-brand-gray/10 dark:divide-brand-gray/5">
        {papers.map((paper, idx) => (
          <div 
            key={paper.pubmed_id || idx} 
            className={`text-xs ${idx > 0 ? 'pt-4' : ''} space-y-2`}
          >
            {/* Number and Title */}
            <div className="flex items-start gap-2">
              <span className="font-mono text-brand-crimson dark:text-brand-red font-bold">{idx + 1}.</span>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-brand-dark dark:text-white leading-snug">{paper.title}</h4>
                <p className="text-[10px] text-brand-gray dark:text-brand-gray/50 font-mono">
                  {paper.journal && <span className="text-brand-gray italic">{paper.journal}</span>}
                  {paper.publication_year && <span> ({paper.publication_year})</span>}
                </p>
              </div>
            </div>

            {/* Abstract preview */}
            {paper.abstract && (
              <p className="text-[11px] text-brand-gray dark:text-brand-gray/40 leading-normal pl-4 font-mono">
                {paper.abstract}
              </p>
            )}

            {/* Citations and Links row */}
            <div className="flex items-center gap-4 pl-4 text-[10px] font-bold">
              {/* Copy Citation button */}
              <button
                onClick={() => handleCopyCitation(paper)}
                className="text-brand-crimson dark:text-brand-red hover:text-brand-red dark:hover:text-brand-crimson flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedId === paper.pubmed_id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-500">Citation Copied</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3 h-3" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>

              {/* External PubMed link */}
              {paper.pubmed_id && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pubmed_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray hover:text-brand-dark dark:hover:text-brand-light inline-flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  PMID: {paper.pubmed_id}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}

              {/* External DOI link */}
              {paper.doi && (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-gray hover:text-brand-dark dark:hover:text-brand-light inline-flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  DOI Link
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
export default ResearchPanel;
