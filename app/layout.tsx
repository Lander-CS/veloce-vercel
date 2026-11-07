import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Veloce Motors — Seu próximo capítulo.', description: 'Explore uma nova forma de encontrar seu seminovo. Vitrine interativa em 3D, seleção de veículos e simulação de financiamento.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html> }
