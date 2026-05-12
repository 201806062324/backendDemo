'use client';

import { useState } from 'react';

interface ApiEndpoint {
  group: string;
  endpoints: {
    method: string;
    path: string;
    description: string;
    bodyFields?: { name: string; type: string; required: boolean; placeholder?: string }[];
  }[];
}

const apiEndpoints: ApiEndpoint[] = [
  {
    group: '用户管理',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users',
        description: '获取用户列表',
      },
      {
        method: 'POST',
        path: '/api/users',
        description: '创建用户',
        bodyFields: [
          { name: 'email', type: 'string', required: true, placeholder: 'user@example.com' },
          { name: 'name', type: 'string', required: false, placeholder: '用户名' },
          { name: 'password', type: 'string', required: true, placeholder: '123456' },
        ],
      },
      {
        method: 'GET',
        path: '/api/users/[id]',
        description: '获取单个用户',
      },
      {
        method: 'PUT',
        path: '/api/users/[id]',
        description: '更新用户',
        bodyFields: [
          { name: 'email', type: 'string', required: false, placeholder: 'user@example.com' },
          { name: 'name', type: 'string', required: false, placeholder: '用户名' },
        ],
      },
      {
        method: 'DELETE',
        path: '/api/users/[id]',
        description: '删除用户',
      },
    ],
  },
  {
    group: '文章管理',
    endpoints: [
      {
        method: 'GET',
        path: '/api/posts',
        description: '获取文章列表',
      },
      {
        method: 'POST',
        path: '/api/posts',
        description: '创建文章',
        bodyFields: [
          { name: 'title', type: 'string', required: true, placeholder: '文章标题' },
          { name: 'content', type: 'string', required: false, placeholder: '文章内容' },
          { name: 'published', type: 'boolean', required: false, placeholder: 'false' },
          { name: 'authorId', type: 'string', required: true, placeholder: '用户ID' },
        ],
      },
      {
        method: 'GET',
        path: '/api/posts/[id]',
        description: '获取单篇文章',
      },
      {
        method: 'PUT',
        path: '/api/posts/[id]',
        description: '更新文章',
        bodyFields: [
          { name: 'title', type: 'string', required: false, placeholder: '文章标题' },
          { name: 'content', type: 'string', required: false, placeholder: '文章内容' },
          { name: 'published', type: 'boolean', required: false, placeholder: 'false' },
        ],
      },
      {
        method: 'DELETE',
        path: '/api/posts/[id]',
        description: '删除文章',
      },
    ],
  },
];

