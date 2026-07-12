import { createClient } from '@/utils/supabase/server'
import HomePageClient from '@/components/HomePageClient'

export default async function HomePage() {
  const supabase = await createClient()

  // SADECE SUNUCU TARAFINDA (SSR) ÇALIŞIR - SIFIR GECİKME (0 DELAY)
  const { data: { session } } = await supabase.auth.getSession()
  
  let profile = null
  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    profile = data
  }

  // Veriler anında ve tam olarak yüklenmiş halde istemciye (Client Component) aktarılır.
  return <HomePageClient initialUser={session?.user} initialProfile={profile} />
}
