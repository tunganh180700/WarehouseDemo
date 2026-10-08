import { ndsCustomers, ndsProducts, ndsOrders } from '../data/mockData'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function NdsPage() {
  return (
    <div>
      <h2 className="page-title">
        <span className="badge badge-nds">NDS</span> Normalized Data Store
      </h2>
      <p className="page-desc">
        Dữ liệu đã được chuẩn hóa (3NF): tách thành các bảng quan hệ
        Customers, Products, Orders. Loại bỏ redundancy, sẵn sàng đưa vào Data Warehouse / Data Mart.
      </p>

      <div className="stats">
        <div className="stat-card">
          <div className="label">Customers</div>
          <div className="value">{ndsCustomers.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Products</div>
          <div className="value">{ndsProducts.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Orders</div>
          <div className="value">{ndsOrders.length}</div>
        </div>
      </div>

      <div className="nds-section">
        <h3>👥 Bảng Customers</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer Key</th>
                <th>Customer Name</th>
                <th>Customer Type</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {ndsCustomers.map((row) => (
                <tr key={row.customer_key}>
                  <td>{row.customer_key}</td>
                  <td>{row.customer_name}</td>
                  <td>{row.customer_type}</td>
                  <td>{row.created_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="nds-section">
        <h3>📦 Bảng Products</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product Key</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {ndsProducts.map((row) => (
                <tr key={row.product_key}>
                  <td>{row.product_key}</td>
                  <td>{row.product_id}</td>
                  <td>{row.product_name}</td>
                  <td>{row.category}</td>
                  <td>{formatCurrency(row.unit_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="nds-section">
        <h3>🧾 Bảng Orders (Fact)</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order Key</th>
                <th>Order Date</th>
                <th>Customer Key</th>
                <th>Product Key</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
                <th>Source System</th>
              </tr>
            </thead>
            <tbody>
              {ndsOrders.map((row) => (
                <tr key={row.order_key}>
                  <td>{row.order_key}</td>
                  <td>{row.order_date}</td>
                  <td>{row.customer_key}</td>
                  <td>{row.product_key}</td>
                  <td>{row.quantity}</td>
                  <td>{formatCurrency(row.unit_price)}</td>
                  <td>{formatCurrency(row.total_amount)}</td>
                  <td>{row.source_system}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NdsPage
