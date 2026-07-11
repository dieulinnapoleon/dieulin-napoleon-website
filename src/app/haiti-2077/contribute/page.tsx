"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";

const PILLARS = ['Governance and Institutions','Security, Justice, and Rule of Law','Education and Human Capital','Healthcare and Public Health','Agriculture and Food Sovereignty','Infrastructure and Transportation','Housing, Urban Planning, and Real Estate','Energy and Electricity','Water, Sanitation, and Waste Management','Technology and Digital Transformation','Natural Resources and Environmental Protection','Tourism, Culture, and Heritage','Industrial Policy and Manufacturing','Finance, Banking, and Capital Formation','Diaspora Engagement','Trade and Regional Integration','Women, Youth, and Family Policy','Disaster Resilience and Climate Adaptation','Local Government and Decentralization','Civic Culture and National Identity'];
const DEPARTMENTS = ['','Artibonite','Centre',"Grand'Anse",'Nippes','Nord','Nord-Est','Nord-Ouest','Ouest','Sud','Sud-Est'];
const ACTORS = ['Government','Private sector','Civil society','Diaspora','Universities','Religious institutions','International partners','Local communities'];

export default function ContributePage() {
  const [form, setForm] = useState({
    fullName: '', email: '', countryCity: '', departmentInterest: '', educationLevel: '', profession: '', organization: '', areaOfExpertise: '',
    proposalTitle: '', policyPillar: '', departmentConcerned: '', problemAddressed: '', proposedSolution: '', expectedImpact: '', timeHorizon: '',
    implementationActors: [] as string[], sources: '', permissionToPublishName: false, consentGiven: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string, value: any) => setForm({ ...form, [field]: value });
  const toggleActor = (actor: string) => {
    const actors = form.implementationActors.includes(actor) ? form.implementationActors.filter(a => a !== actor) : [...form.implementationActors, actor];
    set('implementationActors', actors);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.fullName.trim() || !form.email.trim() || !form.educationLevel.trim() || !form.profession.trim()) { setError('Please fill in all required contributor fields (name, email, education, profession).'); return; }
    if (!form.proposalTitle.trim() || !form.policyPillar || !form.problemAddressed.trim() || !form.proposedSolution.trim() || !form.expectedImpact.trim() || !form.timeHorizon) { setError('Please fill in all required proposal fields (title, pillar, problem, solution, impact, time horizon).'); return; }
    if (form.problemAddressed.length < 50) { setError('Problem Addressed should be at least 50 characters for a quality submission.'); return; }
    if (form.proposedSolution.length < 100) { setError('Proposed Solution should be at least 100 characters for a quality submission.'); return; }
    if (!form.consentGiven) { setError('You must agree to the submission guidelines.'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/haiti-2077', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setSubmitted(true); } else { setError(data.error || 'Submission failed. Please try again.'); }
    } catch { setError('Network error. Please try again.'); }
    setSubmitting(false);
  };

  if (submitted) return (
    <div>
      <section className="bg-navy pt-32 pb-20">
        <div className="section-container max-w-2xl text-center">
          <CheckCircle size={48} className="text-gold mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-white mb-4">Thank You for Your Contribution</h1>
          <p className="text-white/50 mb-8">Your proposal has been submitted and is under review. Approved proposals will appear on the public proposals page. You will not receive a confirmation email, but your submission has been recorded.</p>
          <div className="flex justify-center gap-3">
            <Link href="/haiti-2077" className="bg-gold hover:bg-gold-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Back to Haiti 2077</Link>
            <Link href="/haiti-2077/proposals" className="border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">View Proposals</Link>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <Link href="/haiti-2077" className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-6 hover:text-gold-300 transition-colors"><ArrowLeft size={16} /> Haiti 2077</Link>
          <h1 className="page-header-title">Submit a Proposal</h1>
          <p className="page-header-subtitle">Contribute a structured idea for Haiti&apos;s long-term transformation. All submissions are reviewed before publication.</p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Guidelines */}
          <div className="mb-8 p-5 bg-navy/5 rounded-xl border border-navy/10">
            <h3 className="text-sm font-semibold text-navy mb-2">Submission Guidelines</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>Submissions must be respectful, constructive, and nonpartisan.</li>
              <li>No hate speech, personal attacks, defamatory claims, or incitement to violence.</li>
              <li>Submissions may be edited for clarity before publication.</li>
              <li>Submission does not guarantee publication.</li>
              <li>Contributors choose whether their name appears publicly.</li>
              <li>Your email is stored privately and will not be displayed publicly.</li>
            </ul>
          </div>

          {/* Contributor Info */}
          <h2 className="font-display text-xl font-bold text-navy mb-4">Contributor Information</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div><label className="block text-sm font-medium text-navy mb-1">Full Name <span className="text-red-400">*</span></label><input value={form.fullName} onChange={e => set('fullName', e.target.value)} className="input-field" placeholder="Your full name" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Email <span className="text-red-400">*</span></label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" placeholder="your@email.com" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Country / City</label><input value={form.countryCity} onChange={e => set('countryCity', e.target.value)} className="input-field" placeholder="Port-au-Prince, Haiti" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Department of Interest</label>
              <select value={form.departmentInterest} onChange={e => set('departmentInterest', e.target.value)} className="input-field"><option value="">Select department</option>{DEPARTMENTS.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}</select>
            </div>
            <div><label className="block text-sm font-medium text-navy mb-1">Education Level <span className="text-red-400">*</span></label><input value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)} className="input-field" placeholder="Bachelor, Master, PhD..." /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Profession <span className="text-red-400">*</span></label><input value={form.profession} onChange={e => set('profession', e.target.value)} className="input-field" placeholder="Your current profession" /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Organization</label><input value={form.organization} onChange={e => set('organization', e.target.value)} className="input-field" placeholder="Company, university, NGO..." /></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Area of Expertise</label><input value={form.areaOfExpertise} onChange={e => set('areaOfExpertise', e.target.value)} className="input-field" placeholder="Finance, Education, Agriculture..." /></div>
          </div>

          {/* Proposal */}
          <h2 className="font-display text-xl font-bold text-navy mb-4">Your Proposal</h2>
          <div className="space-y-4 mb-8">
            <div><label className="block text-sm font-medium text-navy mb-1">Proposal Title <span className="text-red-400">*</span></label><input value={form.proposalTitle} onChange={e => set('proposalTitle', e.target.value)} className="input-field" placeholder="A clear, descriptive title for your proposal" /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-navy mb-1">Policy Pillar <span className="text-red-400">*</span></label>
                <select value={form.policyPillar} onChange={e => set('policyPillar', e.target.value)} className="input-field"><option value="">Select pillar</option>{PILLARS.map(p => <option key={p} value={p}>{p}</option>)}</select>
              </div>
              <div><label className="block text-sm font-medium text-navy mb-1">Department Concerned</label>
                <select value={form.departmentConcerned} onChange={e => set('departmentConcerned', e.target.value)} className="input-field"><option value="">National / All departments</option>{DEPARTMENTS.filter(Boolean).map(d => <option key={d} value={d}>{d}</option>)}</select>
              </div>
            </div>
            <div><label className="block text-sm font-medium text-navy mb-1">Problem Addressed <span className="text-red-400">*</span></label><textarea value={form.problemAddressed} onChange={e => set('problemAddressed', e.target.value)} className="input-field" rows={3} placeholder="Describe the problem your proposal aims to solve..." />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{form.problemAddressed.length}/2000 characters {form.problemAddressed.length < 50 && form.problemAddressed.length > 0 ? '(minimum 50 recommended)' : ''}</p></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Proposed Solution <span className="text-red-400">*</span></label><textarea value={form.proposedSolution} onChange={e => set('proposedSolution', e.target.value)} className="input-field" rows={4} placeholder="Describe your proposed solution in detail..." />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{form.proposedSolution.length}/3000 characters {form.proposedSolution.length < 100 && form.proposedSolution.length > 0 ? '(minimum 100 recommended)' : ''}</p></div>
            <div><label className="block text-sm font-medium text-navy mb-1">Expected Impact <span className="text-red-400">*</span></label><textarea value={form.expectedImpact} onChange={e => set('expectedImpact', e.target.value)} className="input-field" rows={3} placeholder="What impact would this proposal have if implemented?" />
            <p className="text-[10px] text-gray-400 mt-1 text-right">{form.expectedImpact.length}/2000 characters {form.expectedImpact.length < 50 && form.expectedImpact.length > 0 ? '(minimum 50 recommended)' : ''}</p></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-navy mb-1">Time Horizon <span className="text-red-400">*</span></label>
                <select value={form.timeHorizon} onChange={e => set('timeHorizon', e.target.value)} className="input-field"><option value="">Select time horizon</option><option value="5 years">5 years</option><option value="10 years">10 years</option><option value="25 years">25 years</option><option value="50 years">50 years</option></select>
              </div>
              <div><label className="block text-sm font-medium text-navy mb-1">Sources / References</label><input value={form.sources} onChange={e => set('sources', e.target.value)} className="input-field" placeholder="Links, studies, reports..." /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-2">Implementation Actors</label>
              <div className="flex flex-wrap gap-2">
                {ACTORS.map(a => (
                  <button key={a} type="button" onClick={() => toggleActor(a)} className={"text-xs px-3 py-1.5 rounded-lg border transition-colors " + (form.implementationActors.includes(a) ? "bg-gold/10 border-gold/30 text-gold font-medium" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gold/20")}>{a}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-3 pt-6 border-t border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.permissionToPublishName} onChange={e => set('permissionToPublishName', e.target.checked)} className="mt-1 rounded border-gray-300" />
              <span className="text-sm text-gray-600">I give permission to display my name and profession publicly with this proposal.</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consentGiven} onChange={e => set('consentGiven', e.target.checked)} className="mt-1 rounded border-gray-300" />
              <span className="text-sm text-gray-600">I confirm that this submission is respectful, constructive, and nonpartisan. I understand it will be reviewed before publication. <span className="text-red-400">*</span></span>
            </label>
          </div>

          <div className="mt-8">
            <button onClick={handleSubmit} disabled={submitting} className="bg-gold hover:bg-gold-300 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Proposal</>}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
