import { motion, type MotionValue } from 'framer-motion'
import Link from 'next/link'
import { Button } from "~/components/ui/button"
import { ChevronRight } from 'lucide-react'

interface HeroSectionProps {
    currentVideoIndex: number;
    videos: string[];
    heroOpacity: MotionValue<number>;
    heroScale: MotionValue<number>;
  }

export function HeroSection({ currentVideoIndex, videos, heroOpacity, heroScale }: HeroSectionProps) {
  return (
    <motion.section
      className="relative h-[85vh] overflow-hidden"
      style={{ opacity: heroOpacity, scale: heroScale }}
    >
      <video
        key={currentVideoIndex}
        className="absolute top-18 left-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-green-100">
          <motion.h1
            className="font-serif text-white text-5xl md:text-7xl font-bold mb-10"
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{
              opacity: [0, 1],
              y: [20, 0],
              scale: [0.5, 1.2],
            }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: "easeOut",
              type: "keyframes",
              stiffness: 100,
            }}
          >
            M.S. NAZ HIGH SCHOOL
          </motion.h1>
          <motion.p
            className="font-serif text-2xl md:text-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            PURSUIT OF EXCELLENCE
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/about">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300">
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

