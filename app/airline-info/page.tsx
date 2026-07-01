import type { Metadata } from 'next'
import AirlineContent from './AirlineContent'

export const metadata: Metadata = {
  title: 'Flying with your Omeo | Adapt Ability',
  description: 'Guidance on flying with your Omeo self-balancing wheelchair. Battery information, airline questions answered and IATA compliance details.',
}

export default function AirlineInfoPage() {
  return <AirlineContent />
}
