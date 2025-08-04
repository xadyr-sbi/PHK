'use client'

import { useState } from 'react';

const reasons = [
  'Penggabungan perusahaan',
  'Pengambil alihan perusahaan',
  'Efisiensi mengalami kerugian',
  'Efisiensi mencegah kerugian',
  'Perusahaan tutup rugi',
  'Perusahaan tutup bukan rugi',
  'Force majeure tutup',
  'Force majeure tidak tutup',
  'PKPU rugi',
  'PKPU bukan rugi',
  'Perusahaan pailit',
  'Permohonan PHK pasal 36 G',
  'Putusan tidak melakukan perbuatan 36 G',
  'Resign',
  'Mangkir 5 hari',
  'Pelanggaran SP',
  'Pelanggaran mendesak',
  'Tahanan pidana gugur',
  'Tahanan pidana tidak rugi',
  'Sakit berkepanjangan',
  'Usia pensiun',
  'Meninggal dunia'
];

export default function Home() {
  const [gaji, setGaji] = useState('');
  const [masuk, setMasuk] = useState('');
  const [keluar, setKeluar] = useState('');
  const [uph, setUph] = useState('');
  const [cuti, setCuti] = useState('');
  const [reason, setReason] = useState(reasons[0]);
  const [result, setResult] = useState<any[]>([]);

  const calculate = () => {
    const gp = parseFloat(gaji) || 0;
    const join = new Date(masuk);
    const leave = new Date(keluar);
    
    // Calculate exact years of service
    const diffMs = leave.getTime() - join.getTime();
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    
    // Calculate UP based on PP 35/2021
    let bulanUpah = 0;
    if (years < 1) bulanUpah = 1;
    else if (years <= 8) bulanUpah = years + 1;
    else bulanUpah = 9;

    // Calculate UPMK based on PP 35/2021
    let upmk = 0;
    if (years >= 3 && years < 6) upmk = 2;
    else if (years >= 6 && years < 9) upmk = 3;
    else if (years >= 9 && years < 12) upmk = 4;
    else if (years >= 12 && years < 15) upmk = 5;
    else if (years >= 15 && years < 18) upmk = 6;
    else if (years >= 18 && years < 21) upmk = 7;
    else if (years >= 21 && years < 24) upmk = 8;
    else if (years >= 24) upmk = 10;

    const up = bulanUpah * gp;
    const upmkVal = upmk * gp;
    const uphVal = parseFloat(uph) || 0;
    const cutiVal = parseFloat(cuti) || 0;

    const detail = [
      { label: 'Gaji Pokok', value: gp.toLocaleString('id-ID') },
      { label: 'Masa Kerja', value: `${years} tahun ${months} bulan ${days} hari` },
      { label: 'Uang Pesangon (UP)', value: `${bulanUpah} x ${gp.toLocaleString('id-ID')} = ${up.toLocaleString('id-ID')}` },
      { label: 'Uang Penghargaan Masa Kerja (UPMK)', value: `${upmk} x ${gp.toLocaleString('id-ID')} = ${upmkVal.toLocaleString('id-ID')}` },
      { label: 'Uang Penggantian Hak (UPH)', value: uphVal.toLocaleString('id-ID') },
      { label: 'Sisa Cuti', value: cutiVal.toLocaleString('id-ID') },
      { 
        label: 'Total Pesangon', 
        value: (up + upmkVal + uphVal + cutiVal).toLocaleString('id-ID'),
        isTotal: true 
      }
    ];
    
    setResult(detail);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Hitung Pesangon PHK</h1>
      <p className="text-center mb-4 font-semibold">PP 35 Tahun 2021</p>
      <div className="space-y-4">
        <div>
          <label>Gaji Pokok + Tunjangan Tetap</label>
          <input 
            type="number" 
            className="w-full border rounded p-2" 
            value={gaji} 
            onChange={e => setGaji(e.target.value)} 
            placeholder="Rp"
          />
        </div>
        <div>
          <label>Tanggal Masuk</label>
          <input 
            type="date" 
            className="w-full border rounded p-2" 
            value={masuk} 
            onChange={e => setMasuk(e.target.value)} 
          />
        </div>
        <div>
          <label>Tanggal Keluar</label>
          <input 
            type="date" 
            className="w-full border rounded p-2" 
            value={keluar} 
            onChange={e => setKeluar(e.target.value)} 
          />
        </div>
        <div>
          <label>Uang Penggantian Hak (UPH)</label>
          <input 
            type="number" 
            className="w-full border rounded p-2" 
            value={uph} 
            onChange={e => setUph(e.target.value)} 
            placeholder="Rp"
          />
        </div>
        <div>
          <label>Sisa Cuti (dalam rupiah)</label>
          <input 
            type="number" 
            className="w-full border rounded p-2" 
            value={cuti} 
            onChange={e => setCuti(e.target.value)} 
            placeholder="Rp"
          />
        </div>
        <div>
          <label>Alasan PHK</label>
          <select 
            className="w-full border rounded p-2" 
            value={reason} 
            onChange={e => setReason(e.target.value)}
          >
            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button 
          onClick={calculate} 
          className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700 transition"
        >
          Hitung Pesangon
        </button>
      </div>
      {result.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Hasil Perhitungan</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Komponen</th>
                <th className="border p-2 text-right">Nilai (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {result.map((row, i) => (
                <tr 
                  key={i} 
                  className={row.isTotal ? 'bg-blue-50 font-bold' : ''}
                >
                  <td className="border p-2">{row.label}</td>
                  <td className="border p-2 text-right">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
