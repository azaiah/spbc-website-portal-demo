import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { lifeStages, stageForAge, campuses } from '@/config/site'
import { links } from '@/config/links'
import { events, upcomingEvents, pastEvents, nextDate, icsFor, eventBySlug } from './events'

const pub = (p: string) => resolve(__dirname, '../../public', p)

describe('life stages', () => {
  it('cover every age from 0 to 110 with no gaps or overlaps', () => {
    for (let age = 0; age <= 110; age++) {
      const hits = lifeStages.filter((s) => age >= s.min && age <= s.max)
      expect(hits.length, `age ${age}`).toBeLessThanOrEqual(1)
      expect(stageForAge(age)).toBeTruthy()
    }
    expect(stageForAge(10).id).toBe('imagination')
    expect(stageForAge(11).id).toBe('smb')
    expect(stageForAge(45).id).toBe('fusion')
    expect(stageForAge(95).id).toBe('refiners')
  })
  it('have unique ids and readable colors', () => {
    expect(new Set(lifeStages.map((s) => s.id)).size).toBe(lifeStages.length)
    for (const s of lifeStages) expect(s.color).toMatch(/^#[0-9A-F]{6}$/i)
  })
})

describe('events', () => {
  it('have unique slugs and every flyer file exists', () => {
    expect(new Set(events.map((e) => e.slug)).size).toBe(events.length)
    for (const e of events) if (e.flyer) expect(existsSync(pub(`images/church/${e.flyer}`)), e.flyer).toBe(true)
  })
  it('have a link-preview card for every event', () => {
    for (const e of events) expect(existsSync(pub(`og/event-${e.slug}.png`)), e.slug).toBe(true)
  })
  it('split into upcoming and past around a reference date', () => {
    const ref = '2026-10-21'
    const up = upcomingEvents(ref), past = pastEvents(ref)
    expect(up.length + past.length).toBe(events.length)
    for (let i = 1; i < up.length; i++) expect(nextDate(up[i - 1], ref) <= nextDate(up[i], ref)).toBe(true)
  })
  it('export a valid calendar file', () => {
    const e = eventBySlug('fire-on-fridays')!
    const ics = icsFor(e)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('Fire on Fridays')
  })
})

describe('links and campuses', () => {
  // The church's own myspbc.info short links are kept exactly as published (https support unverified).
  it('use https for every external link', () => {
    for (const [k, l] of Object.entries(links)) if (/^[a-z]+:/.test(l.href) && !/^(mailto|tel|sms):/.test(l.href) && !l.href.startsWith('http://myspbc.info/')) expect(l.href, k).toMatch(/^https:\/\//)
  })
  it('give every physical campus directions', () => {
    for (const c of campuses) if (c.street) expect(c.directionsUrl).toMatch(/^https:\/\//)
  })
})
