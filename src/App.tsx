import { lazy, Suspense, useEffect, useState } from 'react'
import { useAppStore } from './state/store'
import { hasWebGL } from './lib/webgl'
import { useMotionPreference } from './hooks/useMotionPreference'
import { useSectionObserver } from './hooks/useSectionObserver'
import { useThemeVariables } from './hooks/useThemeVariables'
import { Loader } from './ui/components/Loader'
import { LiveRegion } from './ui/components/LiveRegion'
import { Toast } from './ui/components/Toast'
import { WebGLFallback } from './ui/components/WebGLFallback'
import { Header } from './ui/sections/Header'
import { Hero } from './ui/sections/Hero'
import { AromaProfile } from './ui/sections/AromaProfile'
import { Story } from './ui/sections/Story'
import { Variants } from './ui/sections/Variants'
import { ProductDetail } from './ui/sections/ProductDetail'
import { Footer } from './ui/sections/Footer'

// The 3D runtime (three, R3F, drei, postprocessing) loads as a separate chunk
// so text content paints immediately.
const Experience = lazy(() => import('./three/Experience'))

export default function App() {
  useMotionPreference()
  useThemeVariables()
  useSectionObserver()

  const webglFailed = useAppStore((s) => s.webglFailed)
  const failWebGL = useAppStore((s) => s.failWebGL)
  const [supported] = useState(hasWebGL)

  useEffect(() => {
    if (!supported) failWebGL()
  }, [supported, failWebGL])

  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten
      </a>

      {supported && !webglFailed ? (
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      ) : (
        <WebGLFallback />
      )}

      <Header />
      <main id="main" className="content">
        <Hero />
        <AromaProfile />
        <Story />
        <Variants />
        <ProductDetail />
      </main>
      <Footer />

      <Loader />
      <LiveRegion />
      <Toast />
    </>
  )
}
