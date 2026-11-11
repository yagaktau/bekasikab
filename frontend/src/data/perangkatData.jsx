const totalItems = 26;

export const dummyPerangkatData = Array.from({ length: totalItems }, (_, i) => ({
  id: i + 1,
  name: `Nama Badan, Institusi, atau Dinas ${i + 1}`,
  email: `alamat.email${i + 1}@bekasikab.go.id`
}));

export const totalPerangkat = totalItems;