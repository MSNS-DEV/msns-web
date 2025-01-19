"use client"

import { useEffect, useState } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { CTASection } from '~/components/shared/landing/CTASection'
import { FeaturesSection } from '~/components/shared/landing/FeaturesSection'
import { HeroSection } from '~/components/shared/landing/HeroSection'
import { QuickLinksSection } from '~/components/shared/landing/QuickLinksSection'

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])
  const linkCards = [
    {
      title: "Enroll Now →",
      href: "/dashboard",
    },
    {
      title: "Our Socials →",
      href: "https://www.instagram.com/msnazhighschool/",
    },
  ];
  const videos = [
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729269611/clip1_awtegx",
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729269805/clip4_stlpus",
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729269611/clip1_awtegx",
    "https://res.cloudinary.com/dvvbxrs55/video/upload/f_auto,q_auto,w_auto/v1729267740/clip5_szbx9z",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [videos.length])

  return (
    <div className="min-h-screen bg-emerald-100 font-serif">
      <HeroSection 
        currentVideoIndex={currentVideoIndex} 
        videos={videos} 
        heroOpacity={heroOpacity} 
        heroScale={heroScale} 
      />
      <QuickLinksSection linkCards={linkCards} />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

