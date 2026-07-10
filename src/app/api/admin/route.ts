import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

/**
 * Generic admin API for Firestore CRUD.
 * All requests must include a valid __session cookie.
 *
 * POST /api/admin
 * Body: { action, collection, id?, data?, subcollection?, parentDoc? }
 *
 * Actions: list, get, create, update, delete, setDoc
 */

async function verifyAdmin(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get('__session')?.value;
  if (!session) return null;

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(session, true);
    const db = getAdminDb();
    const adminDoc = await db.collection('adminUsers').doc(decoded.uid).get();
    if (!adminDoc.exists) return null;
    const data = adminDoc.data()!;
    if (data.active === false) return null;
    if (data.role !== 'admin' && data.role !== 'owner') return null;
    return decoded.uid;
  } catch {
    return null;
  }
}


// Map collections to public paths that need revalidation
function revalidateForCollection(collection: string) {
  const pathMap: Record<string, string[]> = {
    blogPosts: ['/', '/insights'],
    projects: ['/', '/projects'],
    services: ['/', '/services'],
    cvSections: ['/cv'],
    mediaItems: ['/media'],
    siteSettings: ['/', '/about', '/cv', '/projects', '/insights', '/services', '/media', '/contact'],
    socialLinks: ['/'],
    contactMessages: [],
    events: ['/speaking'],
    testimonials: ['/'],
    books: ['/books'],
    quotes: ['/quotes', '/'],
    haiti2075Proposals: ['/haiti-2075/proposals', '/haiti-2075'],
  };
  const paths = pathMap[collection] || ['/'];
  paths.forEach((p) => { try { revalidatePath(p); } catch {} });
}

export async function POST(request: NextRequest) {
  const uid = await verifyAdmin(request);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, collection, id, data, subcollection, parentDoc, orderBy, where: whereClause } = body;

    if (!collection) {
      return NextResponse.json({ error: 'collection required' }, { status: 400 });
    }

    const db = getAdminDb();

    // Determine collection reference (supports subcollections)
    let collRef: FirebaseFirestore.CollectionReference;
    if (subcollection && parentDoc) {
      collRef = db.collection(collection).doc(parentDoc).collection(subcollection);
    } else {
      collRef = db.collection(collection);
    }

    switch (action) {
      case 'list': {
        let query: FirebaseFirestore.Query = collRef;
        if (orderBy) {
          query = query.orderBy(orderBy.field, orderBy.direction || 'asc');
        }
        if (whereClause) {
          query = query.where(whereClause.field, whereClause.op, whereClause.value);
        }
        const snap = await query.get();
        const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ docs });
      }

      case 'get': {
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const doc = await collRef.doc(id).get();
        if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ doc: { id: doc.id, ...doc.data() } });
      }

      case 'create': {
        if (!data) return NextResponse.json({ error: 'data required' }, { status: 400 });
        const now = new Date().toISOString();
        const docRef = await collRef.add({
          ...data,
          created_at: data.created_at || now,
          updated_at: now,
        });
        revalidateForCollection(collection);
        return NextResponse.json({ id: docRef.id });
      }

      case 'update': {
        if (!id || !data) return NextResponse.json({ error: 'id and data required' }, { status: 400 });
        await collRef.doc(id).update({
          ...data,
          updated_at: new Date().toISOString(),
        });
        revalidateForCollection(collection);
        return NextResponse.json({ success: true });
      }

      case 'delete': {
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        await collRef.doc(id).delete();
        revalidateForCollection(collection);
        return NextResponse.json({ success: true });
      }

      case 'setDoc': {
        // For documents with specific IDs (like CV meta, site settings)
        if (!id || !data) return NextResponse.json({ error: 'id and data required' }, { status: 400 });
        await collRef.doc(id).set(data, { merge: true });
        revalidateForCollection(collection);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Admin API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
