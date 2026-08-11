import { redirect } from 'next/navigation'

// /v2 was the working URL during the repositioning rounds; the page ships at /sense.
export default function V2Redirect() {
  redirect('/sense')
}
