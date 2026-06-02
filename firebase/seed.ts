/**
 * Firebase Firestore Seed Script
 *
 * Run: npx tsx firebase/seed.ts
 *
 * Requires either:
 *   FIREBASE_SERVICE_ACCOUNT_KEY=./firebase/service-account-key.json
 * or:
 *   FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 *
 * in .env.local
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

// ─── Firebase Admin Init ────────────────────────────────────────────

function getServiceAccount() {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return require(resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
  }
  throw new Error('Set FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_KEY in .env.local');
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(getServiceAccount()) });
}

const db = getFirestore();
const auth = getAuth();

// ─── Helpers ────────────────────────────────────────────────────────

async function seedCollection(name: string, docs: Record<string, any>[], idField?: string) {
  console.log(`\n📦 Seeding ${name}...`);
  for (const doc of docs) {
    const id = idField ? doc[idField] : undefined;
    try {
      if (id) {
        await db.collection(name).doc(id).set(doc, { merge: true });
      } else {
        await db.collection(name).add(doc);
      }
      console.log(`  ✅ ${doc.title || doc.slug || doc.platform || doc.key || id || 'doc'}`);
    } catch (err: any) {
      console.error(`  ❌ ${doc.title || id}:`, err.message);
    }
  }
}

// ─── Main Seed ──────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding Firestore database...\n');

  // ===========================================
  // HERO
  // ===========================================
  console.log('🏠 Seeding hero...');
  await db.collection('hero').doc('main').set({
    tagline: 'Finance · Impact · Strategy',
    title: 'Building at the Intersection of Capital, Technology, and Social Impact',
    subtitle: 'Finance professional with dual graduate degrees from Colorado State University, CFA Level I Candidate, and serial entrepreneur dedicated to creating measurable impact in emerging markets.',
    cta_primary: 'View My Work',
    cta_secondary: 'Get in Touch',
    updated_at: new Date().toISOString(),
  });
  console.log('  ✅ hero/main');

  // ===========================================
  // BLOG POSTS
  // ===========================================
  const now = new Date().toISOString();
  const posts = [
    {
      title: 'Corporate Governance Demystified: Understanding the Language of Corporations',
      slug: 'corporate-governance-demystified',
      category: 'Finance',
      excerpt: 'Every finance professional, investor, and entrepreneur should understand the vocabulary of corporate governance. From shares and dividends to stock options and convertible bonds, mastering this language is essential for navigating capital markets, evaluating investment opportunities, and building ventures that attract institutional capital. This article breaks down the key concepts that define how corporations are structured, governed, and financed.',
      tags: ['corporate governance', 'finance', 'capital markets', 'investing'],
      published: true, featured: true, read_time: '10 min', original_lang: 'fr',
      created_at: '2023-08-15T10:00:00Z', updated_at: now,
      content: [
        { type: 'p', text: "A corporation — also known as a joint-stock company or société anonyme — is a legal entity that is distinct and independent from its shareholders. In the eyes of the law, a corporation is a legal person that enjoys all the rights and assumes the responsibilities of a real person, with the exception of rights that only a natural person can exercise. A corporation can, for example, own property in its own name and be held responsible for its debts." },
        { type: 'p', text: "To form a corporation, founders must complete certain formalities to obtain articles of incorporation from the state. A corporation is administered by a board of directors whose members are elected by the shareholders, and by a management committee made up of individuals who devote their full time to the company's affairs." },
        { type: 'p', text: "The extent of an individual shareholder's ownership is limited to the number of shares of capital stock they hold. Shareholders may at any time transfer some or all of their shares to another investor, making ownership in a corporation easily transferable. This transferability, combined with limited liability, makes the corporation an ideal vehicle for raising substantial capital from multiple shareholders." },
        { type: 'h', text: 'Key Concepts Every Finance Professional Should Know' },
        { type: 'h3', text: '1. Shares (Actions)' },
        { type: 'p', text: 'A share is a negotiable security issued by a corporation representing a fraction of the company\'s capital stock. It is a transferable and negotiable instrument — either registered or bearer — representing a participation in the share capital. Attached to each share are information rights, voting rights at general meetings, and financial rights including dividend entitlements, preferential subscription rights, and liquidation bonuses.' },
        { type: 'h3', text: '2. Preferred Dividend Shares' },
        { type: 'p', text: 'These are shares whose holders do not have voting rights at general meetings but, in return, are entitled to receive a priority dividend before ordinary shareholders. This structure allows companies to raise capital without diluting voting control.' },
        { type: 'h3', text: '3. Shareholders (Actionnaires)' },
        { type: 'p', text: "Any natural person or legal entity holding one or more shares — that is, any person owning a portion of the corporation's equity. Shareholders are the ultimate owners of the company, though their involvement in daily operations varies significantly depending on the corporate structure." },
        { type: 'h3', text: '4. Directors (Administrateurs)' },
        { type: 'p', text: "A director is responsible for managing the affairs of a corporation within which they have been appointed. Directors serve collectively on the board of directors, which typically comprises 3 to 18 members. Directors are appointed at the company's formation by the founding shareholders and may be chosen from among shareholders or from outside the company. Their mandate cannot exceed six years, though they may be re-elected." },
        { type: 'h3', text: '5. Executive Board (Directoire)' },
        { type: 'p', text: "A collective management body found in corporations structured with a supervisory board. The executive board operates under the oversight of the supervisory board and cannot have more than five members, though this is extended to seven when the company's shares are listed on a regulated market." },
        { type: 'h3', text: '6. Dividends' },
        { type: 'p', text: "Income derived from an investment in equity securities. Dividends are generally paid annually and vary according to the company's profits. They may also include an interim payment during the fiscal year before the final balance is distributed." },
        { type: 'h3', text: '7. Voting Rights' },
        { type: 'p', text: 'A fundamental right of shareholders that allows them to participate effectively in collective decisions concerning the issuer. Voting rights can be structured in various ways — some jurisdictions allow double voting rights for shares held in registered form for more than two years, while company bylaws may include caps on voting rights that limit the number of votes any single shareholder can cast.' },
        { type: 'h3', text: '8. Preferential Subscription Rights' },
        { type: 'p', text: 'Rights that allow existing shareholders to subscribe to newly issued shares on a preferential basis during a capital increase. This right is detachable from the share and can be traded on the stock exchange when the issuer is listed. Shareholders can exercise, waive, or transfer this right, with a minimum exercise period of five trading days.' },
        { type: 'h3', text: '9. Convertible Bonds' },
        { type: 'p', text: 'A bond is a debt security issued by a company. The subscriber pays for this instrument and in return receives annual interest called a coupon. A convertible bond gives the holder the option to exchange the bond for shares of the issuing company at a pre-determined conversion ratio. This structure allows issuers to obtain funding at more favorable terms than ordinary bonds, since the implicit value of the conversion right reduces the required interest rate.' },
        { type: 'h3', text: '10. Articles of Incorporation (Statuts)' },
        { type: 'p', text: 'The founding documents that define the rules governing a corporation, including the rights and obligations of its members, its legal structure, and its operational framework. Different corporate forms — sole proprietorship, limited liability company, simplified joint-stock company, or full corporation — are determined by criteria such as the number of partners and minimum capital requirements.' },
        { type: 'h3', text: '11. Stock Options' },
        { type: 'p', text: 'Shares that a company makes available to its employees and executives under advantageous conditions. Stock options are sometimes granted to foster employee motivation or sold at prices well below market value. The holder is taxed on the difference between the actual market price and the purchase price, as well as on any profits realized upon sale.' },
        { type: 'h', text: 'Why This Matters' },
        { type: 'p', text: 'Whether you are evaluating an investment, structuring a startup, or advising a client on capital formation, fluency in the language of corporate governance is not optional — it is foundational. These concepts underpin how companies raise capital, distribute returns, allocate control, and manage accountability. For professionals operating across borders, particularly between the civil law systems of Francophone countries and the common law frameworks of the United States, understanding both traditions creates a significant competitive advantage.' },
        { type: 'note', text: 'Originally published in French on napoleondieulin.blogspot.com (August 2023). Adapted and expanded for an international professional audience.' },
      ],
    },
    {
      title: 'The Anatomy of a Business Plan: A Complete Framework for Entrepreneurs',
      slug: 'anatomy-of-a-business-plan',
      category: 'Entrepreneurship',
      excerpt: "A business plan is simultaneously a working document and a presentation tool — it formalizes your strategy, quantifies your opportunity, and communicates your vision to investors and partners. Whether you are launching a startup, expanding an existing operation, or seeking financing, understanding the full architecture of a professional business plan is the first step toward execution. This guide walks through all ten sections every fundable plan should contain.",
      tags: ['business plan', 'entrepreneurship', 'startups', 'feasibility'],
      published: true, featured: true, read_time: '12 min', original_lang: 'fr',
      created_at: '2017-07-26T10:00:00Z', updated_at: now,
      content: [
        { type: 'p', text: 'If you want your business to survive, grow, and attract capital, you must invest the time to formalize your concept — to define clearly what you want to build, how large you want it to become, and where you see it in three, five, and ten years. The most effective tool for developing this forward-looking vision is the business plan.' },
        { type: 'p', text: 'Small businesses, in particular, should prioritize having a business plan because of their vulnerability to market shocks. But every enterprise — from a newly born startup seeking orientation and financing, to an established company preparing for market volatility, to a large corporation ensuring strategic alignment across divisions — benefits from this discipline.' },
        { type: 'h', text: 'What a Business Plan Actually Is' },
        { type: 'p', text: 'A business plan serves two distinct purposes simultaneously. First, it is a working document in which you formalize your project progressively, ask critical questions about viability and feasibility, define objectives, and identify risks and opportunities. Second, it is a presentation document — derived from the working version — that promotes your project to partners and financiers, serving as the lasting record they will use to evaluate whether to support your venture.' },
        { type: 'p', text: "Starting a business plan is laborious and time-consuming, but necessary. The danger lies in two extremes: abandoning the effort out of intimidation, or diving in so deeply that you lose yourself in spreadsheets and lose contact with reality. The key is to keep the plan's purpose front and center — not just during drafting, but throughout the entire process of shaping, building, and refining the project." },
        { type: 'h', text: 'The Ten Sections of a Complete Business Plan' },
        { type: 'h3', text: 'Section 0: Executive Summary' },
        { type: 'p', text: 'A concise overview of the entire plan — typically written last but placed first. It should capture the essence of your opportunity, your team, your financial projections, and your funding requirements in two to three pages maximum.' },
        { type: 'h3', text: 'Section 1: History and Project Overview' },
        { type: 'p', text: 'The backstory of the company or project, including a description of the venture and a realistic timeline for implementation. This section establishes context and credibility.' },
        { type: 'h3', text: 'Section 2: Ownership and Management Structure' },
        { type: 'p', text: 'Presentation of the ownership structure, shareholder agreements, organizational chart, key management qualifications, the role and composition of the management committee, and a list of external advisors and collaborators.' },
        { type: 'h3', text: 'Section 3: Market Plan' },
        { type: 'p', text: 'A thorough analysis of your products and services, industry sector and trends, target market estimation, market volume and share projections, competitive landscape analysis, and anticipated competitive responses to your market entry.' },
        { type: 'h3', text: 'Section 4: Marketing Strategy' },
        { type: 'p', text: 'Your go-to-market approach across the four pillars: product strategy, pricing strategy, advertising and promotional strategy, and distribution strategy.' },
        { type: 'h3', text: 'Section 5: Operations, Production, and Supply Chain' },
        { type: 'p', text: 'Detailed description of day-to-day operations, production methods, supplier relationships, subcontracting arrangements, environmental compliance, and research and development plans.' },
        { type: 'h3', text: 'Section 6: Human Resources Plan' },
        { type: 'p', text: 'Workforce needs assessment, job descriptions for all positions, and compensation policies. This section demonstrates that you have thought through the people dimension of execution.' },
        { type: 'h3', text: 'Section 7: Financing Plan' },
        { type: 'p', text: "A comprehensive accounting of the project's capital requirements: working capital, initial inventory, real estate, equipment, startup costs, bank financing, venture capital, owner equity contributions, government subsidies, and all other funding sources." },
        { type: 'h3', text: 'Section 8: Financial Projections' },
        { type: 'p', text: 'The quantitative heart of the plan — balance sheet, income statement, cash flow budget, treasury management assumptions, break-even analysis, and sensitivity scenarios. This is where your narrative meets numbers.' },
        { type: 'h3', text: 'Section 9: Risk Management Plan' },
        { type: 'p', text: 'Identification of key risks — market, operational, financial, regulatory — along with mitigation strategies and contingency plans. Investors want to know you have thought about what could go wrong.' },
        { type: 'h3', text: 'Section 10: Appendices' },
        { type: 'p', text: 'Supporting documentation including founder CVs, certificates of incorporation, raw market research data, partnership agreements, personal financial statements, supplier lists, and promotional materials.' },
        { type: 'h', text: 'Adapting the Framework' },
        { type: 'p', text: "This framework can and should be adapted based on the size of your enterprise and the sector in which you operate. A tech startup's plan will emphasize product development and user acquisition metrics differently than a manufacturing company's plan. What matters is that every section is addressed with the depth appropriate to your context." },
        { type: 'p', text: 'Remember: the business plan is a document that will accompany you not only during the genesis of your project, but throughout the early life of your enterprise — and you will likely create new versions as your business evolves.' },
        { type: 'note', text: 'Originally published in French on napoleondieulin.blogspot.com (July 2017). Adapted and expanded for an international professional audience.' },
      ],
    },
    {
      title: 'Difficulties Are Cardboard Walls: A Mindset for Resilience',
      slug: 'difficulties-are-cardboard-walls',
      category: 'Leadership and Ethics',
      excerpt: "Sometimes everything seems to go wrong — unpaid rent, relationship struggles, sudden job loss. But the obstacles we face are rarely as solid as they appear. The difference between people who break through and people who stay stuck is not circumstance — it is attitude. This reflection explores why difficulties are often cardboard walls disguised as concrete, and how choosing your response is the most powerful tool you have.",
      tags: ['resilience', 'mindset', 'leadership', 'personal growth'],
      published: true, featured: false, read_time: '5 min', original_lang: 'fr',
      created_at: '2023-01-15T10:00:00Z', updated_at: now,
      content: [
        { type: 'p', text: 'Sometimes everything seems to go wrong.' },
        { type: 'p', text: "It is the combination of good and bad moments that gives life its true meaning. We always hope the good moments far outnumber the bad. But are there really 'bad moments' in life? What do we actually mean by a 'bad situation'?" },
        { type: 'p', text: 'Is it when we do not have enough money to function? When we cannot pay rent, school fees, or a debt? When there are problems in a relationship? When we suddenly lose a job? This list would be endlessly long if each person had the opportunity to add every difficult situation they have faced.' },
        { type: 'h', text: 'Two Choices' },
        { type: 'p', text: 'When a difficult situation presents itself, you have two fundamental choices.' },
        { type: 'p', text: 'The first is to let the situation defeat you — to remain sad or angry, to declare yourself powerless, to conclude that no change is possible. In this mode, you focus on everything that is wrong. You tell yourself you have no luck. You may even think that God has forgotten you or is ignoring your prayers.' },
        { type: 'p', text: 'The second is to make the deliberate effort to see with a positive lens. You take ownership of the principle that you must manage your problems — not the other way around. You ask yourself: what lesson can I draw from this difficulty? You remind yourself that what does not destroy you must make you stronger.' },
        { type: 'h', text: 'The Cardboard Wall' },
        { type: 'p', text: 'Your life belongs to you. Everything comes down to attitude — the way you respond to what happens to you. Most of the walls we face are not concrete. They are cardboard — they look imposing, they feel solid, but they collapse the moment you push through with determination and clarity.' },
        { type: 'p', text: 'This does not mean difficulties are imaginary. They are real. Financial pressure is real. Loss is real. Uncertainty is real. But the story you tell yourself about those difficulties — whether they define your ceiling or become your staircase — that is entirely within your control.' },
        { type: 'h', text: 'Two Principles to Carry Forward' },
        { type: 'p', text: 'First, it is important to approach moments of pleasure with discernment, because sometimes they can be poisoned gifts — comfort zones that prevent growth, or shortcuts that create long-term costs.' },
        { type: 'p', text: 'Second, it is equally important not to be defeated by difficult moments, because sometimes they are the staircases that lead us toward success. The entrepreneur who fails learns what the classroom cannot teach. The professional who faces rejection develops resilience that compounds over a career. The person who loses everything discovers what truly matters.' },
        { type: 'p', text: 'Have confidence in your purpose. Believe in your objectives. The walls are cardboard.' },
        { type: 'note', text: 'Originally published in French on napoleondieulin.blogspot.com (January 2023). Adapted and expanded for an international professional audience.' },
      ],
    },
    {
      title: 'Leadership Essentials: Power, Styles, and the Art of Influence',
      slug: 'leadership-essentials',
      category: 'Leadership and Ethics',
      excerpt: "Leadership has been at the heart of every major transformation in history — from Moses leading the Israelites to modern corporate visionaries shaping industries. But what exactly is leadership, and how does it differ from management? Drawing on Daniel Goleman's research and classical leadership theory, this article explores the six sources of power, seven leadership styles, and the core competencies — vision, strategy, persuasion, communication, trust, and ethics — that define effective leaders.",
      tags: ['leadership', 'management', 'organizational behavior', 'strategy'],
      published: true, featured: false, read_time: '14 min', original_lang: 'fr',
      created_at: '2017-10-24T10:00:00Z', updated_at: now,
      content: [
        { type: 'p', text: 'Questions of power have always been at the heart of the great transformations and major events that have shaped history — from antiquity to the society in which we live today. But behind every great action and every great event, there is at least one individual possessing certain capabilities and aptitudes that the majority cannot develop: a person who stands apart from the group to guide and orient it.' },
        { type: 'p', text: "The concept of leadership was long synonymous exclusively with command and control. In this framework, the leader exercises hierarchical command functions — generally in a unilateral manner — by giving orders to subordinates who are then supervised and controlled in the execution of their tasks. The only influence relationship between leader and followers is based on the leader's authority and the followers' obedience." },
        { type: 'h', text: 'Defining Leadership' },
        { type: 'p', text: "Leadership, a term borrowed from English, defines the capacity of an individual to lead or conduct other individuals or organizations toward the achievement of certain objectives. Within a group or community, leadership is the relationship of trust established between an individual and the majority of the group's members in the pursuit of a shared objective. This trust can be temporary and must be mutual — the leader must trust the group as much as the group trusts the leader." },
        { type: 'p', text: 'While leadership was historically associated intimately with the personality and charisma of the leader, contemporary research increasingly suggests it is a learned capability — the fruit of experience and tied to specific contexts. In essence, leadership is the art of getting people to accomplish tasks voluntarily. A leader is someone capable of guiding, influencing, and inspiring.' },
        { type: 'h', text: 'The Six Sources of Power' },
        { type: 'p', text: 'Research reveals a variety of sources from which leaders can draw influence, far beyond the traditional command-and-control model:' },
        { type: 'p', text: "Legitimate Power comes from hierarchical position in the organizational structure, granted by a higher authority and accompanied by formal attributes of authority. Coercive Power is the capacity to impose consequences when desired behaviors are not exhibited — criticism, suspension, warnings, psychological pressure, or termination. Reward Power is the ability to control and provide valued rewards — promotions, bonuses, interesting projects, training opportunities, recognition, or time off." },
        { type: 'p', text: "Expert Power derives from possessing expertise valued by others — technical know-how, specialized knowledge, or deep experience. Information Power comes from access to important organizational information and control over its dissemination. Referent Power emerges from being personally appreciated — having team spirit, creating a positive atmosphere — which makes people want to follow your direction and remain loyal." },
        { type: 'p', text: 'The most effective leaders combine multiple sources of power and modulate them according to circumstances. Personal values combined with legitimate authority are more likely to generate voluntary commitment than legitimate authority combined solely with coercion.' },
        { type: 'h', text: 'Seven Leadership Styles' },
        { type: 'p', text: "Drawing on Daniel Goleman's research published in the Harvard Business Review, effective leaders adapt their style to the situation:" },
        { type: 'p', text: 'The Directive Leader operates with authority and leaves little room for personal initiative. Decisions are made unilaterally. This style is useful during crises but can damage morale and motivation when overused. The Pacesetting Leader sets high performance standards and leads by example. This works with highly motivated, competent teams but can quickly discourage those who feel they cannot meet expectations.' },
        { type: 'p', text: 'The Visionary Leader is charismatic and succeeds in uniting teams around a shared project. By transmitting a compelling vision and giving meaning to tasks, this leader generates genuine engagement. The Participative Leader involves others in decision-making, fosters consensus, and develops creativity and initiative. However, decision-making can be slow when every opinion must be considered.' },
        { type: 'p', text: 'The Delegative Leader empowers teams with decision-making authority while remaining available for advice — useful for developing autonomy but risky on high-stakes projects. The Coach Leader invests time developing each team member\'s individual strengths. Results are excellent but take time to appear. The Collaborative Leader prioritizes team cohesion through team-building and collective goal-setting — particularly effective after a crisis when rebuilding trust is the priority.' },
        { type: 'h', text: 'Core Leadership Competencies' },
        { type: 'p', text: 'Across all styles, effective leaders share fundamental competencies. Vision — the ability to imagine a medium- to long-term future that others cannot yet see. Strategy — the capacity to chart a path from a starting position to a desired outcome. Persuasion — the skill of appealing not just to logic but to sentiment to build alignment. Communication — the ability to articulate vision and strategy clearly. Trust — the capacity to inspire confidence. And Ethics — ensuring behavior is consistent with moral principles.' },
        { type: 'h', text: 'Leadership in Practice' },
        { type: 'p', text: "The distinction between managers and leaders rests on two elements: the ability to influence others and convince them to accomplish required tasks, and the manifestation of followers' acceptance of that influence through a positive response. A manager may lack leadership qualities, and a leader may lack management competencies — but the most effective professionals develop both." },
        { type: 'p', text: 'The most important takeaway is that leadership is not static. The best leaders are those who can read the situation, select the appropriate style, draw on the right source of power, and adapt as circumstances evolve. Leadership is learned, practiced, and refined — it is never finished.' },
        { type: 'note', text: 'Originally published in French on napoleondieulin.blogspot.com (October 2017). Adapted and expanded for an international professional audience.' },
      ],
    },
    {
      title: 'Accounting Fundamentals: Why Every Professional Needs Financial Literacy',
      slug: 'accounting-fundamentals',
      category: 'Finance',
      excerpt: "Accounting is often called the language of business — and for good reason. Every transaction, every investment decision, and every strategic pivot ultimately shows up in the financial statements. Yet many professionals, entrepreneurs, and even managers lack a working understanding of how accounting information is produced and what it reveals. From the origins of double-entry bookkeeping in 15th-century Venice to modern financial reporting frameworks, this primer covers what every business-minded person should know.",
      tags: ['accounting', 'financial literacy', 'business', 'education'],
      published: true, featured: false, read_time: '11 min', original_lang: 'fr',
      created_at: '2022-12-17T10:00:00Z', updated_at: now,
      content: [
        { type: 'p', text: 'Information in general constitutes one of the pillars of modern society, to the point of becoming one of the principal resources determining business success. Financial information plays an even more critical role because the vast majority of business transactions are financial in nature. And it is accounting that governs the mechanisms for producing financial information.' },
        { type: 'p', text: "But who needs to understand this particular language? Is accounting only the concern of accountants and entrepreneurs? In reality, everyone conducts business in one form or another, and therefore everyone encounters financial and accounting information daily. Through understanding accounting information, we can make informed judgments on financial questions. An individual examining a company's balance sheet without knowing accounting principles is not only deprived of information — they risk being actively misled." },
        { type: 'h', text: 'What Is Accounting?' },
        { type: 'p', text: 'Accounting can be defined as an information system that transforms all the financial data of an economic entity into coherent and useful information for the various groups and individuals in its environment to support their decision-making. This transformation process comprises four principal stages: collection (recording each relevant financial event from a source document), classification and coding (posting to the general ledger), synthesis (totaling each category and establishing the trial balance), and presentation of pertinent information to users through financial reports.' },
        { type: 'h', text: 'A Brief History' },
        { type: 'p', text: 'While it is difficult to pinpoint precisely the first uses of accounting practices, the invention of double-entry bookkeeping dates to the Middle Ages. However, nearly 2,000 years before Christ, Babylonian merchants were already required to conform to the Code of Hammurabi, which imposed a form of accountability for their transactions.' },
        { type: 'p', text: "The formal codification came with Luca Pacioli's Summa de Arithmetica, published in 1494, whose ninth chapter on commercial matters describes the Venetian method of bookkeeping — known today as double-entry accounting. The term 'double entry' means that every commercial transaction must be recorded in two categories of accounts: one indicating the resource that was used, and the other specifying the use to which it was put." },
        { type: 'p', text: "Double-entry bookkeeping offers the advantage of facilitating the recording of all elements of an enterprise's assets — not only those directly affecting cash flow (an investment, for example) but also operations that have not yet impacted cash (the recording of a receivable, for instance)." },
        { type: 'h', text: 'What Accounting Communicates' },
        { type: 'p', text: "Accounting communicates useful information about two dimensions of an enterprise. Financial performance refers to the generation of new resources through day-to-day operations over a given period — presented in the income statement and the statement of changes in equity. Financial position refers to the totality of an enterprise's resources and financial obligations at a specific date — what it owns (assets), what it owes (liabilities), and what it has (equity) — presented in the balance sheet." },
        { type: 'h', text: 'Types of Accounting' },
        { type: 'p', text: 'There are two major types of accounting used across virtually all forms of enterprise. Financial accounting (or general accounting) is a standardized system providing information to both internal and external users, with the primary objective of measuring financial performance and position. Management accounting (or cost accounting) is a non-standardized system designed to help managers operate the enterprise more effectively by providing specific information tailored to internal decision-making needs.' },
        { type: 'p', text: 'Beyond these two, specialized variations exist: national accounting, which focuses on macroeconomic data such as GDP; public accounting, which records the financial operations of government entities and monitors budget execution; and consolidation accounting, which aggregates the financial statements of corporate groups into unified reports as though the group were a single entity.' },
        { type: 'h', text: 'Who Should Care About Accounting?' },
        { type: 'p', text: 'The short answer: everyone who participates in economic life. Accounting is the language of business, which means all professionals should understand at least its fundamental concepts. Every enterprise exists in constant interaction with employees, suppliers, customers, competitors, creditors, government authorities, and investors. The ability to read and interpret financial statements is not a specialist skill — it is a core professional competency.' },
        { type: 'p', text: 'Whether you are an entrepreneur evaluating your own company\'s health, an investor assessing an opportunity, a manager making budget decisions, or a professional negotiating a contract — accounting literacy gives you the foundation to make informed judgments rather than operating blind.' },
        { type: 'note', text: 'Originally published in French on napoleondieulin.blogspot.com (December 2022). Adapted and expanded for an international professional audience.' },
      ],
    },
    {
      title: 'Understanding Business Valuation', slug: 'understanding-business-valuation', category: 'Finance',
      excerpt: 'Business valuation is both an art and a science. Understanding the key methodologies — DCF, comparable analysis, and precedent transactions — is essential for any finance professional evaluating companies, startups, or investment opportunities.',
      tags: ['valuation', 'finance', 'CFA'],
      published: true, featured: true, read_time: '8 min', created_at: '2024-03-15T10:00:00Z', updated_at: now, content: [],
    },
    {
      title: 'Building Startups as a Graduate Student', slug: 'building-startups-graduate-student', category: 'Entrepreneurship',
      excerpt: "Graduate school offers a unique environment for startup building — access to mentors, resources, competitions, and diverse perspectives that accelerate learning. From Creasti to FINANCEM, here is what I learned about building ventures while earning two master's degrees.",
      tags: ['startups', 'MBA', 'entrepreneurship'],
      published: true, featured: false, read_time: '6 min', created_at: '2024-02-20T10:00:00Z', updated_at: now, content: [],
    },
    {
      title: 'Why Project Execution Fails', slug: 'why-project-execution-fails', category: 'Project Management',
      excerpt: "Most projects don't fail because of bad ideas. They fail because of poor execution — unclear scope, misaligned stakeholders, and inadequate risk management. Drawing on my project management education and consulting experience in Haiti, this article examines the root causes and practical solutions.",
      tags: ['project management', 'execution', 'risk'],
      published: true, featured: false, read_time: '7 min', created_at: '2024-01-10T10:00:00Z', updated_at: now, content: [],
    },
    {
      title: 'Logistics Decarbonization: Pathways to a Greener Supply Chain', slug: 'logistics-decarbonization', category: 'Sustainability and Impact',
      excerpt: "The logistics industry accounts for a significant share of global GHG emissions. Decarbonization requires fleet electrification, route optimization, and supply chain collaboration. Insights from my corporate sustainability fellowship at Pegasus Logistics Group.",
      tags: ['sustainability', 'ESG', 'logistics'],
      published: true, featured: false, read_time: '10 min', created_at: '2024-04-01T10:00:00Z', updated_at: now, content: [],
    },
    {
      title: "Digital Platforms for Haiti's Economic Future", slug: 'digital-platforms-haiti', category: 'Haiti and Development',
      excerpt: "Technology platforms can bridge the gap between Haiti's informal economy and formal financial systems, creating pathways for inclusion and growth. From FINANCEM to LINEON Group, how purpose-built digital tools can transform Haiti's economic landscape.",
      tags: ['Haiti', 'fintech', 'development'],
      published: true, featured: false, read_time: '9 min', created_at: '2024-03-01T10:00:00Z', updated_at: now, content: [],
    },
    {
      title: 'Ethical Leadership in Business: Beyond Compliance', slug: 'ethical-leadership-beyond-compliance', category: 'Leadership and Ethics',
      excerpt: "Ethical leadership isn't about perfection — it's about building systems of accountability, transparency, and genuine care for stakeholders. Reflections from teaching ethics at Colorado State University and leading teams across cultures.",
      tags: ['ethics', 'leadership', 'business'],
      published: true, featured: false, read_time: '5 min', created_at: '2024-02-01T10:00:00Z', updated_at: now, content: [],
    },
  ];

  await seedCollection('blogPosts', posts);

  // ===========================================
  // PROJECTS (with corrected factual data)
  // ===========================================
  const projects = [
    {
      title: 'Creasti', slug: 'creasti', category: 'Startups',
      description: 'A gamified savings and financial wellness app designed to help users build consistent saving habits through goals, streaks, challenges, AI coaching, education, and family circles.',
      problem: 'Many individuals struggle to develop consistent savings habits, lacking tools that make the process engaging and educational.',
      solution: 'Creasti gamifies the savings experience through streak-based goals, AI-powered coaching, family savings circles, and financial literacy modules.',
      role: 'Founder & CEO',
      status: "Active — Award-winning concept at Colorado State University's entrepreneurship ecosystem",
      tech: ['Flutter', 'Firebase', 'Riverpod', 'AI/ML', 'Behavioral Design'],
      impact: 'Impact Award — CSU Institute for Entrepreneurship; Excellence in Social Innovation — CSU Strata; validated with target users',
      url: 'https://creasti.com',
      sort_order: 0, published: true, created_at: now, updated_at: now,
    },
    {
      title: 'FINANCEM', slug: 'financem', category: 'Finance & Investment',
      description: 'A digital wallet concept for Haiti focused on mobile payments, merchant QR acceptance, agent networks, and financial inclusion.',
      problem: 'Haiti has one of the lowest financial inclusion rates in the Western Hemisphere, with most citizens lacking access to formal banking.',
      solution: 'FINANCEM provides a mobile-first digital wallet enabling peer-to-peer payments, merchant QR payments, and cash-in/cash-out through agent networks.',
      role: 'Founder & Strategist', status: 'Concept & Business Plan Stage',
      tech: ['Mobile Payments', 'QR Technology', 'Agent Networks', 'KYC/AML'],
      impact: 'Designed to serve the unbanked population of Haiti',
      sort_order: 1, published: true, created_at: now, updated_at: now,
    },
    {
      title: 'PATRIYA', slug: 'patriya', category: 'Civic Innovation',
      description: 'A civic learning platform designed to help Haitians engage with history, citizenship, patriotism, and civic responsibility through gamified education.',
      problem: 'Civic disengagement and limited understanding of Haitian history, rights, and responsibilities among citizens and diaspora members.',
      solution: 'PATRIYA delivers gamified lessons on Haitian history, civics, and constitutional rights through quizzes, achievements, and community challenges.',
      role: 'Founder & Concept Developer', status: 'Concept Development',
      tech: ['Gamification', 'EdTech', 'Mobile-First Design'],
      impact: 'Targets civic literacy and national identity strengthening',
      sort_order: 2, published: true, created_at: now, updated_at: now,
    },
    {
      title: 'LINEON Group', slug: 'lineon-group', category: 'Haiti-focused Ventures',
      description: "A real estate marketplace connecting property owners, agents, brokers, buyers, renters, and the Haitian diaspora through a professional digital platform.",
      problem: "Haiti's real estate market lacks a transparent, professional digital marketplace for property transactions.",
      solution: 'LINEON Group provides a structured real estate marketplace with verified listings, agent profiles, and tools for diaspora investors.',
      role: 'Founder', status: 'Active Development',
      tech: ['Web Platform', 'GIS Mapping', 'Payment Integration'],
      impact: 'Connecting diaspora capital with local real estate opportunities',
      sort_order: 3, published: true, created_at: now, updated_at: now,
    },
    {
      title: 'ReSource Haiti', slug: 'resource-haiti', category: 'Sustainability / ESG',
      description: 'A circular economy and waste management initiative focused on improving collection, recycling, and environmental outcomes in northern Haiti.',
      problem: 'Cap-Haïtien and the North Department face severe waste management challenges with minimal recycling infrastructure.',
      solution: 'ReSource Haiti proposes a structured waste collection, sorting, and recycling system with community engagement and economic incentives.',
      role: 'Project Lead', status: 'Feasibility Study Complete',
      tech: ['Circular Economy Models', 'GIS Analysis', 'Community Engagement'],
      impact: 'Environmental and economic impact for Cap-Haïtien region',
      sort_order: 4, published: true, created_at: now, updated_at: now,
    },
    {
      title: 'Sustainability & ESG Projects', slug: 'sustainability-esg-projects', category: 'Sustainability / ESG',
      description: 'Work focused on logistics decarbonization, greenhouse gas inventory, recycling strategy, sustainability reporting, and corporate sustainability analysis.',
      problem: 'Companies need data-driven sustainability strategies to reduce environmental impact and meet ESG requirements.',
      solution: 'Delivered greenhouse gas inventories, decarbonization roadmaps, recycling feasibility analyses, and sustainability reporting frameworks.',
      role: 'Corporate Sustainability Fellow & Analyst', status: 'Completed / Ongoing',
      tech: ['GHG Protocol', 'ESG Frameworks', 'Data Analysis', 'Reporting'],
      impact: 'Helped companies measure and reduce environmental footprint',
      sort_order: 5, published: true, created_at: now, updated_at: now,
    },
  ];

  await seedCollection('projects', projects);

  // ===========================================
  // SERVICES
  // ===========================================
  const services = [
    { title: 'Financial Analysis & Valuation', description: 'Rigorous financial modeling, valuation analysis, and investment research to support decision-making.', for_whom: 'Companies, startups, investors, and project sponsors', deliverables: 'Financial models, valuation reports, investment memos, sensitivity analyses', outcomes: 'Informed investment decisions, accurate company valuations, and clear financial projections', icon: 'bar-chart', sort_order: 0, published: true, created_at: now, updated_at: now },
    { title: 'Business Plan & Feasibility Studies', description: 'Comprehensive business plans and feasibility analyses for new ventures, expansions, and capital projects.', for_whom: 'Entrepreneurs, organizations, governments, and NGOs', deliverables: 'Business plans, feasibility reports, market analyses, financial projections', outcomes: 'Fundable business plans, de-risked project decisions, and investor-ready documentation', icon: 'file-text', sort_order: 1, published: true, created_at: now, updated_at: now },
    { title: 'Startup Strategy & Pitch Deck', description: 'Strategic guidance for early-stage ventures including business model refinement, pitch deck creation, and investor readiness.', for_whom: 'Startup founders and early-stage teams', deliverables: 'Pitch decks, business model canvases, go-to-market strategies, financial projections', outcomes: 'Investor-ready pitches, refined business models, and strategic clarity', icon: 'rocket', sort_order: 2, published: true, created_at: now, updated_at: now },
    { title: 'Project Management & Planning', description: 'End-to-end project planning, implementation strategy, and stakeholder management for complex initiatives.', for_whom: 'Organizations, governments, and development agencies', deliverables: 'Project plans, Gantt charts, risk registers, stakeholder analyses, progress reports', outcomes: 'On-time, on-budget project delivery with clear accountability', icon: 'clipboard', sort_order: 3, published: true, created_at: now, updated_at: now },
    { title: 'Sustainability & ESG Strategy', description: 'ESG assessment, sustainability reporting, greenhouse gas inventories, and decarbonization roadmaps.', for_whom: 'Companies seeking sustainability compliance and competitive advantage', deliverables: 'GHG inventories, ESG reports, sustainability strategies, decarbonization plans', outcomes: 'Measurable environmental impact reduction and ESG compliance', icon: 'leaf', sort_order: 4, published: true, created_at: now, updated_at: now },
    { title: 'Haiti Market Entry & Diaspora Strategy', description: 'Strategic guidance for businesses and investors looking to enter the Haitian market or engage the Haitian diaspora.', for_whom: 'Investors, businesses, NGOs, and diaspora entrepreneurs', deliverables: 'Market research, entry strategies, partnership frameworks, risk assessments', outcomes: 'Informed market entry decisions and diaspora engagement strategies', icon: 'globe', sort_order: 5, published: true, created_at: now, updated_at: now },
  ];

  await seedCollection('services', services);

  // ===========================================
  // CV DATA (subcollections)
  // ===========================================
  console.log('\n🎓 Seeding CV data...');

  // Education subcollection
  const education = [
    { degree: 'Master of Finance', institution: 'Colorado State University', year: 'May 2026', details: 'Corporate Finance, Investment Analysis, Valuation, Portfolio Management, Financial Modeling', sort_order: 0 },
    { degree: 'Master of Business Administration — Impact MBA', institution: 'Colorado State University', year: 'May 2026', details: 'Entrepreneurship, Sustainability, Social Impact, Strategy, Innovation', sort_order: 1 },
    { degree: "Master's in Project Management", institution: 'Universidad Para la Cooperación Internacional, Costa Rica', year: 'November 2024', details: 'Project Planning, Risk Management, Stakeholder Management, Feasibility Analysis', sort_order: 2 },
    { degree: 'Master of Business Administration — Accounting and Corporate Taxation', institution: "Institut des Sciences, des Technologies et des Études Avancées d'Haïti (ISTEAH)", year: 'May 2021', details: 'Accounting, Corporate Taxation, Financial Management, Business Strategy', sort_order: 3 },
    { degree: "Bachelor's in Business Administration / Management", institution: 'Université Publique du Nord au Cap-Haïtien', year: 'October 2015', details: 'Business Administration, Management, Operations, Leadership', sort_order: 4 },
    { degree: 'Certificate in Legal Sciences', institution: "Université d'État d'Haïti", year: '2012–2016', details: 'Legal Studies, Haitian Law, Constitutional Law, Administrative Law', sort_order: 5 },
  ];

  for (const edu of education) {
    await db.collection('cvSections').doc('education').collection('items').add(edu);
    console.log(`  ✅ Education: ${edu.degree}`);
  }

  // Experience subcollection
  const experience = [
    { title: 'Corporate Sustainability Fellow', organization: 'Pegasus Logistics Group', period: '2025', description: 'Conducted greenhouse gas inventory, developed decarbonization roadmap, analyzed recycling feasibility, and contributed to sustainability reporting.', sub_items: [], sort_order: 0 },
    { title: 'Graduate Teaching Assistant', organization: 'Colorado State University', period: '2024–2025', description: 'Supported instruction in BUS220: Ethics in Contemporary Organizations. Facilitated discussions, graded assignments, and mentored students.', sub_items: [], sort_order: 1 },
    { title: 'Advisor / Chief of Staff', organization: 'National Port Authority of Haiti (APN)', period: '2018–2022', description: "Provided strategic counsel on operations, policy, and stakeholder management for Haiti's port authority.", sub_items: [], sort_order: 2 },
    { title: 'Co-Founder & CEO', organization: 'GACED Consulting', period: '2016–2022', description: 'Co-founded and led a consulting firm specializing in business plans, feasibility studies, and project management in Haiti.', sub_items: [], sort_order: 3 },
    {
      title: 'Lecturer', organization: 'Multiple Universities, Haiti', period: '2015–2022',
      description: 'Taught undergraduate and graduate courses across four Haitian universities.',
      sub_items: [
        { university: "Institut des Sciences, des Technologies et des Études Avancées d'Haïti (ISTEAH)", courses: 'Financial Accounting, Management, Organizational Behavior' },
        { university: "Université d'État d'Haïti (UEH)", courses: 'Financial Mathematics, Financial Accounting' },
        { university: "Université Notre-Dame d'Haïti", courses: 'Financial Accounting, Management' },
        { university: 'Université Publique du Nord au Cap-Haïtien', courses: 'Financial Mathematics' },
      ],
      sort_order: 4,
    },
  ];

  for (const exp of experience) {
    await db.collection('cvSections').doc('experience').collection('items').add(exp);
    console.log(`  ✅ Experience: ${exp.title}`);
  }

  // CV Meta document
  await db.collection('cvSections').doc('meta').set({
    summary: "Finance professional and entrepreneur with a Master of Finance and Impact MBA from Colorado State University (2026), a Master's in Project Management from Universidad Para la Cooperación Internacional (Costa Rica), and an MBA in Accounting and Corporate Taxation from ISTEAH (Haiti). Experienced in corporate finance, investment analysis, sustainability strategy, project management, public administration, and startup development. CFA Level I Candidate with a track record of building technology-enabled platforms for financial inclusion, civic education, and economic development. Deeply committed to creating measurable impact at the intersection of finance, technology, and social innovation.",
    skills: ['Financial Modeling', 'Valuation (DCF, Comps, Precedent)', 'Investment Analysis', 'Portfolio Management', 'ESG & Sustainability Strategy', 'Business Planning', 'Feasibility Analysis', 'Project Management', 'Pitch Deck Development', 'Market Research', 'Data Analysis', 'Excel / Financial Software', 'Python (basic)', 'Public Speaking', 'Team Leadership'],
    languages: ['English (Fluent)', 'French (Fluent)', 'Haitian Creole (Native)', 'Spanish (Conversational)'],
    certifications: ['CFA Level I Candidate', 'Project Management Professional Development', 'Corporate Sustainability Training'],
    awards: ['CFA Research Challenge — Semifinalist / Finalist', 'National Ethics Case Competition — Semifinalist', 'Impact Award — CSU Institute for Entrepreneurship (Creasti)', 'Excellence in Social Innovation — CSU Strata (Creasti)'],
  });
  console.log('  ✅ CV Meta');

  // ===========================================
  // SOCIAL LINKS
  // ===========================================
  const socialLinks = [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/dieulinnapoleon/', icon: 'linkedin', sort_order: 0 },
    { platform: 'Blog', url: 'https://napoleondieulin.blogspot.com/', icon: 'globe', sort_order: 1 },
    { platform: 'Email', url: 'mailto:contact@dieulinnapoleon.com', icon: 'mail', sort_order: 2 },
  ];

  await seedCollection('socialLinks', socialLinks);

  // ===========================================
  // MEDIA ITEMS
  // ===========================================
  const mediaItems = [
    { title: 'Impact Award — CSU Institute for Entrepreneurship', description: 'Awarded for Creasti, a gamified savings and financial wellness app.', type: 'award', date: '2025', sort_order: 0 },
    { title: 'Excellence in Social Innovation — CSU Strata', description: 'Recognized for social impact through entrepreneurship with Creasti.', type: 'award', date: '2025', sort_order: 1 },
    { title: 'CFA Research Challenge', description: 'Semifinalist / Finalist in the CFA Institute Research Challenge.', type: 'award', date: '2025', sort_order: 2 },
    { title: 'National Ethics Case Competition', description: 'Semifinalist in the national ethics case competition.', type: 'award', date: '2025', sort_order: 3 },
    { title: 'University Lecturer — Four Institutions', description: "Taught financial accounting, management, and financial mathematics across ISTEAH, UEH, Université Notre-Dame d'Haïti, and Université Publique du Nord au Cap-Haïtien.", type: 'speaking', sort_order: 4 },
    { title: 'Graduate Teaching Assistant — Colorado State University', description: 'Supported instruction in BUS220: Ethics in Contemporary Organizations.', type: 'speaking', date: '2024–2025', sort_order: 5 },
    { title: 'LinkedIn', description: 'Professional networking and thought leadership.', type: 'platform', url: 'https://www.linkedin.com/in/dieulinnapoleon/', sort_order: 6 },
    { title: 'napoleondieulin.blogspot.com', description: 'Personal blog with articles on finance, leadership, and entrepreneurship (French).', type: 'platform', url: 'https://napoleondieulin.blogspot.com/', sort_order: 7 },
  ];

  await seedCollection('mediaItems', mediaItems);

  // ===========================================
  // SITE SETTINGS (document ID = setting key)
  // ===========================================
  console.log('\n⚙️  Seeding site settings...');
  const siteSettings = [
    { id: 'site_title', value: 'Dieulin Napoleon | Finance · Impact · Strategy' },
    { id: 'site_description', value: 'Finance professional, entrepreneur, and project strategist building at the intersection of capital markets, technology, and social impact.' },
    { id: 'contact_email', value: 'contact@dieulinnapoleon.com' },
  ];

  for (const setting of siteSettings) {
    await db.collection('siteSettings').doc(setting.id).set({ value: setting.value });
    console.log(`  ✅ ${setting.id}`);
  }

  // ===========================================
  // ADMIN USER
  // ===========================================
  console.log('\n👤 Setting up admin user...');
  console.log('  ℹ️  To create an admin user:');
  console.log('  1. Create a user in Firebase Console → Authentication');
  console.log('  2. Copy the user UID');
  console.log('  3. Add to Firestore: adminUsers/{uid} → { email, role: "admin" }');
  console.log('');
  console.log('  Or run this after creating the Firebase Auth user:');
  console.log('  firebase firestore:set adminUsers/YOUR_UID \'{"email":"you@example.com","role":"admin"}\'');

  console.log('\n✨ Seed complete!\n');
}

seed().catch(console.error);
