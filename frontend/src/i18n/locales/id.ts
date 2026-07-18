const id = {
  common: {
    appName: "Tobacco POS",
    loading: "Memuat...",
    save: "Simpan",
    cancel: "Batal",
    reset: "Reset",
    search: "Cari",
    retry: "Coba Lagi",
  },

  navigation: {
    dashboard: "Dasbor",
    products: "Produk",
    inventory: "Inventaris",
    transactions: "Transaksi",
    reports: "Laporan",
    settings: "Pengaturan",
    logout: "Keluar",
  },

  header: {
    searchProducts: "Cari produk...",
    notifications: "Notifikasi",
    admin: "Admin",
  },

  dashboard: {
    title: "Dasbor",
    description: "Pantau performa penjualan dan kondisi persediaan.",

    error: {
      title: "Gagal memuat dasbor",
      description: "Data dasbor tidak dapat dimuat. Periksa koneksi lalu coba lagi.",
    },

    period: {
      title: "Ringkasan Penjualan",
      description: "Tinjau performa penjualan berdasarkan periode yang dipilih.",
      label: "Periode",
      today: "Hari Ini",
      last7Days: "7 Hari Terakhir",
      last30Days: "30 Hari Terakhir",
      customRange: "Rentang Khusus",
      startDate: "Tanggal Mulai",
      endDate: "Tanggal Selesai",
      apply: "Terapkan",
    },

    summary: {
      totalSales: {
        title: "Total Penjualan",
        description: "Pendapatan pada periode yang dipilih",
      },
      transactions: {
        title: "Transaksi",
        description: "Transaksi penjualan yang selesai",
      },
      productsSold: {
        title: "Produk Terjual",
        description: "Total jumlah produk yang terjual",
      },
      averageTransaction: {
        title: "Rata-rata Transaksi",
        description: "Rata-rata pendapatan per transaksi",
      },
    },

    salesChart: {
      title: "Penjualan Harian",
      description: "Total penjualan yang tercatat setiap hari pada periode yang dipilih.",
      empty: "Belum ada data penjualan.",
      totalSales: "Total Penjualan",
      date: "Tanggal",
    },

    paymentMethods: {
      title: "Metode Pembayaran",
      description: "Distribusi penjualan berdasarkan metode pembayaran.",
      cash: "Tunai",
      qris: "QRIS",
      transfer: "Transfer",
      transactions: "{{count}} transaksi",
    },

    recentTransactions: {
      title: "Transaksi Terbaru",
      description: "Transaksi terbaru dalam periode yang dipilih.",
      emptyTitle: "Tidak ada transaksi",
      emptyDescription: "Transaksi pada periode yang dipilih akan tampil di sini.",
      columns: {
        transaction: "Transaksi",
        date: "Tanggal",
        payment: "Pembayaran",
        products: "Produk",
        total: "Total",
      },
    },

    lowStock: {
      title: "Produk Stok Menipis",
      description: "Produk aktif yang perlu segera ditambah stoknya.",
      healthyTitle: "Kondisi stok aman",
      healthyDescription: "Tidak ada produk aktif yang berada di bawah batas minimum stok.",
      sku: "SKU",
      stock: "Stok {{count}}",
      minimum: "Minimum {{count}}",
      shortage: "Kurang {{count}}",
    },
  },

  products: {
    title: "Produk",
    description: "Kelola daftar produk, harga, stok, dan status produk.",

    toolbar: {
      searchPlaceholder: "Cari produk...",
      addProduct: "Tambah Produk",
    },

    table: {
      sku: "SKU",
      product: "Produk",
      purchasePrice: "Harga Beli",
      sellingPrice: "Harga Jual",
      stock: "Stok",
      status: "Status",
      actions: "Aksi",
      empty: "Produk tidak ditemukan.",
      active: "Aktif",
      inactive: "Tidak Aktif",
      editAria: "Edit {{name}}",
      deleteAria: "Hapus {{name}}",
    },

    pagination: {
      showing: "Menampilkan {{from}} sampai {{to}} dari {{total}} produk",
      rowsPerPage: "Baris per halaman",
      previous: "Sebelumnya",
      next: "Berikutnya",
      page: "Halaman {{current}} dari {{last}}",
    },

    dialog: {
      addTitle: "Tambah Produk",
      editTitle: "Edit Produk",
      addDescription: "Isi informasi berikut untuk membuat produk baru.",
      editDescription: "Perbarui informasi produk ini.",
    },

    deleteDialog: {
      title: "Hapus produk?",
      description: "Apakah Anda yakin ingin menghapus {{name}}? Tindakan ini tidak dapat dibatalkan.",
      fallbackName: "produk ini",
      cancel: "Batal",
      confirm: "Hapus",
    },

    form: {
      sku: "SKU",
      skuPlaceholder: "SKU001",
      name: "Nama Produk",
      namePlaceholder: "Gudang Garam Merah",
      purchasePrice: "Harga Beli",
      sellingPrice: "Harga Jual",
      stock: "Stok",
      minimumStock: "Stok Minimum",
      active: "Aktif",
      saving: "Menyimpan...",
      save: "Simpan Produk",
    },

    error: {
      title: "Gagal memuat produk",
      description: "Periksa koneksi Anda atau coba lagi.",
      retry: "Coba Lagi",
    },

    toast: {
      created: "Produk berhasil dibuat.",
      updated: "Produk berhasil diperbarui.",
      deleted: "Produk berhasil dihapus.",
    },

    validation: {
      skuRequired: "SKU wajib diisi",
      nameRequired: "Nama produk wajib diisi",
      purchasePriceRequired: "Harga beli wajib diisi",
      sellingPriceRequired: "Harga jual wajib diisi",
      stockMinimum: "Stok tidak boleh kurang dari 0",
      minimumStockMinimum: "Stok minimum tidak boleh kurang dari 0",
    },
  },

  inventory: {
    title: "Inventaris",
    description: "Pantau stok masuk, stok keluar, penyesuaian, dan riwayat pergerakan stok.",

    toolbar: {
      searchPlaceholder: "Cari produk, SKU, atau referensi...",
      loadingProducts: "Memuat produk...",
      allProducts: "Semua Produk",
      allTypes: "Semua Jenis",
      reset: "Reset",
      addMovement: "Tambah Pergerakan",
    },

    movementTypes: {
      stockIn: "Stok Masuk",
      stockOut: "Stok Keluar",
      adjustment: "Penyesuaian",
    },

    dialog: {
      title: "Tambah Pergerakan Stok",
      description: "Catat stok masuk, stok keluar, atau penyesuaian stok produk.",
    },

    form: {
      product: "Produk",
      loadingProducts: "Memuat produk...",
      selectProduct: "Pilih produk",
      productOption: "{{name}} - {{sku}} - Stok: {{stock}}",
      movementType: "Jenis Pergerakan",
      quantity: "Jumlah",
      referenceNo: "Nomor Referensi",
      referencePlaceholder: "Nomor referensi opsional",
      note: "Catatan",
      notePlaceholder: "Catatan opsional",
      saving: "Menyimpan...",
      save: "Simpan Pergerakan",
    },

    table: {
      date: "Tanggal",
      product: "Produk",
      sku: "SKU",
      type: "Jenis",
      quantity: "Jumlah",
      before: "Sebelum",
      after: "Sesudah",
      reference: "Referensi",
      note: "Catatan",
      empty: "Pergerakan inventaris tidak ditemukan.",
    },

    pagination: {
      showing: "Menampilkan {{from}} sampai {{to}} dari {{total}} pergerakan",
      rowsPerPage: "Baris per halaman",
      page: "Halaman {{current}} dari {{last}}",
      previousPage: "Halaman sebelumnya",
      nextPage: "Halaman berikutnya",
    },

    error: {
      title: "Gagal memuat riwayat inventaris",
      description: "Periksa koneksi Anda atau coba lagi.",
      retry: "Coba Lagi",
    },

    toast: {
      created: "Pergerakan inventaris berhasil dibuat.",
    },

    validation: {
      productRequired: "Produk wajib dipilih.",
      movementTypeRequired: "Jenis pergerakan wajib dipilih.",
      quantityRequired: "Jumlah wajib diisi.",
      quantityNegative: "Jumlah tidak boleh negatif.",
      referenceTooLong: "Nomor referensi terlalu panjang.",
      quantityAtLeastOne: "Jumlah minimal 1 untuk stok masuk dan stok keluar.",
    },
  },

  transactions: {
    title: "Transaksi",
    description: "Kelola dan tinjau transaksi penjualan.",

    paymentMethods: {
      cash: "Tunai",
      qris: "QRIS",
      transfer: "Transfer",
    },

    toolbar: {
      searchPlaceholder: "Cari nomor transaksi, produk, SKU, atau catatan...",
      paymentFilterAria: "Filter berdasarkan metode pembayaran",
      allPayments: "Semua Pembayaran",
      reset: "Reset",
      newTransaction: "Transaksi Baru",
    },

    error: {
      title: "Gagal memuat transaksi",
      description: "Riwayat transaksi tidak dapat dimuat. Silakan coba lagi.",
      retry: "Coba Lagi",
    },

    table: {
      transactionNo: "Nomor Transaksi",
      date: "Tanggal",
      payment: "Pembayaran",
      total: "Total",
      paid: "Dibayar",
      change: "Kembalian",
      note: "Catatan",
      actions: "Aksi",
      empty: "Transaksi tidak ditemukan.",
      viewAria: "Lihat transaksi {{number}}",
    },

    pagination: {
      showing: "Menampilkan {{from}} sampai {{to}} dari {{total}} transaksi",
      rowsPerPage: "Baris per halaman",
      page: "Halaman {{current}} dari {{last}}",
      previousPage: "Halaman sebelumnya",
      nextPage: "Halaman berikutnya",
    },

    dialog: {
      title: "Transaksi Baru",
      description: "Pilih produk, masukkan informasi pembayaran, lalu simpan penjualan.",
    },

    form: {
      paymentMethod: "Metode Pembayaran",
      paidAmount: "Jumlah Dibayar",
      itemsTitle: "Item Transaksi",
      itemsDescription: "Tambahkan satu atau beberapa produk ke transaksi.",
      addItem: "Tambah Item",
      product: "Produk",
      loadingProducts: "Memuat produk...",
      selectProduct: "Pilih produk",
      productOption: "{{name}} - {{sku}} - Stok: {{stock}}",
      quantity: "Jumlah",
      unitPrice: "Harga Satuan",
      subtotal: "Subtotal",
      removeItemAria: "Hapus item {{number}}",
      transactionTotal: "Total Transaksi",
      change: "Kembalian",
      note: "Catatan",
      notePlaceholder: "Catatan transaksi opsional",
      saving: "Menyimpan Transaksi...",
      save: "Simpan Transaksi",
    },

    detail: {
      title: "Detail Transaksi",
      description: "Tinjau informasi transaksi dan produk yang dibeli.",
      errorTitle: "Gagal memuat detail transaksi.",
      errorDescription: "Silakan coba muat kembali transaksi ini.",
      retry: "Coba Lagi",
      transactionNo: "Nomor Transaksi",
      total: "Total",
      paid: "Dibayar",
      change: "Kembalian",
      purchasedItems: "Produk yang Dibeli",
      product: "Produk",
      sku: "SKU",
      quantity: "Jumlah",
      unitPrice: "Harga Satuan",
      subtotal: "Subtotal",
      note: "Catatan",
    },

    toast: {
      created: "Transaksi berhasil dibuat.",
      stockExceeded: "Satu atau beberapa jumlah produk melebihi stok yang tersedia.",
      paidAmountTooLow: "Jumlah pembayaran minimal harus sama dengan total transaksi.",
    },

    validation: {
      productRequired: "Produk wajib dipilih.",
      productInvalid: "Produk tidak valid.",
      quantityRequired: "Jumlah wajib diisi.",
      quantityWholeNumber: "Jumlah harus berupa bilangan bulat.",
      quantityMinimum: "Jumlah minimal 1.",
      paymentMethodRequired: "Metode pembayaran wajib dipilih.",
      paidAmountRequired: "Jumlah pembayaran wajib diisi.",
      paidAmountNegative: "Jumlah pembayaran tidak boleh negatif.",
      noteTooLong: "Catatan terlalu panjang.",
      atLeastOneProduct: "Tambahkan minimal satu produk.",
      tooManyProducts: "Satu transaksi tidak dapat memuat lebih dari 100 produk.",
      duplicateProduct: "Produk yang sama tidak dapat ditambahkan lebih dari satu kali.",
    },
  },
  reports: {
    title: "Laporan Penjualan",
    description: "Tinjau performa penjualan, produk terlaris, dan riwayat transaksi.",

    toolbar: {
      title: "Filter Laporan",
      description: "Filter transaksi penjualan berdasarkan kata kunci, metode pembayaran, atau rentang tanggal.",
      searchPlaceholder: "Cari transaksi, produk, SKU, atau catatan...",
      searchAria: "Cari laporan penjualan",
      paymentFilterAria: "Filter berdasarkan metode pembayaran",
      allPayments: "Semua Pembayaran",
      startDate: "Tanggal Mulai",
      endDate: "Tanggal Akhir",
      reset: "Reset",
    },

    summary: {
      totalSales: {
        title: "Total Penjualan",
        description: "Pendapatan dari seluruh transaksi yang sesuai filter",
      },
      transactions: {
        title: "Transaksi",
        description: "Jumlah transaksi yang sesuai filter",
      },
      productsSold: {
        title: "Produk Terjual",
        description: "Total jumlah produk yang terjual dalam laporan",
      },
      averageTransaction: {
        title: "Rata-rata Transaksi",
        description: "Nilai rata-rata per transaksi",
      },
    },

    error: {
      title: "Gagal memuat laporan penjualan",
      description: "Laporan penjualan tidak dapat dimuat. Periksa koneksi lalu coba lagi.",
      retry: "Coba Lagi",
    },

    transactions: {
      title: "Transaksi Penjualan",
      description: "Rincian transaksi yang sesuai dengan filter laporan yang dipilih.",
    },

    table: {
      productNames: "Nama Produk",
      date: "Tanggal",
      payment: "Pembayaran",
      quantity: "Jumlah Produk",
      unitPrice: "Harga Produk",
      total: "Total",
      paid: "Dibayar",
      change: "Kembalian",
      emptyTitle: "Transaksi penjualan tidak ditemukan",
      emptyDescription: "Sesuaikan filter laporan untuk menemukan transaksi yang sesuai.",
    },

    pagination: {
      showing: "Menampilkan {{from}} sampai {{to}} dari {{total}} transaksi",
      rowsPerPage: "Baris per halaman",
      page: "Halaman {{current}} dari {{last}}",
      previousPage: "Halaman sebelumnya",
      nextPage: "Halaman berikutnya",
    },

    topProducts: {
      title: "Produk Terlaris",
      description: "Produk dengan penjualan tertinggi dari transaksi yang telah difilter.",
      emptyTitle: "Penjualan produk tidak ditemukan",
      emptyDescription: "Produk terlaris akan muncul saat terdapat transaksi yang sesuai dengan filter.",
      sku: "SKU: {{sku}}",
      sold: "{{count}} terjual",
    },
  },
  auth: {
    signInDescription: "Masuk ke akun Anda",
    email: "Email",
    emailPlaceholder: "nama@contoh.com",
    password: "Kata Sandi",
    passwordPlaceholder: "Masukkan kata sandi",
    signingIn: "Sedang Masuk...",
    signIn: "Masuk",

    validation: {
      invalidEmail: "Email tidak valid.",
      passwordMinimum: "Kata sandi minimal 6 karakter.",
    },
  },

  notFound: {
    description: "Halaman yang Anda cari tidak ditemukan.",
    backToDashboard: "Kembali ke Dasbor",
  },

  errors: {
    skuTaken: "SKU sudah digunakan.",
    productNameTaken: "Nama produk sudah digunakan.",
    invalidData: "Data yang dikirim tidak valid.",
    generic: "Terjadi kesalahan. Silakan coba lagi.",
  },
  settings: {
    title: "Pengaturan",
    description: "Kelola preferensi aplikasi.",
    language: {
      title: "Bahasa",
      description: "Pilih bahasa yang digunakan pada aplikasi.",
      indonesian: "Bahasa Indonesia",
      english: "English",
    },
  },
} as const;

export default id;