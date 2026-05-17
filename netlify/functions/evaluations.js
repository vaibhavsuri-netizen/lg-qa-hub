import { getStore } from '@netlify/blobs';

const store = getStore('qa-evaluations');

export default async (req, context) => {
  const { method } = req;

  if (method === 'GET') {
    const data = await store.get('all-evaluations', { type: 'json' }) || {
      records: [],
      lastModified: 0
    };
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (method === 'POST') {
    const newRecord = await req.json();
    const current = await store.get('all-evaluations', { type: 'json' }) || {
      records: [],
      lastModified: 0
    };

    current.records.unshift(newRecord);
    current.lastModified = Date.now();

    await store.set('all-evaluations', JSON.stringify(current));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
};
