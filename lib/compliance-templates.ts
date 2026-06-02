// ─── Compliance Training Templates ──────────────────────────────────────────
// Each template auto-creates a full course: title, description, tags,
// 10 quiz questions, 5 scenario slides, and curated source links.

export interface Slide {
  title: string
  body: string
  scenario?: string         // scenario question text
  options?: string[]        // 4 answer options
  correct?: number          // 0-indexed correct answer
  tip?: string              // explanation shown after answering
}

export interface Source {
  label: string
  url: string
  type: 'free' | 'paid' | 'government'
  description: string
}

export interface Question {
  text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
}

export interface ComplianceTemplate {
  id: string
  title: string
  description: string
  tags: string[]
  industry: string
  regulator: string
  frequency: string
  slides: Slide[]
  questions: Question[]
  sources: Source[]
}

export const COMPLIANCE_TEMPLATES: ComplianceTemplate[] = [

  // ── AML ─────────────────────────────────────────────────────────────────────
  {
    id: 'aml-fundamentals',
    title: 'Anti-Money Laundering (AML) Fundamentals',
    description: 'Core BSA/AML compliance training covering suspicious activity detection, SAR filing, CTR requirements, and customer due diligence. Required annually for all financial institution employees.',
    tags: ['Finance', 'Banking', 'Crypto', 'AML', 'BSA', 'Compliance', 'Annual'],
    industry: 'Financial Services',
    regulator: 'FinCEN / FINRA',
    frequency: 'Annual',
    sources: [
      { label: 'FinCEN AML Training Materials', url: 'https://www.fincen.gov/resources/statutes-and-regulations/bank-secrecy-act', type: 'government', description: 'Official FinCEN guidance, advisories, and training resources — free' },
      { label: 'FFIEC BSA/AML Examination Manual', url: 'https://bsaaml.ffiec.gov/manual', type: 'government', description: 'The definitive examiner manual — read to understand exactly what auditors look for' },
      { label: 'ACAMS Training', url: 'https://www.acams.org/en/training', type: 'paid', description: 'Industry-standard AML certification courses (~$300-$500)' },
      { label: 'YouTube: FinCEN Educational Videos', url: 'https://www.youtube.com/@FinCENGov', type: 'free', description: 'Official FinCEN educational content on YouTube' },
      { label: 'LinkedIn Learning: AML Compliance', url: 'https://www.linkedin.com/learning/search?keywords=anti+money+laundering', type: 'paid', description: 'Multiple AML courses with certificates (~$30/mo subscription)' },
    ],
    slides: [
      {
        title: 'What is Money Laundering?',
        body: 'Money laundering is the process of making illegally obtained funds appear legitimate. It occurs in three stages:\n\n**1. Placement** — Dirty money enters the financial system (cash deposits, wire transfers).\n\n**2. Layering** — Funds are moved through complex transactions to obscure the trail (shell companies, international transfers).\n\n**3. Integration** — Clean funds re-enter the economy (real estate, luxury goods, business investments).\n\nYou are the first line of defense.',
      },
      {
        title: 'Red Flags You Must Know',
        body: 'These behaviors warrant a Suspicious Activity Report (SAR):\n\n• Customer refuses to provide ID or explanation for unusual activity\n• Transactions just below reporting thresholds (structuring)\n• Large cash transactions inconsistent with the customer\'s business\n• Rapid movement of funds: in one account, out another\n• Shell companies with no apparent business purpose\n• Customers from high-risk countries with no legitimate reason\n• Reluctance to provide source of funds',
        scenario: 'A customer makes 4 cash deposits of $2,400 each on the same day at different branches. What is this called?',
        options: ['Normal banking activity', 'Structuring (smurfing) — a federal crime', 'Currency Transaction Report trigger', 'Enhanced Due Diligence requirement'],
        correct: 1,
        tip: 'Structuring (breaking up transactions to avoid the $10,000 CTR threshold) is itself a federal crime under 31 U.S.C. § 5324, separate from any underlying crime.',
      },
      {
        title: 'CTR vs SAR — Know the Difference',
        body: '**Currency Transaction Report (CTR)**\n• Required for ALL cash transactions over $10,000 in a single business day\n• Filed within 15 days\n• No judgment required — automatic\n• Customer must be notified (generally)\n\n**Suspicious Activity Report (SAR)**\n• Required when you SUSPECT money laundering, fraud, or other financial crime\n• Filed within 30 days of detection (60 if still investigating)\n• Customer must NOT be notified ("tipping off" is a crime)\n• No minimum dollar amount — $0 transactions can require a SAR',
        scenario: 'You discover a customer is using multiple accounts to funnel funds to a company with no employees or website. You file a SAR. Can you tell the customer?',
        options: ['Yes, out of professional courtesy', 'Yes, if they ask directly', 'No — tipping off is a federal crime', 'Only after 30 days'],
        correct: 2,
        tip: 'Tipping off a SAR subject is a federal crime under 31 U.S.C. § 5318(g)(2). Never disclose that a SAR has been filed or that an investigation is underway.',
      },
      {
        title: 'Know Your Customer (KYC)',
        body: 'KYC is your institution\'s process for verifying who your customers are before doing business.\n\n**Customer Identification Program (CIP)** — Collect name, DOB, address, and ID number for individuals.\n\n**Customer Due Diligence (CDD)** — Understand the nature and purpose of the relationship. Know what "normal" looks like for this customer.\n\n**Enhanced Due Diligence (EDD)** — Required for high-risk customers: PEPs (politically exposed persons), high-risk countries, cash-intensive businesses, shell companies.\n\n**Beneficial Ownership** — For legal entities, you must identify individuals who own 25%+ or exercise control.',
      },
      {
        title: 'Your Responsibilities',
        body: 'Every employee — not just compliance staff — has AML obligations:\n\n✅ Complete annual AML training\n✅ Know the red flags for your role\n✅ Report suspicious activity to your BSA/AML Officer immediately\n✅ Never tip off a customer who is under review\n✅ Maintain customer records as required (5 years minimum)\n\n**The consequences of failure:**\n• Institution: fines up to $1M per violation, loss of charter\n• You personally: up to 10 years imprisonment, $500K fine\n\nIf you see something, say something — to your supervisor or BSA Officer.',
        scenario: 'A colleague says a CTR filing is "too much paperwork" and suggests skipping it for a good customer who deposits $12,000 cash. What do you do?',
        options: ['Agree — good customers don\'t need to be reported', 'File the CTR anyway — it\'s legally required', 'Report only if the customer seems nervous', 'Ask a manager if the customer qualifies for an exemption'],
        correct: 1,
        tip: 'CTRs are mandatory for all cash transactions over $10,000. There are limited exemptions for certain businesses, but they require formal documentation — not judgment calls. Failure to file is a federal crime.',
      },
    ],
    questions: [
      { text: 'What is the minimum cash transaction amount that requires filing a Currency Transaction Report (CTR)?', option_a: '$5,000', option_b: '$10,000', option_c: '$25,000', option_d: '$50,000', correct_answer: 'B' },
      { text: 'Within how many days must a Suspicious Activity Report (SAR) be filed after detecting suspicious activity?', option_a: '15 days', option_b: '45 days', option_c: '30 days', option_d: '60 days', correct_answer: 'C' },
      { text: 'What is "structuring" in the context of AML?', option_a: 'Creating complex corporate ownership structures', option_b: 'Breaking up large transactions to avoid CTR reporting thresholds', option_c: 'Organizing a compliance program', option_d: 'Layering funds through multiple accounts', correct_answer: 'B' },
      { text: 'What does "tipping off" mean in AML compliance?', option_a: 'Providing a tip to law enforcement about suspicious activity', option_b: 'Notifying a customer that they are the subject of a SAR', option_c: 'Filing a SAR before completing an investigation', option_d: 'Sharing customer information with a business partner', correct_answer: 'B' },
      { text: 'Which stage of money laundering involves moving funds through complex transactions to obscure the trail?', option_a: 'Placement', option_b: 'Integration', option_c: 'Layering', option_d: 'Structuring', correct_answer: 'C' },
      { text: 'What is the minimum ownership percentage that triggers Beneficial Ownership reporting requirements?', option_a: '10%', option_b: '15%', option_c: '20%', option_d: '25%', correct_answer: 'D' },
      { text: 'What does PEP stand for in AML/KYC?', option_a: 'Primary Enforcement Protocol', option_b: 'Politically Exposed Person', option_c: 'Pre-Employment Program', option_d: 'Potential Exposure to Prosecution', correct_answer: 'B' },
      { text: 'Which of the following is the BEST description of Enhanced Due Diligence (EDD)?', option_a: 'Standard identity verification for all customers', option_b: 'Additional scrutiny applied to high-risk customers and relationships', option_c: 'A process for filing SARs automatically', option_d: 'Background checks on all employees', correct_answer: 'B' },
      { text: 'How long must financial institutions generally retain BSA/AML records?', option_a: '1 year', option_b: '3 years', option_c: '5 years', option_d: '10 years', correct_answer: 'C' },
      { text: 'If a customer deposits $9,500 cash and asks you not to report it "because it\'s under $10,000," what should you do?', option_a: 'Honor the request — it\'s below the threshold', option_b: 'File a SAR — the request itself is a red flag', option_c: 'Consult a supervisor but take no immediate action', option_d: 'File a CTR since the customer mentioned the threshold', correct_answer: 'B' },
    ],
  },

  // ── HIPAA Privacy ────────────────────────────────────────────────────────────
  {
    id: 'hipaa-privacy',
    title: 'HIPAA Privacy Rule Training',
    description: 'Comprehensive HIPAA Privacy Rule training for covered entities and business associates. Covers PHI definition, patient rights, permissible disclosures, and minimum necessary standard.',
    tags: ['Healthcare', 'HIPAA', 'Privacy', 'PHI', 'Compliance', 'Annual'],
    industry: 'Healthcare',
    regulator: 'HHS Office for Civil Rights (OCR)',
    frequency: 'Annual',
    sources: [
      { label: 'HHS HIPAA for Professionals', url: 'https://www.hhs.gov/hipaa/for-professionals/index.html', type: 'government', description: 'Official HHS guidance, training materials, and compliance tools — all free' },
      { label: 'HHS HIPAA Training Videos', url: 'https://www.hhs.gov/hipaa/for-professionals/training/index.html', type: 'government', description: 'Free OCR training modules for workforce training documentation' },
      { label: 'HIPAA Journal Training Resources', url: 'https://www.hipaajournal.com/hipaa-training/', type: 'free', description: 'Comprehensive free training articles and quizzes' },
      { label: 'Compliancy Group eLearning', url: 'https://compliancy-group.com/hipaa-training/', type: 'paid', description: 'HIPAA eLearning with completion certificates suitable for audit documentation' },
      { label: 'YouTube: HHS HIPAA Tutorials', url: 'https://www.youtube.com/@HHSgov', type: 'free', description: 'Official HHS channel with HIPAA educational content' },
    ],
    slides: [
      {
        title: 'What is Protected Health Information (PHI)?',
        body: 'PHI is any health information that can identify an individual, in any form — paper, electronic (ePHI), or verbal.\n\n**The 18 HIPAA identifiers include:**\nName, address, dates (except year), phone, fax, email, SSN, medical record numbers, health plan numbers, account numbers, certificate numbers, VINs, device IDs, URLs, IPs, biometrics, photos, and any other unique identifier.\n\n**PHI examples:**\n• "Patient John Smith has diabetes" ✗ PHI\n• "A 45-year-old male patient has diabetes" — may be PHI if identifiable in your context\n• Aggregated, de-identified statistics ✓ Not PHI',
      },
      {
        title: 'The Minimum Necessary Standard',
        body: 'You should only access, use, or disclose the minimum amount of PHI necessary to accomplish the intended purpose.\n\nAsk yourself before accessing records:\n\n✅ Do I need this information to do my job right now?\n✅ Am I accessing only what I need — not the whole record?\n✅ Is this request appropriate for my role?\n\n**What this means in practice:**\n• A billing clerk does NOT need to access a patient\'s full clinical notes\n• A nurse treating a patient does NOT need to review records from 10 years ago (usually)\n• You should NOT look up records of family members or celebrities out of curiosity',
        scenario: 'You work in billing. A coworker asks you to pull up a patient\'s full psychiatric history "just to understand the charges." What do you do?',
        options: ['Pull up the records — a coworker must have a legitimate reason', 'Decline — psychiatric records require specific authorization and billing only needs diagnoses/codes', 'Pull up only the psychiatric notes, not the billing records', 'Escalate to a physician to decide'],
        correct: 1,
        tip: 'Billing staff should only access the minimum PHI needed for billing — typically diagnosis codes, procedure codes, and dates of service. Full clinical records, especially psychiatric records, require special authorization.',
      },
      {
        title: 'When Can PHI Be Disclosed Without Authorization?',
        body: 'You can disclose PHI without patient authorization for:\n\n**Treatment** — Sharing with other providers involved in the patient\'s care\n\n**Payment** — Submitting claims, coordinating benefits\n\n**Healthcare Operations** — Quality improvement, staff training, audits, legal compliance\n\n**Required by Law** — Court orders, mandatory reporting (abuse, infectious disease)\n\n**Public Health** — CDC reporting, vital statistics\n\n**Law Enforcement** — With specific legal requirements (warrant, court order)\n\n**Everything else requires a signed HIPAA authorization from the patient.**',
      },
      {
        title: 'Patient Rights Under HIPAA',
        body: 'Patients have the following rights you must honor:\n\n**Right of Access** — Must provide records within 30 days (can charge reasonable cost-based fee)\n\n**Right to Amend** — Patient can request corrections to their record\n\n**Right to an Accounting of Disclosures** — Must track and report non-TPO disclosures for 6 years\n\n**Right to Restrict** — Patient can request limits on use/disclosure (must honor if they pay out of pocket)\n\n**Right to Confidential Communications** — Honor reasonable alternative communication requests\n\n**Right to Notification of Breach** — Must notify within 60 days of discovering a breach',
      },
      {
        title: 'Breach: What to Do',
        body: 'A breach is any impermissible use or disclosure of PHI that compromises its security or privacy.\n\n**If you discover or suspect a breach:**\n1. Stop the breach immediately if possible\n2. Report to your Privacy Officer IMMEDIATELY — do not wait\n3. Document what happened (who, what, when, where)\n4. Do NOT try to "fix it" on your own\n\n**Consequences of unreported breaches:**\n• OCR fines: $100 to $50,000 per violation, up to $1.9M per category per year\n• Criminal charges for intentional violations (up to 10 years)\n• Reputational damage, loss of contracts\n\nWhen in doubt — REPORT IT.',
        scenario: 'You accidentally send a patient\'s discharge summary to the wrong email address. The recipient replies saying they received it. What is the FIRST thing you do?',
        options: ['Reply to both emails apologizing', 'Delete your sent email and hope it resolves itself', 'Immediately notify your Privacy Officer', 'Wait to see if the patient complains'],
        correct: 2,
        tip: 'Always report immediately. Trying to handle a breach yourself can make it worse legally. Your Privacy Officer needs to assess if this is a reportable breach under the 4-factor risk assessment.',
      },
    ],
    questions: [
      { text: 'PHI stands for:', option_a: 'Personal Health Identification', option_b: 'Protected Health Information', option_c: 'Private Health Insurance', option_d: 'Primary Health Indicator', correct_answer: 'B' },
      { text: 'The minimum necessary standard requires that you access only:', option_a: 'Information approved by your supervisor', option_b: 'The full medical record for any treatment activity', option_c: 'The minimum PHI needed to accomplish the intended purpose', option_d: 'Information that is more than one year old', correct_answer: 'C' },
      { text: 'Which of the following does NOT require patient authorization for disclosure?', option_a: 'Sharing records with an employer for employment purposes', option_b: 'Sharing records with a life insurance company', option_c: 'Sharing records with another treating physician', option_d: 'Sharing records with a patient\'s attorney', correct_answer: 'C' },
      { text: 'How long does a covered entity have to provide a patient\'s records after receiving an access request?', option_a: '15 days', option_b: '30 days (extendable by 30 more)', option_c: '60 days', option_d: '90 days', correct_answer: 'B' },
      { text: 'If a patient pays fully out-of-pocket for a service, they have the right to:', option_a: 'Request their records for free', option_b: 'Restrict disclosure to their health plan', option_c: 'Waive the Notice of Privacy Practices', option_d: 'Access records of other patients with the same condition', correct_answer: 'B' },
      { text: 'A healthcare employee looks up a celebrity patient\'s records out of curiosity. This is:', option_a: 'Permissible if done on a personal device', option_b: 'A HIPAA violation regardless of whether the information is shared', option_c: 'Acceptable under the treatment exception', option_d: 'Permissible if the patient is a public figure', correct_answer: 'B' },
      { text: 'How many of the HIPAA "18 identifiers" must be removed for data to be considered de-identified?', option_a: '10 of the 18', option_b: '15 of the 18', option_c: 'All 18', option_d: '12 of the 18', correct_answer: 'C' },
      { text: 'Within how many days of discovering a breach must patients be notified?', option_a: '30 days', option_b: '45 days', option_c: '60 days', option_d: '90 days', correct_answer: 'C' },
      { text: 'What is a Business Associate Agreement (BAA)?', option_a: 'A contract between a hospital and its medical staff', option_b: 'A written contract with vendors who access PHI on your behalf', option_c: 'A patient consent form for data sharing', option_d: 'An agreement between insurance companies', correct_answer: 'B' },
      { text: 'Which of the following is the BEST example of the minimum necessary standard?', option_a: 'A billing clerk accessing only diagnosis codes and dates, not clinical notes', option_b: 'A receptionist reading a patient\'s full history to answer scheduling questions', option_c: 'A nurse downloading all patient records before going on vacation', option_d: 'An IT technician accessing patient records to test a new system', correct_answer: 'A' },
    ],
  },

  // ── Sexual Harassment Prevention ─────────────────────────────────────────────
  {
    id: 'sexual-harassment-prevention',
    title: 'Sexual Harassment Prevention',
    description: 'Comprehensive workplace harassment prevention training covering quid pro quo, hostile work environment, bystander intervention, and reporting procedures. Meets CA/NY/IL mandatory requirements.',
    tags: ['HR', 'Employment', 'Compliance', 'Annual', 'All Industries', 'California', 'New York'],
    industry: 'All Industries',
    regulator: 'EEOC / State Labor Commissions',
    frequency: 'Annual (CA/NY: mandatory)',
    sources: [
      { label: 'EEOC Sexual Harassment Resources', url: 'https://www.eeoc.gov/sexual-harassment', type: 'government', description: 'Official EEOC guidance on harassment law — free' },
      { label: 'California DFEH Training Videos', url: 'https://www.dfeh.ca.gov/resources/educational-resources/training/', type: 'government', description: 'Free CA DFEH compliance training videos — satisfies CA mandate for hourly employees' },
      { label: 'SHRM Harassment Prevention Training', url: 'https://www.shrm.org/resourcesandtools/hr-topics/employee-relations/pages/workplace-harassment-training.aspx', type: 'paid', description: 'SHRM comprehensive training modules with certificates' },
      { label: 'Traliant Harassment Training', url: 'https://www.traliant.com/courses/preventing-harassment/', type: 'paid', description: 'State-specific harassment prevention courses that meet NY/CA/IL requirements' },
      { label: 'YouTube: EEOC Training Webinars', url: 'https://www.youtube.com/@USEEOC', type: 'free', description: 'Free EEOC training webinars and educational content' },
    ],
    slides: [
      {
        title: 'Two Types of Sexual Harassment',
        body: '**Quid Pro Quo ("This for That")**\nA supervisor conditions employment decisions (hiring, promotion, raises, continued employment) on submitting to sexual demands.\n\n*Example: "Sleep with me and I\'ll give you that promotion."*\n\n**Hostile Work Environment**\nConduct that is so severe or pervasive that it creates an intimidating, offensive, or abusive work environment — even without economic harm.\n\n*Examples: Repeated sexual jokes, displaying explicit images, unwanted touching, persistent flirting after rejection*\n\n**Both are illegal under Title VII of the Civil Rights Act — and under most state laws.**',
      },
      {
        title: 'What Counts as Harassment?',
        body: 'Harassing conduct can be verbal, physical, or visual:\n\n**Verbal:** Sexual comments, jokes, propositions, discussing sexual activities, commenting on appearance in a sexual way\n\n**Physical:** Unwanted touching, blocking someone\'s path, inappropriate gestures\n\n**Visual:** Displaying explicit images, sending sexual emails/texts/memes, graffiti\n\n**Important facts:**\n• Either gender can be the victim or harasser\n• The harasser and victim can be the same sex\n• The victim doesn\'t have to be the person directly targeted\n• Harassment can come from a non-employee (customer, vendor, contractor)\n• YOU don\'t have to be the target to file a complaint',
        scenario: 'A manager regularly tells sexual jokes at team meetings. Some employees laugh, but others are uncomfortable. Is this sexual harassment?',
        options: ['No — if some employees don\'t mind, it\'s not harassment', 'No — jokes are protected speech in the workplace', 'Yes — it can create a hostile work environment even if some employees laugh', 'Only if the jokes are about a specific person'],
        correct: 2,
        tip: 'Harassment is evaluated by whether it would offend a "reasonable person," not whether everyone is offended. If conduct is severe or pervasive enough to create an offensive work environment for a reasonable person, it\'s harassment.',
      },
      {
        title: 'What is NOT Harassment',
        body: 'Not every uncomfortable interaction is illegal harassment:\n\n✓ A single off-color comment (usually) — must be severe or pervasive\n✓ Mutual, welcome flirting between adults\n✓ Constructive criticism of work performance\n✓ Personality conflicts not based on protected characteristics\n\n**However:**\n• "I thought they were OK with it" is NOT a defense\n• Once someone signals discomfort, continuing IS harassment\n• Isolated incidents CAN be harassment if they are severe enough (e.g., assault)\n\nWhen in doubt — don\'t say it, don\'t do it.',
      },
      {
        title: 'Bystander Intervention',
        body: 'You have a responsibility to act if you witness harassment.\n\n**The 4 D\'s of Bystander Intervention:**\n\n**Direct** — Interrupt the behavior: "Hey, that\'s not cool."\n\n**Delegate** — Get someone else to help: HR, a manager, a supervisor\n\n**Distract** — Break up the situation: "Sarah, can I talk to you for a second?"\n\n**Document** — Write down what you saw (who, what, when, where). Share with HR.\n\n**You cannot be retaliated against for good-faith reports.** Retaliation is itself an illegal act under Title VII.',
        scenario: 'You witness a coworker making repeated unwanted advances to a new employee who looks uncomfortable. What should you do?',
        options: ['Ignore it — it\'s not your business', 'Tell the new employee they should report it themselves', 'Intervene directly or report to HR — you have an obligation as a bystander', 'Wait to see if the new employee files a complaint'],
        correct: 2,
        tip: 'Bystanders who intervene prevent escalation and protect their colleagues. More importantly, organizations that encourage bystander reporting have significantly fewer harassment incidents.',
      },
      {
        title: 'Reporting & Your Rights',
        body: '**How to report harassment:**\n1. Tell the harasser to stop (if safe to do so)\n2. Document incidents (dates, times, witnesses, exact words/actions)\n3. Report to HR, a manager (not the harasser), or use your ethics hotline\n4. Keep copies of everything you submit\n\n**Your rights:**\n• You CANNOT be retaliated against for a good-faith report\n• Retaliation (demotion, firing, hostile treatment) is its own federal violation\n• You can file directly with the EEOC or your state agency\n• Time limits apply: typically 180-300 days from the incident\n\n**If you are a manager:** You have a DUTY to report harassment you witness or know about — even if the victim doesn\'t want to report.',
      },
    ],
    questions: [
      { text: 'Quid pro quo sexual harassment occurs when:', option_a: 'Two coworkers have a consensual relationship', option_b: 'A supervisor conditions employment decisions on sexual favors', option_c: 'An employee tells an off-color joke once', option_d: 'Coworkers disagree about workplace policies', correct_answer: 'B' },
      { text: 'Which of the following is TRUE about hostile work environment harassment?', option_a: 'It requires physical contact to be illegal', option_b: 'It must happen every day to qualify as harassment', option_c: 'It can include verbal, visual, and physical conduct', option_d: 'It only applies to behavior from supervisors', correct_answer: 'C' },
      { text: 'If an employee reports harassment in good faith, the employer:', option_a: 'May demote them if the claim is unfounded', option_b: 'Cannot retaliate against them under federal law', option_c: 'Must keep the report secret from all managers', option_d: 'Has 90 days to begin an investigation', correct_answer: 'B' },
      { text: 'Sexual harassment can occur:', option_a: 'Only between members of opposite sexes', option_b: 'Only when there is physical contact', option_c: 'Between members of the same sex', option_d: 'Only in manager-to-employee situations', correct_answer: 'C' },
      { text: 'Which of the following is the BEST example of the "Direct" bystander intervention technique?', option_a: 'Pretending not to notice the harassment', option_b: 'Reporting the incident to HR after the fact', option_c: 'Immediately saying "Hey, that\'s not appropriate" to interrupt the behavior', option_d: 'Asking a colleague to handle it', correct_answer: 'C' },
      { text: 'A manager who witnesses harassment but does nothing may:', option_a: 'Be personally liable for the harassment', option_b: 'Be excused if they were not the direct target', option_c: 'Only be responsible after a second incident', option_d: 'Avoid liability by referring to the employee handbook', correct_answer: 'A' },
      { text: 'Harassment from a customer or vendor directed at your employee:', option_a: 'Is not covered by EEOC regulations', option_b: 'Can still create employer liability if the employer fails to address it', option_c: 'Is the employee\'s personal problem to manage', option_d: 'Only applies if it happens on company property', correct_answer: 'B' },
      { text: 'How long does an employee typically have to file an EEOC charge of discrimination/harassment?', option_a: '30 days from the incident', option_b: '90 days from the incident', option_c: '180-300 days from the incident', option_d: '1 year from the incident', correct_answer: 'C' },
      { text: 'California law requires sexual harassment training for managers every:', option_a: '6 months', option_b: '1 year', option_c: '2 years', option_d: '3 years', correct_answer: 'C' },
      { text: 'An employee who laughs at sexual jokes at work but later claims harassment:', option_a: 'Cannot bring a valid harassment claim', option_b: 'May still have a valid claim — past tolerance does not create future consent', option_c: 'Must wait 6 months before reporting', option_d: 'Must prove the conduct continued after a written complaint', correct_answer: 'B' },
    ],
  },

  // ── Cybersecurity Awareness ──────────────────────────────────────────────────
  {
    id: 'cybersecurity-awareness',
    title: 'Cybersecurity Awareness Training',
    description: 'Essential cybersecurity training covering phishing recognition, password security, social engineering, safe browsing, incident reporting, and data handling. Required for all employees.',
    tags: ['Technology', 'Cybersecurity', 'All Industries', 'Finance', 'Healthcare', 'SOC 2', 'Annual'],
    industry: 'All Industries',
    regulator: 'NIST / CISA / SOC 2 / HIPAA Security',
    frequency: 'Annual (SOC 2 requires documented completion)',
    sources: [
      { label: 'CISA Free Cybersecurity Training', url: 'https://www.cisa.gov/cybersecurity-training-exercises', type: 'government', description: 'Free CISA training resources including phishing exercises and awareness content' },
      { label: 'SANS Security Awareness', url: 'https://www.sans.org/security-awareness-training/', type: 'paid', description: 'Industry-leading security awareness platform with phishing simulations' },
      { label: 'KnowBe4 Security Awareness', url: 'https://www.knowbe4.com/security-awareness-training', type: 'paid', description: 'Comprehensive platform with automated phishing tests and training (~$20/user/year)' },
      { label: 'Google Phishing Quiz', url: 'https://phishingquiz.withgoogle.com/', type: 'free', description: 'Free interactive phishing identification quiz — excellent for training' },
      { label: 'NIST Cybersecurity Resources', url: 'https://www.nist.gov/cyberframework', type: 'government', description: 'NIST Cybersecurity Framework — the gold standard for enterprise security' },
    ],
    slides: [
      {
        title: 'The #1 Threat: Phishing',
        body: 'Phishing is the attempt to trick you into revealing credentials, clicking malicious links, or installing malware — via email, text (smishing), or phone (vishing).\n\n**Phishing red flags:**\n• Urgency — "Act NOW or your account will be closed!"\n• Generic greeting — "Dear Customer" instead of your name\n• Suspicious sender — "support@paypa1.com" not "support@paypal.com"\n• Unexpected attachments or links\n• Requests for passwords, SSNs, payment info via email\n• Grammar/spelling errors (though AI has improved this)\n\n**When in doubt: don\'t click. Call the sender directly using a number you know.**',
        scenario: 'You receive an email from "IT Department <it-support@company-helpdesk.net>" asking you to verify your password within 24 hours or lose access. What do you do?',
        options: ['Click the link and enter your password quickly', 'Ignore it — IT never contacts employees via email', 'Call IT using the phone number from the company directory (not from the email) to verify', 'Forward it to colleagues to warn them'],
        correct: 2,
        tip: 'Never click links in urgent security emails. Always verify by contacting IT through a trusted channel. Legitimate IT departments will never ask for your password.',
      },
      {
        title: 'Password Security',
        body: '**The rules have changed.** NIST 2023 guidelines recommend:\n\n✅ Use a **passphrase** — 4+ random words ("purple-coffee-lighthouse-42")\n✅ Use a **password manager** (1Password, Bitwarden, LastPass)\n✅ Enable **Multi-Factor Authentication (MFA)** on all accounts\n✅ Use a **unique password** for every account\n\n❌ Don\'t use the same password everywhere\n❌ Don\'t use birthdays, names, or pet names\n❌ Don\'t write passwords on sticky notes\n❌ Don\'t share passwords with anyone — including IT\n\n**MFA matters:** Even if attackers get your password, MFA stops 99.9% of automated attacks (Microsoft research).',
      },
      {
        title: 'Social Engineering',
        body: 'Social engineering is psychological manipulation to get you to bypass security procedures.\n\n**Common tactics:**\n\n**Pretexting** — Caller claims to be IT, your bank, a vendor: "I need your login to fix this issue."\n\n**Baiting** — Leaving USB drives in parking lots. Curiosity kills security.\n\n**Tailgating** — Following you through a secured door without badging in.\n\n**Authority** — "This is the CEO. I need this done NOW before I land."\n\n**Remember:** Legitimate requests don\'t require bypassing security procedures. When pressured — SLOW DOWN. Verify through official channels.',
      },
      {
        title: 'Safe Data Handling',
        body: '**Classify before you share:**\n• **Confidential/Secret** — Never share externally without authorization (customer data, health records, trade secrets)\n• **Internal Only** — Share within the company only\n• **Public** — Safe to share externally\n\n**Safe practices:**\n• Lock your screen when you walk away (Win+L / Cmd+Ctrl+Q)\n• Don\'t work on confidential data in public (coffee shops, planes)\n• Encrypt sensitive files before emailing\n• Use approved cloud storage only (not personal Dropbox/Google Drive)\n• Shred physical documents before disposal\n• Report lost devices IMMEDIATELY',
      },
      {
        title: 'Incident Reporting',
        body: 'If you click a phishing link, lose a device, or notice something suspicious:\n\n**Report IMMEDIATELY. Do not wait.**\n\nThe average cost of a breach is $4.45M (IBM 2023). The average time to detect: 204 days. Every hour matters.\n\n**What to do:**\n1. Disconnect from WiFi/network if you think you\'ve been compromised\n2. Call your IT/Security team NOW\n3. Do NOT try to fix it yourself\n4. Preserve evidence — don\'t delete suspicious emails\n\n**You will NOT be in trouble for reporting a mistake quickly. You WILL be in trouble for hiding it.**\n\nAnonymous reporting: [Your company\'s ethics hotline]',
        scenario: 'You accidentally clicked a link in a suspicious email and now your browser is acting strangely. What is the first thing you do?',
        options: ['Run an antivirus scan and hope for the best', 'Restart your computer to clear the issue', 'Immediately disconnect from the network and call IT Security', 'Close the browser tab — that should fix it'],
        correct: 2,
        tip: 'Immediately disconnecting from the network limits the damage by preventing malware from communicating with its command-and-control server or spreading to other systems.',
      },
    ],
    questions: [
      { text: 'Which of the following is the BEST indicator of a phishing email?', option_a: 'The email uses your full name', option_b: 'The email creates urgency and requests you to verify credentials via a link', option_c: 'The email comes from a colleague\'s address', option_d: 'The email has no attachments', correct_answer: 'B' },
      { text: 'According to NIST guidelines, the best password strategy is:', option_a: 'A complex 8-character password with symbols, changed every 90 days', option_b: 'Using your name and birth year across all systems', option_c: 'A long, unique passphrase with MFA enabled on each account', option_d: 'The same strong password reused across trusted sites', correct_answer: 'C' },
      { text: 'Multi-Factor Authentication (MFA) blocks approximately what percentage of automated attacks?', option_a: '60%', option_b: '75%', option_c: '90%', option_d: '99.9%', correct_answer: 'D' },
      { text: 'What is "tailgating" in cybersecurity?', option_a: 'Monitoring an employee\'s internet activity', option_b: 'Following an authorized person through a secured door without badging in', option_c: 'Reading someone\'s email over their shoulder', option_d: 'Leaving USB drives for employees to find', correct_answer: 'B' },
      { text: 'You find a USB drive in the parking lot. What should you do?', option_a: 'Plug it in to see whose it is so you can return it', option_b: 'Turn it in to IT without plugging it in', option_c: 'Plug it into a personal device instead of a work device', option_d: 'Delete it to protect company data', correct_answer: 'B' },
      { text: 'You accidentally clicked a suspicious email link. The FIRST thing you should do is:', option_a: 'Change your password', option_b: 'Disconnect from the network and call IT immediately', option_c: 'Run an antivirus scan', option_d: 'Restart your computer', correct_answer: 'B' },
      { text: 'Which of the following is an approved method for sharing confidential documents with an external partner?', option_a: 'Attaching them to a personal Gmail message', option_b: 'Uploading to your personal Dropbox and sharing the link', option_c: 'Using company-approved encrypted file transfer', option_d: 'Printing and mailing them', correct_answer: 'C' },
      { text: 'A caller claims to be from IT and needs your password to fix an urgent system issue. You should:', option_a: 'Provide it — IT has a legitimate need', option_b: 'Provide it only if they know your employee ID', option_c: 'Refuse — IT will never ask for your password', option_d: 'Provide a temporary password you create', correct_answer: 'C' },
      { text: 'How long does it take, on average, for organizations to detect a data breach?', option_a: '24 hours', option_b: '2 weeks', option_c: '204 days', option_d: '30 days', correct_answer: 'C' },
      { text: 'What is pretexting?', option_a: 'Sending phishing emails', option_b: 'Using a fabricated scenario to manipulate someone into providing information', option_c: 'Testing security systems with authorized penetration tests', option_d: 'Reviewing an employee\'s communications before hiring', correct_answer: 'B' },
    ],
  },

  // ── OSHA Fall Protection ─────────────────────────────────────────────────────
  {
    id: 'osha-fall-protection',
    title: 'OSHA Fall Protection Training',
    description: 'OSHA 29 CFR 1926.502 compliant fall protection training for construction and general industry. Covers PFAS, guardrails, warning lines, covers, and rescue planning.',
    tags: ['Construction', 'Trades', 'OSHA', 'Safety', 'Annual', 'Fall Protection'],
    industry: 'Construction / Trades',
    regulator: 'OSHA (29 CFR 1926.502)',
    frequency: 'Annual + when conditions change',
    sources: [
      { label: 'OSHA Fall Protection Publication 3146', url: 'https://www.osha.gov/sites/default/files/publications/OSHA3146.pdf', type: 'government', description: 'Free OSHA fall protection guide — downloadable PDF' },
      { label: 'OSHA Training Institute (OTI)', url: 'https://www.osha.gov/ote/training-resources', type: 'government', description: 'Free and subsidized OSHA training through OTI education centers' },
      { label: 'OSHA YouTube Channel', url: 'https://www.youtube.com/@USDOL', type: 'free', description: 'Free OSHA training videos covering fall protection and other topics' },
      { label: '360training OSHA 10/30', url: 'https://www.360training.com/osha-training/', type: 'paid', description: 'OSHA 10 and 30-hour courses with OSHA card (~$45-$189)' },
      { label: 'National Safety Council Training', url: 'https://www.nsc.org/training/construction-safety', type: 'paid', description: 'NSC construction safety training with certificates' },
    ],
    slides: [
      { title: 'The Fatal Four', body: 'Falls are the #1 cause of construction fatalities. OSHA\'s "Fatal Four" cause 60% of all construction deaths:\n\n1. **Falls** — 36.4% of deaths\n2. **Struck by object** — 10.8%\n3. **Electrocution** — 8.5%\n4. **Caught-in/between** — 2.4%\n\nFall protection is required at 6 feet in construction (29 CFR 1926.502) and 4 feet in general industry. You have the right to refuse unsafe work.' },
      { title: 'Your Three Options', body: '**OSHA requires one of three fall protection systems:**\n\n1. **Guardrail Systems** — Top rail 42" high (±3"), mid-rail, toe board. Must withstand 200 lbs.\n\n2. **Safety Net Systems** — Must be installed within 30 feet of working surface\n\n3. **Personal Fall Arrest System (PFAS)** — Full-body harness + lanyard/SRL + anchor point rated for 5,000 lbs per worker\n\nYour employer must provide fall protection AND train you to use it. Refusing to use it puts your life at risk and violates OSHA regulations.', scenario: 'You are working on a roof at 8 feet. Your supervisor says "just be careful — no harness needed for short jobs." What do you do?', options: ['Agree — 8 feet isn\'t that high', 'Work quickly to minimize risk', 'Refuse unsafe work — fall protection is required above 6 feet in construction', 'Use the harness only near the edge'], correct: 2, tip: 'OSHA 1926.502 requires fall protection at 6 feet in construction. Workers have the right to refuse work they reasonably believe poses imminent danger without fear of retaliation.' },
      { title: 'Inspecting Your Harness', body: 'Before every use, inspect your Personal Fall Arrest System:\n\n**Harness:**\n✓ No cuts, fraying, or broken stitching\n✓ All buckles function properly\n✓ Labels are readable\n\n**Lanyard/SRL:**\n✓ No kinks, cuts, or chemical damage\n✓ Snap hooks engage and lock\n✓ SRL retracts and locks\n\n**Anchor Point:**\n✓ Rated for 5,000 lbs minimum per worker\n✓ Structurally sound (no corrosion, damage)\n\n**If in doubt — tag it out.** Never use damaged equipment.' },
      { title: 'Ladder Safety', body: '**Ladder falls cause 300 deaths per year in the US.**\n\n**Safe ladder use:**\n• Set at 4:1 angle (1 foot out for every 4 feet up)\n• Three points of contact at all times (2 hands + 1 foot, or 2 feet + 1 hand)\n• Never stand on top two rungs\n• Extend 3 feet above roofline for roof access\n• Face the ladder when climbing\n• Never carry tools in your hands — use a tool belt or hoist\n• Use a spotter or tie-off on extension ladders\n• Inspect before each use — no cracks, bent rungs, missing feet' },
      { title: 'Rescue Planning', body: 'A rescue plan must be in place BEFORE anyone goes up. Suspension trauma can cause death within 15-20 minutes if a fallen worker hangs in a harness without rescue.\n\n**Your rescue plan must include:**\n• Who is responsible for rescue\n• How to get an injured worker down quickly\n• What equipment is staged\n• How to call for emergency help\n• First aid for suspension trauma\n\n**Suspension trauma symptoms:** Fainting, difficulty breathing, leg tingling. After rescue: do NOT immediately lay victim flat — sit them in a V position for 30 minutes.' },
    ],
    questions: [
      { text: 'At what height does OSHA require fall protection in construction?', option_a: '4 feet', option_b: '6 feet', option_c: '8 feet', option_d: '10 feet', correct_answer: 'B' },
      { text: 'Which of the following is NOT one of OSHA\'s "Fatal Four" in construction?', option_a: 'Falls', option_b: 'Electrocution', option_c: 'Repetitive strain injuries', option_d: 'Struck by object', correct_answer: 'C' },
      { text: 'An anchor point for a personal fall arrest system must be rated for at least:', option_a: '1,000 lbs per worker', option_b: '2,500 lbs per worker', option_c: '5,000 lbs per worker', option_d: '3,500 lbs per worker', correct_answer: 'C' },
      { text: 'The correct angle to set a portable ladder against a wall is:', option_a: '1 foot out for every 2 feet up (2:1)', option_b: '1 foot out for every 3 feet up (3:1)', option_c: '1 foot out for every 4 feet up (4:1)', option_d: '1 foot out for every 6 feet up (6:1)', correct_answer: 'C' },
      { text: 'For roof access, a portable ladder should extend above the roofline by at least:', option_a: '1 foot', option_b: '2 feet', option_c: '3 feet', option_d: '4 feet', correct_answer: 'C' },
      { text: 'You find a harness with a small cut in one of the straps. You should:', option_a: 'Use it — small cuts don\'t affect performance', option_b: 'Tape the cut and use it', option_c: 'Tag it out and remove it from service', option_d: 'Use it only at heights under 10 feet', correct_answer: 'C' },
      { text: 'Suspension trauma (orthostatic shock) can become fatal within approximately:', option_a: '5 minutes', option_b: '15-20 minutes', option_c: '45 minutes', option_d: '1-2 hours', correct_answer: 'B' },
      { text: 'How many points of contact should you maintain on a ladder?', option_a: '1 hand and both feet', option_b: '3 points (2 hands + 1 foot, or 2 feet + 1 hand)', option_c: '2 hands only', option_d: '4 points at all times', correct_answer: 'B' },
      { text: 'If your supervisor tells you to work at 8 feet without fall protection, you have the right to:', option_a: 'Work faster to minimize the risk', option_b: 'Refuse the unsafe work without fear of retaliation', option_c: 'Comply only for tasks under 30 minutes', option_d: 'Report to OSHA but comply in the meantime', correct_answer: 'B' },
      { text: 'Safety nets must be installed within how many feet below the working surface?', option_a: '15 feet', option_b: '20 feet', option_c: '30 feet', option_d: '40 feet', correct_answer: 'C' },
    ],
  },

  // ── HEALTHCARE ──────────────────────────────────────────────────────────────

  {
    id: 'hipaa-privacy-security',
    title: 'HIPAA Privacy & Security',
    description: 'Annual mandatory training covering Protected Health Information (PHI), patient privacy rights, the Security Rule for electronic PHI, and breach notification requirements. Required for all workforce members who access PHI.',
    tags: ['Healthcare', 'HIPAA', 'Privacy', 'PHI', 'Annual', 'Mandatory'],
    industry: 'Healthcare',
    regulator: 'HHS / OCR',
    frequency: 'Annual',
    sources: [
      { label: 'HHS HIPAA Training Materials', url: 'https://www.hhs.gov/hipaa/for-professionals/training/index.html', type: 'government', description: 'Official HHS training resources and guidance — free' },
      { label: 'OCR HIPAA Enforcement', url: 'https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/index.html', type: 'government', description: 'Real enforcement actions and settlements — shows what gets you fined' },
      { label: 'HIPAA Journal Training', url: 'https://www.hipaajournal.com/hipaa-training/', type: 'free', description: 'Comprehensive free HIPAA training guides' },
    ],
    slides: [
      {
        title: 'What is PHI and Why Does It Matter?',
        body: 'Protected Health Information (PHI) is any information that can identify a patient AND relates to their health condition, treatment, or payment.\n\n**18 PHI identifiers include:**\n• Name, address, phone, email\n• Dates (birth, admission, discharge)\n• Social Security Number\n• Medical record numbers\n• Photos, fingerprints\n• Any other unique identifier\n\nA HIPAA violation can cost your organization **$100 to $50,000 per violation** — up to $1.9M per year for repeated violations. Criminal penalties can include **up to 10 years in federal prison**.',
      },
      {
        title: 'The Minimum Necessary Rule',
        body: 'You may only access, use, or share the **minimum amount of PHI necessary** to do your job.\n\n**Allowed without authorization:**\n• Treatment — sharing with providers directly involved in care\n• Payment — billing and insurance processing\n• Healthcare Operations — quality improvement, training, audits\n\n**Requires patient authorization:**\n• Marketing\n• Selling PHI\n• Most research\n• Disclosures to employers\n\n**Never browse patient records out of curiosity** — even family members. "Snooping" is the #1 cause of employee terminations for HIPAA violations.',
        scenario: 'A coworker mentions that a celebrity was admitted last night. You are curious and look up their chart even though they are not your patient. This is:',
        options: ['Allowed — you work at the hospital', 'A HIPAA violation — minimum necessary rule', 'OK if you tell no one', 'Fine since it is internal access'],
        correct: 1,
        tip: '"Snooping" on patient records without a treatment purpose is a HIPAA violation regardless of whether you share the information. Many healthcare workers have been terminated and prosecuted for this.',
      },
      {
        title: 'The Security Rule — Protecting Electronic PHI',
        body: 'The HIPAA Security Rule requires safeguards for **electronic PHI (ePHI)**:\n\n**Administrative:**\n• Unique user IDs — never share passwords\n• Automatic logoff on unattended workstations\n• Workforce training (this course)\n\n**Physical:**\n• Lock screens before leaving a workstation\n• Position monitors so visitors cannot see patient data\n• Secure disposal of printed PHI (shred, don\'t recycle)\n\n**Technical:**\n• Encrypt devices containing ePHI\n• Use only approved, encrypted email for PHI\n• Never email PHI to personal accounts\n• Do not store PHI on personal devices',
        scenario: 'You need to email a patient\'s lab results to their specialist. What do you do?',
        options: ['Send from your work email to their work email', 'Use your personal Gmail — it\'s faster', 'Use your organization\'s encrypted/secure email system', 'Text the results for speed'],
        correct: 2,
        tip: 'PHI must be encrypted in transit. Regular email is not secure. Use your organization\'s approved secure messaging or encrypted email system.',
      },
      {
        title: 'Breach Notification — What You Must Do',
        body: 'A **breach** is any impermissible use or disclosure of PHI that compromises its security.\n\n**You MUST report immediately to your supervisor or Privacy Officer if:**\n• You sent PHI to the wrong person\n• A device with PHI was lost or stolen\n• You left printed PHI in a public area\n• You suspect unauthorized access to records\n• You received PHI you weren\'t supposed to get\n\n**Breach notification timelines:**\n• Notify affected individuals: within 60 days\n• Notify HHS Secretary: within 60 days\n• If 500+ individuals: notify prominent media outlets\n\n**The #1 rule: Report it immediately. Do NOT try to handle it yourself.**',
        scenario: 'You accidentally fax a patient\'s discharge summary to the wrong number. What do you do?',
        options: ['Hope the recipient ignores it and do nothing', 'Tell no one — it was an honest mistake', 'Report it immediately to your supervisor or Privacy Officer', 'Wait to see if anyone calls about it'],
        correct: 2,
        tip: 'Even accidental disclosures must be reported. The sooner it is reported, the better the organization can respond and potentially limit the breach. Trying to cover it up makes things significantly worse.',
      },
      {
        title: 'Patient Rights Under HIPAA',
        body: 'Patients have the right to:\n\n• **Access their records** — within 30 days of request\n• **Request corrections** — to inaccurate information\n• **Accounting of disclosures** — list of who received their PHI\n• **Restrict disclosures** — to certain payers or people\n• **Confidential communications** — choose how they are contacted\n• **File a complaint** — with HHS OCR without retaliation\n\n**Your role:**\nIf a patient asks about their rights, direct them to your organization\'s Privacy Officer. Never tell a patient they cannot see their own records.',
      },
    ],
    questions: [
      { text: 'HIPAA stands for:', option_a: 'Health Insurance Portability and Accountability Act', option_b: 'Healthcare Information Privacy and Accountability Act', option_c: 'Hospital Information Protection and Access Act', option_d: 'Health Information Procedures and Administration Act', correct_answer: 'A' },
      { text: 'How many PHI identifiers are defined under HIPAA?', option_a: '10', option_b: '14', option_c: '18', option_d: '22', correct_answer: 'C' },
      { text: 'The minimum necessary standard means:', option_a: 'Share the minimum amount required by law', option_b: 'Only access and share PHI needed for your specific job function', option_c: 'Use minimum encryption for PHI', option_d: 'Train staff on a minimum annual basis', correct_answer: 'B' },
      { text: 'Which of the following requires patient authorization before disclosure?', option_a: 'Sharing with another treating provider', option_b: 'Billing insurance', option_c: 'Marketing to the patient', option_d: 'Quality improvement review', correct_answer: 'C' },
      { text: 'You left a patient chart on the break room table for 10 minutes. This is:', option_a: 'Fine if no visitors were present', option_b: 'A potential HIPAA breach requiring reporting', option_c: 'Only a problem if someone read it', option_d: 'Not a HIPAA issue for paper records', correct_answer: 'B' },
      { text: 'The maximum civil penalty per HIPAA violation per year is:', option_a: '$10,000', option_b: '$250,000', option_c: '$1,000,000', option_d: '$1,919,173', correct_answer: 'D' },
      { text: 'If a device containing ePHI is lost or stolen, you must report it within:', option_a: '24 hours to HHS', option_b: 'Immediately to your supervisor — then 60 days for official notifications', option_c: '30 days if under 500 records', option_d: 'Only if PHI was accessed', correct_answer: 'B' },
      { text: 'A patient has the right to access their own medical records within:', option_a: '15 days', option_b: '30 days', option_c: '45 days', option_d: '60 days', correct_answer: 'B' },
      { text: 'Sharing a coworker\'s login credentials is:', option_a: 'Acceptable in emergencies', option_b: 'A Security Rule violation', option_c: 'Only a problem if misused', option_d: 'Required for coverage purposes', correct_answer: 'B' },
      { text: 'Which action is allowed without patient authorization?', option_a: 'Selling patient data to a pharmaceutical company', option_b: 'Sharing records for treatment with another provider', option_c: 'Using PHI for a marketing campaign', option_d: 'Giving records to an employer', correct_answer: 'B' },
    ],
  },

  {
    id: 'infection-control',
    title: 'Infection Control & Hand Hygiene',
    description: 'Evidence-based infection prevention for healthcare settings. Covers hand hygiene, standard and transmission-based precautions, PPE use, and healthcare-associated infection prevention. Required annually per Joint Commission and CDC standards.',
    tags: ['Healthcare', 'Infection Control', 'Hand Hygiene', 'PPE', 'CDC', 'Joint Commission', 'Annual'],
    industry: 'Healthcare',
    regulator: 'CDC / Joint Commission',
    frequency: 'Annual',
    sources: [
      { label: 'CDC Hand Hygiene in Healthcare', url: 'https://www.cdc.gov/handhygiene/index.html', type: 'government', description: 'CDC guidelines and training resources — free' },
      { label: 'WHO Hand Hygiene Guidelines', url: 'https://www.who.int/teams/integrated-health-services/infection-prevention-control/hand-hygiene', type: 'government', description: 'WHO five moments of hand hygiene — global standard' },
      { label: 'Joint Commission Infection Prevention', url: 'https://www.jointcommission.org/resources/patient-safety-topics/infection-prevention-and-control/', type: 'free', description: 'Joint Commission standards and resources' },
    ],
    slides: [
      {
        title: 'Why Hand Hygiene Saves Lives',
        body: 'Healthcare-Associated Infections (HAIs) affect **1 in 31 hospital patients** on any given day in the United States. They cause:\n\n• ~99,000 deaths per year\n• $28–45 billion in additional healthcare costs annually\n• Extended hospital stays averaging 6–17 extra days\n\n**Hand hygiene is the single most effective way to prevent HAIs.**\n\nStudies show healthcare workers clean their hands less than half the time they should. The consequences are preventable deaths.',
      },
      {
        title: 'The 5 Moments of Hand Hygiene (WHO)',
        body: 'The WHO defines 5 critical moments requiring hand hygiene:\n\n**1. Before touching a patient**\nPrevents transmission of organisms from environment to patient\n\n**2. Before a clean/aseptic procedure**\nPrevents organisms on hands entering the patient\'s body\n\n**3. After body fluid exposure risk**\nProtects YOU and prevents cross-transmission\n\n**4. After touching a patient**\nPrevents transmission from patient to environment\n\n**5. After touching patient surroundings**\nPrevents transmission even if you didn\'t touch the patient',
        scenario: 'You enter a patient\'s room to check their IV. You touch the IV pump (but not the patient) and then leave. When must you perform hand hygiene?',
        options: ['Only if you touched the patient directly', 'Only before entering the next room', 'After touching the patient\'s surroundings — Moment 5', 'Hand hygiene is not required in this scenario'],
        correct: 2,
        tip: 'Moment 5: After touching patient surroundings. The IV pump is in the patient\'s zone and can harbor organisms. Hand hygiene is required even if you did not touch the patient.',
      },
      {
        title: 'Alcohol-Based Rub vs. Soap and Water',
        body: '**Use alcohol-based hand rub (preferred for most situations):**\n• More effective than soap for most pathogens\n• Less skin damage with frequent use\n• Faster — 20 to 30 seconds\n• Before and after most patient contacts\n\n**Use soap and water when:**\n• Hands are visibly soiled or contaminated with blood/body fluids\n• Before eating or after restroom use\n• **C. difficile (C. diff) exposure** — alcohol does NOT kill C. diff spores\n• Norovirus exposure\n\n**Proper technique:**\nRub all surfaces — palm, back, between fingers, thumbs, fingertips, wrists — for at least **20 seconds** with soap or until rub is dry.',
        scenario: 'You just cared for a patient with confirmed C. difficile infection. What do you use for hand hygiene?',
        options: ['Alcohol-based hand rub is fine', 'Either option works equally well', 'Soap and water — alcohol does not kill C. diff spores', 'Gloves alone are sufficient'],
        correct: 2,
        tip: 'C. difficile forms spores that are resistant to alcohol-based hand rubs. Soap and water physically removes spores through friction and rinsing. This is one of the most commonly missed infection control facts.',
      },
      {
        title: 'Transmission-Based Precautions',
        body: '**Contact Precautions** (MRSA, C. diff, wound infections)\n• Gown and gloves upon room entry\n• Dedicated equipment (stethoscope, BP cuff)\n\n**Droplet Precautions** (influenza, pertussis, COVID-19)\n• Surgical mask within 3–6 feet of patient\n• Private room preferred\n\n**Airborne Precautions** (TB, measles, chickenpox)\n• N95 respirator (fit-tested)\n• Negative-pressure room\n• Door must remain closed\n\n**Standard Precautions apply to ALL patients at ALL times** — treat every patient\'s blood and body fluids as potentially infectious.',
      },
      {
        title: 'PPE: Donning and Doffing',
        body: '**Donning (putting on) — in this order:**\n1. Gown\n2. Mask or respirator\n3. Eye protection / face shield\n4. Gloves\n\n**Doffing (taking off) — most contaminated first:**\n1. Gloves (most contaminated)\n2. Eye protection\n3. Gown\n4. Mask or respirator (least contaminated)\n5. **Perform hand hygiene after each step**\n\n**Critical rule:** The outside of your gown and gloves is contaminated. Never touch your face while wearing PPE. Doffing incorrectly is how providers contaminate themselves.',
        scenario: 'You are removing PPE after caring for a contact precaution patient. You have removed your gloves. What is the next step?',
        options: ['Remove your gown', 'Remove your mask', 'Perform hand hygiene', 'Remove your eye protection'],
        correct: 2,
        tip: 'Hand hygiene should be performed after removing gloves, as gloves are not 100% impermeable and hands can become contaminated during removal. Hand hygiene between each doffing step is the safest practice.',
      },
    ],
    questions: [
      { text: 'Approximately what percentage of hospital patients are affected by HAIs on any given day?', option_a: '1 in 100', option_b: '1 in 31', option_c: '1 in 10', option_d: '1 in 5', correct_answer: 'B' },
      { text: 'The WHO defines how many moments requiring hand hygiene?', option_a: '3', option_b: '4', option_c: '5', option_d: '6', correct_answer: 'C' },
      { text: 'When is soap and water preferred over alcohol-based hand rub?', option_a: 'After every patient contact', option_b: 'When caring for C. difficile patients', option_c: 'When gloves are not available', option_d: 'When hands feel dry', correct_answer: 'B' },
      { text: 'Airborne precautions require which type of respirator?', option_a: 'Surgical mask', option_b: 'N95 respirator', option_c: 'Cloth mask', option_d: 'Face shield alone', correct_answer: 'B' },
      { text: 'When donning PPE, what is put on first?', option_a: 'Gloves', option_b: 'Mask', option_c: 'Gown', option_d: 'Eye protection', correct_answer: 'C' },
      { text: 'Standard precautions apply to:', option_a: 'Only patients with known infections', option_b: 'All patients at all times', option_c: 'Patients on contact precautions only', option_d: 'Only when blood exposure is expected', correct_answer: 'B' },
      { text: 'Alcohol-based hand rub should be rubbed for at least:', option_a: '5 seconds', option_b: '10 seconds', option_c: '20–30 seconds or until dry', option_d: '60 seconds', correct_answer: 'C' },
      { text: 'Contact precautions require which PPE upon room entry?', option_a: 'N95 and eye protection', option_b: 'Gown and gloves', option_c: 'Surgical mask only', option_d: 'Gloves only', correct_answer: 'B' },
      { text: 'When doffing PPE, what is removed first?', option_a: 'Mask', option_b: 'Gown', option_c: 'Eye protection', option_d: 'Gloves', correct_answer: 'D' },
      { text: 'Droplet precautions are required for which condition?', option_a: 'Tuberculosis', option_b: 'MRSA wound infection', option_c: 'Influenza', option_d: 'C. difficile', correct_answer: 'C' },
    ],
  },

  {
    id: 'patient-rights-grievances',
    title: 'Patient Rights & Grievances',
    description: 'CMS Conditions of Participation require all healthcare staff to understand and uphold patient rights. Covers the patient bill of rights, informed consent, advance directives, grievance processes, and non-discrimination requirements.',
    tags: ['Healthcare', 'Patient Rights', 'CMS', 'Informed Consent', 'HIPAA', 'Annual'],
    industry: 'Healthcare',
    regulator: 'CMS',
    frequency: 'Annual',
    sources: [
      { label: 'CMS Patient Rights Conditions of Participation', url: 'https://www.cms.gov/Regulations-and-Guidance/Legislation/CFRs/downloads/cfr482_13.pdf', type: 'government', description: '42 CFR 482.13 — the actual federal regulations' },
      { label: 'CMS Patient Rights Guidance', url: 'https://www.cms.gov/Medicare/Provider-Enrollment-and-Certification/SurveyCertificationGenInfo/Downloads/SCLetter11_01.pdf', type: 'government', description: 'CMS surveyor guidance on patient rights' },
    ],
    slides: [
      {
        title: 'The Patient Bill of Rights',
        body: 'Under CMS Conditions of Participation (42 CFR 482.13), every inpatient has the right to:\n\n• **Participate in their care** — informed consent for all treatments\n• **Refuse treatment** — even life-saving treatment\n• **Privacy and confidentiality**\n• **Safe care** — free from abuse, neglect, exploitation\n• **Know their caregivers** — who is treating them and why\n• **Access their records** — within 30 days\n• **File a grievance** — without fear of retaliation\n• **Designate a support person** — of their choice\n• **Receive notice of rights** — upon admission\n\n**Your responsibility:** Know these rights and actively support them.',
      },
      {
        title: 'Informed Consent',
        body: 'Informed consent requires the patient to understand:\n\n1. **What** the procedure or treatment is\n2. **Why** it is recommended\n3. **Risks and benefits**\n4. **Alternatives** — including doing nothing\n5. **Who** will perform it\n\n**Valid consent requires:**\n• Patient is **competent** (or legal guardian consents)\n• Information given in language patient understands\n• **Voluntary** — no coercion or pressure\n• Documented in the medical record\n\n**Your role:** If a patient expresses confusion or doubt about a consent they signed, immediately notify the charge nurse or provider. Never pressure a patient to sign.',
        scenario: 'A patient signed a consent form but now says they do not understand what they consented to and feel pressured. What do you do?',
        options: ['Reassure them it will be fine and move forward', 'Tell them it is too late — they already signed', 'Notify the charge nurse or provider immediately', 'Ask them to re-read the form'],
        correct: 2,
        tip: 'Consent can be withdrawn at any time. A patient who feels pressured or confused has not given valid informed consent. The care team must stop, clarify, and re-obtain consent if needed.',
      },
      {
        title: 'Advance Directives',
        body: '**Advance directives** are legal documents stating a patient\'s wishes if they cannot speak for themselves:\n\n**Types:**\n• **Living Will** — specifies what treatments are wanted/refused\n• **Healthcare Proxy / POA** — designates a decision-maker\n• **DNR / POLST** — specific resuscitation orders\n\n**Your responsibilities:**\n• Ask about advance directives on admission\n• Ensure they are documented and accessible in the chart\n• Communicate their existence to the care team\n• **Do NOT pressure patients to create or change directives**\n\nIdaho law (Idaho Code § 39-4509) requires hospitals to inform patients of their right to advance directives.',
      },
      {
        title: 'Handling Grievances',
        body: 'A **grievance** is a formal written or verbal complaint about the quality of care or violation of rights.\n\n**Your role when a patient complains:**\n1. Listen without dismissing\n2. Thank them for bringing it to your attention\n3. If you can resolve it immediately — do so\n4. If not — escalate to your supervisor or Patient Advocate\n5. Document the complaint\n\n**Grievance timelines (CMS requirement):**\n• Acknowledge in writing within **7 days**\n• Resolve and respond within **30 days**\n\n**Retaliation against a patient for filing a grievance is a serious violation and grounds for termination.**',
        scenario: 'A patient says they want to file a formal complaint about their care. What is the correct first step?',
        options: ['Tell them to wait until discharge', 'Defend the care that was provided', 'Notify your supervisor and connect them with the Patient Advocate', 'Tell them to contact the Joint Commission directly'],
        correct: 2,
        tip: 'Patients have the right to file grievances at any time. The appropriate response is to listen, not defend, and connect them with the proper process.',
      },
    ],
    questions: [
      { text: 'The federal regulation governing inpatient patient rights is:', option_a: 'HIPAA Privacy Rule', option_b: '42 CFR 482.13 — CMS Conditions of Participation', option_c: 'Joint Commission Standard RC.02.01.01', option_d: 'The ADA', correct_answer: 'B' },
      { text: 'A patient has the right to refuse treatment even if:', option_a: 'Only if the treatment is non-emergency', option_b: 'It is life-saving treatment', option_c: 'Their family disagrees', option_d: 'Both B and C', correct_answer: 'D' },
      { text: 'Valid informed consent requires all EXCEPT:', option_a: 'Patient understanding of risks and benefits', option_b: 'Voluntary agreement without coercion', option_c: 'Family member co-signature', option_d: 'Explanation of alternatives', correct_answer: 'C' },
      { text: 'CMS requires grievances to be acknowledged in writing within:', option_a: '24 hours', option_b: '3 days', option_c: '7 days', option_d: '14 days', correct_answer: 'C' },
      { text: 'A Healthcare Proxy is:', option_a: 'A list of treatments to be refused', option_b: 'A document designating a healthcare decision-maker', option_c: 'A DNR order', option_d: 'An insurance document', correct_answer: 'B' },
      { text: 'If a patient retracts consent after signing, you should:', option_a: 'Proceed — they already signed', option_b: 'Ask them to re-read the form', option_c: 'Notify the charge nurse or provider immediately and stop', option_d: 'Document and proceed only for non-invasive procedures', correct_answer: 'C' },
      { text: 'Retaliating against a patient for filing a grievance is:', option_a: 'Acceptable if the complaint is unfounded', option_b: 'A serious violation and grounds for termination', option_c: 'Only prohibited by Joint Commission standards', option_d: 'Only prohibited for nursing staff', correct_answer: 'B' },
      { text: 'Patients must be informed of their right to advance directives:', option_a: 'Only if they are over 65', option_b: 'On admission to a hospital', option_c: 'Only in ICU settings', option_d: 'When they request it', correct_answer: 'B' },
      { text: 'Which is NOT a component of informed consent?', option_a: 'Explanation of the procedure', option_b: 'Identification of risks and benefits', option_c: 'Patient\'s family agreement', option_d: 'Presentation of alternatives', correct_answer: 'C' },
      { text: 'Within how many days must a hospital resolve a grievance?', option_a: '7 days', option_b: '14 days', option_c: '30 days', option_d: '60 days', correct_answer: 'C' },
    ],
  },

  {
    id: 'workplace-safety-healthcare',
    title: 'Workplace Safety for Healthcare Workers',
    description: 'OSHA standards specific to healthcare environments. Covers bloodborne pathogen exposure, needlestick prevention, ergonomics and safe patient handling, workplace violence prevention, and hazardous materials in clinical settings.',
    tags: ['Healthcare', 'OSHA', 'Bloodborne Pathogens', 'Needlestick', 'Safe Patient Handling', 'Annual'],
    industry: 'Healthcare',
    regulator: 'OSHA',
    frequency: 'Annual',
    sources: [
      { label: 'OSHA Bloodborne Pathogens Standard', url: 'https://www.osha.gov/bloodborne-pathogens', type: 'government', description: 'OSHA 29 CFR 1910.1030 — the complete bloodborne pathogens standard' },
      { label: 'OSHA Healthcare Safety', url: 'https://www.osha.gov/healthcare', type: 'government', description: 'OSHA healthcare safety resources and guidelines' },
    ],
    slides: [
      {
        title: 'Bloodborne Pathogens — Your Risk',
        body: 'Healthcare workers face exposure to **HIV, Hepatitis B (HBV), and Hepatitis C (HCV)** through:\n\n• Needlestick or sharp object injuries\n• Splashes to eyes, nose, or mouth\n• Contact with broken skin\n\n**Risk per needlestick:**\n• HIV: 0.3%\n• HCV: 1.8%\n• HBV: 6–30% (if not vaccinated)\n\n**Protection:**\n• Hepatitis B vaccine (OSHA requires employers to offer free)\n• Safety-engineered sharps\n• Standard precautions — always\n• Never recap needles two-handed',
      },
      {
        title: 'Needlestick — What to Do Immediately',
        body: 'If you have a needlestick or body fluid exposure:\n\n**Immediately:**\n1. Wash the wound with soap and water (15+ minutes for eye splash — use eyewash station)\n2. Do NOT squeeze or suck the wound\n3. Report to your supervisor immediately\n4. Go to Employee Health or the ER — within 2 hours for HIV PEP consideration\n\n**You will NOT lose your job for reporting a needlestick.**\nOSHA prohibits retaliation. Unreported exposures deny you access to potentially life-saving post-exposure prophylaxis (PEP).',
        scenario: 'You stick yourself with a used needle while recapping it. What is your first action?',
        options: ['Squeeze out the blood', 'Wash with soap and water for 15 minutes', 'Report to supervisor before washing', 'Apply a bandage and monitor for symptoms'],
        correct: 1,
        tip: 'Immediate washing with soap and water is the first step. Squeezing the wound can force pathogens deeper. After washing, report immediately to access post-exposure care within the 2-hour PEP window.',
      },
      {
        title: 'Safe Patient Handling',
        body: 'Musculoskeletal injuries are the leading cause of disability in healthcare workers. **Safe Patient Handling (SPH) prevents injuries:**\n\n**Before any patient transfer:**\n• Assess patient mobility level\n• Use the right equipment (lift, slide board, gait belt)\n• Get adequate help — never try alone if it requires two\n• Position yourself — bend knees, straight back, feet apart\n\n**Mechanical lifts must be used when:**\n• Patient is non-weight bearing\n• Patient weighs more than 35 lbs for repositioning\n• Patient is unpredictable or combative\n\n**"No-lift" does not mean no care** — it means use equipment.',
      },
      {
        title: 'Workplace Violence Prevention',
        body: 'Healthcare workers are **4× more likely** to experience workplace violence than other industries. 73% of all non-fatal workplace assaults occur in healthcare.\n\n**Types of workplace violence:**\n• **Type I** — Criminal intent (robbery)\n• **Type II** — Patient/visitor to worker (most common)\n• **Type III** — Worker to worker\n• **Type IV** — Personal relationship\n\n**De-escalation techniques:**\n• Speak calmly and slowly\n• Give the person space\n• Listen without interrupting\n• Avoid arguing or threatening\n• Call for help — do not try to handle alone\n\n**All incidents must be reported.** Unreported violence perpetuates unsafe conditions.',
        scenario: 'A patient becomes verbally aggressive and threatening. The safest first step is:',
        options: ['Restrain them to prevent escalation', 'Argue to establish authority', 'Call for help and maintain calm, non-threatening communication', 'Leave the room and do not return'],
        correct: 2,
        tip: 'De-escalation and calling for backup are the safest approaches. Physical restraint should only be used as a last resort by trained staff. Documentation and reporting after the event are required.',
      },
    ],
    questions: [
      { text: 'The risk of HIV transmission per needlestick is approximately:', option_a: '0.3%', option_b: '3%', option_c: '10%', option_d: '30%', correct_answer: 'A' },
      { text: 'After a needlestick, the wound should be washed with soap and water for at least:', option_a: '30 seconds', option_b: '2 minutes', option_c: '15 minutes', option_d: 'Until it stops bleeding', correct_answer: 'C' },
      { text: 'Post-exposure HIV prophylaxis (PEP) must be initiated within:', option_a: '30 minutes', option_b: '2 hours', option_c: '24 hours', option_d: '72 hours', correct_answer: 'D' },
      { text: 'OSHA requires employers to offer the Hepatitis B vaccine:', option_a: 'At employee cost', option_b: 'Only to clinical staff', option_c: 'Free to all at-risk employees', option_d: 'Only after exposure', correct_answer: 'C' },
      { text: 'A mechanical lift must be used when a patient is non-weight bearing or requires repositioning of more than:', option_a: '15 lbs', option_b: '35 lbs', option_c: '50 lbs', option_d: '75 lbs', correct_answer: 'B' },
      { text: 'The most common type of workplace violence in healthcare is:', option_a: 'Worker to worker', option_b: 'Criminal intent', option_c: 'Patient or visitor to worker', option_d: 'Personal relationship', correct_answer: 'C' },
      { text: 'Recapping a needle should:', option_a: 'Always be done to prevent exposure', option_b: 'Never be done two-handed', option_c: 'Be done only with the dominant hand', option_d: 'Be done using a one-handed scoop method only if necessary', correct_answer: 'D' },
      { text: 'All workplace violence incidents must be:', option_a: 'Reported only if injury occurred', option_b: 'Handled quietly to avoid alarm', option_c: 'Reported — all incidents', option_d: 'Reported only for Type I events', correct_answer: 'C' },
      { text: 'OSHA prohibits retaliation for reporting:', option_a: 'Only for injury reports', option_b: 'Needlestick exposures and safety violations', option_c: 'Only formal OSHA complaints', option_d: 'Retaliation is legal in at-will states', correct_answer: 'B' },
      { text: 'SPH stands for:', option_a: 'Standard Patient Hygiene', option_b: 'Safe Patient Handling', option_c: 'Standard Protective Healthcare', option_d: 'Safety Protocol for Hospitals', correct_answer: 'B' },
    ],
  },

  {
    id: 'mandatory-reporter',
    title: 'Mandatory Reporter: Abuse, Neglect & Exploitation',
    description: 'Idaho law requires all healthcare workers to report suspected abuse, neglect, or exploitation of vulnerable adults and children. Covers definitions, recognition, reporting requirements, and Idaho-specific procedures. Failure to report is a misdemeanor.',
    tags: ['Healthcare', 'Idaho', 'Mandatory Reporter', 'Abuse', 'Neglect', 'Children', 'Elderly', 'Annual'],
    industry: 'Healthcare',
    regulator: 'Idaho IDHW / CMS',
    frequency: 'Annual',
    sources: [
      { label: 'Idaho Mandatory Reporting Law', url: 'https://legislature.idaho.gov/statutesrules/idstat/title16/t16ch16/', type: 'government', description: 'Idaho Code § 16-1619 — child abuse reporting requirements' },
      { label: 'Idaho Adult Protective Services', url: 'https://healthandwelfare.idaho.gov/services-programs/aging/adult-protective-services', type: 'government', description: 'Idaho IDHW Adult Protective Services reporting' },
      { label: 'Idaho Careline', url: 'https://www.idahocareline.org/', type: 'government', description: '211 Idaho Careline — resource and referral network' },
    ],
    slides: [
      {
        title: 'You Are a Mandatory Reporter',
        body: 'In Idaho, **all healthcare workers are mandatory reporters** under Idaho Code § 16-1619 (children) and § 18-1505 (vulnerable adults).\n\n**What this means:**\n• You are **legally required** to report suspected abuse, neglect, or exploitation\n• You do NOT need to prove it — reasonable suspicion is enough\n• You are **protected from liability** if you report in good faith\n• Failure to report is a **misdemeanor** — up to 1 year in jail and $1,000 fine\n\n**Who is protected:**\n• Children under 18\n• Vulnerable adults (elderly, disabled, incapacitated)\n• Patients in your care',
      },
      {
        title: 'Recognizing Abuse and Neglect',
        body: '**Physical abuse indicators:**\n• Unexplained injuries, bruises in unusual locations\n• Injuries inconsistent with the stated cause\n• Pattern injuries (belt marks, cigarette burns)\n• Delays in seeking medical care\n\n**Neglect indicators:**\n• Malnutrition, dehydration, untreated medical conditions\n• Poor hygiene, inappropriate clothing for weather\n• Being left alone unsafely\n\n**Emotional abuse:**\n• Withdrawal, depression, fear\n• Low self-esteem, regression in behavior\n\n**Sexual abuse:**\n• Injuries to genital areas\n• Unexplained STIs in children\n• Behavioral changes, sexualized behavior in children\n\n**Financial exploitation (adults):**\n• Sudden changes in financial status\n• Caregiver controlling access to money',
        scenario: 'A 7-year-old presents with bruising in various healing stages on their back and upper arms. The parent says the child "falls a lot." What do you do?',
        options: ['Accept the explanation and document', 'Ask the child privately about the injuries and report if they confirm abuse', 'Report your reasonable suspicion — you do not need proof', 'Consult with the attending physician before deciding'],
        correct: 2,
        tip: 'Mandatory reporters are not investigators. You report reasonable suspicion — it is Idaho IDHW\'s job to investigate. Delays in reporting can put the child at further risk. Report first, document, and notify your supervisor.',
      },
      {
        title: 'How to Report in Idaho',
        body: '**For child abuse/neglect:**\n• Call **Idaho Careline: 211** (statewide, 24/7)\n• Or call **Idaho Child Protective Services** directly\n• Emergency situations: Call **911** first\n\n**For vulnerable adult abuse/neglect:**\n• Call **Idaho Adult Protective Services: 1-800-926-2588**\n• Or report through your hospital\'s social work department\n\n**What to report:**\n• Your name and contact (confidential)\n• Child/adult\'s name and location\n• Nature and extent of suspected abuse\n• Information about the suspected perpetrator if known\n\n**After reporting:**\n• Document your report in the medical record\n• Notify your supervisor\n• Cooperate with any investigation',
      },
      {
        title: 'Protecting Yourself',
        body: '**You are protected when you report in good faith:**\n• Idaho law provides civil and criminal immunity for good-faith reporters\n• Your identity is kept confidential during investigation\n• You cannot be disciplined by your employer for making a mandatory report\n\n**You are NOT protected if:**\n• You knew abuse was occurring and failed to report\n• You deliberately made a false report to harass someone\n\n**Institutional pressure to NOT report is illegal.**\nIf someone asks you not to report suspected abuse, you are still legally required to report. Document the request.',
        scenario: 'Your supervisor tells you that the family of a patient is well-known in the community and asks you not to report your suspicions about elder abuse. You should:',
        options: ['Comply with your supervisor — they know best', 'Report anyway — mandatory reporting supersedes employer directives', 'Wait to see if another staff member reports first', 'Contact the family to resolve it internally'],
        correct: 1,
        tip: 'Mandatory reporting is a legal duty that cannot be overridden by employer directives. Failing to report because a supervisor asked you not to still makes you personally liable under Idaho law.',
      },
    ],
    questions: [
      { text: 'Under Idaho law, mandatory reporting of child abuse applies to:', option_a: 'Only physicians and nurses', option_b: 'All healthcare workers', option_c: 'Only social workers and counselors', option_d: 'Only those with direct patient care roles', correct_answer: 'B' },
      { text: 'To make a mandatory report in Idaho, you need:', option_a: 'Proof that abuse occurred', option_b: 'A physician\'s order', option_c: 'Reasonable suspicion only', option_d: 'Supervisor approval', correct_answer: 'C' },
      { text: 'Failure to make a mandatory report in Idaho is:', option_a: 'A civil violation only', option_b: 'Not a criminal offense', option_c: 'A misdemeanor', option_d: 'A felony', correct_answer: 'C' },
      { text: 'The Idaho Careline number for reporting child abuse is:', option_a: '911', option_b: '211', option_c: '1-800-926-2588', option_d: '311', correct_answer: 'B' },
      { text: 'Multiple bruises in various healing stages in unusual locations may indicate:', option_a: 'Coagulation disorder only', option_b: 'Normal childhood activity', option_c: 'Possible physical abuse', option_d: 'Nothing without further evidence', correct_answer: 'C' },
      { text: 'If your supervisor asks you not to report suspected abuse, you should:', option_a: 'Comply — they have more context', option_b: 'Report anyway — mandatory reporting supersedes employer directives', option_c: 'Get a second opinion first', option_d: 'Document but wait 48 hours', correct_answer: 'B' },
      { text: 'Good-faith reporters of suspected abuse are:', option_a: 'Liable if the report is unsubstantiated', option_b: 'Protected by Idaho law from civil and criminal liability', option_c: 'Only protected if abuse is confirmed', option_d: 'Not protected if the investigation finds nothing', correct_answer: 'B' },
      { text: 'Financial exploitation of a vulnerable adult may look like:', option_a: 'Caregiver helping manage bills', option_b: 'Sudden changes in the adult\'s financial status', option_c: 'Adult refusing medical care', option_d: 'Adult changing their will', correct_answer: 'B' },
      { text: 'After making a mandatory report, you should:', option_a: 'Keep it confidential and tell no one', option_b: 'Wait to see if IDHW follows up', option_c: 'Document in the medical record and notify your supervisor', option_d: 'Contact the family directly', correct_answer: 'C' },
      { text: 'Adult Protective Services in Idaho can be reached at:', option_a: '211', option_b: '1-800-422-4453', option_c: '1-800-926-2588', option_d: '1-888-677-1199', correct_answer: 'C' },
    ],
  },

  {
    id: 'stark-law-anti-kickback',
    title: 'Stark Law & Anti-Kickback Statute',
    description: 'Federal law training covering the Physician Self-Referral Law (Stark Law) and the Anti-Kickback Statute. Required for all healthcare staff involved in referrals, ordering, billing, or relationships with physicians and vendors.',
    tags: ['Healthcare', 'Stark Law', 'Anti-Kickback', 'OIG', 'Compliance', 'Physicians', 'Annual'],
    industry: 'Healthcare',
    regulator: 'CMS / OIG / DOJ',
    frequency: 'Annual',
    sources: [
      { label: 'CMS Stark Law Overview', url: 'https://www.cms.gov/medicare/fraud-and-abuse/physicianselfreferral', type: 'government', description: 'Official CMS guidance on Stark Law prohibitions and exceptions' },
      { label: 'OIG Anti-Kickback Statute', url: 'https://oig.hhs.gov/fraud/anti-kickback-statute/', type: 'government', description: 'HHS OIG guidance and advisory opinions on the AKS' },
      { label: 'OIG Compliance Guidance for Hospitals', url: 'https://oig.hhs.gov/compliance/compliance-guidance/compliance-guidance.asp', type: 'government', description: 'OIG compliance program guidance for healthcare organizations' },
    ],
    slides: [
      {
        title: 'What is the Stark Law?',
        body: 'The **Physician Self-Referral Law (Stark Law)** — 42 U.S.C. § 1395nn — prohibits a physician from making referrals for certain "designated health services" (DHS) payable by Medicare or Medicaid to an entity with which the physician (or an immediate family member) has a **financial relationship**, unless an exception applies.\n\n**Designated Health Services include:**\n• Clinical laboratory services\n• Physical therapy\n• Radiology and imaging\n• Radiation therapy\n• Durable medical equipment\n• Home health services\n• Inpatient and outpatient hospital services\n\n**Stark Law is a STRICT LIABILITY statute** — intent does not matter. If the referral happened and no exception applies, it is a violation.',
      },
      {
        title: 'The Anti-Kickback Statute (AKS)',
        body: 'The **Anti-Kickback Statute** — 42 U.S.C. § 1320a-7b(b) — prohibits knowingly and willfully offering, paying, soliciting, or receiving anything of value to induce or reward referrals of items or services covered by federal healthcare programs.\n\n**Examples of potential violations:**\n• Paying physicians above fair market value for services\n• Free or below-cost office space or equipment to referring physicians\n• Gifts, meals, or entertainment that could influence referrals\n• Compensation tied to the volume or value of referrals\n\n**AKS requires intent** — unlike Stark, the government must prove knowing and willful conduct. Violations are criminal, not just civil.',
        scenario: 'A vendor offers your hospital a "free" EMR upgrade worth $50,000 in exchange for preferred vendor status. This is:',
        options: ['Acceptable — no cash changed hands', 'A potential Anti-Kickback Statute violation', 'Fine if disclosed to the board', 'Only a concern if Medicare patients are involved'],
        correct: 1,
        tip: 'The AKS covers "anything of value" — not just cash. In-kind benefits like free equipment, services, or software can violate the AKS if they are intended to induce or reward referrals.',
      },
      {
        title: 'Penalties Are Severe',
        body: '**Stark Law civil penalties:**\n• Denial of claims submitted in violation\n• Refund of all Medicare payments received\n• Civil monetary penalties up to $15,000 per service\n• Exclusion from Medicare and Medicaid programs\n\n**Anti-Kickback Statute criminal penalties:**\n• Up to 10 years in federal prison per violation\n• Up to $100,000 in fines per violation\n• Mandatory exclusion from Medicare and Medicaid\n• False Claims Act liability (treble damages + $13,000–$26,000 per false claim)\n\n**One violation can end a hospital, a practice, or a career.**',
      },
      {
        title: 'Safe Harbors and Exceptions',
        body: 'Both laws have **exceptions** and **safe harbors** that protect legitimate arrangements.\n\n**Common Stark exceptions:**\n• Bona fide employment — physician employed at FMV\n• Personal services arrangements — written contract, FMV compensation\n• In-office ancillary services — services supervised and billed by the referring group\n\n**Common AKS safe harbors:**\n• Employment — W-2 employees\n• Personal services — written contracts at FMV not tied to referral volume\n• Space and equipment rentals — at FMV, written lease\n\n**Key principle:** Compensation must reflect **fair market value (FMV)** and must NOT be tied to the volume or value of referrals.',
        scenario: 'A hospital wants to pay a physician $500/hour for medical director services. What must be true for this to comply with Stark and AKS?',
        options: ['The amount must be approved by the board', 'The amount must reflect fair market value and not be tied to referral volume', 'It is fine as long as it is in writing', 'Only Medicare patients matter for this analysis'],
        correct: 1,
        tip: 'Fair Market Value (FMV) is the critical test. Compensation must be what an independent party would pay for the same services. If compensation increases with referral volume, it will fail both Stark and AKS.',
      },
      {
        title: 'Your Role — Recognize and Report',
        body: 'You don\'t need to be an attorney to spot red flags. **Report concerns to your Compliance Officer if you see:**\n\n• Physician compensation that seems unusually high for the services provided\n• Gifts, meals, or entertainment from vendors or physician-owned companies\n• Financial relationships between referring physicians and hospital departments not covered by a written agreement\n• Vendor contracts that seem designed to reward referrals\n• Pressure to refer to specific providers or vendors\n\n**You are protected from retaliation for good-faith compliance reports.** The False Claims Act\'s qui tam provisions allow employees to report violations to the government and receive a percentage of any recovery.',
      },
    ],
    questions: [
      { text: 'The Stark Law prohibits physician referrals for Designated Health Services when:', option_a: 'The physician has a financial relationship with the entity receiving the referral', option_b: 'The physician is not board certified', option_c: 'The referral is for a Medicare patient over 65', option_d: 'The service costs more than $10,000', correct_answer: 'A' },
      { text: 'Unlike Stark Law, the Anti-Kickback Statute requires:', option_a: 'A written contract to be violated', option_b: 'Only Medicare patients to be involved', option_c: 'Knowing and willful intent to violate', option_d: 'Cash to change hands', correct_answer: 'C' },
      { text: 'Stark Law is considered a strict liability statute, meaning:', option_a: 'Violations result in strict penalties only', option_b: 'Intent does not matter — if the referral occurred with no exception, it is a violation', option_c: 'Only the physician can be held liable', option_d: 'The law only applies to strict physician-patient relationships', correct_answer: 'B' },
      { text: 'Which of these is a Designated Health Service under Stark Law?', option_a: 'Physician office visits', option_b: 'Clinical laboratory services', option_c: 'Emergency room services only', option_d: 'Prescription medications', correct_answer: 'B' },
      { text: 'Fair Market Value compensation is important because:', option_a: 'It is required by the Joint Commission', option_b: 'Above-FMV compensation can indicate an illegal kickback arrangement', option_c: 'It only matters for government employees', option_d: 'It determines Medicare reimbursement rates', correct_answer: 'B' },
      { text: 'AKS safe harbors protect arrangements that:', option_a: 'Involve large hospitals only', option_b: 'Meet specific criteria for legitimate business relationships at FMV', option_c: 'Have board approval', option_d: 'Are under $10,000', correct_answer: 'B' },
      { text: 'The maximum prison sentence for an Anti-Kickback Statute violation per count is:', option_a: '2 years', option_b: '5 years', option_c: '10 years', option_d: '20 years', correct_answer: 'C' },
      { text: 'If you suspect a Stark Law violation, you should:', option_a: 'Handle it quietly to avoid disrupting the relationship', option_b: 'Report it to your Compliance Officer', option_c: 'Only report if the amount exceeds $10,000', option_d: 'Wait to see if anyone else notices', correct_answer: 'B' },
      { text: 'Which arrangement likely violates the Anti-Kickback Statute?', option_a: 'Paying a physician employed by the hospital an annual salary', option_b: 'Paying a physician above fair market value for medical director services', option_c: 'Renting space to a physician group at fair market value', option_d: 'Paying a physician for on-call coverage at FMV', correct_answer: 'B' },
      { text: 'The False Claims Act\'s qui tam provision allows:', option_a: 'Hospitals to recover overpayments from vendors', option_b: 'Employees to report fraud and receive a share of any government recovery', option_c: 'Physicians to bill for unreimbursed services', option_d: 'Insurance companies to deny Stark-tainted claims', correct_answer: 'B' },
    ],
  },

  {
    id: 'hazardous-chemicals-right-to-know',
    title: 'Hazardous Chemicals & Right-to-Know (HazCom)',
    description: 'OSHA Hazard Communication Standard (HazCom 2012/GHS) training for healthcare workers. Covers chemical hazard identification, Safety Data Sheets, GHS labeling, PPE selection, and emergency response. Required annually for all staff with potential chemical exposure.',
    tags: ['Healthcare', 'OSHA', 'HazCom', 'GHS', 'Chemicals', 'Right-to-Know', 'Annual', 'Safety Data Sheet'],
    industry: 'Healthcare',
    regulator: 'OSHA',
    frequency: 'Annual',
    sources: [
      { label: 'OSHA HazCom Standard', url: 'https://www.osha.gov/hazard-communication', type: 'government', description: 'OSHA 29 CFR 1910.1200 — complete Hazard Communication standard' },
      { label: 'OSHA GHS Quick Card', url: 'https://www.osha.gov/sites/default/files/publications/OSHA3493QuickCardGHS.pdf', type: 'government', description: 'Free printable GHS label and pictogram reference' },
    ],
    slides: [
      {
        title: 'Your Right to Know',
        body: 'OSHA\'s **Hazard Communication Standard (HazCom)** — 29 CFR 1910.1200 — gives you the right to know about hazardous chemicals in your workplace.\n\n**Healthcare workers face exposures to:**\n• Disinfectants and sterilants (glutaraldehyde, formaldehyde, peracetic acid)\n• Chemotherapy drugs (antineoplastic agents)\n• Anesthetic gases\n• Laboratory reagents and fixatives\n• Cleaning chemicals\n• Mercury (in older equipment)\n\n**Three pillars of HazCom:**\n1. **Labels** — on every chemical container\n2. **Safety Data Sheets (SDS)** — detailed hazard information for every chemical\n3. **Training** — this course',
      },
      {
        title: 'GHS Pictograms — Know What They Mean',
        body: 'The **Globally Harmonized System (GHS)** uses standardized pictograms on chemical labels:\n\n🔥 **Flame** — Flammable (alcohols, acetone)\n💀 **Skull & Crossbones** — Acute toxicity (can kill with small amounts)\n❗ **Exclamation Mark** — Irritant, harmful, or less severe hazard\n⚠️ **Health Hazard** — Carcinogen, reproductive toxin, sensitizer\n🧪 **Corrosion** — Burns skin/eyes, corrodes metals\n🌊 **Environment** — Aquatic toxicity\n💥 **Exploding Bomb** — Explosive\n🔵 **Flame over Circle** — Oxidizer\n🌬️ **Gas Cylinder** — Compressed gas\n\n**In healthcare, the most common:** Skull & Crossbones (chemo drugs, fixatives), Exclamation Mark (disinfectants), Corrosion (concentrated acids/bases), Health Hazard (formaldehyde).',
        scenario: 'A cleaning product has a GHS label with only the Exclamation Mark pictogram. This means:',
        options: ['The product is safe enough to use without PPE', 'The product has a less severe hazard — irritant or low-level toxicity', 'The product may be explosive', 'The product is a known carcinogen'],
        correct: 1,
        tip: 'The Exclamation Mark indicates a less severe hazard — typically an irritant, skin/eye sensitizer, or mildly harmful substance. PPE may still be required — always check the SDS.',
      },
      {
        title: 'Safety Data Sheets — How to Read Them',
        body: 'Every hazardous chemical must have a **Safety Data Sheet (SDS)** with 16 standardized sections. The most critical for healthcare workers:\n\n**Section 2 — Hazard Identification:** What dangers the chemical poses\n**Section 4 — First Aid Measures:** What to do if exposed\n**Section 5 — Fire Fighting Measures:** If applicable\n**Section 7 — Handling and Storage:** Safe use requirements\n**Section 8 — Exposure Controls/PPE:** What protection is required\n**Section 10 — Reactivity:** What it shouldn\'t contact\n\n**SDS must be accessible to all employees at all times.** In most hospitals, they are in a central electronic system (e.g., MSDSonline, Chemwatch). Know where to find yours.',
        scenario: 'You need to know what PPE to wear before using a glutaraldehyde-based sterilant. Where do you look first?',
        options: ['The bottle label only', 'Section 8 of the Safety Data Sheet', 'Ask a coworker', 'Section 1 of the SDS'],
        correct: 1,
        tip: 'Section 8 (Exposure Controls/Personal Protection) of the SDS tells you exactly what PPE — gloves, eye protection, respirator — is required for safe handling. This is the definitive source, not the label.',
      },
      {
        title: 'Chemotherapy Drugs — Hazardous Drug Handling',
        body: 'Antineoplastic (chemotherapy) drugs are among the most hazardous chemicals in healthcare. Even small exposures can cause:\n\n• Cancer (many are known carcinogens)\n• Reproductive harm (fetal damage, infertility)\n• Organ toxicity\n\n**Who is at risk:**\n• Pharmacy staff preparing doses\n• Nurses administering IV chemotherapy\n• Anyone handling patient waste (urine, feces, vomit) during treatment\n• Laundry staff handling contaminated linens\n\n**Required precautions:**\n• NIOSH-listed hazardous drug training\n• Double gloves, gown, face protection\n• Closed-system drug transfer devices (CSTDs)\n• Designated waste containers\n• Pregnant staff have the right to request reassignment',
      },
      {
        title: 'Chemical Spill and Exposure Response',
        body: '**If you spill a hazardous chemical:**\n1. Alert others in the area\n2. Consult the SDS for spill procedures — not all chemicals respond the same way\n3. Use the spill kit appropriate for that chemical\n4. Wear required PPE before cleanup\n5. Report the spill to your supervisor\n6. Document it\n\n**If you are exposed:**\n1. Remove contaminated clothing\n2. Flush affected skin or eyes with water for **15-20 minutes** at an eyewash station\n3. Seek medical evaluation immediately\n4. Bring the SDS with you to the emergency department\n5. Report to Employee Health\n\n**Know where your eyewash stations are before you need them.**',
      },
    ],
    questions: [
      { text: 'OSHA\'s Hazard Communication Standard is found in:', option_a: '29 CFR 1910.1030', option_b: '29 CFR 1910.1200', option_c: '42 CFR 482.13', option_d: '21 CFR 820', correct_answer: 'B' },
      { text: 'The GHS Skull and Crossbones pictogram indicates:', option_a: 'Flammable material', option_b: 'Environmental hazard', option_c: 'Acute toxicity — can be lethal in small amounts', option_d: 'Mild irritant', correct_answer: 'C' },
      { text: 'Safety Data Sheets must be accessible to employees:', option_a: 'Upon written request to HR', option_b: 'At all times during their work shift', option_c: 'Only in the pharmacy or lab', option_d: 'Within 24 hours of request', correct_answer: 'B' },
      { text: 'Which SDS section tells you what PPE to wear?', option_a: 'Section 2 — Hazard Identification', option_b: 'Section 4 — First Aid', option_c: 'Section 8 — Exposure Controls/Personal Protection', option_d: 'Section 15 — Regulatory Information', correct_answer: 'C' },
      { text: 'For a chemical skin exposure, flush the area with water for at least:', option_a: '5 minutes', option_b: '10 minutes', option_c: '15-20 minutes', option_d: '30 minutes', correct_answer: 'C' },
      { text: 'Chemotherapy drugs are hazardous because:', option_a: 'They are flammable', option_b: 'They can cause cancer, reproductive harm, and organ toxicity even in small exposures', option_c: 'They react with water', option_d: 'They are corrosive to skin', correct_answer: 'B' },
      { text: 'The GHS Exclamation Mark pictogram indicates:', option_a: 'Explosive hazard', option_b: 'Known carcinogen', option_c: 'Less severe hazard — irritant, harmful, or sensitizer', option_d: 'Acute toxicity', correct_answer: 'C' },
      { text: 'Pregnant staff who work with chemotherapy drugs have the right to:', option_a: 'No special accommodation', option_b: 'Request reassignment to avoid hazardous drug exposure', option_c: 'Double their PPE and continue', option_d: 'Refuse all patient assignments', correct_answer: 'B' },
      { text: 'When responding to a chemical spill, the first step is:', option_a: 'Begin cleanup immediately', option_b: 'Call 911', option_c: 'Alert others in the area and consult the SDS', option_d: 'Contact the chemical manufacturer', correct_answer: 'C' },
      { text: 'HazCom training must be provided:', option_a: 'Only to lab and pharmacy staff', option_b: 'Upon hire and whenever new hazardous chemicals are introduced', option_c: 'Every 5 years', option_d: 'Only after a chemical incident', correct_answer: 'B' },
    ],
  },

  {
    id: 'bloodborne-pathogens',
    title: 'Bloodborne Pathogens Standard',
    description: 'Standalone OSHA bloodborne pathogens training (29 CFR 1910.1030). Covers HIV, HBV, HCV transmission and prevention, the Exposure Control Plan, engineering controls, PPE, post-exposure procedures, and recordkeeping. Required annually for all workers with occupational exposure.',
    tags: ['Healthcare', 'OSHA', 'Bloodborne Pathogens', 'HIV', 'Hepatitis', 'BBP', 'Annual', 'Needlestick'],
    industry: 'Healthcare',
    regulator: 'OSHA',
    frequency: 'Annual',
    sources: [
      { label: 'OSHA Bloodborne Pathogens Standard', url: 'https://www.osha.gov/bloodborne-pathogens', type: 'government', description: 'Complete 29 CFR 1910.1030 standard and guidance' },
      { label: 'CDC Occupational HIV Transmission', url: 'https://www.cdc.gov/niosh/topics/bbp/default.html', type: 'government', description: 'CDC guidance on occupational bloodborne pathogen exposure' },
      { label: 'OSHA Bloodborne Pathogens Fact Sheet', url: 'https://www.osha.gov/sites/default/files/publications/osha3128.pdf', type: 'government', description: 'Free OSHA quick reference for BBP requirements' },
    ],
    slides: [
      {
        title: 'What Are Bloodborne Pathogens?',
        body: 'Bloodborne pathogens are **microorganisms in human blood and OPIM** (Other Potentially Infectious Materials) that can cause disease.\n\n**The three primary concerns:**\n\n🔴 **HIV (Human Immunodeficiency Virus)**\n• Destroys the immune system; leads to AIDS\n• Risk per needlestick: ~0.3%\n• No cure; managed with antiretroviral therapy\n\n🟡 **Hepatitis B Virus (HBV)**\n• Attacks the liver; can cause cirrhosis and liver cancer\n• Risk per needlestick: 6–30% (if not vaccinated)\n• **Vaccine available — free from your employer**\n\n🟠 **Hepatitis C Virus (HCV)**\n• Leading cause of liver transplants in the US\n• Risk per needlestick: ~1.8%\n• No vaccine; curative treatment now available\n\n**OPIM** includes semen, vaginal secretions, CSF, synovial fluid, pleural fluid, and any fluid visibly contaminated with blood.',
      },
      {
        title: 'OSHA Exposure Control Plan',
        body: 'Every employer must have a written **Exposure Control Plan (ECP)** that includes:\n\n• Identification of job classifications with occupational exposure\n• Methods to eliminate or minimize exposure\n• Procedures for evaluating exposure incidents\n• Schedule for implementing control measures\n\n**Hierarchy of controls (in order of preference):**\n1. **Elimination** — remove the hazard (e.g., needleless systems)\n2. **Engineering controls** — isolate the hazard (sharps containers, safety needles)\n3. **Work practice controls** — change how tasks are done (no two-hand recapping)\n4. **PPE** — protect the worker (gloves, gowns, face protection)\n\n**The ECP must be reviewed and updated annually** and whenever new tasks with potential exposure are introduced.',
      },
      {
        title: 'Hepatitis B Vaccine — Your Protection',
        body: 'OSHA requires employers to **offer the Hepatitis B vaccine series at no cost** to all employees with occupational exposure.\n\n**The HBV vaccine:**\n• 3-dose series (0, 1, 6 months)\n• Highly effective — 95%+ protection after full series\n• Provides long-term immunity\n• If you have not been vaccinated, contact Employee Health today\n\n**Post-vaccination testing:**\n• Test 1–2 months after the 3rd dose to confirm immunity\n• If non-responder: re-vaccination series recommended\n\n**Declining the vaccine:**\n• You have the right to decline — but you must sign an informed refusal form\n• You may change your mind at any time and receive the vaccine at no cost',
        scenario: 'A new employee has never received the Hepatitis B vaccine. Under OSHA, the employer must:',
        options: ['Offer the vaccine only if the employee requests it', 'Offer the vaccine free of charge within 10 working days of initial assignment', 'Require the employee to get vaccinated before starting', 'Offer the vaccine only after an exposure incident'],
        correct: 1,
        tip: 'OSHA requires the employer to offer the HBV vaccine to at-risk workers free of charge within 10 working days of initial assignment to tasks with occupational exposure.',
      },
      {
        title: 'Post-Exposure Procedure',
        body: '**If you have a needlestick, cut, or exposure to blood:**\n\n**Immediately:**\n1. Wash the wound with soap and water for 15 minutes\n2. Flush mucous membranes (eyes, nose, mouth) with water\n3. Do NOT squeeze or suck the wound\n\n**Within 2 hours:**\n4. Report to your supervisor\n5. Go to Employee Health or the Emergency Department\n6. Evaluation for HIV Post-Exposure Prophylaxis (PEP) — most effective if started within 2 hours, must be started within 72 hours\n\n**Documentation required:**\n• Route of exposure and body parts involved\n• Source patient identity (for consent to test)\n• Circumstances of the exposure\n\n**You will not lose your job for reporting.** OSHA prohibits retaliation.',
        scenario: 'At 11 PM, you stick yourself with a needle used on an HIV-positive patient. The Employee Health office is closed. You should:',
        options: ['Wait until Employee Health opens in the morning', 'Go to the Emergency Department immediately for PEP evaluation', 'Clean the wound and document it tomorrow', 'Only report if you develop symptoms'],
        correct: 1,
        tip: 'HIV PEP is most effective when started within 2 hours of exposure and must begin within 72 hours. The ER is your after-hours resource. Waiting until morning could cost you the window for prophylaxis.',
      },
      {
        title: 'Labels, Recordkeeping, and Medical Records',
        body: '**Labeling requirements:**\nAll containers of blood, OPIM, or contaminated equipment must bear the biohazard symbol and the word "BIOHAZARD." Red bags or containers may substitute for labels.\n\n**Sharps injury log:**\nEmployers must maintain a sharps injury log recording all percutaneous injuries from contaminated sharps. Log entries are confidential and must be maintained for 5 years.\n\n**Medical records:**\nPost-exposure medical records are confidential and maintained for the duration of employment plus 30 years.\n\n**Training records:**\nBBP training records must be kept for 3 years and include the dates of training, content summary, trainer credentials, and names of attendees.',
      },
    ],
    questions: [
      { text: 'The risk of HIV transmission per needlestick with contaminated blood is approximately:', option_a: '0.03%', option_b: '0.3%', option_c: '3%', option_d: '10%', correct_answer: 'B' },
      { text: 'HIV post-exposure prophylaxis (PEP) must be started within:', option_a: '2 hours (optimal) and no later than 72 hours', option_b: '24 hours', option_c: '1 week', option_d: '30 minutes', correct_answer: 'A' },
      { text: 'OSHA requires the Hepatitis B vaccine to be offered to at-risk employees:', option_a: 'Only after a documented exposure', option_b: 'Free of charge within 10 working days of initial assignment', option_c: 'After 90 days of employment', option_d: 'At cost to the employee', correct_answer: 'B' },
      { text: 'OPIM stands for:', option_a: 'Occupational Pathogen Incident Management', option_b: 'Other Potentially Infectious Materials', option_c: 'Optional Personal Infection Measures', option_d: 'Other PPE Infection Materials', correct_answer: 'B' },
      { text: 'Two-handed recapping of needles is:', option_a: 'Acceptable if no sharps container is nearby', option_b: 'Prohibited — a work practice control violation', option_c: 'Required for insulin syringes', option_d: 'Only prohibited in OR settings', correct_answer: 'B' },
      { text: 'The Exposure Control Plan must be reviewed and updated:', option_a: 'Every 5 years', option_b: 'Annually and when new exposure tasks are introduced', option_c: 'Only after an exposure incident', option_d: 'When requested by OSHA', correct_answer: 'B' },
      { text: 'Hepatitis B is the most dangerous BBP in terms of transmission risk because:', option_a: 'It has no vaccine', option_b: 'It can survive on surfaces for up to 7 days and has the highest per-needlestick risk', option_c: 'It spreads through the air', option_d: 'It affects children more severely', correct_answer: 'B' },
      { text: 'After a needlestick, sharps injury logs must be maintained for:', option_a: '1 year', option_b: '3 years', option_c: '5 years', option_d: '10 years', correct_answer: 'C' },
      { text: 'The FIRST step after a needlestick injury is:', option_a: 'Report to supervisor', option_b: 'Go to Employee Health', option_c: 'Wash the wound with soap and water for 15 minutes', option_d: 'Call the source patient', correct_answer: 'C' },
      { text: 'Containers of blood or OPIM must be labeled with:', option_a: 'A red X', option_b: 'The biohazard symbol and the word "BIOHAZARD" (or use red containers)', option_c: 'An orange triangle', option_d: 'A white label with disposal instructions', correct_answer: 'B' },
    ],
  },

]

export function getTemplate(id: string): ComplianceTemplate | undefined {
  return COMPLIANCE_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByIndustry(industry: string): ComplianceTemplate[] {
  return COMPLIANCE_TEMPLATES.filter(t =>
    t.industry.toLowerCase().includes(industry.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(industry.toLowerCase()))
  )
}
