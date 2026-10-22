# CLAUDE.md — SPBC (ChurchConnect build)

Read README.md first, then DESIGN.md (tokens and rules) and MEDIA-PLAN.md.

- Church facts live only in `src/config/site.ts` and `src/config/links.ts`. Events live in `src/data/events.ts`. Never hardcode a time, phone number or URL in a page.
- Never invent facts about the church or its leaders. Unknowns get `// TODO: confirm with church` in code, never visible on a page.
- Real leaders in the demo hub get public name/title only. Anything else is a sample account or sample data and is labeled.
- Never generate people with Kie.ai. Real people come from `public/images/church/` only.
- The Kie key lives in `ChurchConnect/claude-project/.env.local`. Never copy it into this repo, a `VITE_` variable, a prompt or chat.
- Colors: orange (#F3801F) is a fill with ink text, never text on light; use `ember` (#B5520A) for orange text. Tailwind opacity steps must be multiples of 5.
- After content changes: `npm test`, `npm run build`, and `npm run og` if you added or renamed an event.
- Giving goes to Pushpay; member login and registrations go to Rock. Don't rebuild either.
