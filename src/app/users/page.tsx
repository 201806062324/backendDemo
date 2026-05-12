'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsers();
        closeModal();
      } else {
        const data = await res.json();
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('删除失败');
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ email: user.email, name: user.name || '', password: '' });
    } else {
      setEditingUser(null);
      setFormData({ email: '', name: '', password: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ email: '', name: '', password: '' });
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>用户管理</h1>
            <p>管理系统用户</p>
          </div>
          <button
            onClick={() => openModal()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            新增用户
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>加载中...</p>
        ) : users.length === 0 ? (
          <p style={{ color: '#6b7280' }}>暂无用户</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>邮箱</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>名称</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>创建时间</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem' }}>{user.email}</td>
                  <td style={{ padding: '0.75rem' }}>{user.name || '-'}</td>
                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(user.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => openModal(user)}
                      style={{ marginRight: '0.5rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            width: '400px',
          }}>
            <h2 style={{ marginBottom: '1rem' }}>{editingUser ? '编辑用户' : '新增用户'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  密码 {editingUser && <span style={{ color: '#6b7280', fontWeight: 'normal' }}>(留空保持不变)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: 'white', cursor: 'pointer' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
