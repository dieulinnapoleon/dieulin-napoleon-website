export interface FinanceExperience {
  title: string;
  organization: string;
  type: string;
  period?: string;
  description: string;
  focus: string[];
  current?: boolean;
}

export const financeExperience: FinanceExperience[] = [
  {
    title: 'Investment Research Intern',
    organization: 'NZS Capital · Denver, CO',
    type: 'Internship',
    period: 'Aug 2026 – Present',
    description: "I recently joined NZS Capital, where I'm gaining hands-on experience in investment research and learning how a professional investment team evaluates ideas.",
    focus: ['Investment Research', 'Industry Analysis'],
    current: true,
  },
  {
    title: 'Portfolio Analyst',
    organization: 'Student-Managed Veteran Fund · Colorado State University',
    type: 'Student-Managed Fund',
    period: 'Jan 2026 – May 2026',
    description: 'Contributed company research, financial modeling, and sector analysis to a student-managed portfolio, presenting recommendations to a faculty investment committee.',
    focus: ['Financial Modeling', 'Sector Analysis', 'Portfolio Review'],
  },
  {
    title: 'CFA Institute Research Challenge',
    organization: 'Colorado Finalist · CFA Society Colorado',
    type: 'Competition',
    period: 'Nov 2025 – Feb 2026',
    description: 'Researched a public company as part of a university team, built a valuation, and defended an investment recommendation through a written report and panel presentation.',
    focus: ['Equity Research', 'Valuation', 'Presentation'],
  },
  {
    title: 'Enterprise Valuation',
    organization: 'Graduate Coursework',
    type: 'Coursework',
    description: 'Graduate coursework building a foundation in valuation methods, financial statement analysis, and the judgment behind valuation assumptions.',
    focus: ['Valuation Methods', 'Financial Analysis'],
  },
];
