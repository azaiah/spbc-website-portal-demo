import type { Opportunity, ReadinessItem } from './types'

/**
 * Funding opportunities for The Saint Paul's Baptist Church and its community development arm,
 * Nia Community Development Corporation of Greater Richmond (501(c)(3), EIN 54-1736110), plus the
 * Saint Paul's Community Foundation (EIN 20-4242064). See docs/04-funding.md.
 * Program facts were verified for a Richmond church on 2026-10-19 and re-scored for SPBC on 2026-10-21.
 * Dates marked "expected" are projected from the prior cycle. `verified: false` = confirm before relying on it.
 * In this module, entity 'center' means Nia.
 */
export const RESEARCHED_ON = '2026-10-21'

export const opportunities: Opportunity[] = [
  {
    id: 'op_nsgp', name: 'Nonprofit Security Grant Program', funder: 'FEMA via Virginia Dept. of Emergency Management', category: 'security', level: 'federal', entity: 'church',
    amount: 'Up to $200,000 per site, up to 3 sites', amountValue: 400000, window: 'Annual. The 2026 Virginia window was July 1 to 10.', nextDeadline: '2027-07-09', status: 'recurring', fit: 94,
    whyFit: 'Houses of worship are eligible and each campus is its own site. Creighton and Belt both host large crowds (Sunday worship, the Christmas production, Breakthrough NYE, Homecoming), which is exactly the risk profile the program funds: cameras, access control, lighting and training.',
    requirements: ['A vulnerability assessment for each campus', 'Current-year Investment Justification form, unaltered', 'Mission statement PDF', 'UEI from SAM.gov before any award is paid'],
    nextSteps: ['Request security assessments for both campuses this winter', 'Register the church on SAM.gov (takes weeks)', 'Draft one Investment Justification per campus in April'],
    programs: ['Creighton Campus', 'Belt Campus', 'Christmas production', 'NYE services'], verified: true, source: 'https://www.vdem.virginia.gov/divisions/finance/grants/opportunity/26001-2/',
  },
  {
    id: 'op_bja', name: 'Enhancing Security for Houses of Worship', funder: 'U.S. DOJ Bureau of Justice Assistance', category: 'security', level: 'federal', entity: 'church',
    amount: 'Up to $200,000', amountValue: 200000, window: 'The FY26 Grants.gov deadline was September 2, 2026. May recur.', status: 'recurring', fit: 84,
    whyFit: 'A second federal security source for houses of worship that rewards a written partnership with local law enforcement (Henrico County Police for Creighton, Richmond Police for Belt).',
    requirements: ['Grants.gov and SAM.gov registration', 'Local law enforcement coordination', 'Security plan'],
    nextSteps: ['Ask Henrico and Richmond police for letters of support', 'Reuse the NSGP vulnerability assessments', 'Watch Grants.gov for the FY27 notice'],
    programs: ['Security ministry', 'Both campuses'], verified: true, source: 'https://www.grants.gov/',
  },
  {
    id: 'op_solar', name: 'Clean energy credits paid as cash (IRS Elective Pay)', funder: 'U.S. Treasury / IRS', category: 'energy', level: 'federal', entity: 'either',
    amount: 'About 30% or more of project cost, paid as cash', amountValue: 250000, window: 'Solar starting construction after July 4, 2026 must be in service by December 31, 2027. Storage through 2035; geothermal through 2034.', nextDeadline: '2027-12-31', status: 'open', fit: 90,
    whyFit: 'The Creighton campus is a 125,000+ square foot ministry complex with large roofs and parking. Churches and nonprofits can receive the clean energy credit as a direct payment, so solar canopies over parking could return roughly a third of their cost and lower power bills for years. It is also a strong City of Possibility story.',
    requirements: ['Pre-filing registration with the IRS', 'Prevailing wage and apprenticeship rules for larger systems', 'Placed in service by the deadline (solar)'],
    nextSteps: ['Get two solar proposals for Creighton roofs and parking canopies', 'Ask installers to model elective-pay returns', 'Decide before spring 2027 to beat the in-service deadline'],
    programs: ['Creighton Campus', 'City of Possibility'], verified: true, source: 'https://planetdetroit.org/2026/04/irs-elective-pay-solar-deadline/',
  },
  {
    id: 'op_nap', name: 'Neighborhood Assistance Program tax credits', funder: 'Virginia Dept. of Social Services', category: 'tax-credit', level: 'state', entity: 'center', outsideBox: true,
    amount: 'Donors receive up to a 65% Virginia tax credit', amountValue: 75000, window: 'Apply March 15 to the first business day in May. Credits run July 1 to June 30.', nextDeadline: '2027-05-03', status: 'upcoming', fit: 92,
    whyFit: 'NAP makes every major gift cheaper for the donor. A business that gives $10,000 to Nia can receive up to $6,500 back in Virginia tax credits, turning Eastern Henrico and Southside businesses into realistic sponsors of fresh food Fridays, the health fair and Dignity on the Go.',
    requirements: ['Approved 501(c)(3) serving low-income people (Nia)', 'Annual application inside the window', 'Credit allocation tracked and reported'],
    nextSteps: ['Register Nia in the NAP database before March', 'Build a list of 25 business prospects in Partners', 'Prepare a one-page sponsor ask showing the after-credit cost'],
    programs: ['Fresh Food Distribution', 'Dignity on the Go', 'Health Fair'], verified: true, source: 'https://dss.virginia.gov/community-and-volunteer-services/nap/',
  },
  {
    id: 'op_5310', name: 'Accessible vehicles for seniors (FTA Section 5310)', funder: 'Virginia DRPT Human Services Grant Program', category: 'transport', level: 'state', entity: 'center',
    amount: 'State-procured accessible vehicle; local share required', amountValue: 85000, window: 'Annual window December 1 to February 1.', nextDeadline: '2027-02-01', status: 'upcoming', fit: 88,
    whyFit: 'Saint Paul’s already runs a transportation line (804.463.2429) and has two senior life stages, Prime Time and Refiners, with daytime Bible studies at both campuses. An accessible vehicle through Nia would carry seniors and neighbors with disabilities between campuses and to programs.',
    requirements: ['Nonprofit applicant (Nia)', 'Demonstrated ridership need', 'Local share and insurance'],
    nextSteps: ['Log every ride in Outreach starting now', 'Survey Prime Time and Refiners about ride needs', 'Draft the application in December'],
    programs: ['Transportation', 'Prime Time', 'Refiners'], verified: true, source: 'https://drpt.virginia.gov/our-grant-programs/human-services-grant-program/',
  },
  {
    id: 'op_henrico', name: 'Henrico County CDBG / HOME', funder: 'Henrico County (HUD entitlement community)', category: 'housing', level: 'city', entity: 'center',
    amount: 'Varies by program', amountValue: 100000, window: 'Annual county cycle. Dates not yet confirmed.', status: 'upcoming', fit: 82,
    whyFit: 'Henrico receives its own federal housing and community development funds. Nia’s housing and homeownership work and the affordability goals of the City of Possibility fit the HOME and CDBG purposes.',
    requirements: ['501(c)(3) applicant', 'SAM.gov UEI', 'Program serving low- and moderate-income residents'],
    nextSteps: ['Call Henrico Community Revitalization to learn the cycle', 'Map Nia’s housing counseling outcomes', 'Confirm SAM.gov registration'],
    programs: ['Nia housing', 'City of Possibility'], verified: false,
  },
  {
    id: 'op_cdbg', name: 'City of Richmond federal entitlement NOFA (CDBG/ESG)', funder: 'City of Richmond Housing & Community Development', category: 'housing', level: 'city', entity: 'center',
    amount: 'Varies; 1:1 leverage', amountValue: 75000, window: 'Expected NOFA late November 2026, due mid-December (verify).', nextDeadline: '2026-12-15', status: 'upcoming', fit: 78,
    whyFit: 'Dignity on the Go showers and Belt Campus outreach serve Southside Richmond residents without stable housing, a fit for Emergency Solutions Grant and public services categories.',
    requirements: ['SAM.gov UEI', '1:1 leverage', 'Program in the City of Richmond'],
    nextSteps: ['Log Dignity on the Go guests and showers weekly', 'Watch for the NOFA in late November', 'Line up leverage from NAP sponsors'],
    programs: ['Dignity on the Go', 'Belt Campus outreach'], verified: false, source: 'https://rva.gov/housing-and-community-development',
  },
  {
    id: 'op_opioid', name: 'Opioid settlement community funding', funder: 'City of Richmond, Office of Opioid and Substance Use Response', category: 'recovery', level: 'city', entity: 'center',
    amount: 'Share of a $600,000 pool (up to 10 awards)', amountValue: 60000, window: 'Annual request for applications. The 2026 round was due March 20, 2026.', nextDeadline: '2027-03-19', status: 'recurring', fit: 74,
    whyFit: 'Nia’s health education and prevention work, and the church’s commitment to people coming home from incarceration, fit community-based prevention in Black communities, a named 2026 priority. Requires a full Form 990, so Nia would need to grow beyond the 990-EZ.',
    requirements: ['Nonprofit in good standing with the City', 'Evidence-based approach', 'Most recent complete Form 990 (990-N not accepted)'],
    nextSteps: ['Confirm whether Nia can file a full 990', 'Partner with RBHA on an evidence-based curriculum', 'Track prevention session attendance'],
    programs: ['Nia health education', 'Counseling'], verified: true, source: 'https://rva.gov/sites/default/files/2026-01/Request_for_Applications_%28Open_Application%29_%20UPDATED.pdf',
  },
  {
    id: 'op_psn', name: 'Project Safe Neighborhoods (Eastern District of Virginia)', funder: 'U.S. DOJ via Virginia DCJS', category: 'violence', level: 'federal', entity: 'center',
    amount: '$25,000 to $200,000, no match', amountValue: 100000, window: 'Annual. The 2026 round was due January 15, 2026.', nextDeadline: '2027-01-15', status: 'upcoming', fit: 80,
    whyFit: 'Faith-based prevention and reentry programs run by 501(c)(3)s are eligible. SMB’s youth mentoring programs (Sons & Daughters of the King; Kisura & Lions of Judah) and the church’s reentry commitment could anchor a prevention proposal through Nia.',
    requirements: ['501(c)(3) in the Eastern District', 'One application per organization', 'Prevention or reentry focus', 'No food, gift cards or client stipends'],
    nextSteps: ['Document mentoring enrollment and outcomes', 'Get letters from Henrico and Richmond police', 'Watch DCJS for the 2027 solicitation in December'],
    programs: ['SMB youth mentoring', 'Reentry support'], verified: true, source: 'https://www.dcjs.virginia.gov/sites/dcjs.virginia.gov/files/grants/PSN_EDVA_Funding_Opportunity_2026_0.pdf',
  },
  {
    id: 'op_lilly', name: 'Lilly Endowment: Serving Neighbors (2027)', funder: 'Lilly Endowment Inc. (through a coordinating 501(c)(3))', category: 'capacity', level: 'foundation', entity: 'either',
    amount: 'TBD', amountValue: 0, window: 'Concept papers due January 19, 2027 through a coordinating 501(c)(3).', nextDeadline: '2027-01-19', status: 'upcoming', fit: 76,
    whyFit: 'A national initiative for congregations serving their neighbors. Saint Paul’s scale and outreach make it a candidate lead congregation or partner. Eligibility for a single large congregation must be confirmed.',
    requirements: ['Coordinating 501(c)(3) applicant', 'Concept paper by the deadline'],
    nextSteps: ['Confirm eligibility and the coordinating organization', 'Draft a one-page concept around fresh food, showers and seniors'],
    programs: ['Outreach'], verified: false,
  },
  {
    id: 'op_dominion', name: 'Dominion Energy Charitable Foundation', funder: 'Dominion Energy', category: 'giving', level: 'corporate', entity: 'center',
    amount: 'Varies', amountValue: 15000, window: 'Two cycles a year; expect the spring 2027 cycle around January.', nextDeadline: '2027-01-20', status: 'upcoming', fit: 77,
    whyFit: 'Human needs and community vitality are focus areas, and Dominion is a Richmond headquarters company. Fresh food Fridays and Dignity on the Go are concrete, countable programs.',
    requirements: ['501(c)(3) applicant (Nia)', 'Clear budget and outcomes'],
    nextSteps: ['Gather a year of food and shower counts', 'Draft a $15,000 request for the spring cycle'],
    programs: ['Fresh Food Distribution', 'Dignity on the Go'], verified: true,
  },
  {
    id: 'op_cfr', name: 'Community Foundation for a greater Richmond', funder: 'Community Foundation for a greater Richmond (incl. Ujima Legacy Fund)', category: 'education', level: 'foundation', entity: 'center',
    amount: 'Up to $20,000 (Ujima); others by invitation', amountValue: 20000, window: 'Ujima next listed deadline September 2027 (verify).', nextDeadline: '2027-09-25', status: 'upcoming', fit: 72,
    whyFit: 'Ujima funds youth empowerment for ages 12 to 21 with emphasis on Black youth. SMB mentoring through Nia fits. Most other CFR grants are relationship-driven.',
    requirements: ['501(c)(3) applicant (churches ineligible)', 'Youth 12 to 21 focus'],
    nextSteps: ['Introduce Nia to CFR program staff', 'Document SMB mentoring outcomes'],
    programs: ['SMB mentoring'], verified: false, source: 'https://www.instrumentl.com/grants/ujima-legacy-fund-grants',
  },
  {
    id: 'op_recurring', name: 'Recurring online giving (Pushpay)', funder: 'Your own congregation', category: 'giving', level: 'creative', entity: 'church', outsideBox: true,
    amount: 'Steady monthly income', amountValue: 0, window: 'Start now. No application.', status: 'idea', fit: 95,
    whyFit: 'The fastest money needs no grant. The new website presents recurring giving first on the Give page and in the app, and the Finance view tracks the share of givers on a schedule.',
    requirements: ['Pushpay recurring enabled (already available)'],
    nextSteps: ['Announce recurring giving from the pulpit on a Sunday in November', 'Add a recurring prompt to the e-bulletin', 'Track the recurring share monthly'],
    programs: ['General fund'], verified: true,
  },
  {
    id: 'op_match', name: 'Employer matching gifts and volunteer grants', funder: 'Members’ employers', category: 'giving', level: 'creative', entity: 'center', outsideBox: true,
    amount: 'Often 1:1 on gifts; $10 to $25 per volunteer hour', amountValue: 25000, window: 'Year-round; many programs close in January for the prior year.', status: 'rolling', fit: 80,
    whyFit: 'With thousands of people in the congregation, many work for Richmond employers with matching programs (Dominion, Capital One, CarMax, Altria, Truist: verify each). Matches usually go to a 501(c)(3), so gifts to Nia or the Foundation qualify.',
    requirements: ['Gift to an eligible 501(c)(3)', 'Employee submits through the employer portal'],
    nextSteps: ['Add “Does your employer match?” to the Give page and e-bulletin', 'Publish Nia’s and the Foundation’s EINs for matching forms'],
    programs: ['Nia', 'Community Foundation'], verified: false,
  },
  {
    id: 'op_rentals', name: 'Facility and event rentals at Creighton', funder: 'Earned revenue', category: 'earned', level: 'creative', entity: 'church', outsideBox: true,
    amount: 'Varies', amountValue: 0, window: 'Ongoing', status: 'idea', fit: 70,
    whyFit: 'The Commons and other Creighton spaces can host community events, receptions and conferences when not in ministry use, with clear policies and insurance.',
    requirements: ['Facility use policy', 'Certificates of insurance', 'Unrelated business income review'],
    nextSteps: ['Inventory rentable spaces and rates in Facilities', 'Draft a rental policy for leadership approval'],
    programs: ['The Commons'], verified: false,
  },
]

