// src/app/page.js
"use client"; // This tells Next.js to run this code in the browser

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// export default function Home() {
//   const [status, setStatus] = useState('Checking...');

//   useEffect(() => {
//     fetch('/api/v1/test')
//       .then(res => {
//         if (!res.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return res.json();
//       })
//       .then(data => {
//         setStatus(data.status); // Should set to "OK"
//       })
//       .catch((error) => {
//         console.error("Fetch error:", error);
//         setStatus('Error: Could not connect');
//       });
//       }, []);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
//       <h1 className="text-5xl font-bold mb-4">
//         Roam Rush
//       </h1>
//       <p className="text-lg">
//         Backend Status: 
//         <span className="ml-2 font-mono p-2 bg-gray-700 rounded-md text-green-400">
//           {status}
//         </span>
//       </p>
//     </main>
//   );
// }
export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/login')
  }, [router])

  return null
}
