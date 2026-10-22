import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'
import { Mark } from '@/components/Logo'
import { church } from '@/config/site'

type Msg = { from: 'bot' | 'you'; text: string; links?: { label: string; to: string }[] }

/** Answers come only from facts on this website (config/site.ts, events). Anything else goes to the church office. */
const rules: { k: RegExp; a: Msg }[] = [
  { k: /time|when|service|sunday|worship|start|campus/i, a: { from: 'bot', text: 'Sunday worship is 9:00 AM at the Creighton Campus (4247 Creighton Road, Henrico) and online, or 11:30 AM at the Belt Campus (700 E. Belt Blvd, Richmond). Special Sundays at Belt move to 12:00 PM.', links: [{ label: 'Plan a visit', to: '/visit' }, { label: 'Watch online', to: '/watch' }] } },
  { k: /food|pantry|grocer|hungry|feed|eat/i, a: { from: 'bot', text: 'Community Fresh Food Distribution is Fridays at 4:00 PM at the Creighton Campus. You don’t need to be a member.', links: [{ label: 'Get help', to: '/community/get-help' }] } },
  { k: /shower|homeless|wash/i, a: { from: 'bot', text: 'Dignity on the Go mobile showers are Wednesdays at 10:00 AM at the Belt Campus.', links: [{ label: 'Community outreach', to: '/community' }] } },
  { k: /kid|child|youth|teen|student|imagination|smb/i, a: { from: 'bot', text: 'imagiNATION (birth to 10) has Bible study during worship at both campuses. Students 11 to 19 are part of SMB.', links: [{ label: 'Life stages', to: '/life-stages' }] } },
  { k: /life stage|age|20s|30s|40s|50s|60s|70|senior|dreamchaser|aspire|fusion|encore|prime|refiner/i, a: { from: 'bot', text: 'Saint Paul’s cares for people in eight life stages, each with its own Life Stage Pastor and Bible study. Enter your age in the Life Stage Finder to see yours.', links: [{ label: 'Find my life stage', to: '/life-stages' }] } },
  { k: /bible|bridge|study|class/i, a: { from: 'bot', text: 'THE BRIDGE is our online Bible study on Thursdays at 11:00 AM or 7:00 PM. This fall: Joy Is My Superpower, a study in Philippians.', links: [{ label: 'Grow', to: '/grow' }] } },
  { k: /counsel|therapy|grief|mental|struggl|depress|anxi|crisis/i, a: { from: 'bot', text: 'Our Intercessors and Counselors are here for you. Send a request and ask for a call. If you are in crisis right now, call or text 988 any time.', links: [{ label: 'Prayer & counseling', to: '/prayer' }] } },
  { k: /pray|prayer|7:14|714/i, a: { from: 'bot', text: 'Join 7:14 Prayer every Wednesday at 7:14 AM by phone: 855.518.2394, then select 1. Or send a prayer request online.', links: [{ label: 'Prayer', to: '/prayer' }] } },
  { k: /give|giving|tithe|offering|donat|pushpay/i, a: { from: 'bot', text: 'You can give online through Pushpay or in the SPBC app, one time or recurring.', links: [{ label: 'Give', to: '/give' }] } },
  { k: /ride|transport|van|pick ?up/i, a: { from: 'bot', text: 'The Transportation line is 804.463.2429, or request a ride online.', links: [{ label: 'Request a ride', to: '/visit#ride' }] } },
  { k: /marri|wedding|premarital|broom/i, a: { from: 'bot', text: 'Before You Jump the Broom is a free six-week premarital series on Wednesdays at 6:30 PM at Creighton.', links: [{ label: 'Details', to: '/events/before-you-jump-the-broom' }] } },
  { k: /app|phone app|download/i, a: { from: 'bot', text: 'The free SPBC app lets you watch, pray, find a group and register for events.', links: [{ label: 'Get the app', to: '/app' }] } },
  { k: /address|where|park|direction|locat/i, a: { from: 'bot', text: 'Creighton Campus: 4247 Creighton Road, Henrico, VA 23223. Belt Campus: 700 E. Belt Boulevard, Richmond, VA 23224.', links: [{ label: 'Directions', to: '/visit' }] } },
  { k: /volunteer|serve|myfit|help out/i, a: { from: 'bot', text: 'Take the MyFitAssessment to discover how you were created to serve, and join us at Volunteer University.', links: [{ label: 'Serve', to: '/serve' }] } },
  { k: /join|member|dna/i, a: { from: 'bot', text: 'Ready to join? Start with the DNA new members class. We’ll send you the schedule.', links: [{ label: 'Next steps', to: '/next-steps' }] } },
  { k: /pastor|watson|leader/i, a: { from: 'bot', text: 'Saint Paul’s is led by Senior Pastor Rev. Dr. Lance D. Watson, Sr. (since 1985) and First Lady Rose Watson, with eight Life Stage Pastors.', links: [{ label: 'Our story', to: '/our-story' }] } },
  { k: /possibility|city|321|acre|henrico land/i, a: { from: 'bot', text: 'The City of Possibility is Saint Paul’s vision for 321 acres in Eastern Henrico: homes, gardens and gathering places, open to everyone.', links: [{ label: 'Learn more', to: '/city-of-possibility' }] } },
  { k: /event|christmas|trunk|anniversary|fire on|veteran|movie|new year/i, a: { from: 'bot', text: 'This fall: Trunk or Treat (Oct 31), Fire on Fridays (November), the Veterans Brunch (Nov 7), the 117th Church Anniversary (Nov 15), The Spirit of Christmas (Dec 12–13) and Breakthrough 2027 (Dec 31).', links: [{ label: 'All events', to: '/events' }] } },
  { k: /watch|live|stream|online|sermon|message/i, a: { from: 'bot', text: 'Worship streams live Sundays at 9:00 AM at MySPBC.tv, YouTube and Facebook @myspbc. Replays are up all week.', links: [{ label: 'Watch', to: '/watch' }] } },
]
const suggestions = ['Service times', 'Find my life stage', 'I need food', '7:14 Prayer', 'How do I give?']

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Welcome to Saint Paul’s! Ask me about worship times, life stages, events, outreach or how to get connected.' }])
  const [input, setInput] = useState('')
  const nav = useNavigate()
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, open])
  function send(q?: string) {
    const text = (q ?? input).trim(); if (!text) return
    setInput('')
    setMsgs((m) => [...m, { from: 'you', text }])
    const hit = rules.find((r) => r.k.test(text))
    setTimeout(() => setMsgs((m) => [...m, hit ? hit.a : { from: 'bot', text: `Great question. The church can help: call ${church.phone} (GROW) or send a message.`, links: [{ label: 'Contact', to: '/contact' }] }]), 420)
  }
  return (
    <div className="fixed bottom-24 sm:bottom-5 right-4 sm:right-5 z-[60] no-print">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ duration: 0.25 }} className="assistant-panel mb-3 w-[calc(100vw-2.5rem)] sm:w-[400px] rounded-3xl border border-line bg-paper shadow-lift flex flex-col overflow-hidden" role="dialog" aria-label="Ask Saint Paul’s">
            <div className="shrink-0 relative flex items-center justify-between px-5 py-4 bg-canopy text-white overflow-hidden">
              <div className="relative flex items-center gap-3"><Mark size={34} light /><div><p className="font-display font-bold text-xl leading-none">Ask Saint Paul’s</p><p className="text-[13px] text-white/75 mt-1 inline-flex items-center gap-1"><Sparkles size={11} /> Instant answers · church office follows up</p></div></div>
              <button type="button" onClick={() => setOpen(false)} className="relative tap inline-flex items-center justify-center rounded-full hover:bg-white/10" aria-label="Close assistant"><X size={18} /></button>
            </div>
            <div className="h-80 min-h-[5rem] flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-morning" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[16px] ${m.from === 'you' ? 'bg-grow text-white rounded-br-md' : 'bg-paper border border-line rounded-bl-md'}`}>
                    <p className="leading-relaxed">{m.text}</p>
                    {m.links && <div className="mt-2 flex flex-wrap gap-1.5">{m.links.map((l) => <button key={l.to} type="button" onClick={() => { nav(l.to); setOpen(false) }} className="rounded-full bg-orange-50 text-ember border border-orange/40 px-3 py-1.5 text-[14px] font-bold hover:bg-orange hover:text-ink min-h-[40px]">{l.label}</button>)}</div>}
                  </div>
                </div>
              ))}
              <div ref={end} />
            </div>
            <div className="shrink-0 p-2.5 border-t border-line bg-paper">
              <div className="flex flex-wrap gap-1.5 px-1 pb-2 [@media(max-height:520px)]:hidden">{suggestions.map((s) => <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-[14px] font-semibold hover:border-grow hover:text-grow min-h-[40px]">{s}</button>)}</div>
              <form onSubmit={(e: FormEvent) => { e.preventDefault(); send() }} className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question" aria-label="Ask Saint Paul’s a question" className="flex-1 rounded-full border-2 border-line px-4 py-2 text-base focus:border-grow focus:outline-none focus:ring-2 focus:ring-grow/20 min-h-[48px]" />
                <button type="submit" className="tap inline-flex items-center justify-center rounded-full bg-grow text-white hover:bg-canopy min-h-[48px] min-w-[48px]" aria-label="Send"><Send size={16} /></button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => setOpen((o) => !o)} className="relative ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-canopy shadow-lift ring-2 ring-orange/60 hover:ring-orange transition" aria-label={open ? 'Close Ask Saint Paul’s' : 'Open Ask Saint Paul’s'} aria-expanded={open}>
        {!open && <span aria-hidden="true" className="absolute inset-0 rounded-full animate-ping bg-orange/20" style={{ animationDuration: '3s' }} />}
        {open ? <X size={24} className="text-white" /> : <Mark size={30} light />}
      </button>
    </div>
  )
}
