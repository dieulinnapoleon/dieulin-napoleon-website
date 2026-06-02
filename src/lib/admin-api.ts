/**
 * Client-side helper for admin CRUD operations.
 * Calls /api/admin which verifies the session cookie and
 * performs Firestore operations via Admin SDK.
 */

interface AdminApiOptions {
  action: 'list' | 'get' | 'create' | 'update' | 'delete' | 'setDoc';
  collection: string;
  id?: string;
  data?: Record<string, any>;
  subcollection?: string;
  parentDoc?: string;
  orderBy?: { field: string; direction?: 'asc' | 'desc' };
  where?: { field: string; op: string; value: any };
}

export async function adminApi<T = any>(options: AdminApiOptions): Promise<T> {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `API error: ${res.status}`);
  }

  return res.json();
}

// Convenience wrappers

export async function listDocs<T>(
  collection: string,
  orderBy?: { field: string; direction?: 'asc' | 'desc' },
  where?: { field: string; op: string; value: any }
): Promise<T[]> {
  const result = await adminApi<{ docs: T[] }>({ action: 'list', collection, orderBy, where });
  return result.docs;
}

export async function listSubDocs<T>(
  collection: string,
  parentDoc: string,
  subcollection: string,
  orderBy?: { field: string; direction?: 'asc' | 'desc' }
): Promise<T[]> {
  const result = await adminApi<{ docs: T[] }>({
    action: 'list', collection, parentDoc, subcollection, orderBy,
  });
  return result.docs;
}

export async function createDoc(collection: string, data: Record<string, any>): Promise<string> {
  const result = await adminApi<{ id: string }>({ action: 'create', collection, data });
  return result.id;
}

export async function createSubDoc(
  collection: string, parentDoc: string, subcollection: string, data: Record<string, any>
): Promise<string> {
  const result = await adminApi<{ id: string }>({
    action: 'create', collection, parentDoc, subcollection, data,
  });
  return result.id;
}

export async function updateDoc(collection: string, id: string, data: Record<string, any>): Promise<void> {
  await adminApi({ action: 'update', collection, id, data });
}

export async function updateSubDoc(
  collection: string, parentDoc: string, subcollection: string, id: string, data: Record<string, any>
): Promise<void> {
  await adminApi({ action: 'update', collection, parentDoc, subcollection, id, data });
}

export async function deleteDoc(collection: string, id: string): Promise<void> {
  await adminApi({ action: 'delete', collection, id });
}

export async function deleteSubDoc(
  collection: string, parentDoc: string, subcollection: string, id: string
): Promise<void> {
  await adminApi({ action: 'delete', collection, parentDoc, subcollection, id });
}

export async function setDoc(collection: string, id: string, data: Record<string, any>): Promise<void> {
  await adminApi({ action: 'setDoc', collection, id, data });
}
