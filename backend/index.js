const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");

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
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
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

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login berhasil",
      token: token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal melakukan proses login", error });
  }
});

// Middleware untuk mengunci rute Admin (Admin & Super Admin)
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak ditemukan." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Sesi telah habis atau token tidak valid." });
    }
    req.user = user;
    next();
  });
};

// Middleware khusus Super Admin
const authorizeSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "SUPER_ADMIN") {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya Super Admin yang diizinkan." });
  }
  next();
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

app.get("/api/datapns", async (req, res) => {
  try {
    // 1. Panggil nama tabel yang benar: statistikPns
    const data = await prisma.statistikPns.findFirst({
      orderBy: { tahun: "desc" }, // Ambil data tahun terbaru
    });

    // 2. Kalau database masih kosong, kembalikan nilai default 0
    if (!data) {
      return res.json({
        total: 0,
        lakiLaki: 0,
        perempuan: 0,
        golongan: [],
        golonganJumlah: [],
        pendidikan: [],
        pendidikanJumlah: [],
      });
    }

    // 3. Sesuaikan nama kolom database dengan yang dibutuhkan frontend
    res.json({
      total: data.totalPns,
      lakiLaki: data.pria,
      perempuan: data.wanita,
      // Karena di schema hanya ada kolom tunggal, kita jadikan array agar frontend tidak error
      golongan: data.golonganTerbanyak ? [data.golonganTerbanyak] : [],
      golonganJumlah: [0],
      pendidikan: data.pendidikanTerbanyak ? [data.pendidikanTerbanyak] : [],
      pendidikanJumlah: [0],
    });
  } catch (error) {
    console.error("Error GET Data PNS:", error);
    res.status(500).json({ message: "Error Data PNS", error: error.message });
  }
});

