'use client'

import { useState } from 'react';

/* ---------- 1. Daftar alasan PHK & faktor kompensasi (PP 35/2021) ---------- */
const reasons = [
  'Perusahaan melakukan efisiensi karena mengalami kerugian',
  'Perusahaan melakukan efisiensi untuk mencegah kerugian',
  'Perusahaan tutup karena mengalami kerugian',
  'Perusahaan tutup bukan karena mengalami kerugian',
  'Perusahaan tutup karena force majeure',
  'Terjadi force majeure yang tidak mengakibatkan perusahaan tutup',
  'Perusahaan dalam keadaan PKPU karena mengalami kerugian',
  'Perusahaan dalam keadaan PKPU bukan karena mengalami kerugian',
  'Perusahaan mengalami pailit',
  'Pekerja mengajukan PHK karena pengusaha melakukan perbuatan Pasal 36 huruf G',
  'Putusan Lembaga PHI menyatakan pengusaha tidak melakukan perbuatan Pasal 36 huruf G',
  'Pekerja mengundurkan diri atas kemauan sendiri',
  'Pekerja mangkir ≥ 5 hari kerja berturut-turut tanpa keterangan tertulis',
  'Pekerja melanggar PK/PP/PKB setelah diberi SP-1, SP-2, SP-3',
  'Pekerja melanggar bersifat mendesak sesuai PK/PP/PKB',
  'Pekerja ditahan 6 bulan karena tindak pidana Pasal 36 huruf I dan merugikan perusahaan',
  'Pekerja ditahan 6 bulan karena tindak pidana Pasal 36 huruf I tanpa merugikan perusahaan',
  'Pekerja sakit berkepanjangan atau cacat akibat kecelakaan kerja > 12 bulan',
  'Pekerja memasuki usia pensiun',
  'Pekerja meninggal dunia'
] as const;

/* Mapping alasan → faktor kompensasi */
const factorMap: Record<string, number> = {
  'Perusahaan melakukan efisiensi karena mengalami kerugian': 0.5,
  'Perusahaan melakukan efisiensi untuk mencegah kerugian': 1.0,
  'Perusahaan tutup karena mengalami kerugian': 0.5,
  'Perusahaan tutup bukan karena mengalami kerugian': 1.0,
  'Perusahaan tutup karena force majeure': 0.5,
  'Terjadi force majeure yang tidak mengakibatkan perusahaan tutup': 0.75,
  'Perusahaan dalam keadaan PKPU karena mengalami kerugian': 0.5,
  'Perusahaan dalam keadaan PKPU bukan karena mengalami kerugian': 1.0,
  'Perusahaan mengalami pailit': 0.5,
  'Pekerja mengajukan PHK karena pengusaha melakukan perbuatan Pasal 36 huruf G': 1.0,
  'Putusan Lembaga PHI menyatakan pengusaha tidak melakukan perbuatan Pasal 36 huruf G': 0,
  'Pekerja mengundurkan diri atas kemauan sendiri': 0,
  'Pekerja mangkir ≥ 5 hari kerja berturut-turut tanpa keterangan tertulis': 0,
  'Pekerja melanggar PK/PP/PKB setelah diberi SP-1, SP-2, SP-3': 0.5,
  'Pekerja melanggar bersifat mendesak sesuai PK/PP/PKB': 0,
  'Pekerja ditahan 6 bulan karena tindak pidana Pasal 36 huruf I dan merugikan perusahaan': 0,
  'Pekerja ditahan 6 bulan karena tindak pidana Pasal 36 huruf I tanpa merugikan perusahaan': 0,
  'Pekerja sakit berkepanjangan atau cacat akibat kecelakaan kerja > 12 bulan': 2.0,
  'Pekerja memasuki usia pensiun': 1.75,
  'Pekerja meninggal dunia': 2.0
};

type DetailRow = { label: string; value: string; isTotal?: true };

export default function Home() {
  const [gaji, setGaji] = useState('');
  const [masuk, setMasuk] = useState('');
  const [keluar, setKeluar] = useState('');
  const [uph, setUph] = useState('');
  const [cutiHari, setCutiHari] = useState('');
  const [reason, setReason] = useState<string>(reasons[0]);
  const [result, setResult] = useState<DetailRow[]>([]);

  const calculate = () => {
    const gp = parseFloat(gaji) || 0;
    const join = new Date(masuk);
    const leave = new Date(keluar);

    const diffMs = leave.getTime() - join.getTime();
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));

    let bulanUpah = 0;
    if (years < 1) bulanUpah = 1;
    else if (years <= 8) bulanUpah = years + 1;
    else bulanUpah = 9;

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
      { label: 'Faktor Kompensasi', value: `${(compensationFactor * 100).toFixed(2).replace('.00', '')}%` }
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
      <p className="text-center mb-1 font-semibold">PP 35 Tahun 2021</p>
      <p className="text-center text-base font-extrabold tracking-wide text-gray-800">SBTP-FSBI</p>

      <div className="space-y-4 mt-4">
        <div>
          <label>Gaji Pokok + Tunjangan Tetap (Rp)</label>
          <input type="number" className="w-full border rounded p-2" value={gaji} onChange={e => setGaji(e.target.value)} placeholder="0" />
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
          <label>Uang Penggantian Hak (UPH) (Rp)</label>
          <input type="number" className="w-full border rounded p-2" value={uph} onChange={e => setUph(e.target.value)} placeholder="0" />
        </div>

        <div>
          <label>Sisa Hari Cuti</label>
          <input type="number" className="w-full border rounded p-2" value={cutiHari} onChange={e => setCutiHari(e.target.value)} placeholder="0" />
        </div>

        <div>
          <label>Alasan PHK</label>
          <select className="w-full border rounded p-2" value={reason} onChange={e => setReason(e.target.value)}>
            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <button onClick={calculate} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
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
