const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Mulai melakukan seeding data lengkap...");

  // 1. Isi Data Halaman Statis (CMS)
  await prisma.page.upsert({
    where: { slug: "sejarah" },
    update: {},
    create: {
      slug: "sejarah",
      title: "Sejarah Kabupaten Bekasi",
      content:
        "<p>Kabupaten Bekasi memiliki sejarah panjang yang heroik...</p>",
    },
  });

  // 2. Isi Data Pimpinan
  await prisma.pimpinan.create({
    data: {
      namaLengkap: "Bupati Dummy Lengkap",
      jabatan: "Bupati Bekasi",
      periode: "2024 - 2029",
      urutan: 1,
      isActive: true,
    },
  });

  // 3. Isi Data Perangkat Daerah
  await prisma.perangkatDaerah.create({
    data: {
      namaInstansi: "Dinas Komunikasi dan Informatika",
      kategori: "Dinas",
      email: "diskominfo@bekasikab.go.id",
    },
  });

  // 4 & 5. Isi Data Wilayah (Kecamatan dan Relasinya dengan Desa/Kelurahan)
  // Kita buat kecamatannya dulu, lalu simpan ID-nya untuk desanya
  const kecamatanCikarang = await prisma.kecamatan.create({
    data: {
      namaKecamatan: "Cikarang Pusat",
    },
  });

  await prisma.desaKelurahan.createMany({
    data: [
      {
        kecamatanId: kecamatanCikarang.id,
        namaWilayah: "Sukamahi",
        kategori: "DESA",
      },
      {
        kecamatanId: kecamatanCikarang.id,
        namaWilayah: "Jayamukti",
        kategori: "DESA",
      },
    ],
  });

  // 6. Isi Data Statistik PNS
  await prisma.statistikPns.upsert({
    where: { tahun: 2024 },
    update: {},
    create: {
      tahun: 2024,
      totalPns: 12500,
      pria: 7000,
      wanita: 5500,
      golonganTerbanyak: "Golongan III/c",
      pendidikanTerbanyak: "S1 / Sarjana",
      isActive: true,
    },
  });

  // 7. Isi Data Realisasi Anggaran (Line Chart)
  await prisma.realisasiAnggaran.upsert({
    where: { tahun: 2023 },
    update: {},
    create: {
      tahun: 2023,
      targetAnggaran: 6500000000000, // 6.5 Triliun
      nilaiRealisasi: 6100000000000, // 6.1 Triliun
    },
  });

  console.log("Seeding 6 Tabel Utama berhasil diselesaikan! 🌱🚀");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