interface RequestHistory {
  id: number;
  method: string;
  url: string;
  path: string;
  description: string;
  status: number;
  time: number;
  response: string;
  timestamp: string;
}

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<{ method: string; path: string; bodyFields?: ApiEndpoint['endpoints'][0]['bodyFields'] } | null>(null);
  const [requestBody, setRequestBody] = useState<string>('');
  const [pathParam, setPathParam] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set([apiEndpoints[0]?.group]));
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    setLoading(true);
    setResponse('');

    const baseUrl = window.location.origin;
    let url = selectedEndpoint.path;

    if (selectedEndpoint.path.includes('[id]') && pathParam) {
      url = url.replace('[id]', pathParam);
    }

    const fullUrl = `${baseUrl}${url}`;
    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (selectedEndpoint.method !== 'GET' && selectedEndpoint.method !== 'DELETE' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(fullUrl, options);
      const data = await res.json();
      const endTime = Date.now();

      const responseText = JSON.stringify(data, null, 2);
      setResponse(responseText);

      const historyItem: RequestHistory = {
        id: Date.now(),
        method: selectedEndpoint.method,
        url: fullUrl,
        path: selectedEndpoint.path,
        description: apiEndpoints
          .flatMap((g) => g.endpoints)
          .find((e) => e.method === selectedEndpoint.method && e.path === selectedEndpoint.path)?.description || '',
        status: res.status,
        time: endTime - startTime,
        response: responseText,
        timestamp: new Date().toLocaleString('zh-CN'),
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 10));
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>API 接口调试</h1>
        <p>在线测试 API 接口</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div className="card">
            <h2>选择接口</h2>
            {apiEndpoints.map((group) => (
              <div key={group.group} style={{ marginBottom: '1rem' }}>
                <div
                  onClick={() => {
                    const newExpanded = new Set(expandedGroups);
                    if (newExpanded.has(group.group)) {
                      newExpanded.delete(group.group);
                    } else {
                      newExpanded.add(group.group);
                    }
                    setExpandedGroups(newExpanded);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ marginRight: '0.5rem', color: '#6b7280' }}>
                    {expandedGroups.has(group.group) ? '▼' : '▶'}
                  </span>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                    {group.group}
                  </h3>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                    ({group.endpoints.length})
                  </span>
                </div>
                {expandedGroups.has(group.group) && (
                  <div style={{ paddingLeft: '1rem' }}>
                    {group.endpoints.map((endpoint) => (
                      <div
                        key={`${endpoint.method}-${endpoint.path}`}
                        className="api-endpoint"
                        onClick={() => {
                          setSelectedEndpoint({
                            method: endpoint.method,
                            path: endpoint.path,
                            bodyFields: endpoint.bodyFields,
                          });
                          const obj: Record<string, unknown> = {};
                          endpoint.bodyFields?.forEach((field) => {
                            obj[field.name] = field.placeholder || `${field.name}_value`;
                          });
                          setRequestBody(endpoint.bodyFields ? JSON.stringify(obj, null, 2) : '');
                          setResponse('');
                        }}
                        style={{
                          cursor: 'pointer',
                          backgroundColor:
                            selectedEndpoint?.method === endpoint.method && selectedEndpoint?.path === endpoint.path
                              ? '#f3f4f6'
                              : undefined,
                        }}
                      >
                        <span className={`api-method ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                        <span className="api-path">{endpoint.path}</span>
                        <span className="api-desc">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h2>请求历史</h2>
            {history.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>暂无请求历史</p>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.5rem',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                    onClick={() => setResponse(item.response)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span className={`api-method ${item.method.toLowerCase()}`} style={{ marginRight: '0.5rem', fontSize: '0.7rem', padding: '0.125rem 0.25rem' }}>
                        {item.method}
                      </span>
                      <span style={{ color: '#374151' }}>{item.path}</span>
                      <span style={{ marginLeft: 'auto', color: item.status >= 400 ? '#ef4444' : '#10b981' }}>{item.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                      <span>{item.description}</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedEndpoint ? (
            <>
              <div className="card">
                <h2>调试参数</h2>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    请求方法
                  </label>
                  <span className={`api-method ${selectedEndpoint.method.toLowerCase()}`}>
                    {selectedEndpoint.method}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    请求路径
                  </label>
                  <code style={{ display: 'block', padding: '0.5rem', background: '#f3f4f6', borderRadius: '0.25rem' }}>
                    {selectedEndpoint.path}
                  </code>
                </div>

                {selectedEndpoint.path.includes('[id]') && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                      ID 参数
                    </label>
                    <input
                      type="text"
                      value={pathParam}
                      onChange={(e) => setPathParam(e.target.value)}
                      placeholder="输入用户 ID"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                )}

                {selectedEndpoint.bodyFields && selectedEndpoint.bodyFields.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={6}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontFamily: 'monospace',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                )}

                <button
                  onClick={executeRequest}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? '发送中...' : '发送请求'}
                </button>
              </div>

              <div className="card">
                <h2>响应结果</h2>
                {response ? (
                  <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
                    <code>{response}</code>
                  </pre>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>点击&quot;发送请求&quot;查看响应</p>
                )}
              </div>
            </>
          ) : (
            <div className="card">
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                点击左侧接口进行调试
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
