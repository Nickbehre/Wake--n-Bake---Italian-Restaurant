'use client'

import { Download } from 'lucide-react'

export default function MenuPDFButton() {
  return (
    <a
      href="/assets/menu/menu-pdf.pdf"
      download
      className="inline-flex items-center gap-2 border-2 border-espresso text-espresso hover:bg-espresso hover:text-white font-montserrat font-bold px-6 py-3 transition-all duration-300"
    >
      <Download className="w-5 h-5" />
      DOWNLOAD MENU (PDF)
    </a>
  )
}
