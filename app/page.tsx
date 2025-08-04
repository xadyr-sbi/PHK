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
  const [tunjangan, setTunjangan] = useState('');
  const [masuk, setMasuk] = useState('');
  const [keluar, setKeluar] = useState('');
  const [uph, setUph] = useState('');
  const [cuti, setCuti] = useState(0);
  const [reason, setReason] = useState(reasons[0]);
  const [result, setResult] = useState<any[]>([]);

  const calculate = () => {
    const gp = parseFloat(gaji) + parseFloat(tunjangan);
    const join = new Date(masuk);
    const leave = new Date(keluar);
    const years = Math.floor((leave.getTime() - join.getTime()) / (1000*60*60*24*365));
    const bulanUpah = Math.min(years + 1, 9); // max 9 based on aturan
    const up = bulanUpah * gp;
    const upmk = years >= 3 ? ((years < 6 ? 2 : years < 9 ? 3 : years < 12 ? 4 : years < 15 ? 5 : years < 18 ? 6 : years < 21 ? 7 : years < 24 ? 8 : 10) * gp) : 0;
    const hakCuti = parseFloat(gaji) / 25;
    const uphVal = parseFloat(uph);
    const detail = [
      { label: 'Gaji Pokok + Tunjangan', value: gp.toLocaleString() },
      { label: 'Uang Pesangon (UP)', value: up.toLocaleString() },
      { label: 'Uang Penghargaan Masa Kerja (UPMK)', value: upmk.toLocaleString() },
      { label: 'Uang Penggantian Hak (UPH)', value: uphVal.toLocaleString() },
      { label: 'Sisa Cuti (1/25 gaji)', value: hakCuti.toLocaleString(undefined, {maximumFractionDigits:2}) }
    ];
    setResult(detail);
    setCuti(hakCuti);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Hitung Pesangon PHK</h1>
      <p className="text-center mb-4 font-semibold">SBTP-FSBI</p>
      <div className="space-y-4">
        <div>
          <label>Gaji Pokok + Tunjangan tetap</label>
          <input type="number" className="w-full border rounded p-2" value={gaji} onChange={e => setGaji(e.target.value)} />
        </div>
        <div>
          <label>Tunjangan tetap</label>
          <input type="number" className="w-full border rounded p-2" value={tunjangan} onChange={e => setTunjangan(e.target.value)} />
        </div>
        <div>
          <label>Tanggal Masuk</label>
          <input type="date" className="w-full border rounded p-2" value={masuk} onChange={e => setMasuk(e.target.value)} />
        </div>
        <div>
          <label>Tanggal Keluar</label>
          <input type="date" className="w-full border rounded p-2" value={keluar} onChange={e => setKeluar(e.target.value)} />
        </div>
        <div>
          <label>UPH</label>
          <input type="number" className="w-full border rounded p-2" value={uph} onChange={e => setUph(e.target.value)} />
        </div>
        <div>
          <label>Sisa Cuti</label>
          <input type="number" className="w-full border rounded p-2 bg-gray-100" value={cuti} readOnly />
        </div>
        <div>
          <label>Alasan PHK</label>
          <select className="w-full border rounded p-2" value={reason} onChange={e => setReason(e.target.value)}>
            {reasons.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={calculate} className="w-full bg-blue-600 text-white p-2 rounded mt-4">Hitung Pesangon</button>
      </div>
      {result.length > 0 && (
        <table className="w-full mt-6 table-auto">
          <thead>
            <tr>
              <th className="border p-2">Keterangan</th>
              <th className="border p-2">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {result.map((row, i) => (
              <tr key={i}>
                <td className="border p-2">{row.label}</td>
                <td className="border p-2">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
