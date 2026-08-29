import { redirect } from 'next/navigation'

/**
 * /category → redirect to the shop page.
 * This prevents a 404 when users or links navigate to /category without a slug.
 */
export default function CategoryIndexPage() {
  redirect('/shop')
}
