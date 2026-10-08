import { rawData } from '../data/mockData'

function RawPage() {
  return (
    <div>
      <h2 className="page-title">
        <span className="badge badge-raw">RAW</span> Dữ liệu Thô
      </h2>
      <p className="page-desc">
        Dữ liệu gốc lấy trực tiếp từ các hệ thống nguồn (POS, Website, Mobile App).
        Chưa được làm sạch, kiểu dữ liệu còn là chuỗi, có giá trị null / rỗng.
      </p>

      <div className="stats">
        <div className="stat-card">
          <div className="label">Tổng bản ghi</div>
          <div className="value">{rawData.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Nguồn dữ liệu</div>
          <div className="value">3</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Source</th>
              <th>Timestamp</th>
              <th>Product Code</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Customer</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {rawData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.source}</td>
                <td>{row.timestamp}</td>
                <td>{row.product_code}</td>
                <td>{row.qty}</td>
                <td>{row.price}</td>
                <td>{row.customer}</td>
                <td>
                  {row.note === null || row.note === '' ? (
                    <span className="null-value">{row.note === null ? 'null' : 'empty'}</span>
                  ) : (
                    row.note
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RawPage
