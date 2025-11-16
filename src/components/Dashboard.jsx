import { useEffect, useMemo, useState } from 'react';

function number(n){return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS'}).format(n||0)}

export default function Dashboard({ token }){
  const [month, setMonth] = useState(new Date().getMonth()+1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState(null);
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState('');
  const base = import.meta.env.VITE_BACKEND_URL;

  async function load(){
    try{
      setError('');
      const s = await fetch(`${base}/summary?month=${month}&year=${year}`, { headers: { Authorization: `Bearer ${token}` }});
      if(!s.ok) throw new Error('שגיאה בסיכום');
      setSummary(await s.json());
      const t = await fetch(`${base}/transactions?month=${month}&year=${year}`, { headers: { Authorization: `Bearer ${token}` }});
      if(!t.ok) throw new Error('שגיאה בנתוני התנועות');
      const tjson = await t.json();
      setTxs(tjson.items || []);
    }catch(e){ setError(e.message) }
  }

  useEffect(()=>{ load() }, [month, year]);

  const byCategory = useMemo(()=> summary?.by_category || [], [summary]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">לוח מחוונים</h2>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-1" value={month} onChange={e=>setMonth(Number(e.target.value))}>
            {Array.from({length:12}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <select className="border rounded px-2 py-1" value={year} onChange={e=>setYear(Number(e.target.value))}>
            {Array.from({length:5}).map((_,i)=> {
              const y = new Date().getFullYear()-2+i; return <option key={y} value={y}>{y}</option>
            })}
          </select>
          <button onClick={load} className="bg-blue-600 text-white rounded px-3 py-1">רענן</button>
        </div>
      </div>

      {error && <div className="text-red-700">{error}</div>}

      {summary && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-gray-500">הכנסות</div>
            <div className="text-2xl font-bold text-emerald-600">{number(summary.income)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-gray-500">הוצאות</div>
            <div className="text-2xl font-bold text-rose-600">{number(summary.expense)}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-gray-500">נטו</div>
            <div className={`text-2xl font-bold ${summary.net>=0?'text-emerald-700':'text-rose-700'}`}>{number(summary.net)}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">חלוקה לפי קטגוריות</div>
        <div className="grid md:grid-cols-3 gap-2">
          {byCategory.map((c)=> (
            <div key={c.category} className="flex items-center justify-between border rounded px-3 py-2">
              <span>{c.category}</span>
              <span className={`font-medium ${c.total>=0?'text-emerald-600':'text-rose-600'}`}>{number(c.total)}</span>
            </div>
          ))}
          {!byCategory.length && <div className="text-gray-500">אין נתונים לתקופה זו</div>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-auto">
        <div className="font-semibold mb-2">תנועות</div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-left">
              <th className="p-2">תאריך</th>
              <th className="p-2">תיאור</th>
              <th className="p-2">קטגוריה</th>
              <th className="p-2">סכום</th>
              <th className="p-2">מקור</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(tx => (
              <tr key={tx._id} className="border-t">
                <td className="p-2">{tx.date}</td>
                <td className="p-2">{tx.description}</td>
                <td className="p-2">{tx.category}</td>
                <td className={`p-2 ${tx.amount>=0?'text-emerald-700':'text-rose-700'}`}>{number(tx.amount)}</td>
                <td className="p-2">{tx.source}</td>
              </tr>
            ))}
            {!txs.length && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">אין תנועות להצגה</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
