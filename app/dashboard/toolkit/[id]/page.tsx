import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import ToolkitManager from '@/components/ToolkitManager'

export default async function ToolkitPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: toolkit } = await supabase
    .from('toolkits').select('*').eq('id', params.id).single()

  if (!toolkit) notFound()
  if (toolkit.owner_id !== user.id) redirect('/dashboard')

  const { data: tools } = await supabase
    .from('tools').select('*').eq('toolkit_id', params.id)
    .order('created_at', { ascending: false })

  return <ToolkitManager toolkit={toolkit} tools={tools || []} />
}
