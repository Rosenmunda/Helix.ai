import React from 'react';
import { useStore } from '../../store/useStore';
import { ExternalLink, TableProperties, Download } from 'lucide-react';

export const DrugPanel: React.FC = () => {
  const { drugs, selectedProtein } = useStore();

  if (!selectedProtein || drugs.length === 0) return null;

  const handleDownloadCSV = () => {
    if (!drugs || drugs.length === 0) return;
    const headers = ['Drug Name', 'DrugBank ID', 'Approval Status', 'Type', 'Source'];
    const rows = drugs.map(d => [
      d.name,
      d.drug_bank_id || 'N/A',
      d.approval_status,
      d.type || 'Small Molecule',
      d.source
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Drug_Repurposing_${selectedProtein.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border border-brand-gray/25 rounded-lg overflow-hidden bg-white shadow-sm select-none text-brand-dark">
      
      {/* Header */}
      <div className="bg-brand-light px-4 py-2.5 border-b border-brand-gray/20 flex justify-between items-center text-brand-dark">
        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <TableProperties className="w-3.5 h-3.5 text-brand-crimson" />
          <span>Repurposable Drug Candidates</span>
        </span>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="text-brand-gray font-semibold">Matched: {drugs.length}</span>
          <button
            onClick={handleDownloadCSV}
            className="text-brand-crimson hover:text-brand-red font-bold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Structured data table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-brand-light/50 border-b border-brand-gray/15 text-brand-gray font-bold uppercase tracking-wider">
              <th className="p-2.5 pl-4">Drug Candidate Name</th>
              <th className="p-2.5">DrugBank ID</th>
              <th className="p-2.5">Approval Status</th>
              <th className="p-2.5">Molecular Class</th>
              <th className="p-2.5 pr-4">Reference Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/10 text-brand-dark">
            {drugs.map((drug, idx) => (
              <tr key={idx} className="hover:bg-brand-light/20 transition">
                <td className="p-2.5 pl-4 font-bold text-brand-dark">{drug.name}</td>
                <td className="p-2.5">
                  {drug.drug_bank_id ? (
                    <a
                      href={`https://go.drugbank.com/drugs/${drug.drug_bank_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-crimson hover:text-brand-red inline-flex items-center gap-0.5 hover:underline cursor-pointer font-semibold"
                    >
                      {drug.drug_bank_id}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-brand-gray/50">-</span>
                  )}
                </td>
                <td className="p-2.5">
                  <span className={`inline-block px-2 py-0.2 rounded border text-[9px] font-bold ${
                    drug.approval_status === 'Approved'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-655 text-emerald-600'
                      : 'bg-amber-50 border-amber-200 text-amber-600'
                  }`}>
                    {drug.approval_status}
                  </span>
                </td>
                <td className="p-2.5 text-brand-gray">{drug.type || 'Small Molecule'}</td>
                <td className="p-2.5 pr-4 font-mono text-[9px] text-brand-gray/50">{drug.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
export default DrugPanel;
