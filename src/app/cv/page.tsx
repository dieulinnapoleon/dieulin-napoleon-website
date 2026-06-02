import type { Metadata } from 'next';
import { GraduationCap, Briefcase, Award, Languages, BadgeCheck, Wrench } from 'lucide-react';
import { getCVData } from '@/lib/data';

export const metadata: Metadata = {
  title: 'CV',
  description: 'Curriculum vitae of Dieulin Napoleon — education, professional experience, skills, and certifications.',
};

export const revalidate = 60;

export default async function CVPage() {
  const cv = await getCVData();

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Resume</p>
          <h1 className="page-header-title">Curriculum Vitae</h1>
          <p className="page-header-subtitle">
            Education, experience, and qualifications.
          </p>
        </div>
      </section>

      <section className="py-section bg-white">
        <div className="section-container max-w-4xl mx-auto">
          {/* Summary */}
          {cv.summary && (
            <div className="mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[15px] text-gray-600 leading-relaxed">{cv.summary}</p>
            </div>
          )}

          {/* Education */}
          <CVSection icon={GraduationCap} title="Education">
            {cv.education.map((edu) => (
              <div key={edu.id} className="py-5 border-b border-gray-100 last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <h3 className="font-display text-base font-semibold text-navy">{edu.degree}</h3>
                  <span className="text-xs font-semibold text-gold bg-gold-50 px-2.5 py-1 rounded shrink-0">
                    {edu.year}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{edu.institution}</p>
                {edu.details && <p className="text-sm text-gray-400">{edu.details}</p>}
              </div>
            ))}
          </CVSection>

          {/* Experience */}
          <CVSection icon={Briefcase} title="Professional Experience">
            {cv.experience.map((exp) => (
              <div key={exp.id} className="py-5 border-b border-gray-100 last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <h3 className="font-display text-base font-semibold text-navy">{exp.title}</h3>
                  <span className="text-xs font-medium text-gray-400 shrink-0">{exp.period}</span>
                </div>
                <p className="text-sm font-medium text-gold-500 mb-2">{exp.organization}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                {exp.sub_items && exp.sub_items.length > 0 && (
                  <div className="mt-3 space-y-2 pl-4 border-l-2 border-gold-100">
                    {exp.sub_items.map((sub, i) => (
                      <div key={i}>
                        <p className="text-sm font-medium text-navy">{sub.university}</p>
                        <p className="text-xs text-gray-500">{sub.courses}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CVSection>

          {/* Skills */}
          {cv.skills.length > 0 && (
            <CVSection icon={Wrench} title="Skills">
              <div className="flex flex-wrap gap-2 py-4">
                {cv.skills.map((skill) => (
                  <span key={skill} className="text-xs font-medium text-navy bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </CVSection>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <CVSection icon={Languages} title="Languages">
              <div className="flex flex-wrap gap-2 py-4">
                {cv.languages.map((lang) => (
                  <span key={lang} className="text-xs font-medium text-navy bg-gold-50 border border-gold-100 px-3 py-1.5 rounded-lg">
                    {lang}
                  </span>
                ))}
              </div>
            </CVSection>
          )}

          {/* Certifications */}
          {cv.certifications.length > 0 && (
            <CVSection icon={BadgeCheck} title="Certifications">
              <ul className="py-4 space-y-2">
                {cv.certifications.map((cert) => (
                  <li key={cert} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gold mt-0.5">•</span> {cert}
                  </li>
                ))}
              </ul>
            </CVSection>
          )}

          {/* Awards */}
          {cv.awards.length > 0 && (
            <CVSection icon={Award} title="Awards & Recognition">
              <ul className="py-4 space-y-2">
                {cv.awards.map((award) => (
                  <li key={award} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gold mt-0.5">★</span> {award}
                  </li>
                ))}
              </ul>
            </CVSection>
          )}
        </div>
      </section>
    </div>
  );
}

function CVSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
          <Icon size={18} className="text-gold" />
        </div>
        <h2 className="font-display text-xl font-semibold text-navy">{title}</h2>
      </div>
      <div className="ml-12">{children}</div>
    </div>
  );
}
