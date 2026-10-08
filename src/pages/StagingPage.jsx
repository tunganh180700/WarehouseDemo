import { stagingData } from '../data/mockData'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function StagingPage() {
  const totalAmount = stagingData.reduce((sum, r) => sum + r.total_amount, 0)

  return (
    <div>
      <h2 className="page-title">
        <span className="badge badge-staging">STAGING</span> Dữ liệu Staging
      </h2>
      <p className="page-desc">
        Dữ liệu đã được làm sạch: chuyển kiểu dữ liệu (qty → number, price → number),
        tính total_amount, chuẩn hóa tên cột, đánh dấu is_valid.
      </p>

      <div className="stats">
        <div className="stat-card">
          <div className="label">Tổng bản ghi</div>
          <div className="value">{stagingData.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Tổng doanh thu</div>
          <div className="value" style={{ fontSize: '1.1rem' }}>{formatCurrency(totalAmount)}</div>
        </div>
        <div className="stat-card">
          <div className="label">Valid records</div>
          <div className="value">{stagingData.filter(r => r.is_valid).length}</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Source System</th>
              <th>Order Date</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Valid</th>
            </tr>
          </thead>
          <tbody>
            {stagingData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.source_system}</td>
                <td>{row.order_date}</td>
                <td>{row.product_id}</td>
                <td>{row.quantity}</td>
                <td>{formatCurrency(row.unit_price)}</td>
                <td>{row.customer_name}</td>
                <td>{formatCurrency(row.total_amount)}</td>
                <td>
                  <span className="badge" style={{ background: row.is_valid ? '#14532d' : '#7f1d1d', color: row.is_valid ? '#86efac' : '#fca5a5' }}>
                    {row.is_valid ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StagingPage
