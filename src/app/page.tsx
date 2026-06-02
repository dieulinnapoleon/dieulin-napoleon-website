import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Lightbulb, BarChart3, Globe2, Award, BookOpen, GraduationCap, Briefcase, Leaf, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPosts, getProjects, getServices, getSiteSettings } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const [posts, projects, services, siteSettings] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getServices(),
    getSiteSettings(),
  ]);

  const profilePhotoUrl = siteSettings.profile_photo_url || '/images/Dieulin-website.jpg';

  const featuredProjects = projects.slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0d1f3c] to-charcoal" />
        <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(196,149,58,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-[5%] left-[10%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(30,64,175,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="section-container relative z-10 py-32">
          <div className="grid lg:grid-cols-[1fr,400px] gap-16 items-center">
            {/* Left — Main hero content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-gold text-xs font-semibold tracking-[0.06em] uppercase">Available for opportunities</span>
              </div>

              {/* Name + Photo row */}
              <div className="flex items-end gap-6 mb-5">
                <h1 className="font-display text-[clamp(44px,6.5vw,72px)] font-bold text-white leading-[1.05] tracking-tight">
                  Dieulin<br />Napoleon
                </h1>
                {/*
                  PROFILE PHOTO — Replace the placeholder below with your image.
                  1. Add your photo to /public/images/dieulin-napoleon.jpg (or .png)
                  2. Uncomment the <Image> tag and remove the placeholder <div>
                */}
                <div className="hidden md:block shrink-0 mb-2">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30 flex items-center justify-center overflow-hidden">
                    {profilePhotoUrl ? (
                      <Image
                        src={profilePhotoUrl}
                        alt="Dieulin Napoleon professional portrait"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                        priority
                      />
                    ) : (
                      <User size={40} className="text-gold/60" />
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gold-300 text-[clamp(15px,2vw,18px)] font-medium tracking-wide mb-6">
                Finance Professional · Entrepreneur · Project Strategist · Impact-Driven Builder
              </p>

              <p className="text-[17px] text-white/50 leading-[1.85] max-w-xl mb-10">
                With 4 graduate degrees including two from Colorado State University, United States
                of America, I work at the intersection of finance, entrepreneurship, sustainability,
                and technology to build ventures, analyze opportunities, and support projects that
                create measurable economic and social impact.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/cv">
                  <Button className="bg-gold hover:bg-gold-300 text-white">
                    View CV <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" className="border-white/15 text-white/80 hover:bg-white hover:text-navy">
                    Explore Projects
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button variant="outline" className="border-white/15 text-white/80 hover:bg-white hover:text-navy">
                    Read Insights
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/15 text-white/80 hover:bg-white hover:text-navy">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — Credential / profile card */}
            <div className="hidden lg:block">
              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-7 pb-6 border-b border-white/10">
                  {/*
                    Card photo — uses same image as hero.
                    Uncomment <Image> and remove the fallback when you add a photo.
                  */}
                  <div className="w-14 h-14 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center overflow-hidden">
                    {profilePhotoUrl ? (
                      <Image src={profilePhotoUrl} alt="DN" width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-bold text-xl text-white">DN</span>
                    )}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white text-lg">Dieulin Napoleon</p>
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gold">Finance · Impact · Strategy</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { icon: GraduationCap, label: 'Master of Finance', sub: 'Colorado State University, United States, 2026' },
                    { icon: GraduationCap, label: 'Master of Business Administration — Impact MBA', sub: 'Colorado State University, United States, 2026' },
                    { icon: GraduationCap, label: 'Master in Project Management', sub: 'University for International Cooperation, Costa Rica, 2024' },
                    { icon: GraduationCap, label: 'Master of Business Administration', sub: "Institut des Sciences, des Technologies et des Études Avancées d'Haïti (ISTEAH), 2021" },
                    { icon: BarChart3, label: 'CFA Level I Candidate', sub: 'CFA Institute' },
                    { icon: Leaf, label: 'Sustainability Fellow', sub: 'Pegasus Logistics Group, 2025' },
                    { icon: Briefcase, label: 'Founder & Builder', sub: 'Creasti · FINANCEM · GACED · PATRIYA · LINEON' },
                    { icon: BookOpen, label: 'University Lecturer', sub: '4 Institutions in Haiti' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={14} className="text-gold/80" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-white/90 leading-snug">{item.label}</p>
                        <p className="text-[11px] text-white/35 leading-snug">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2">
                  {['English', 'French', 'Kreyòl', 'Spanish'].map((l) => (
                    <span key={l} className="text-[11px] text-white/30 bg-white/5 px-2.5 py-1 rounded-md">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CREDENTIALS BAR ===== */}
      <section className="py-section bg-white">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: TrendingUp, label: 'Master of Finance', sub: 'Colorado State University' },
              { icon: Lightbulb, label: 'Impact MBA', sub: 'Colorado State University' },
              { icon: BarChart3, label: 'CFA Level I', sub: 'Candidate' },
              { icon: Globe2, label: 'MPM', sub: 'UCI Costa Rica' },
              { icon: Award, label: 'CSU Awards', sub: 'Impact & Innovation' },
              { icon: BookOpen, label: 'University Lecturer', sub: '4 Institutions' },
            ].map((cred, i) => (
              <div key={i} className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold-100 transition-colors">
                  <cred.icon size={22} className="text-gold" />
                </div>
                <p className="font-display font-semibold text-navy text-sm">{cred.label}</p>
                <p className="text-xs text-gray-400 mt-1">{cred.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container">
          <p className="page-header-label text-center">Ventures &amp; Projects</p>
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-4">
            What I&apos;m Building
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Technology-enabled platforms and strategic initiatives at the intersection of finance,
            sustainability, and social impact.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link key={project.id} href="/projects" className="card group">
                <div className="card-gold-bar" />
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="category-badge">{project.category}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-navy mb-3 group-hover:text-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="tag">#{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/projects">
              <Button variant="outline">View All Projects <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== RECENT INSIGHTS ===== */}
      <section className="py-section bg-white">
        <div className="section-container">
          <p className="page-header-label text-center">Insights</p>
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-4">
            Thought Leadership
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Writing on finance, entrepreneurship, project management, sustainability, and Haiti&apos;s economic future.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/insights/${post.slug}`} className="card group">
                <div className="card-gold-bar" />
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="category-badge">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.read_time}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy mb-3 group-hover:text-gold transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-gray-300 mt-4">
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/insights">
              <Button variant="outline">Read All Insights <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="py-section bg-gray-50/50">
        <div className="section-container">
          <p className="page-header-label text-center">Services</p>
          <h2 className="font-display text-section-title font-bold text-navy text-center mb-4">
            How I Can Help
          </h2>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
            Strategic support across finance, entrepreneurship, project management, and sustainability.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((svc) => (
              <div key={svc.id} className="p-7 rounded-2xl bg-white border border-gray-100 text-center">
                <h3 className="font-display text-lg font-semibold text-navy mb-3">{svc.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{svc.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button>View Services <ArrowRight size={16} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-section bg-navy relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,149,58,0.08)_0%,transparent_60%)]" />
        <div className="section-container text-center relative z-10">
          <h2 className="font-display text-section-title font-bold text-white mb-6">
            Let&apos;s Build Something <span className="text-gold">Meaningful</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10">
            Whether you&apos;re exploring investment opportunities, building a startup, planning a
            project, or working on Haiti-focused initiatives — I&apos;d love to connect.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/contact">
              <Button size="lg" className="bg-gold hover:bg-gold-300 text-white">
                Get in Touch <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-navy">
                Learn About Me
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