app.get("/api/realisasi-anggaran", async (req, res) => {
  try {
    // 1. Ubah year menjadi tahun
    const data = await prisma.realisasiAnggaran.findMany({
      orderBy: { tahun: "asc" },
    });

    if (!data || data.length === 0) {
      return res.json([]);
    }

    // 2. Sesuaikan map dengan nama kolom yang ada di database
    res.json(
      data.map((item) => ({
        year: item.tahun,
        amount: item.nilaiRealisasi ? item.nilaiRealisasi.toString() : "0",
      })),
    );
  } catch (error) {
    console.error("Error GET Realisasi Anggaran:", error);
    res.status(500).json({ message: "Error Anggaran", error: error.message });
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

// Konfigurasi penyimpanan foto (Versi Baru)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "-"));
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
// 1. GET: Ambil semua data Kecamatan beserta relasi Desa/Kelurahannya
app.get("/api/kecamatan", async (req, res) => {
  try {
    const data = await prisma.kecamatan.findMany({
      include: { desaKelurahan: true },
      orderBy: { id: "desc" },
    });

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const mappedData = data.map((item) => {
      const listKelurahan =
        item.desaKelurahan
          ?.filter((dk) => dk.kategori === "KELURAHAN")
          .map((dk) => dk.namaWilayah) || [];

      const listDesa =
        item.desaKelurahan
          ?.filter((dk) => dk.kategori === "DESA")
          .map((dk) => dk.namaWilayah) || [];

      const fixedFoto = item.gambar
        ? item.gambar.replace(/^https?:\/\/[^/]+/, hostUrl)
        : null;

      return {
        ...item,
        gambar: fixedFoto,
        namaKecamatan: item.title,
        namaKelurahan: listKelurahan,
        namaDesa: listDesa,
        foto: fixedFoto,
      };
    });

    res.json(mappedData);
  } catch (error) {
    console.error("Error GET Kecamatan:", error);
    res.status(500).json({ error: "Gagal mengambil data kecamatan" });
  }
});

// 2. POST: Tambah data Kecamatan baru
app.post("/api/kecamatan", upload.single("foto"), async (req, res) => {
  const { namaKecamatan, namaKelurahan, namaDesa } = req.body;
  const foto = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

  try {
    const arrayKelurahan = namaKelurahan ? JSON.parse(namaKelurahan) : [];
    const arrayDesa = namaDesa ? JSON.parse(namaDesa) : [];

    const dataRelasi = [
      ...arrayKelurahan.map((nama) => ({
        namaWilayah: nama,
        kategori: "KELURAHAN",
      })),
      ...arrayDesa.map((nama) => ({ namaWilayah: nama, kategori: "DESA" })),
    ];

    const newKecamatan = await prisma.kecamatan.create({
      data: {
        title: namaKecamatan,
        isi: "",
        website: "",
        gambar: foto,
        ...(dataRelasi.length > 0 && {
          desaKelurahan: {
            create: dataRelasi,
          },
        }),
      },
      include: { desaKelurahan: true },
    });

    res.status(201).json(newKecamatan);
  } catch (error) {
    console.error("Error Tambah Kecamatan:", error);
    res.status(500).json({ error: "Gagal menambah data kecamatan" });
  }
});

// 3. PUT: Edit data Kecamatan, Kelurahan, Desa, & Foto
app.put("/api/kecamatan/:id", upload.single("foto"), async (req, res) => {
  const { id } = req.params;
  const { namaKecamatan, namaKelurahan, namaDesa } = req.body;

  try {
    const arrayKelurahan = namaKelurahan ? JSON.parse(namaKelurahan) : [];
    const arrayDesa = namaDesa ? JSON.parse(namaDesa) : [];

    const dataRelasi = [
      ...arrayKelurahan.map((nama) => ({
        namaWilayah: nama,
        kategori: "KELURAHAN",
      })),
      ...arrayDesa.map((nama) => ({ namaWilayah: nama, kategori: "DESA" })),
    ];

    const updateData = {
      title: namaKecamatan,
      desaKelurahan: {
        deleteMany: {}, // Hapus daftar lama lalu ganti dengan daftar terbaru
        ...(dataRelasi.length > 0 && {
          create: dataRelasi,
        }),
      },
    };

    // Jika admin mengunggah foto baru, perbarui foto; jika tidak, pertahankan foto lama
    if (req.file) {
      updateData.gambar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedKecamatan = await prisma.kecamatan.update({
      where: { id: Number(id) },
      data: updateData,
      include: { desaKelurahan: true },
    });

    res.json(updatedKecamatan);
  } catch (error) {
    console.error("Error Edit Kecamatan:", error);
    res.status(500).json({ error: "Gagal memperbarui data kecamatan" });
  }
});

// 4. DELETE: Hapus data Kecamatan
app.delete("/api/kecamatan/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.kecamatan.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menghapus data kecamatan" });
  }
});

// --- CRUD REALISASI ANGGARAN ---

// UPDATE GET (tambahkan id agar admin bisa edit/hapus)
app.get("/api/realisasi-anggaran", async (req, res) => {
  try {
    const data = await prisma.realisasiAnggaran.findMany({
      orderBy: { tahun: "asc" },
    });

    if (!data || data.length === 0) return res.json([]);

    res.json(
      data.map((item) => ({
        id: item.id, // <-- Ditambahkan untuk Admin
        year: item.tahun,
        amount: item.nilaiRealisasi ? item.nilaiRealisasi.toString() : "0",
      })),
    );
  } catch (error) {
    console.error("Error GET Realisasi Anggaran:", error);
    res.status(500).json({ message: "Error Anggaran", error: error.message });
  }
});

