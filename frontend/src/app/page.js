// src/app/page.js
"use client"; // This tells Next.js to run this code in the browser

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/login')
  }, [router])

  return null
}
