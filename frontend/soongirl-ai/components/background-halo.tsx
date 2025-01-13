"use client"

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

type VantaEffect = {
    destroy: () => void
}

export function BackgroundHalo() {
    const vantaRef = useRef<HTMLDivElement>(null)
    const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null)
    const [scriptsLoaded, setScriptsLoaded] = useState(0)

    useEffect(() => {
        if (scriptsLoaded === 2 && !vantaEffect && vantaRef.current) {
            // @ts-expect-error - VANTA is loaded from external script
            const effect = window.VANTA.HALO({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                backgroundColor: 0x131a43,
                baseColor: 0x1a59,
                size: 1,
                amplitudeFactor: 1,
                xOffset: 0,
                yOffset: 0
            })
            setVantaEffect(effect)
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect, scriptsLoaded])

    const handleScriptLoad = () => {
        setScriptsLoaded(prev => prev + 1)
    }

    return (
        <>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
                onLoad={handleScriptLoad}
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js"
                onLoad={handleScriptLoad}
            />
            <div
                ref={vantaRef}
                className="fixed inset-0 -z-10"
            />
        </>
    )
} 