// POST
app.post(
  "/api/admin/realisasi-anggaran",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { year, amount } = req.body;
      const newAnggaran = await prisma.realisasiAnggaran.create({
        data: {
          tahun: parseInt(year),
          targetAnggaran: amount, // Disamakan karena fokus pada realisasinya
          nilaiRealisasi: amount,
        },
      });
      res.status(201).json({
        message: "Anggaran ditambahkan",
        data: {
          ...newAnggaran,
          nilaiRealisasi: newAnggaran.nilaiRealisasi.toString(),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  },
);

// PUT (Edit)
app.put(
  "/api/admin/realisasi-anggaran/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { year, amount } = req.body;
      const updatedAnggaran = await prisma.realisasiAnggaran.update({
        where: { id: parseInt(req.params.id) },
        data: {
          tahun: parseInt(year),
          targetAnggaran: amount,
          nilaiRealisasi: amount,
        },
      });
      res.json({
        message: "Anggaran diperbarui",
        data: {
          ...updatedAnggaran,
          nilaiRealisasi: updatedAnggaran.nilaiRealisasi.toString(),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  },
);

// DELETE
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
      res.status(500).json({ message: "Error", error: error.message });
    }
  },
);

// --- CRUD DAFTAR PERANGKAT ---
// 1. GET: Ambil semua data (Bisa diakses publik tanpa login)
app.get("/api/perangkat", async (req, res) => {
  try {
    const data = await prisma.perangkatDaerah.findMany({
      orderBy: { id: "desc" },
    });

    const mappedData = data.map((item) => ({
      ...item,
      name: item.namaInstansi,
      website: item.websiteUrl,
    }));
    res.json(mappedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data perangkat" });
  }
});

// 2. POST: Tambah data baru (Hanya Admin)
app.post("/api/admin/perangkat", authenticateAdmin, async (req, res) => {
  try {
    console.log("👉 DATA YANG MASUK DARI FORM:", req.body);
    const { name, email, website, logo } = req.body;
    const newPerangkat = await prisma.perangkatDaerah.create({
      data: {
        namaInstansi: name,
        kategori: "Dinas",
        email,
        websiteUrl: website,
        logo,
      },
    });
    res
      .status(201)
      .json({ message: "Perangkat ditambahkan", data: newPerangkat });
  } catch (error) {
    console.error("Error Tambah Perangkat:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// 3. PUT: Edit data (Hanya Admin)
app.put("/api/admin/perangkat/:id", authenticateAdmin, async (req, res) => {
  try {
    const { name, email, website, logo } = req.body;
    const updatedPerangkat = await prisma.perangkatDaerah.update({
      where: { id: parseInt(req.params.id) },
      data: {
        namaInstansi: name,
        email,
        websiteUrl: website,
        logo,
      },
    });
    res.json({ message: "Perangkat diperbarui", data: updatedPerangkat });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// 4. DELETE: Hapus data (Hanya Admin)
app.delete("/api/admin/perangkat/:id", authenticateAdmin, async (req, res) => {
  try {
    await prisma.perangkatDaerah.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Perangkat dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// --- CRUD STRUKTUR ORGANISASI (NodeStruktur) ---

// 1. GET: Ambil semua data struktur (Bisa diakses publik/admin)
app.get("/api/struktur-nodes", async (req, res) => {
  try {
    const nodes = await prisma.nodeStruktur.findMany();
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data struktur" });
  }
});

// 2. POST: Tambah/Timpa data struktur baru (Hanya Admin)
app.post("/api/admin/struktur-nodes", authenticateAdmin, async (req, res) => {
  try {
    const { nodes } = req.body; // Menerima array 'nodes' dari frontend

    // Hapus semua data struktur yang lama di database
    await prisma.nodeStruktur.deleteMany();

    // Simpan semua node layout yang baru secara massal (bulk insert)
    if (nodes && nodes.length > 0) {
      await prisma.nodeStruktur.createMany({
        data: nodes,
      });
    }

    res
      .status(201)
      .json({ message: "Layout struktur berhasil disimpan ke database" });
  } catch (error) {
    console.error("Error POST Struktur:", error);
    res
      .status(500)
      .json({ message: "Gagal menyimpan struktur", error: error.message });
  }
});

// 3. PUT: Update data struktur (Hanya Admin)
app.put(
  "/api/admin/struktur-nodes/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      const {
        jabatan,
        nama,
        type,
        position,
        data,
        posX,
        posY,
        parentId,
        sourceHandle,
        targetHandle,
        tipeGaris,
      } = req.body;

      const updatedNode = await prisma.nodeStruktur.update({
        where: { id: req.params.id }, // id bentuknya String berdasarkan schema
        data: {
          jabatan,
          nama,
          type,
          position,
          data,
          posX: parseFloat(posX),
          posY: parseFloat(posY),
          parentId,
          sourceHandle,
          targetHandle,
          tipeGaris,
        },
      });
      res.json({ message: "Struktur diperbarui", data: updatedNode });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal mengupdate struktur", error: error.message });
    }
  },
);

// 4. DELETE: Hapus data struktur (Hanya Admin)
app.delete(
  "/api/admin/struktur-nodes/:id",
  authenticateAdmin,
  async (req, res) => {
    try {
      await prisma.nodeStruktur.delete({
        where: { id: req.params.id }, // id bentuknya String
      });
      res.json({ message: "Struktur dihapus" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal menghapus struktur", error: error.message });
    }
  },
);

// ==========================================
// 4. ENDPOINT KELOLA ADMIN (Khusus Super Admin)
// ==========================================
app.get(
  "/api/admin/users",
  authenticateAdmin,
  authorizeSuperAdmin,
  async (req, res) => {
    try {
      const admins = await prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        orderBy: { id: "asc" },
      });
      res.json(admins);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal mengambil data admin", error: error.message });
    }
  },
);

app.post(
  "/api/admin/users",
  authenticateAdmin,
  authorizeSuperAdmin,
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Nama, email, dan kata sandi wajib diisi." });
      }

      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: "Email sudah terdaftar." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const validRole = role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";

      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: validRole,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      res
        .status(201)
        .json({ message: "Admin berhasil ditambahkan", data: newAdmin });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal menambah admin", error: error.message });
    }
  },
);

app.put(
  "/api/admin/users/:id",
  authenticateAdmin,
  authorizeSuperAdmin,
  async (req, res) => {
    try {
      const targetId = parseInt(req.params.id);
      const { name, email, password, role } = req.body;
      const validRole = role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";

      if (targetId === req.user.id && validRole !== "SUPER_ADMIN") {
        return res.status(400).json({
          message: "Anda tidak dapat menurunkan role akun Anda sendiri.",
        });
      }

      const updateData = {
        name,
        email,
        role: validRole,
      };

      if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedAdmin = await prisma.admin.update({
        where: { id: targetId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      res.json({ message: "Data admin diperbarui", data: updatedAdmin });
    } catch (error) {
      if (error.code === "P2002") {
        return res
          .status(400)
          .json({ message: "Email sudah digunakan admin lain." });
      }
      res
        .status(500)
        .json({ message: "Gagal memperbarui admin", error: error.message });
    }
  },
);

app.delete(
  "/api/admin/users/:id",
  authenticateAdmin,
  authorizeSuperAdmin,
  async (req, res) => {
    try {
      const targetId = parseInt(req.params.id);
      if (targetId === req.user.id) {
        return res.status(400).json({
          message:
            "Anda tidak dapat menghapus akun Anda sendiri yang sedang login.",
        });
      }

      await prisma.admin.delete({ where: { id: targetId } });
      res.json({ message: "Akun admin berhasil dihapus" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal menghapus admin", error: error.message });
    }
  },
);

// Otomatis enkripsi password jika ada yang diinput manual lewat Prisma Studio
async function autoHashPlainPasswords() {
  const admins = await prisma.admin.findMany();
  for (const admin of admins) {
    if (admin.password && !admin.password.startsWith("$2")) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      });
      console.log(`🔒 Password untuk ${admin.email} otomatis dienkripsi.`);
    }
  }
}
autoHashPlainPasswords();

// START SERVER
app.listen(5000, "0.0.0.0", () => {
  console.log("Server berjalan di port 5000");
});
