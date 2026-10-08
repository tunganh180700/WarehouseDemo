// Dữ liệu thô (Raw Data) - dữ liệu gốc chưa xử lý
export const rawData = [
  { id: 1, source: 'POS_System', timestamp: '2025-10-01T08:15:22', product_code: 'SP001', qty: '10', price: '150000', customer: 'Nguyen Van A', note: 'raw string qty' },
  { id: 2, source: 'POS_System', timestamp: '2025-10-01T09:30:11', product_code: 'SP002', qty: '5', price: '250000', customer: 'Tran Thi B', note: null },
  { id: 3, source: 'Website', timestamp: '2025-10-01T10:05:45', product_code: 'SP001', qty: '2', price: '150000', customer: 'Le Van C', note: 'online order' },
  { id: 4, source: 'POS_System', timestamp: '2025-10-01T11:22:00', product_code: 'SP003', qty: '1', price: '500000', customer: 'Pham Thi D', note: '' },
  { id: 5, source: 'Mobile_App', timestamp: '2025-10-01T12:40:33', product_code: 'SP002', qty: '3', price: '250000', customer: 'Hoang Van E', note: 'promo applied' },
  { id: 6, source: 'Website', timestamp: '2025-10-01T14:15:19', product_code: 'SP004', qty: '8', price: '75000', customer: 'Vo Thi F', note: null },
  { id: 7, source: 'POS_System', timestamp: '2025-10-01T15:50:07', product_code: 'SP001', qty: '4', price: '150000', customer: 'Do Van G', note: 'duplicate possible' },
  { id: 8, source: 'Mobile_App', timestamp: '2025-10-01T16:33:41', product_code: 'SP005', qty: '2', price: '1200000', customer: 'Bui Thi H', note: '' },
];

// Dữ liệu Staging - đã làm sạch, chuẩn hóa kiểu dữ liệu
export const stagingData = [
  { id: 1, source_system: 'POS_System', order_date: '2025-10-01', product_id: 'SP001', quantity: 10, unit_price: 150000, customer_name: 'Nguyen Van A', total_amount: 1500000, is_valid: true },
  { id: 2, source_system: 'POS_System', order_date: '2025-10-01', product_id: 'SP002', quantity: 5, unit_price: 250000, customer_name: 'Tran Thi B', total_amount: 1250000, is_valid: true },
  { id: 3, source_system: 'Website', order_date: '2025-10-01', product_id: 'SP001', quantity: 2, unit_price: 150000, customer_name: 'Le Van C', total_amount: 300000, is_valid: true },
  { id: 4, source_system: 'POS_System', order_date: '2025-10-01', product_id: 'SP003', quantity: 1, unit_price: 500000, customer_name: 'Pham Thi D', total_amount: 500000, is_valid: true },
  { id: 5, source_system: 'Mobile_App', order_date: '2025-10-01', product_id: 'SP002', quantity: 3, unit_price: 250000, customer_name: 'Hoang Van E', total_amount: 750000, is_valid: true },
  { id: 6, source_system: 'Website', order_date: '2025-10-01', product_id: 'SP004', quantity: 8, unit_price: 75000, customer_name: 'Vo Thi F', total_amount: 600000, is_valid: true },
  { id: 7, source_system: 'POS_System', order_date: '2025-10-01', product_id: 'SP001', quantity: 4, unit_price: 150000, customer_name: 'Do Van G', total_amount: 600000, is_valid: true },
  { id: 8, source_system: 'Mobile_App', order_date: '2025-10-01', product_id: 'SP005', quantity: 2, unit_price: 1200000, customer_name: 'Bui Thi H', total_amount: 2400000, is_valid: true },
];

// Dữ liệu NDS (Normalized Data Store)
export const ndsCustomers = [
  { customer_key: 1, customer_name: 'Nguyen Van A', customer_type: 'Retail', created_date: '2025-10-01' },
  { customer_key: 2, customer_name: 'Tran Thi B', customer_type: 'Retail', created_date: '2025-10-01' },
  { customer_key: 3, customer_name: 'Le Van C', customer_type: 'Online', created_date: '2025-10-01' },
  { customer_key: 4, customer_name: 'Pham Thi D', customer_type: 'Retail', created_date: '2025-10-01' },
  { customer_key: 5, customer_name: 'Hoang Van E', customer_type: 'Online', created_date: '2025-10-01' },
  { customer_key: 6, customer_name: 'Vo Thi F', customer_type: 'Online', created_date: '2025-10-01' },
  { customer_key: 7, customer_name: 'Do Van G', customer_type: 'Retail', created_date: '2025-10-01' },
  { customer_key: 8, customer_name: 'Bui Thi H', customer_type: 'Online', created_date: '2025-10-01' },
];

export const ndsProducts = [
  { product_key: 1, product_id: 'SP001', product_name: 'Áo thun basic', category: 'Thời trang', unit_price: 150000 },
  { product_key: 2, product_id: 'SP002', product_name: 'Quần jean slim', category: 'Thời trang', unit_price: 250000 },
  { product_key: 3, product_id: 'SP003', product_name: 'Giày sneaker', category: 'Giày dép', unit_price: 500000 },
  { product_key: 4, product_id: 'SP004', product_name: 'Tất cotton', category: 'Phụ kiện', unit_price: 75000 },
  { product_key: 5, product_id: 'SP005', product_name: 'Áo khoác dù', category: 'Thời trang', unit_price: 1200000 },
];

export const ndsOrders = [
  { order_key: 1, order_date: '2025-10-01', customer_key: 1, product_key: 1, quantity: 10, unit_price: 150000, total_amount: 1500000, source_system: 'POS_System' },
  { order_key: 2, order_date: '2025-10-01', customer_key: 2, product_key: 2, quantity: 5, unit_price: 250000, total_amount: 1250000, source_system: 'POS_System' },
  { order_key: 3, order_date: '2025-10-01', customer_key: 3, product_key: 1, quantity: 2, unit_price: 150000, total_amount: 300000, source_system: 'Website' },
  { order_key: 4, order_date: '2025-10-01', customer_key: 4, product_key: 3, quantity: 1, unit_price: 500000, total_amount: 500000, source_system: 'POS_System' },
  { order_key: 5, order_date: '2025-10-01', customer_key: 5, product_key: 2, quantity: 3, unit_price: 250000, total_amount: 750000, source_system: 'Mobile_App' },
  { order_key: 6, order_date: '2025-10-01', customer_key: 6, product_key: 4, quantity: 8, unit_price: 75000, total_amount: 600000, source_system: 'Website' },
  { order_key: 7, order_date: '2025-10-01', customer_key: 7, product_key: 1, quantity: 4, unit_price: 150000, total_amount: 600000, source_system: 'POS_System' },
  { order_key: 8, order_date: '2025-10-01', customer_key: 8, product_key: 5, quantity: 2, unit_price: 1200000, total_amount: 2400000, source_system: 'Mobile_App' },
];
