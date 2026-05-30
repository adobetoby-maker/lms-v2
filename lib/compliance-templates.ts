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
