import fotoBupati from "../assets/contoh-foto-orang.png";
import fotoWabup from "../assets/contoh-foto-orang.png";
import fotoSekda from "../assets/contoh-foto-orang.png";

export const leadersData = [
  {
    id: 1,
    role: "Bupati",
    name: "Ade Kuswara Kunang, S.H.",
    birthDate: "15 Agustus 1993",
    period: "2025 - 2030",
    bio: "Ade Kuswara Kunang, S.H. (lahir 15 Agustus 1993) adalah seorang politikus dari Partai Demokrasi Indonesia Perjuangan (PDI-P) yang menjabat sebagai Bupati Bekasi periode 2025-2030. Ia resmi dilantik pada 20 Februari 2025 oleh Presiden Prabowo Subianto di Istana Negara, Jakarta.",
    buttonText: "Riwayat Pendidikan & Karir",
    photo: fotoBupati,
    extraInfo: [
      {
        title: "Riwayat Pendidikan",
        items: [
          "SD Negeri Sukadami 03",
          "SMP Negeri 1 Cikarang Selatan",
          "SMA Negeri 1 Cikarang Selatan",
          "Sarjana Hukum dari Universitas Presiden"
        ]
      },
      {
        title: "Karir Politik",
        items: [
          "Anggota DPRD Kab. Bekasi periode 2019-2024 (Fraksi PDI-P).",
          "Anggota DPRD Kab. Bekasi periode 2024-2029 (Fraksi PDI-P)."
        ]
      }
    ]
  },
  {
    id: 2,
    role: "Wakil Bupati",
    name: "dr. Asep Surya Atmaja",
    birthDate: "22 Juni 1976",
    period: "2025 - 2030",
    bio: "dr. Asep Surya Atmaja (lahir 22 Juni 1976) adalah seorang dokter dan politikus asal Kabupaten Bekasi yang kini menjabat sebagai Wakil Bupati Bekasi periode 2025-2030. Ia merupakan adik kandung dari almarhum Eka Supria Atmaja, Bupati Bekasi periode 2019-2021.",
    buttonText: "Riwayat Pendidikan & Karir",
    photo: fotoWabup,
    extraInfo: [
      {
        title: "Riwayat Pendidikan",
        items: [
          "SD Negeri Sukadami 03",
          "SMP Negeri 1 Cikarang Selatan",
          "SMA Negeri 1 Cikarang Selatan",
          "S1-Sarjana Hukum dari Universitas Presiden"
        ]
      },
      {
        title: "Karir Politik",
        items: [
          "Anggota DPRD Kabupaten Bekasi dari Partai Golkar (dapil Bekasi 6).",
          "Anggota Komisi IV DPRD (bidang pendidikan, ketenagakerjaan, sosial, kesehatan).",
          "Ketua Fraksi Golkar DPRD Kabupaten Bekasi."
        ]
      }
    ]
  },
  {
    id: 3,
    role: "Sekretaris Daerah",
    name: "Drs. H. Endin Samsudin, M.Si.",
    birthDate: "-",
    period: "2025 - 2030",
    bio: "Menjabat sebagai Sekretaris Daerah Kabupaten Bekasi, bertugas membantu Bupati dalam menyusun kebijakan dan mengkoordinasikan dinas daerah serta lembaga teknis daerah.",
    buttonText: "Riwayat Pangkat & Diklat",
    photo: fotoSekda,
    extraInfo: [
      {
        title: "Riwayat Pendidikan Formal",
        items: [
          "SD Negeri Sukadami 01",
          "MTs AL BAQIYATUSSHOLIHAT Kab. Bekasi",
          "SMA Negeri 1 Cikarang Utara",
          "D4-STPDN",
          "S1-Administrasi Manajemen Keuangan dari IIP",
          "S2-STIA YAPPANN"
        ]
      },
      {
        title: "Riwayat Kepangkatan Terakhir",
        items: [
          "Gol. IV/a (01-04-2012) - SK: 823/Kep.413-BKD/2012",
          "Gol. IV/b (01-04-2016) - SK: 823.4/Kep.300-BKD/2016",
          "Gol. IV/c (01-04-2021) - SK: 00003/KEP/AA/15001/21",
          "Gol. IV/d (01-01-2026) - SK: 00715/KEP/AA/15001/25"
        ]
      }
    ]
  }
];

export const loopingLeaders = [...leadersData, ...leadersData, ...leadersData, ...leadersData];