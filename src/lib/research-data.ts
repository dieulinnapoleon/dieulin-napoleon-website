export interface ResearchItem {
  slug: string;
  title: string;
  company: string;
  ticker?: string;
  sector?: string;
  type: string;
  date?: string;
  summary: string;
  thesis?: string[];
  methodology: string[];
  keyTakeaways?: string[];
  recommendation?: string;
  targetPrice?: string;
  pdfUrl?: string;
  skills: string[];
  published: boolean;
}

export const RESEARCH_DISCLAIMER =
  'This research is independent work prepared for educational and professional development purposes. It is not investment advice, a solicitation, or a recommendation to buy or sell any security. Analysis is based on public information available at the time of writing and may not reflect current conditions.';

export const researchItems: ResearchItem[] = [
  {
    slug: 'ncr-voyix-vyx-equity-research',
    title: 'NCR Voyix (VYX): Fundamental Equity Research and DCF Valuation',
    company: 'NCR Voyix Corporation',
    ticker: 'NYSE: VYX',
    sector: 'Technology · Retail & Restaurant Commerce Software',
    type: 'Equity Research',
    summary:
      'An independent fundamental analysis of NCR Voyix built from primary SEC filings, examining the business model, historical financial performance, and intrinsic value through a discounted cash flow framework.',
    methodology: [
      'Primary-source review of SEC filings (Form 10-K and 10-Q)',
      'Historical analysis of revenue, margins, and cash flow',
      'Discounted cash flow (DCF) valuation with explicit forecast assumptions',
      'Identification of key value drivers and risks',
    ],
    skills: ['Financial Statement Analysis', 'DCF Valuation', 'SEC Filings', 'Equity Research'],
    published: true,
  },
];
