import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

const pressStart2P = Press_Start_2P({ 
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Proof of Thought - 人类思考的印章',
  description: '在AI时代，为你的分享盖上一个“人类思考”的印章。记录、证明并分享你的思考过程。',
  keywords: ['AI', '思考证明', '人类价值', '分享', '创作'],
  authors: [{ name: 'PoT Team' }],
  openGraph: {
    title: 'Proof of Thought',
    description: '为人类思考盖上印章',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={pressStart2P.className}>{children}</body>
    </html>
  )
}
