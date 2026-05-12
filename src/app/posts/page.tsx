'use client';

import { useState, useEffect } from 'react';

interface Author {
  id: string;
  email: string;
  name: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', published: false, authorId: '' });

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchPosts();
        closeModal();
      } else {
        const data = await res.json();
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('删除失败');
    }
  };

  const openModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content || '',
        published: post.published,
        authorId: post.authorId,
      });
    } else {
      setEditingPost(null);
      setFormData({ title: '', content: '', published: false, authorId: users[0]?.id || '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', published: false, authorId: '' });
  };

  const getAuthorName = (author: Author) => {
    return author.name || author.email;
  };

  return (
    <>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>文章管理</h1>
            <p>管理博客文章</p>
          </div>
          <button
            onClick={() => openModal()}
            disabled={users.length === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: users.length === 0 ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: users.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            新增文章
          </button>
        </div>
      </div>

      {users.length === 0 && (
        <div className="card" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
          <p style={{ color: '#92400e' }}>
            请先创建用户，才能添加文章
          </p>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>加载中...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: '#6b7280' }}>暂无文章</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>标题</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>作者</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>状态</th>
                <th style={{ textAlign: 'left', padding: '0.75rem' }}>创建时间</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem' }}>{post.title}</td>
                  <td style={{ padding: '0.75rem' }}>{getAuthorName(post.author)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      backgroundColor: post.published ? '#d1fae5' : '#f3f4f6',
                      color: post.published ? '#065f46' : '#6b7280',
                    }}>
                      {post.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(post.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => openModal(post)}
                      style={{ marginRight: '0.5rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
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
            width: '500px',
          }}>
            <h2 style={{ marginBottom: '1rem' }}>{editingPost ? '编辑文章' : '新增文章'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', resize: 'vertical' }}
                />
              </div>
              {!editingPost && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>作者</label>
                  <select
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                  >
                    <option value="">选择作者</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  发布文章
                </label>
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
