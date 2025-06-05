'use client';

import Link from 'next/link';

export default function BackButton() {
  return (
    <Link 
      href="/"
      className="absolute top-4 left-4 text-white bg-[#a16bb7] px-4 py-2 rounded-md hover:bg-[#8a5b9d] transition-colors z-10"
    >
      Volver
    </Link>
  );
} 