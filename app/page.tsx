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
  'Permohonan PHK pasal 36 huruf g',
  'Putusan tidak melakukan perbuatan pasal 36 huruf g',
  'Resign',
  'Mangkir 5 hari kerja',
  'Pelanggaran berat dalam SP 1',
  'Pelanggaran berat dalam SP 2',
  'Pelanggaran mendesak',
  'Tahanan pidana gugur hak',
  'Tahanan pidana tidak gugur hak',
  'Sakit berkepanjangan > 12 bulan',
  'Usia pensiun',
  'Meninggal dunia'
];

// mapping alasan → faktor kompensasi sesuai PP 35/2021
const factorMap: Record<string, 1 | 0.5 | 0> = {
  // 100 %
  'Penggabungan perusahaan': 1,
  'Pengambil alihan perusahaan': 1,
  'Efisiensi mengalami kerugian': 1,
  'Efisiensi mencegah kerugian': 1,
  'Perusahaan tutup rugi': 1,
  'Force majeure tutup': 1,
  'PKPU rugi': 1,
  'Perusahaan pailit': 1,
  'Permohonan PHK pasal 36 huruf g': 1,
  'Sakit berkepanjangan > 12 bulan': 1,
  'Usia pensiun': 1,
  'Meninggal dunia': 1,

  // 50 %
  'Perusahaan tutup bukan rugi': 0.5,
  'Force majeure tidak tutup': 0.5,
  'PKPU bukan rugi': 0.5,

  // 0 %
  Resign: 0,
  'Mangkir 5 hari kerja': 0,
  'Pelanggaran berat dalam SP 1': 0,
  'Pelanggaran berat dalam SP 2': 0,
  'Pelanggaran mendesak': 0,
  'Tahanan pidana gugur hak': 0,
  'Tahanan pidana tidak gugur hak': 0,
  'Putusan tidak melakukan perbuatan pasal 36 huruf g': 0
};

type DetailRow = { label: string; value: string; isTotal?: true };

export default function Home() {
  const [gaji, setGaji] = useState('');
  const [masuk, setMasuk] = useState('');
  const [keluar, setKeluar] = useState('');
  const [uph, setUph] = useState('');
  const [cutiHari, setCutiHari] = useState('');
  const [reason, setReason] = useState(reasons[0]);
  const [result, setResult] = useState<DetailRow[]>([]);

  const calculate = () => {
    const gp = parseFloat(gaji) || 0;
    const join = new Date(masuk);
    const leave = new Date(keluar);

    const diffMs = leave.getTime() - join.getTime();
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));

    // UP
    let bulanUpah = 0;
    if (years < 1) bulanUpah = 1;
    else if (years <= 8) bulanUpah = years + 1;
    else bulanUpah = 9;

    // UPMK
    let upmk = 0;
    if (years >= 3 && years < 6) upmk = 2;
    else if (years >= 6 && years < 9) upmk = 3;
    else if (years >= 9 && years < 12) upmk = 4;
    else if (years >= 12 && years < 15) upmk = 5;
    else if (years >= 15 && years < 18) upmk = 6;
    else if (years >= 18 && years < 21) upmk = 7;
    else if (years >= 21 && years < 24) upmk = 8;
    else if (years >= 24) upmk = 10;

    const compensationFactor = factorMap[reason] ?? 0;

    const up = bulanUpah * gp * compensationFactor;
    const upmkVal = upmk * gp * compensationFactor;
    const uphVal = parseFloat(uph) || 0;
    const hariCuti = parseInt(cutiHari) || 0;
    const nilaiCuti = hariCuti * (gp / 25);

    const detail: DetailRow[] = [
      { label: 'Gaji Pokok + Tunjangan Tetap', value: gp.toLocaleString('id-ID') },
      { label: 'Masa Kerja', value: `${years} tahun ${months} bulan ${days} hari` },
      { label: 'Alasan PHK', value: reason },
      {
        label: 'Faktor Kompensasi',
        value: compensationFactor === 0 ? 'Tidak berhak' : `${compensationFactor * 100}%`
      }
    ];

    if (compensationFactor > 0) {
      detail.push(
        { label: 'Uang Pesangon (UP)', value: `${bulanUpah} × ${gp.toLocaleString('id-ID')} × ${compensationFactor} = ${up.toLocaleString('id-ID')}` },
        { label: 'UPMK', value: `${upmk} × ${gp.toLocaleString('id-ID')} × ${compensationFactor} = ${upmkVal.toLocaleString('id-ID')}` }
      );
    }

    detail.push(
      { label: 'Uang Penggantian Hak (UPH)', value: uphVal.toLocaleString('id-ID') },
      { label: 'Sisa Cuti', value: `${hariCuti} hari × (${gp.toLocaleString('id-ID')} ÷ 25) = ${nilaiCuti.toLocaleString('id-ID')}` },
      { label: 'Total Pesangon', value: (up + upmkVal + uphVal + nilaiCuti).toLocaleString('id-ID'), isTotal: true }
    );

    setResult(detail);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold text-center">Hitung Pesangon PHK</h1>
      <p className="text-center mb-4 font-semibold">PP 35 Tahun 2021</p>
      <p className="text-center text-sm text-gray-600 mb-4">SBTP-FSBI</p>

      <div className="space-y-4">
        <div>
          <label>Gaji Pokok + Tunjangan Tetap (Rp)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={gaji}
            onChange={e => setGaji(e.target.value)}
            placeholder="0"
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
          <label>Uang Penggantian Hak (UPH) (Rp)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={uph}
            onChange={e => setUph(e.target.value)}
            placeholder="0"
          />
        </div>

        <div>
          <label>Sisa Hari Cuti</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={cutiHari}
            onChange={e => setCutiHari(e.target.value)}
            placeholder="0"
          />
        </div>

        <div>
          <label>Alasan PHK</label>
          <select
            className="w-full border rounded p-2"
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            {reasons.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
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
                <tr key={i} className={row.isTotal ? 'bg-blue-50 font-bold' : ''}>
                  <td className="border p-2">{row.label}</td>
                  <td className="border p-2 text-right">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
