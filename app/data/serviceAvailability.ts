// app/data/serviceAvailability.ts
//
// Source of truth for which locations each service is offered at.
// Used by ServiceBookingClient.tsx to determine SimplyBook widget pre-filtering:
//   - If a service is offered at ONE location: pre-fill the widget with both
//     service + location, saving the user a step in the booking flow
//   - If a service is offered at MULTIPLE locations: pre-fill service only,
//     letting the user pick their preferred location during booking
//   - If a service is NOT in this map: falls through to the legacy
//     `widgetLocation` field on the Service type (currently used by
//     physiotherapy-treatment until further decisions are made)
//
// Location IDs match SimplyBook.me:
//   '2' = Thoday Street
//   '4' = Cromwell Road
//
// This data should be kept in sync with the actual therapist roster:
// services are available at a location if at least one therapist there offers it.

export const serviceAvailability: Record<string, string[]> = {
  'deep-tissue-massage':  ['2', '4'],   // Thoday (Antonia, Orla) + Cromwell (Safia)
  'sports-massage':       ['2', '4'],   // Thoday (Orla) + Cromwell (Safia)
  'swedish-massage':      ['2'],        // Thoday only (Antonia, Claire)
  'relaxation-massage':   ['2'],        // Thoday only (Antonia, Claire)
  'pregnancy-massage':    ['2'],        // Thoday only (Antonia)
  'hopi-ear':             ['2'],        // Thoday only (Antonia) — "Hopi Ear with Back Massage" service ID 8
  'indian-head-massage':  ['2'],        // Thoday only (Antonia) — service ID 9
  'hot-stone-massage':    ['2'],        // Thoday only (Antonia) — service ID 26
  'cupping':              ['2'],        // Thoday only (Orla)    — service ID 24
  // 'physiotherapy-treatment' — intentionally omitted; falls through to legacy widgetLocation
};
