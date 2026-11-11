const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@bekasikab.go.id";
  const plainPassword = "admin123"; // Ubah password ini sesuai keinginanmu
  const name = "Super Admin";

  // Cek apakah admin sudah ada agar tidak duplikat
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log("Akun admin dengan email ini sudah ada.");
    return;
  }

  // Hash password dengan salt round 10
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Simpan ke database
  const newAdmin = await prisma.admin.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  console.log("✅ Akun admin berhasil dibuat:", newAdmin.email);
}

main()
  .catch((e) => {
    console.error("❌ Gagal membuat admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
