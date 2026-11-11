-- CreateTable
CREATE TABLE `pages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pages_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pimpinan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `fotoUrl` VARCHAR(191) NULL,
    `kataSambutan` TEXT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perangkat_daerah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaInstansi` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `websiteUrl` VARCHAR(191) NULL,
    `alamat` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kecamatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaKecamatan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `desa_kelurahan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kecamatanId` INTEGER NOT NULL,
    `namaWilayah` VARCHAR(191) NOT NULL,
    `kategori` ENUM('DESA', 'KELURAHAN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `statistik_pns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `totalPns` INTEGER NOT NULL,
    `pria` INTEGER NOT NULL,
    `wanita` INTEGER NOT NULL,
    `golonganTerbanyak` VARCHAR(191) NULL,
    `pendidikanTerbanyak` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `statistik_pns_tahun_key`(`tahun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `realisasi_anggaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `targetAnggaran` DECIMAL(15, 2) NOT NULL,
    `nilaiRealisasi` DECIMAL(15, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `realisasi_anggaran_tahun_key`(`tahun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `desa_kelurahan` ADD CONSTRAINT `desa_kelurahan_kecamatanId_fkey` FOREIGN KEY (`kecamatanId`) REFERENCES `kecamatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
