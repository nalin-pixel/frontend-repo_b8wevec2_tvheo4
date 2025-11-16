import { useState } from 'react';

export default function Uploader({ token, onUploaded }){
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('paystub');
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const base = import.meta.env.VITE_BACKEND_URL;

  async function upload(){
    if(!file) return;
    setLoading(true); setError('');
    try{
      const form = new FormData();
      form.append('doc_type', docType);
      form.append('month', String(month));
      form.append('year', String(year));
      form.append('file', file);
      const r = await fetch(`${base}/documents/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
      if(!r.ok) throw new Error('שגיאה בהעלאה');
      await r.json();
      onUploaded?.();
    }catch(e){ setError(e.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-3">
      <div className="font-semibold">העלאת מסמך</div>
      <div className="grid md:grid-cols-4 gap-2">
        <select className="border rounded px-2 py-1" value={docType} onChange={e=>setDocType(e.target.value)}>
          <option value="paystub">תלוש שכר</option>
          <option value="bank">דף בנק</option>
          <option value="credit">כרטיס אשראי</option>
          <option value="loan">הלוואה</option>
        </select>
        <select className="border rounded px-2 py-1" value={month} onChange={e=>setMonth(Number(e.target.value))}>
          {Array.from({length:12}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
        <select className="border rounded px-2 py-1" value={year} onChange={e=>setYear(Number(e.target.value))}>
          {Array.from({length:5}).map((_,i)=> { const y = new Date().getFullYear()-2+i; return <option key={y} value={y}>{y}</option>})}
        </select>
        <input type="file" className="border rounded px-2 py-1" onChange={e=>setFile(e.target.files?.[0])} />
      </div>
      {error && <div className="text-red-700 text-sm">{error}</div>}
      <button disabled={!file||loading} onClick={upload} className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">{loading?'מעלה...':'העלה'}</button>
    </div>
  );
}
