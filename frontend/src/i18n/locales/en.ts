const en = {
  common: {
    appName: "Tobacco POS",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    reset: "Reset",
    search: "Search",
    retry: "Try Again",
  },

  navigation: {
    dashboard: "Dashboard",
    products: "Products",
    suppliers: "Suppliers",
    purchases: "Purchases",
    inventory: "Inventory",
    transactions: "Transactions",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
  },

  header: {
    searchProducts: "Search products...",
    notifications: "Notifications",
    admin: "Admin",
  },

  dashboard: {
    title: "Dashboard",
    description: "Monitor sales performance and inventory status.",

    error: {
      title: "Failed to load dashboard",
      description: "The dashboard data could not be loaded. Check the connection and try again.",
    },

    period: {
      title: "Sales Overview",
      description: "Review sales performance for the selected period.",
      label: "Period",
      today: "Today",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      customRange: "Custom Range",
      startDate: "Start Date",
      endDate: "End Date",
      apply: "Apply",
    },

    summary: {
      totalSales: {
        title: "Total Sales",
        description: "Revenue in the selected period",
      },
      transactions: {
        title: "Transactions",
        description: "Completed sales transactions",
      },
      productsSold: {
        title: "Products Sold",
        description: "Total product quantity sold",
      },
      averageTransaction: {
        title: "Average Transaction",
        description: "Average revenue per transaction",
      },
    },

    salesChart: {
      title: "Daily Sales",
      description: "Total sales recorded for each day in the selected period.",
      empty: "No sales data available.",
      totalSales: "Total Sales",
      date: "Date",
    },

    paymentMethods: {
      title: "Payment Methods",
      description: "Sales distribution by payment method.",
      cash: "Cash",
      qris: "QRIS",
      transfer: "Transfer",
      transactions: "{{count}} transactions",
    },

    recentTransactions: {
      title: "Recent Transactions",
      description: "Latest transactions within the selected period.",
      emptyTitle: "No transactions found",
      emptyDescription: "Transactions for the selected period will appear here.",
      columns: {
        transaction: "Transaction",
        date: "Date",
        payment: "Payment",
        products: "Products",
    suppliers: "Suppliers",
    purchases: "Purchases",
        total: "Total",
      },
    },

    lowStock: {
      title: "Low Stock Products",
      description: "Active products that need stock replenishment.",
      healthyTitle: "Stock levels are healthy",
      healthyDescription: "No active products are currently below their minimum stock.",
      sku: "SKU",
      stock: "Stock {{count}}",
      minimum: "Minimum {{count}}",
      shortage: "Short {{count}}",
    },
  },

  products: {
    title: "Products",
    description: "Manage products, prices, stock, and product status.",

    toolbar: {
      searchPlaceholder: "Search products...",
      addProduct: "Add Product",
    },

    table: {
      sku: "SKU",
      product: "Product",
      purchasePrice: "Purchase Price",
      sellingPrice: "Selling Price",
      stock: "Stock",
      status: "Status",
      actions: "Actions",
      empty: "No products found.",
      active: "Active",
      inactive: "Inactive",
      editAria: "Edit {{name}}",
      deleteAria: "Delete {{name}}",
    },

    pagination: {
      showing: "Showing {{from}} to {{to}} of {{total}} products",
      rowsPerPage: "Rows per page",
      previous: "Previous",
      next: "Next",
      page: "Page {{current}} of {{last}}",
    },

    dialog: {
      addTitle: "Add Product",
      editTitle: "Edit Product",
      addDescription: "Fill in the information below to create a new product.",
      editDescription: "Update the information of this product.",
    },

    deleteDialog: {
      title: "Delete product?",
      description: "Are you sure you want to delete {{name}}? This action cannot be undone.",
      fallbackName: "this product",
      cancel: "Cancel",
      confirm: "Delete",
    },

    form: {
      sku: "SKU",
      skuPlaceholder: "SKU001",
      name: "Product Name",
      namePlaceholder: "Gudang Garam Merah",
      purchasePrice: "Purchase Price",
      sellingPrice: "Selling Price",
      stock: "Stock",
      minimumStock: "Minimum Stock",
      active: "Active",
      saving: "Saving...",
      save: "Save Product",
    },

    error: {
      title: "Failed to load products",
      description: "Please check your connection or try again.",
      retry: "Retry",
    },

    toast: {
      created: "Product created successfully.",
      updated: "Product updated successfully.",
      deleted: "Product deleted successfully.",
    },

    validation: {
      skuRequired: "SKU is required",
      nameRequired: "Product name is required",
      purchasePriceRequired: "Purchase price is required",
      sellingPriceRequired: "Selling price is required",
      stockMinimum: "Stock cannot be less than 0",
      minimumStockMinimum: "Minimum stock cannot be less than 0",
    },
  },

  suppliers: {
    title: "Suppliers",
    description: "Manage suppliers, distributors, and wholesalers that provide store inventory.",

    toolbar: {
      searchPlaceholder: "Search name, phone, address, or notes...",
      statusLabel: "Filter supplier status",
      allStatuses: "All Statuses",
      active: "Active",
      inactive: "Inactive",
      addSupplier: "Add Supplier",
    },

    table: {
      name: "Supplier Name",
      phone: "Phone",
      address: "Address",
      status: "Status",
      actions: "Actions",
      empty: "No suppliers found.",
      active: "Active",
      inactive: "Inactive",
      editAria: "Edit {{name}}",
      deactivateAria: "Deactivate {{name}}",
    },

    pagination: {
      showing: "Showing {{from}} to {{to}} of {{total}} suppliers",
      rowsPerPage: "Rows per page",
      previous: "Previous",
      next: "Next",
      page: "Page {{current}} of {{last}}",
    },

    dialog: {
      addTitle: "Add Supplier",
      editTitle: "Edit Supplier",
      addDescription: "Fill in the information below to add a new supplier.",
      editDescription: "Update this supplier's information and status.",
    },

    deactivateDialog: {
      title: "Deactivate supplier?",
      description: "{{name}} will no longer be available for new purchases, but its existing history will remain stored.",
      fallbackName: "This supplier",
      cancel: "Cancel",
      confirm: "Deactivate",
    },

    form: {
      name: "Supplier Name",
      namePlaceholder: "Main Distributor Ltd.",
      phone: "Phone Number",
      phonePlaceholder: "0812-3456-7890",
      address: "Address",
      addressPlaceholder: "Enter the supplier address",
      notes: "Notes",
      notesPlaceholder: "Additional notes about this supplier",
      active: "Active Supplier",
      saving: "Saving...",
      save: "Save Supplier",
    },

    error: {
      title: "Failed to load suppliers",
      description: "Supplier data could not be loaded. Check the connection and try again.",
      retry: "Try Again",
    },

    toast: {
      created: "Supplier added successfully.",
      updated: "Supplier updated successfully.",
      deactivated: "Supplier deactivated successfully.",
    },

    validation: {
      nameRequired: "Supplier name is required.",
      nameMaximum: "Supplier name cannot exceed 255 characters.",
      phoneMaximum: "Phone number cannot exceed 50 characters.",
    },
  },
  purchases: {
    title: "Purchases",
    description: "Manage inventory purchases from suppliers until the goods are received.",

    toolbar: {
      searchPlaceholder: "Search purchase number, supplier, product, or notes...",
      addPurchase: "Add Purchase",
      supplierFilterAria: "Filter by supplier",
      loadingSuppliers: "Loading suppliers...",
      allSuppliers: "All Suppliers",
      receiptStatusFilterAria: "Filter by receipt status",
      allReceiptStatuses: "All Receipt Statuses",
      paymentStatusFilterAria: "Filter by payment status",
      allPaymentStatuses: "All Payment Statuses",
      dateFromAria: "Purchase date from",
      dateToAria: "Purchase date to",
      reset: "Reset Filters",
    },

    receiptStatuses: {
      draft: "Draft",
      ordered: "Ordered",
      received: "Received",
      cancelled: "Cancelled",
    },

    paymentStatuses: {
      unpaid: "Unpaid",
      partial: "Partially Paid",
      paid: "Paid",
    },

    table: {
      purchaseNo: "Purchase Number",
      date: "Date",
      supplier: "Supplier",
      receiptStatus: "Receipt Status",
      paymentStatus: "Payment Status",
      total: "Total",
      paid: "Paid",
      remaining: "Remaining",
      actions: "Actions",
      empty: "No purchases found.",
      viewAria: "View purchase {{number}}",
      editAria: "Edit purchase {{number}}",
      receiveAria: "Receive goods for purchase {{number}}",
      cancelAria: "Cancel purchase {{number}}",
    },

    pagination: {
      showing: "Showing {{from}} to {{to}} of {{total}} purchases",
      rowsPerPage: "Rows per page",
      page: "Page {{current}} of {{last}}",
      previousPage: "Previous page",
      nextPage: "Next page",
    },

    dialog: {
      addTitle: "Add Purchase",
      editTitle: "Edit Purchase",
      addDescription: "Record a new inventory purchase from a supplier.",
      editDescription: "Update a purchase that has not been completed.",
    },

    detail: {
      title: "Purchase Details",
      description: "View complete purchase information and its product items.",
      errorTitle: "Failed to load purchase details",
      errorDescription: "Purchase details could not be loaded. Please try again.",
      retry: "Try Again",
      purchaseNo: "Purchase Number",
      supplier: "Supplier",
      total: "Purchase Total",
      paid: "Amount Paid",
      remaining: "Remaining Balance",
      itemsTitle: "Product Items",
      product: "Product",
      sku: "SKU",
      quantity: "Quantity",
      unitCost: "Unit Cost",
      subtotal: "Subtotal",
      receivedAt: "Received At",
      notes: "Notes",
    },

    actionDialog: {
      receiveTitle: "Receive goods?",
      cancelTitle: "Cancel purchase?",
      receiveDescription: "Purchase {{number}} will be marked as received.",
      cancelDescription: "Purchase {{number}} will be cancelled.",
      receiveWarning: "Product stock will increase, an inventory movement will be recorded, and the weighted average purchase cost will be updated.",
      back: "Back",
      processing: "Processing...",
      confirmReceive: "Receive Goods",
      confirmCancel: "Cancel Purchase",
    },

    form: {
      purchaseDate: "Purchase Date",
      supplier: "Supplier",
      loadingSuppliers: "Loading suppliers...",
      selectSupplier: "Select a supplier",
      receiptStatus: "Order Status",
      paidAmount: "Amount Paid",
      itemsTitle: "Purchase Items",
      itemsDescription: "Add products, quantities, and supplier purchase costs.",
      addItem: "Add Product",
      product: "Product",
      loadingProducts: "Loading products...",
      selectProduct: "Select a product",
      productOption: "{{name}} — {{sku}}",
      quantity: "Quantity",
      unitCost: "Unit Cost",
      subtotal: "Subtotal",
      removeItemAria: "Remove product number {{number}}",
      purchaseTotal: "Purchase Total",
      remainingAmount: "Remaining Balance",
      paymentStatus: "Payment Status",
      notes: "Notes",
      notesPlaceholder: "Add an invoice number or supplier notes",
      saving: "Saving...",
      update: "Update Purchase",
      save: "Save Purchase",
    },

    error: {
      title: "Failed to load purchases",
      description: "Purchase data could not be loaded. Check the connection and try again.",
      retry: "Try Again",
    },

    toast: {
      created: "Purchase added successfully.",
      updated: "Purchase updated successfully.",
      received: "Purchase goods received successfully.",
      cancelled: "Purchase cancelled successfully.",
    },

    validation: {
      productRequired: "A product must be selected.",
      productInvalid: "The selected product is invalid.",
      quantityRequired: "Product quantity is required.",
      quantityWholeNumber: "Product quantity must be a whole number.",
      quantityMinimum: "Product quantity must be at least 1.",
      unitCostRequired: "Unit cost is required.",
      unitCostNegative: "Unit cost cannot be negative.",
      purchaseDateRequired: "Purchase date is required.",
      supplierRequired: "A supplier must be selected.",
      supplierInvalid: "The selected supplier is invalid.",
      receiptStatusRequired: "Order status is required.",
      paidAmountRequired: "Payment amount is required.",
      paidAmountNegative: "Payment amount cannot be negative.",
      paidAmountExceeded: "Payment amount cannot exceed the purchase total.",
      notesTooLong: "Notes cannot exceed 1,000 characters.",
      atLeastOneProduct: "Add at least one product.",
      tooManyProducts: "A purchase can contain a maximum of 100 products.",
      duplicateProduct: "The same product cannot be added more than once.",
    },
  },
  inventory: {
    title: "Inventory",
    description: "Track stock in, stock out, adjustments, and movement history.",

    toolbar: {
      searchPlaceholder: "Search product, SKU, or reference...",
      loadingProducts: "Loading products...",
      allProducts: "All Products",
      allTypes: "All Types",
      reset: "Reset",
      addMovement: "Add Movement",
    },

    movementTypes: {
      stockIn: "Stock In",
      stockOut: "Stock Out",
      adjustment: "Adjustment",
    },

    dialog: {
      title: "Add Inventory Movement",
      description: "Record stock in, stock out, or a product stock adjustment.",
    },

    form: {
      product: "Product",
      loadingProducts: "Loading products...",
      selectProduct: "Select product",
      productOption: "{{name}} - {{sku}} - Stock: {{stock}}",
      movementType: "Movement Type",
      quantity: "Quantity",
      referenceNo: "Reference No.",
      referencePlaceholder: "Optional reference number",
      note: "Note",
      notePlaceholder: "Optional note",
      saving: "Saving...",
      save: "Save Movement",
    },

    table: {
      date: "Date",
      product: "Product",
      sku: "SKU",
      type: "Type",
      quantity: "Qty",
      before: "Before",
      after: "After",
      reference: "Reference",
      note: "Note",
      empty: "No inventory movements found.",
    },

    pagination: {
      showing: "Showing {{from}} to {{to}} of {{total}} movements",
      rowsPerPage: "Rows per page",
      page: "Page {{current}} of {{last}}",
      previousPage: "Previous page",
      nextPage: "Next page",
    },

    error: {
      title: "Failed to load inventory movements",
      description: "Please check your connection or try again.",
      retry: "Retry",
    },

    toast: {
      created: "Inventory movement created successfully.",
    },

    validation: {
      productRequired: "Product is required.",
      movementTypeRequired: "Movement type is required.",
      quantityRequired: "Quantity is required.",
      quantityNegative: "Quantity cannot be negative.",
      referenceTooLong: "Reference number is too long.",
      quantityAtLeastOne: "Quantity must be at least 1 for stock in and stock out.",
    },
  },

  transactions: {
    title: "Transactions",
    description: "Manage and review sales transactions.",

    paymentMethods: {
      cash: "Cash",
      qris: "QRIS",
      transfer: "Transfer",
    },

    toolbar: {
      searchPlaceholder: "Search transaction no., product, SKU, or note...",
      paymentFilterAria: "Filter by payment method",
      allPayments: "All Payments",
      reset: "Reset",
      newTransaction: "New Transaction",
    },

    error: {
      title: "Failed to load transactions",
      description: "The transaction history could not be loaded. Please try again.",
      retry: "Try Again",
    },

    table: {
      transactionNo: "Transaction No.",
      date: "Date",
      payment: "Payment",
      total: "Total",
      paid: "Paid",
      change: "Change",
      note: "Note",
      actions: "Actions",
      empty: "No transactions found.",
      viewAria: "View transaction {{number}}",
    },

    pagination: {
      showing: "Showing {{from}} to {{to}} of {{total}} transactions",
      rowsPerPage: "Rows per page",
      page: "Page {{current}} of {{last}}",
      previousPage: "Previous page",
      nextPage: "Next page",
    },

    dialog: {
      title: "New Transaction",
      description: "Select products, enter payment information, and save the sale.",
    },

    form: {
      paymentMethod: "Payment Method",
      paidAmount: "Paid Amount",
      itemsTitle: "Transaction Items",
      itemsDescription: "Add one or more products to the transaction.",
      addItem: "Add Item",
      product: "Product",
      loadingProducts: "Loading products...",
      selectProduct: "Select product",
      productOption: "{{name}} - {{sku}} - Stock: {{stock}}",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      subtotal: "Subtotal",
      removeItemAria: "Remove item {{number}}",
      transactionTotal: "Transaction Total",
      change: "Change",
      note: "Note",
      notePlaceholder: "Optional transaction note",
      saving: "Saving Transaction...",
      save: "Save Transaction",
    },

    detail: {
      title: "Transaction Detail",
      description: "Review transaction information and purchased items.",
      errorTitle: "Failed to load transaction detail.",
      errorDescription: "Please try loading the transaction again.",
      retry: "Try Again",
      transactionNo: "Transaction No.",
      total: "Total",
      paid: "Paid",
      change: "Change",
      purchasedItems: "Purchased Items",
      product: "Product",
      sku: "SKU",
      quantity: "Qty",
      unitPrice: "Unit Price",
      subtotal: "Subtotal",
      note: "Note",
    },

    toast: {
      created: "Transaction created successfully.",
      stockExceeded: "One or more quantities exceed available stock.",
      paidAmountTooLow: "Paid amount must be at least the transaction total.",
    },

    validation: {
      productRequired: "Product is required.",
      productInvalid: "Product is invalid.",
      quantityRequired: "Quantity is required.",
      quantityWholeNumber: "Quantity must be a whole number.",
      quantityMinimum: "Quantity must be at least 1.",
      paymentMethodRequired: "Payment method is required.",
      paidAmountRequired: "Paid amount is required.",
      paidAmountNegative: "Paid amount cannot be negative.",
      noteTooLong: "Note is too long.",
      atLeastOneProduct: "Add at least one product.",
      tooManyProducts: "A transaction cannot contain more than 100 products.",
      duplicateProduct: "The same product cannot be added more than once.",
    },
  },
  reports: {
    title: "Sales Reports",
    description: "Review sales performance, top products, and transaction history.",

    toolbar: {
      title: "Report Filters",
      description: "Filter sales transactions by keyword, payment method, or date range.",
      searchPlaceholder: "Search transaction, product, SKU, or note...",
      searchAria: "Search sales report",
      paymentFilterAria: "Filter by payment method",
      allPayments: "All Payments",
      startDate: "Start Date",
      endDate: "End Date",
      reset: "Reset",
    },

    summary: {
      totalSales: {
        title: "Total Sales",
        description: "Revenue from all filtered transactions",
      },
      transactions: {
        title: "Transactions",
        description: "Number of matching transactions",
      },
      productsSold: {
        title: "Products Sold",
        description: "Total quantity sold in the report",
      },
      averageTransaction: {
        title: "Average Transaction",
        description: "Average value per transaction",
      },
    },

    error: {
      title: "Failed to load sales report",
      description: "The sales report could not be loaded. Check the connection and try again.",
      retry: "Try Again",
    },

    transactions: {
      title: "Sales Transactions",
      description: "Detailed transactions matching the selected report filters.",
    },

    table: {
      productNames: "Product Names",
      date: "Date",
      payment: "Payment",
      quantity: "Product Quantity",
      unitPrice: "Product Price",
      total: "Total",
      paid: "Paid",
      change: "Change",
      emptyTitle: "No sales transactions found",
      emptyDescription: "Adjust the report filters to find matching transactions.",
    },

    pagination: {
      showing: "Showing {{from}} to {{to}} of {{total}} transactions",
      rowsPerPage: "Rows per page",
      page: "Page {{current}} of {{last}}",
      previousPage: "Previous page",
      nextPage: "Next page",
    },

    topProducts: {
      title: "Top Products",
      description: "Best-selling products from the filtered transactions.",
      emptyTitle: "No product sales found",
      emptyDescription: "Top-selling products will appear when transactions match the filters.",
      sku: "SKU: {{sku}}",
      sold: "{{count}} sold",
    },
  },
  auth: {
    signInDescription: "Sign in to your account",
    email: "Email",
    emailPlaceholder: "name@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    signingIn: "Signing In...",
    signIn: "Sign In",

    validation: {
      invalidEmail: "Email is invalid.",
      passwordMinimum: "Password must be at least 6 characters.",
    },
  },

  notFound: {
    description: "The page you are looking for could not be found.",
    backToDashboard: "Back to Dashboard",
  },

  errors: {
    skuTaken: "The SKU is already in use.",
    productNameTaken: "The product name is already in use.",
    invalidData: "The submitted data is invalid.",
    generic: "Something went wrong. Please try again.",
  },
  settings: {
    title: "Settings",
    description: "Manage application preferences.",
    language: {
      title: "Language",
      description: "Choose the language used throughout the application.",
      indonesian: "Bahasa Indonesia",
      english: "English",
    },
  },
} as const;

export default en;