export const readiness: ReadinessItem[] = [
  { id: 'rd_sam_church', label: 'SAM.gov registration (church)', detail: 'Required before federal security grants (NSGP, BJA) can be paid. Free; can take weeks.', entity: 'church', done: false, unlocks: 'Nonprofit Security Grant Program, BJA houses of worship security' },
  { id: 'rd_sam_nia', label: 'SAM.gov registration (Nia)', detail: 'Register Nia Community Development Corporation of Greater Richmond at SAM.gov.', entity: 'center', done: false, unlocks: 'CDBG/ESG, Project Safe Neighborhoods, Section 5310 and most pass-through funds' },
  { id: 'rd_990', label: 'Nia Form 990-EZ on file (FY2024)', detail: 'Revenue $140,847; net assets $429,157 (ProPublica).', entity: 'center', done: true, unlocks: 'Most foundation applications' },
  { id: 'rd_full990', label: 'Path to a full Form 990 for Nia', detail: 'Some city programs (opioid settlement RFA) do not accept 990-EZ. Growing Nia’s programs and revenue opens these.', entity: 'center', done: false, unlocks: 'City of Richmond opioid settlement funds' },
  { id: 'rd_assess', label: 'Security vulnerability assessments (both campuses)', detail: 'Request free assessments from local law enforcement or a qualified assessor.', entity: 'church', done: false, unlocks: 'NSGP Investment Justifications' },
  { id: 'rd_counts', label: 'Program counts logged every week', detail: 'Fresh food households, shower guests and rides, logged in Outreach.', entity: 'either', done: false, unlocks: 'Every narrative and report: real numbers only' },
  { id: 'rd_board', label: 'Nia board roster and bylaws', detail: 'Current board list with officers and terms (confirm with Nia).', entity: 'center', done: false, unlocks: 'Foundation and county applications' },
  { id: 'rd_audit', label: 'Financial review or audit', detail: 'An independent review strengthens larger asks.', entity: 'either', done: false, unlocks: 'Grants above $50,000' },
]
