import { redirect } from 'next/navigation'

function page() {
  return redirect('/admin/transaction')
}

export default page