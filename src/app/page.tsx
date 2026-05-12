export default function Home() {
  return (
    <>
      <div className="page-header">
        <h1>项目概览</h1>
        <p>Next.js + Prisma + Supabase 全栈模板</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>API 接口</h3>
          <div className="value">5</div>
        </div>
        <div className="stat-card">
          <h3>数据模型</h3>
          <div className="value">2</div>
        </div>
        <div className="stat-card">
          <h3>技术栈</h3>
          <div className="value">4</div>
        </div>
        <div className="stat-card">
          <h3>数据库</h3>
          <div className="value">SQLite</div>
        </div>
      </div>

      <div className="card">
        <h2>技术栈</h2>
        <ul className="tech-list">
          <li>Next.js 14 (App Router)</li>
          <li>TypeScript</li>
          <li>Prisma ORM</li>
          <li>Supabase (可选)</li>
        </ul>
      </div>

      <div className="card">
        <h2>快速开始</h2>
        <pre>
          <code>{`# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 同步数据库
npm run db:push`}</code>
        </pre>
      </div>

      <div className="card">
        <h2>数据库 Schema</h2>
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>User 表</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>字段</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>类型</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>id</td>
                <td style={{ padding: '0.5rem' }}>String</td>
                <td style={{ padding: '0.5rem' }}>主键 (CUID)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>email</td>
                <td style={{ padding: '0.5rem' }}>String</td>
                <td style={{ padding: '0.5rem' }}>邮箱 (唯一)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>name</td>
                <td style={{ padding: '0.5rem' }}>String?</td>
                <td style={{ padding: '0.5rem' }}>用户名</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>password</td>
                <td style={{ padding: '0.5rem' }}>String</td>
                <td style={{ padding: '0.5rem' }}>密码</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Post 表</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>字段</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>类型</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>id</td>
                <td style={{ padding: '0.5rem' }}>String</td>
                <td style={{ padding: '0.5rem' }}>主键 (CUID)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>title</td>
                <td style={{ padding: '0.5rem' }}>String</td>
                <td style={{ padding: '0.5rem' }}>标题</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>content</td>
                <td style={{ padding: '0.5rem' }}>String?</td>
                <td style={{ padding: '0.5rem' }}>内容</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.5rem' }}>published</td>
                <td style={{ padding: '0.5rem' }}>Boolean</td>
                <td style={{ padding: '0.5rem' }}>发布状态</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem' }}>authorId</td>
                <td style={{ padding: '0.5rem' }}>String</td>
                <td style={{ padding: '0.5rem' }}>作者 ID</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
