const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/pages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const pageData = await prisma.page.findUnique({
      where: { slug: slug }, // 'selayang-pandang'
    });

    if (!pageData) {
      // Kembalikan objek kosong atau pesan jika data belum ada (Empty State)
      return res.status(200).json(null);
    }

    res.json(pageData);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data halaman", error });
  }
});

// Ambil semua data Kecamatan
app.get("/api/kecamatan", async (req, res) => {
  try {
    const dataKecamatan = await prisma.kecamatan.findMany({
      orderBy: { title: "asc" }, // Mengurutkan berdasarkan abjad A-Z
    });
    res.json(dataKecamatan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data kecamatan", error });
  }
});

// Ambil data PNS statis (biasanya hanya 1 row pertama)
app.get("/api/datapns", async (req, res) => {
  try {
    const data = await prisma.dataPNS.findFirst();
    if (!data) {
      return res.status(200).json(null); // Return null jika database kosong
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data PNS", error });
  }
});

// Ambil seluruh data anggaran, urutkan berdasarkan tahun
app.get("/api/realisasi-anggaran", async (req, res) => {
  try {
    const data = await prisma.realisasiAnggaran.findMany({
      orderBy: { year: "asc" }, // Pastikan data selalu urut dari tahun terkecil
    });

    // Jika amount menggunakan BigInt di Prisma, kita perlu konversi ke string
    // agar bisa di-serialize menjadi JSON dengan benar.
    const formattedData = data.map((item) => ({
      year: item.year,
      amount: item.amount.toString(),
    }));

    res.json(formattedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data Realisasi Anggaran", error });
  }
});

// Ambil semua daftar perangkat daerah
app.get("/api/perangkat", async (req, res) => {
  try {
    const data = await prisma.perangkat.findMany({
      orderBy: { name: "asc" }, // Urutkan berdasarkan nama A-Z
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data perangkat", error });
  }
});

// ==========================================
// 1. ENDPOINT PUBLIC (Untuk Halaman Utama Web)
// ==========================================

// Ambil semua pimpinan aktif
app.get("/api/pimpinan", async (req, res) => {
  try {
    const data = await prisma.pimpinan.findMany({
      where: { isActive: true },
      orderBy: { urutan: "asc" },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error });
  }
});

// ==========================================
// 2. ENDPOINT ADMIN (Untuk Dashboard Admin Nanti)
// ==========================================

// [CREATE] Tambah Pimpinan Baru dari Dashboard Admin
app.post("/api/admin/pimpinan", async (req, res) => {
  try {
    const { namaLengkap, jabatan, periode, fotoUrl, bio, urutan } = req.body;
    const newLeader = await prisma.pimpinan.create({
      data: {
        namaLengkap,
        jabatan,
        periode,
        fotoUrl,
        bio,
        urutan: parseInt(urutan) || 0,
      },
    });
    res
      .status(201)
      .json({ message: "Data pimpinan berhasil ditambahkan", data: newLeader });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah data", error });
  }
});

// [UPDATE] Edit Pimpinan dari Dashboard Admin
app.put("/api/admin/pimpinan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { namaLengkap, jabatan, periode, fotoUrl, bio, urutan, isActive } =
      req.body;

    const updatedLeader = await prisma.pimpinan.update({
      where: { id: parseInt(id) },
      data: { namaLengkap, jabatan, periode, fotoUrl, bio, urutan, isActive },
    });

    res.json({ message: "Data berhasil diperbarui", data: updatedLeader });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui data", error });
  }
});

// [DELETE] Hapus Pimpinan dari Dashboard Admin
app.delete("/api/admin/pimpinan/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pimpinan.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus data", error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server backend siap di http://localhost:${PORT}`);
});
