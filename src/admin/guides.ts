/**
 * Plain-language walkthrough guides for non-technical church staff.
 * Each module: what it is for, who usually owns it, what you can hand off, and a step-by-step tour.
 */
export type GuideStep = { title: string; text: string; to?: string; cta?: string }
export type Guide = {
  path: string; title: string; plain: string; owner: string; handoff: string[]; steps: GuideStep[]
}

export const guides: Guide[] = [
  { path: '/admin', title: 'Dashboard', owner: 'Senior Pastor and Executive Administrator',
    plain: 'Think of this as the one-page report for both campuses that you used to have to ask five people for. It pulls numbers from every other tool so leadership can see how the church is doing without calling the office.',
    handoff: ['Nothing to assign here. This page only reads what the other tools already know.', 'Use "What needs my attention" as the Monday huddle agenda.'],
    steps: [
      { title: 'Read the four big numbers', text: 'Active members, this month’s giving, open requests and upcoming events. Each one is a button. Click it to go to the tool that owns the number.' },
      { title: 'Scan "What needs my attention"', text: 'These are exceptions, not routine work: visitors nobody has called, approvals waiting, urgent repairs. Each line takes you straight to the fix.', to: '/admin', cta: 'Show me' },
      { title: 'Answer the leadership questions', text: 'Are we growing? Which ministries need support? What impact are we making? The small panels answer these from live records, and "Open" takes you to the detail.' },
      { title: 'Check the Monday Morning Package', text: 'The AI agents prepare a bundle of drafts after Sunday. Nothing in it is sent until a person approves it. Open AI Agents to review.', to: '/admin/agents', cta: 'Open AI Agents' },
    ] },
  { path: '/admin/action-center', title: 'Action Center', owner: 'Executive Administrator (with Finance Office and Office & Communications for their areas)',
    plain: 'This is the church’s inbox for decisions. Anything that needs a yes or no from a person lands here: expense requests, event proposals, room bookings, messages waiting to go out, and drafts the AI agents prepared.',
    handoff: ['Expense approvals go to the Finance Office.', 'Communications approvals go to the Office & Communications.', 'Events, facilities and new volunteers go to the Executive Administrator.', 'Tasks can be checked off by whoever owns them.'],
    steps: [
      { title: 'Approvals tab', text: 'Each card says what is being asked, who asked, and how much. Approve or Reject. The decision flows back to the right tool automatically: an approved expense shows as approved in Finance, an approved booking turns green in Facilities.', to: '/admin/action-center?tab=approvals', cta: 'Open approvals' },
      { title: 'Agent drafts tab', text: 'The AI agents wrote these: a bulletin, a welcome letter, a giving summary. Click Review to read and edit the words before approving. Approving a bulletin moves it to the Office; approving a report files it in Documents.', to: '/admin/action-center?tab=drafts', cta: 'Open drafts' },
      { title: 'Tasks tab', text: 'Everyday to-dos with an owner and a due date. Check the box when done. Overdue tasks are counted at the top.', to: '/admin/action-center?tab=tasks', cta: 'Open tasks' },
      { title: 'Why some buttons are missing', text: 'If you see "Requires Finance Office", your role is not allowed to make that decision. That is deliberate: the system enforces who can approve what.' },
    ] },
  { path: '/admin/members', title: 'Members', owner: 'Office & Communications and Hospitality team (visitors); Pastor (pastoral care)',
    plain: 'The church directory, upgraded. Every member, family, visitor and attendee has one record with contact details, ministries, event history and notes. Visitors move through a pipeline so nobody is forgotten.',
    handoff: ['Welcome calls to first-time visitors: Hospitality team.', 'Updating addresses and household changes: Office & Communications.', 'Pastoral care requests: Pastor or care coordinator only.', 'Monthly "needs follow-up" list: each Life Stage Pastor for their stage.'],
    steps: [
      { title: 'Search the directory', text: 'Type a name, email or phone. Use the filter to show only visitors, members, or people with no contact in 90+ days.', to: '/admin/members?tab=directory', cta: 'Open directory' },
      { title: 'Open a person', text: 'Click any row. You see their household, ministries, events and a place to log a call. Giving and pastoral care sections only appear if your role is allowed to see them.' },
      { title: 'Work the visitor pipeline', text: 'Guests appear here the moment they plan a visit on the church website, tagged with their campus. "Log welcome call" moves them forward. When they register for orientation they move again.', to: '/admin/members?tab=visitors', cta: 'Open pipeline' },
      { title: 'Pastoral care queue', text: 'Prayer and care requests from the website land here. Assign to the right Life Stage Pastor or to Outreach, add updates, close when resolved. Confidential requests are hidden from roles that should not see them.', to: '/admin/members?tab=care', cta: 'Open care queue' },
      { title: 'Add someone by hand', text: 'Use "Add person" for walk-ins or phone calls. The system checks for duplicate emails and creates a welcome-call task for a new visitor.' },
    ] },
  { path: '/admin/finance', title: 'Finance', owner: 'Finance Office (detail); Senior Pastor and Executive Administrator (summary)',
    plain: 'Where the money is tracked: every gift, every fund, every ministry budget and every expense request. Pushpay keeps processing gifts and your accounting system keeps the books; this is the view everyone can understand, with approvals built in.',
    handoff: ['Weekly reconciliation of Pushpay batches and Sunday deposits: Finance Office.', 'Approving expense requests: Finance Office (board for anything over $2,500).', 'Marking approved expenses as paid: Finance Office.', 'Year-end giving statements: Finance Office each January.'],
    steps: [
      { title: 'Overview', text: 'Six months of giving, a breakdown by fund, and a simple month view of money in versus money out.', to: '/admin/finance?tab=overview', cta: 'Open overview' },
      { title: 'Giving', text: 'Every gift. Online gifts from the website arrive as "recorded". After you match them to the bank deposit, click Reconcile (or Reconcile all).', to: '/admin/finance?tab=giving', cta: 'Open giving' },
      { title: 'Funds and budgets', text: 'Funds show what is restricted (City of Possibility) versus general. Budgets show each ministry’s planned versus actual for the month; red means over.', to: '/admin/finance?tab=budgets', cta: 'Open budgets' },
      { title: 'Expenses', text: 'Ministry leaders request, Finance approves, then marks paid. Paying an expense updates the ministry’s budget line automatically.', to: '/admin/finance?tab=expenses', cta: 'Open expenses' },
      { title: 'Statements', text: 'Pick a donor and download their annual statement. In January this runs for everyone and posts to each member’s portal.', to: '/admin/finance?tab=statements', cta: 'Open statements' },
    ] },
  { path: '/admin/office', title: 'Office', owner: 'Office & Communications',
    plain: 'The secretary’s desk. Announcements, the Sunday bulletin, letters, the document cabinet, meeting agendas, and the inbox of requests that came in through the website, each already routed to the right person.',
    handoff: ['Writing and sending announcements: Office & Communications (pastor approves).', 'Weekly e-bulletin and GPS guide: Office & Communications reviews the agent’s draft.', 'Letters and thank-you notes: Office & Communications.', 'Meeting agendas and action items: Executive Administrator.'],
    steps: [
      { title: 'Announcements', text: 'Draft, approve, schedule, send. Pick the channels: bulletin, website, email, text. Sending creates a campaign record automatically.', to: '/admin/office?tab=announcements', cta: 'Open announcements' },
      { title: 'Bulletin', text: 'Generated from the calendar and approved announcements. Download or print. The Office Agent prepares it every Wednesday.', to: '/admin/office?tab=bulletin', cta: 'Open bulletin' },
      { title: 'Letters', text: 'Choose a template and a person. The letter fills itself in. "Mark as sent" updates their last-contact date.', to: '/admin/office?tab=letters', cta: 'Open letters' },
      { title: 'Documents and meetings', text: 'Policies, minutes, forms and agreements in one searchable list. Meetings keep an agenda and action items you can tick off.', to: '/admin/office?tab=documents', cta: 'Open documents' },
      { title: 'Incoming', text: 'Every website form that arrived today and where it went. Nothing waits in a personal email inbox.', to: '/admin/office?tab=requests', cta: 'Open incoming' },
    ] },
  { path: '/admin/ministries', title: 'Life Stages & Ministries', owner: 'Each Life Stage Pastor or ministry leader for their own area; Executive Administrator across all',
    plain: 'A private workspace for each of the eight life stages and each ministry: its people, calendar, budget lines, volunteer shifts and monthly report. Life Stage Pastors see only their own stage. Leadership sees all of them.',
    handoff: ['Event requests: the ministry leader submits, the Executive Administrator approves.', 'Keeping the roster current: the ministry leader.', 'Monthly activity report: prepared automatically, confirmed by the leader.'],
    steps: [
      { title: 'Pick a ministry', text: 'The colored pills switch workspaces. A ministry leader only sees one.', to: '/admin/ministries', cta: 'Open ministries' },
      { title: 'Check budget and volunteers', text: 'Budget lines turn red when over plan. Open volunteer shifts show as gold "Open" badges.' },
      { title: 'Request an event', text: 'Fill in the form. The Event Agent checks the room calendar for conflicts and an approval goes to the Executive Administrator. On approval the room is reserved and the registration page goes live.', to: '/admin/ministries', cta: 'Try a request' },
    ] },
  { path: '/admin/agents', title: 'AI Agents', owner: 'Executive Administrator (pause/resume); each agent’s drafts go to the role named on its card',
    plain: 'Seven assistants that do the repetitive paperwork: draft the e-bulletin, write welcome notes, summarize giving, check calendars, plan logistics, open work orders and find funding. They never send, pay or publish anything. A person always approves first.',
    handoff: ['Office Agent drafts: Office & Communications.', 'Finance Agent reports: Finance Office.', 'Member, Event and Facilities Agent items: Executive Administrator.', 'Outreach Agent campaigns: Office & Communications.'],
    steps: [
      { title: 'Read the Monday Morning Package', text: 'Items assembled after Sunday: giving and attendance at both campuses, guest follow-ups by life stage, events, volunteer gaps, maintenance and the e-bulletin draft.', to: '/admin/agents', cta: 'Open agents' },
      { title: 'Review a draft', text: 'Click Review. Edit the text if you like, then Approve or Reject. Approved items move to the tool that uses them.' },
      { title: 'Run the package yourself', text: '"Run Monday package now" creates fresh drafts from today’s data so you can see the cycle.' },
      { title: 'Pause everything', text: 'Leadership can pause all agents with one switch. The guardrails panel explains what agents can and cannot see.' },
    ] },
  { path: '/admin/events', title: 'Events', owner: 'Executive Administrator (approvals); the owning ministry leader (details)',
    plain: 'Every event walks through the same eight steps, from idea to impact report, so everyone knows what stage it is in and who is responsible next. Published events appear on the church website’s Events page automatically, replacing the separate myspbc.events site.',
    handoff: ['Approving a proposed event and its budget: Executive Administrator.', 'Confirming the room: Facilities.', 'Publishing registration and promoting: Office & Communications.', 'Recording attendance afterwards: the ministry leader.'],
    steps: [
      { title: 'The lifecycle board', text: 'Columns are stages. Cards are events. "Advance" moves an event to the next stage and does the work for that stage (reserving the room, opening registration, asking the Event Agent for an impact report).', to: '/admin/events?view=board', cta: 'Open board' },
      { title: 'Open an event', text: 'Click a card for owner, budget, registrations and the export list. Record attendance once it has happened.' },
      { title: 'List view', text: 'The same events as a simple dated list with registration counts.', to: '/admin/events?view=list', cta: 'Open list' },
    ] },
  { path: '/admin/facilities', title: 'Facilities', owner: 'Executive Administrator; facilities contractor for repairs',
    plain: 'The building book for both campuses. Who has which room and when (Creighton Sanctuary, The Commons, the Chapel, Belt), requests from outside groups, repairs that need doing, and the equipment and insurance dates you must not miss.',
    handoff: ['Approving room requests and rentals: Executive Administrator.', 'Doing the repairs: facilities contractor or vendor.', 'Recording rental payments: Finance Office.', 'Insurance and service renewals: Executive Administrator (reminded by the Facilities Agent).'],
    steps: [
      { title: 'Rooms this week', text: 'A grid of every room by day. Blue is a church event, green an approved booking, gold still waiting.', to: '/admin/facilities?tab=rooms', cta: 'Open rooms' },
      { title: 'Reservations', text: 'Approve or decline requests. Conflicts are flagged. For rentals, record the payment; it posts to the Building Fund.', to: '/admin/facilities?tab=reservations', cta: 'Open reservations' },
      { title: 'Maintenance', text: 'Report an issue and the Facilities Agent drafts a work order with a suggested vendor. Move items from open to assigned to scheduled to done.', to: '/admin/facilities?tab=maintenance', cta: 'Open maintenance' },
      { title: 'Assets', text: 'The van, broadcast and sound systems, kitchen, insurance policies. Service and renewal dates with warnings as they approach.', to: '/admin/facilities?tab=assets', cta: 'Open assets' },
    ] },
  { path: '/admin/people', title: 'People & Volunteers', owner: 'Executive Administrator; ministry leaders for their own schedules',
    plain: 'Staff, contractors and volunteers in one roster, with the two things churches must get right: background checks and schedules. Nobody can be put on a youth shift until their check is clear.',
    handoff: ['Adding new volunteers and requesting background checks: Executive Administrator.', 'Filling Sunday shifts: ministry leaders.', 'Recording trainings: Executive Administrator.', 'Hours for payroll: Finance Office.'],
    steps: [
      { title: 'Directory', text: 'Everyone on the roster with their type and background-check status.', to: '/admin/people?tab=directory', cta: 'Open directory' },
      { title: 'Schedule', text: 'Four Sundays of shifts across both campuses. Assign only shows people who are cleared for that ministry. Confirm once they say yes.', to: '/admin/people?tab=schedule', cta: 'Open schedule' },
      { title: 'Compliance', text: 'Pending and expired checks at the top. Mark cleared when the result comes back; record safeguarding training.', to: '/admin/people?tab=compliance', cta: 'Open compliance' },
      { title: 'Hours', text: 'Volunteer hours for the impact report; staff hours for payroll.', to: '/admin/people?tab=hours', cta: 'Open hours' },
    ] },
  { path: '/admin/outreach', title: 'Outreach', owner: 'Outreach team (fresh food, showers and help requests); Transportation (rides)',
    plain: 'Everything Saint Paul’s does for neighbors in one place: Friday fresh food at Creighton, Dignity on the Go showers on Wednesdays at Belt, ride requests and help requests from the website. The numbers you log here become the proof funders ask for.',
    handoff: ['Friday counts (households, people, pounds): the intake volunteer at the end of each distribution.', 'Shower day counts (guests, showers, kits): the Dignity on the Go host.', 'Ride requests: Transportation (804.463.2429).', 'Help requests from the website: the Outreach team member on duty.'],
    steps: [
      { title: 'Log a Friday distribution', text: 'Tap "Log a Friday" after each distribution and enter households, people, seniors, children and pounds. Totals for the month and year update instantly.', to: '/admin/outreach?tab=pantry', cta: 'Open fresh food' },
      { title: 'Log Dignity on the Go', text: 'Enter guests, showers and hygiene kits each Wednesday. These are the numbers city and foundation funders ask for.', to: '/admin/outreach?tab=showers', cta: 'Open showers' },
      { title: 'Schedule rides', text: 'Ride requests from the website land here. Assign a driver, mark the ride complete, and the log builds the case for an accessible van grant through Nia.', to: '/admin/outreach?tab=rides', cta: 'Open rides' },
      { title: 'Answer help requests', text: 'Food, showers, diapers, bills, housing, jobs and counseling. Assign, follow up and close with an outcome. Personal details stay private; reports only show totals.', to: '/admin/outreach?tab=requests', cta: 'Open requests' },
      { title: 'Download the impact summary', text: 'One click gives a plain-language impact summary for the pastor, the board or a funder.' },
    ] },
  { path: '/admin/grants', title: 'Grant Advisor', owner: 'Executive Administrator, with the Outreach team for program data and Nia for nonprofit applications',
    plain: 'An AI funding advisor that knows Saint Paul’s. It searches federal, Virginia, Henrico, Richmond, foundation and corporate funding, scores how well each fits the church or Nia, explains why, and drafts the first letter. It also looks past grants: tax credits, solar elective pay, matching gifts and recurring giving.',
    handoff: ['Weekly review of new matches: Executive Administrator.', 'Readiness items (SAM.gov, Nia’s 990 and board list): Executive Administrator and Nia’s treasurer.', 'Program data and narratives: the Outreach team.', 'Final approval before anything is submitted: Senior Pastor.'],
    steps: [
      { title: 'Read the matches', text: 'Every opportunity has a fit score, the dollar range, the deadline and whether the church or Nia should apply. Filter by category or by entity.', to: '/admin/grants?tab=matches', cta: 'Open matches' },
      { title: 'Open one to see why it fits', text: 'The advisor explains the fit in plain words, lists requirements and the next three steps, with a link to the official source.' },
      { title: 'Draft a letter of inquiry', text: 'One click writes a first draft using Saint Paul’s real history, programs and the numbers logged in Outreach. Edit it, then send it to the pipeline.', to: '/admin/grants?tab=matches', cta: 'Try it' },
      { title: 'Work the readiness checklist', text: 'Most grants are lost before they start because of paperwork. The checklist shows what is missing and which grants each item unlocks.', to: '/admin/grants?tab=readiness', cta: 'Open readiness' },
      { title: 'Ask the advisor', text: 'Ask questions like "How do we pay for a van?" or "What can we apply for this quarter?" and get an answer built from the opportunity list.', to: '/admin/grants?tab=ask', cta: 'Ask now' },
    ] },
  { path: '/admin/community', title: 'Community', owner: 'Outreach team (fresh food, showers, help requests); Transportation; Prime Time and Refiners pastors for seniors',
    plain: 'The church as a help desk for the neighborhood. Requests for food, showers, diapers, help with bills, jobs, rides, senior support and emergencies come in from the website and are routed to a coordinator. Leadership sees totals, never names.',
    handoff: ['Assigning new requests: the Outreach team.', 'Fulfilling or referring: the assigned coordinator.', 'Impact numbers for grants and the board: Executive Administrator.'],
    steps: [
      { title: 'Service requests', text: 'New requests at the top. Assign, start, then record the outcome: fulfilled or referred to a partner. Names are hidden from roles that do not need them.', to: '/admin/community?tab=requests', cta: 'Open requests' },
      { title: 'Programs', text: 'Each program with its coordinator, partners and how many requests were resolved.', to: '/admin/community?tab=programs', cta: 'Open programs' },
      { title: 'Impact', text: 'The totals you give funders and the congregation: households served, people reached, referrals, volunteer hours.', to: '/admin/community?tab=impact', cta: 'Open impact' },
    ] },
  { path: '/admin/communications', title: 'Communications', owner: 'Office & Communications (pastor approves)',
    plain: 'Email newsletters and text messages to the right groups of people, with permission tracked for every person. Segments are built from the directory, so "first-time guests", "Refiners" or "Belt Campus members" are always current.',
    handoff: ['Writing the brief and approving copy: Office & Communications.', 'Final approval and sending: Office & Communications or pastor.', 'Unsubscribe requests: handled automatically; questions go to the Office & Communications.'],
    steps: [
      { title: 'Campaigns', text: 'Create a campaign with a brief. The Outreach Agent drafts the copy; you approve it in the Action Center; then Send.', to: '/admin/communications?tab=campaigns', cta: 'Open campaigns' },
      { title: 'Segments', text: 'Live counts of who would receive what. No spreadsheets.', to: '/admin/communications?tab=segments', cta: 'Open segments' },
      { title: 'Consent', text: 'Who has said yes to email and text. Members change this themselves in the portal.', to: '/admin/communications?tab=consent', cta: 'Open consent' },
    ] },
  { path: '/admin/partners', title: 'Partnerships', owner: 'Executive Administrator and Pastor',
    plain: 'Partners like Feed More, Urban Baby Beginnings and Delta Sigma Theta; the City of Possibility team; member-owned businesses; grants you are chasing; programs and rentals of The Commons.',
    handoff: ['Partner relationships: Executive Administrator.', 'Approving business directory listings: Senior Pastor or Executive Administrator.', 'Grant applications and deadlines: Executive Administrator (tasks are created automatically).', 'Program outcomes: the program lead.'],
    steps: [
      { title: 'Partner CRM', text: 'Prospect, active or paused. Notes on what each partner does with you.', to: '/admin/partners?tab=partners', cta: 'Open partners' },
      { title: 'Business directory', text: 'Member businesses waiting for approval appear with an Approve button. Approved listings show on the church website.', to: '/admin/partners?tab=directory', cta: 'Open directory' },
      { title: 'Grants', text: 'A board from identified to awarded. Adding a grant creates a deadline task.', to: '/admin/partners?tab=grants', cta: 'Open grants' },
      { title: 'Programs and rentals', text: 'Enrolled, completed and placed for each program; income and payment status for each rental.', to: '/admin/partners?tab=programs', cta: 'Open programs' },
    ] },
  { path: '/admin/reports', title: 'Reports', owner: 'Senior Pastor, Executive Administrator, Finance Office',
    plain: 'Six questions leadership always asks, answered automatically from the same records every tool uses. Export the weekly summary for the board. The audit trail at the bottom shows who did what and when.',
    handoff: ['Nothing to assign. Reports are prepared automatically.', 'Reviewing the weekly summary before the board meeting: Executive Administrator.'],
    steps: [
      { title: 'Read the six answers', text: 'Finances, growth, ministries needing support, facilities, impact, attention. Each has a small chart or list behind it.', to: '/admin/reports', cta: 'Open reports' },
      { title: 'Export', text: '"Export weekly summary" downloads a text summary and files a copy in Documents.' },
      { title: 'Audit trail', text: 'Every approval, reconciliation, draft and change, with the person or agent responsible.' },
    ] },
  { path: '/admin/settings', title: 'Settings', owner: 'Executive Administrator; DataIsData support',
    plain: 'Church details that appear on the website and letters, the roles and permissions table, security switches, connected services, and the list of churches on the platform.',
    handoff: ['Church profile changes: Executive Administrator.', 'Role changes and integrations: DataIsData support with the Executive Administrator.'],
    steps: [
      { title: 'Roles and permissions', text: 'The table shows exactly what each role can see and approve. Switch accounts from the menu at the top right to see it in action.', to: '/admin/settings?tab=roles', cta: 'Open roles' },
      { title: 'Integrations', text: 'Pushpay, Rock RMS, Microsoft 365, YouTube, Subsplash, texting and background checks. Existing systems stay; this connects them.', to: '/admin/settings?tab=integrations', cta: 'Open integrations' },
      { title: 'Reset the demo', text: 'Security tab. Puts every sample record back the way it started.', to: '/admin/settings?tab=security', cta: 'Open security' },
    ] },
  { path: '/admin/help', title: 'Help', owner: 'Everyone', plain: 'Short tours of the demo and a map of the three surfaces and twelve modules.', handoff: [], steps: [{ title: 'Pick a tour', text: 'Each card is a two-minute walkthrough that proves one idea: one database, giving to reconciliation, the Monday package, role-scoped access.', to: '/admin/help', cta: 'Open help' }] },
]

export function guideFor(pathname: string) {
  const exact = guides.find((g) => g.path === pathname)
  if (exact) return exact
  return guides.filter((g) => g.path !== '/admin' && pathname.startsWith(g.path)).sort((a, b) => b.path.length - a.path.length)[0] ?? guides[0]
}
