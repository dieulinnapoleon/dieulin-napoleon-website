import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ['fullName', 'email', 'educationLevel', 'profession', 'proposalTitle', 'policyPillar', 'problemAddressed', 'proposedSolution', 'expectedImpact', 'timeHorizon'];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: 'Missing required field: ' + field }, { status: 400 });
      }
    }

    if (!body.consentGiven) {
      return NextResponse.json({ error: 'You must agree to the submission guidelines' }, { status: 400 });
    }

    const db = getAdminDb();
    const slug = body.proposalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);

    const proposal = {
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      countryCity: body.countryCity?.trim() || '',
      departmentInterest: body.departmentInterest?.trim() || '',
      educationLevel: body.educationLevel.trim(),
      profession: body.profession.trim(),
      organization: body.organization?.trim() || '',
      areaOfExpertise: body.areaOfExpertise?.trim() || '',
      proposalTitle: body.proposalTitle.trim(),
      policyPillar: body.policyPillar.trim(),
      departmentConcerned: body.departmentConcerned?.trim() || '',
      problemAddressed: body.problemAddressed.trim(),
      proposedSolution: body.proposedSolution.trim(),
      expectedImpact: body.expectedImpact.trim(),
      timeHorizon: body.timeHorizon.trim(),
      implementationActors: body.implementationActors || [],
      sources: body.sources?.trim() || '',
      permissionToPublishName: body.permissionToPublishName ?? false,
      consentGiven: true,
      status: 'pending',
      featured: false,
      incorporatedIntoPlan: false,
      adminNotes: '',
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.collection('haiti2075Proposals').add(proposal);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
