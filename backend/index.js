const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Inisialisasi Express & Prisma
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Rahasia untuk token JWT
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_default_dev_123";

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Otomatis membuat folder "uploads" jika belum ada
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware Dasar
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// 1. ENDPOINT AUTH & MIDDLEWARE
// ==========================================
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email: email } });
    if (!admin)
      return res.status(401).json({ message: "Email atau kata sandi salah." });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Email atau kata sandi salah." });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login berhasil",
      token: token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal melakukan proses login", error });
  }
});

// Middleware untuk mengunci rute Admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak ditemukan." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Sesi telah habis atau token tidak valid." });
    req.user = user;
    next();
  });
};

// ==========================================
// 2. ENDPOINT PUBLIC (Untuk Halaman Utama Web)
// ==========================================
app.get("/api/pages/:slug", async (req, res) => {
  try {
    const pageData = await prisma.page.findUnique({
      where: { slug: req.params.slug },
    });
    if (!pageData) return res.status(200).json(null);
    res.json(pageData);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/api/kecamatan", async (req, res) => {
  try {
    res.json(await prisma.kecamatan.findMany({ orderBy: { title: "asc" } }));
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/api/datapns", async (req, res) => {
  try {
    const data = await prisma.dataPNS.findFirst();
    if (!data) return res.status(200).json(null);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/api/realisasi-anggaran", async (req, res) => {
  try {
    const data = await prisma.realisasiAnggaran.findMany({
      orderBy: { year: "asc" },
    });
    res.json(
      data.map((item) => ({ year: item.year, amount: item.amount.toString() })),
    );
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/api/perangkat", async (req, res) => {
  try {
    res.json(await prisma.perangkat.findMany({ orderBy: { name: "asc" } }));
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.get("/api/pimpinan", async (req, res) => {
  try {
    res.json(
      await prisma.pimpinan.findMany({
        where: { isActive: true },
        orderBy: { urutan: "asc" },
      }),
    );
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// ==========================================
// 3. ENDPOINT ADMIN (Dengan Gembok authenticateAdmin)
// ==========================================

// Konfigurasi penyimpanan foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // Memberi nama unik pada foto dengan tanggal/waktu + ekstensi aslinya
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Endpoint Khusus Upload Gambar
app.post(
  "/api/admin/upload",
  authenticateAdmin,
  upload.single("image"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "Tidak ada file yang diunggah" });

    // Mengembalikan URL foto yang baru saja diupload
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  },
);

// --- CRUD PIMPINAN ---
app.post("/api/admin/pimpinan", authenticateAdmin, async (req, res) => {
  try {
    const {
      namaLengkap,
      jabatan,
      periode,
      fotoUrl,
      bio,
      urutan,
      isActive,
      tempatTanggalLahir,
      riwayatPendidikan,
      karirPolitik,
      riwayatPangkat,
      riwayatDiklat,
    } = req.body;

    const newPimpinan = await prisma.pimpinan.create({
      data: {
        namaLengkap: namaLengkap,
        jabatan: jabatan,
        periode: periode || "",
        fotoUrl: fotoUrl || "",
        bio: bio || "",
        urutan: urutan ? parseInt(urutan) : 0, // Dipaksa menjadi angka (Integer)
        isActive: isActive !== undefined ? Boolean(isActive) : true, // Dipaksa menjadi Boolean
        tempatTanggalLahir: tempatTanggalLahir || "",
        riwayatPendidikan: riwayatPendidikan || "",
        karirPolitik: karirPolitik || "",
        riwayatPangkat: riwayatPangkat || "",
        riwayatDiklat: riwayatDiklat || "",
      },
    });

    res.status(201).json(newPimpinan);
  } catch (error) {
    // Ini akan mencetak alasan detail error di terminal jika masih gagal
    console.error("DETAIL ERROR POST PIMPINAN:", error);
    res
      .status(500)
      .json({ message: "Gagal menambah data pimpinan", error: error.message });
  }
});

app.put("/api/admin/pimpinan/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      namaLengkap,
      jabatan,
      periode,
      fotoUrl,
      bio,
      urutan,
      isActive,
      tempatTanggalLahir,
      riwayatPendidikan,
      karirPolitik,
      riwayatPangkat,
      riwayatDiklat,
    } = req.body;

    const updatedPimpinan = await prisma.pimpinan.update({
      where: { id: Number(id) },
      data: {
        namaLengkap,
        jabatan,
        periode: periode || "",
        fotoUrl: fotoUrl || "",
        bio: bio || "",
        urutan: urutan ? parseInt(urutan) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        tempatTanggalLahir: tempatTanggalLahir || "",
        riwayatPendidikan: riwayatPendidikan || "",
        karirPolitik: karirPolitik || "",
        riwayatPangkat: riwayatPangkat || "",
        riwayatDiklat: riwayatDiklat || "",
      },
    });

    res.status(200).json(updatedPimpinan);
  } catch (error) {
    console.error("DETAIL ERROR PUT PIMPINAN:", error);
    res.status(500).json({
      message: "Gagal mengupdate data pimpinan",
      error: error.message,
    });
  }
});

app.delete("/api/admin/pimpinan/:id", authenticateAdmin, async (req, res) => {
  try {
    await prisma.pimpinan.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Data dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// --- CRUD HALAMAN (PAGES) ---
app.post("/api/admin/pages", authenticateAdmin, async (req, res) => {
  try {
    const { title, slug, content, image } = req.body;
    const newPage = await prisma.page.create({
      data: { title, slug, content, image },
    });
    res.status(201).json({ message: "Halaman ditambahkan", data: newPage });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.put("/api/admin/pages/:id", authenticateAdmin, async (req, res) => {
  try {
    const { title, slug, content, image } = req.body;
    const updatedPage = await prisma.page.update({
      where: { id: parseInt(req.params.id) },
      data: { title, slug, content, image },
    });
    res.json({ message: "Halaman diperbarui", data: updatedPage });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.delete("/api/admin/pages/:id", authenticateAdmin, async (req, res) => {
  try {
    await prisma.page.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Halaman dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// --- CRUD KECAMATAN ---
app.post("/api/admin/kecamatan", authenticateAdmin, async (req, res) => {
  try {
    const { title, area, population, description, image, mapUrl } = req.body;
    const newKecamatan = await prisma.kecamatan.create({
      data: { title, area, population, description, image, mapUrl },
    });
    res
      .status(201)
      .json({ message: "Kecamatan ditambahkan", data: newKecamatan });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.put("/api/admin/kecamatan/:id", authenticateAdmin, async (req, res) => {
  try {
    const { title, area, population, description, image, mapUrl } = req.body;
    const updatedKecamatan = await prisma.kecamatan.update({
      where: { id: parseInt(req.params.id) },
      data: { title, area, population, description, image, mapUrl },
    });
    res.json({ message: "Kecamatan diperbarui", data: updatedKecamatan });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.delete("/api/admin/kecamatan/:id", authenticateAdmin, async (req, res) => {
  try {
    await prisma.kecamatan.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Kecamatan dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// --- CRUD DATA PNS ---
app.post("/api/admin/datapns", authenticateAdmin, async (req, res) => {
  try {
    const {
      total,
      lakiLaki,
      perempuan,
      golongan,
      golonganJumlah,
      pendidikan,
      pendidikanJumlah,
    } = req.body;
    const existing = await prisma.dataPNS.findFirst();
    if (existing)
      return res
        .status(400)
        .json({ message: "Data PNS sudah ada, gunakan PUT." });

    const newData = await prisma.dataPNS.create({
      data: {
        total,
        lakiLaki,
        perempuan,
        golongan,
        golonganJumlah,
        pendidikan,
        pendidikanJumlah,
      },
    });
    res.status(201).json({ message: "Data PNS dibuat", data: newData });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.put("/api/admin/datapns/:id", authenticateAdmin, async (req, res) => {
  try {
    const {
      total,
      lakiLaki,
      perempuan,
      golongan,
      golonganJumlah,
      pendidikan,
      pendidikanJumlah,
    } = req.body;
    const updatedData = await prisma.dataPNS.update({
      where: { id: parseInt(req.params.id) },
      data: {
        total,
        lakiLaki,
        perempuan,
        golongan,
        golonganJumlah,
        pendidikan,
        pendidikanJumlah,
      },
    });
    res.json({ message: "Data PNS diperbarui", data: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// --- CRUD REALISASI ANGGARAN ---
app.post(
  "/api/admin/realisasi-anggaran",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { year, amount } = req.body;
      const newAnggaran = await prisma.realisasiAnggaran.create({
        data: { year: parseInt(year), amount: BigInt(amount) },
      });
      res.status(201).json({
        message: "Anggaran ditambahkan",
        data: { ...newAnggaran, amount: newAnggaran.amount.toString() },
      });
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  },
);

app.put(
  "/api/admin/realisasi-anggaran/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { year, amount } = req.body;
      const updatedAnggaran = await prisma.realisasiAnggaran.update({
        where: { id: parseInt(req.params.id) },
        data: { year: parseInt(year), amount: BigInt(amount) },
      });
      res.json({
        message: "Anggaran diperbarui",
        data: { ...updatedAnggaran, amount: updatedAnggaran.amount.toString() },
      });
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  },
);

app.delete(
  "/api/admin/realisasi-anggaran/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      await prisma.realisasiAnggaran.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json({ message: "Anggaran dihapus" });
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  },
);

// --- CRUD DAFTAR PERANGKAT ---
app.post("/api/admin/perangkat", authenticateAdmin, async (req, res) => {
  try {
    const { name, email, website } = req.body;
    const newPerangkat = await prisma.perangkat.create({
      data: { name, email, website },
    });
    res
      .status(201)
      .json({ message: "Perangkat ditambahkan", data: newPerangkat });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.put("/api/admin/perangkat/:id", authenticateAdmin, async (req, res) => {
  try {
    const { name, email, website } = req.body;
    const updatedPerangkat = await prisma.perangkat.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email, website },
    });
    res.json({ message: "Perangkat diperbarui", data: updatedPerangkat });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

app.delete("/api/admin/perangkat/:id", authenticateAdmin, async (req, res) => {
  try {
    await prisma.perangkat.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Perangkat dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// 1. Ambil data nodes untuk Pengunjung & Admin
app.get("/api/struktur-nodes", async (req, res) => {
  try {
    const nodes = await prisma.nodeStruktur.findMany();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// 2. Simpan layout nodes (Khusus Admin)
app.post("/api/admin/struktur-nodes", async (req, res) => {
  // Catatan: Jika ada middleware authenticateAdmin, masukkan sebelum async (req, res)
  try {
    const { nodes } = req.body;

    // Hapus semua layout lama, timpa dengan layout baru
    await prisma.nodeStruktur.deleteMany();

    if (nodes && nodes.length > 0) {
      await prisma.nodeStruktur.createMany({ data: nodes });
    }

    res.json({ message: "Layout Struktur berhasil disimpan!" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server backend siap di http://localhost:${PORT}`);
});
