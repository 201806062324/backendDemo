'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/users', label: '用户管理' },
  { href: '/posts', label: '文章管理' },
  { href: '/api-docs', label: 'API 接口' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>全栈模板</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
