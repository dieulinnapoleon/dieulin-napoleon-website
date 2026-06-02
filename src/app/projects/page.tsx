import type { Metadata } from 'next';
import { getProjects } from '@/lib/data';
import { ProjectsClient } from './projects-client';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Ventures and initiatives spanning fintech, civic innovation, sustainability, and economic development by Dieulin Napoleon.',
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <section className="page-header">
        <div className="section-container">
          <p className="page-header-label">Portfolio</p>
          <h1 className="page-header-title">Projects &amp; Ventures</h1>
          <p className="page-header-subtitle">
            Ventures and initiatives spanning fintech, civic innovation, sustainability, and economic development.
          </p>
        </div>
      </section>

      <ProjectsClient projects={projects} />
    </div>
  );
}
