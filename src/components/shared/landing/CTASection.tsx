import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from "~/components/ui/button"
import { ChevronRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="bg-green-700 text-primary-foreground py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Join Our Community?
        </motion.h2>
        <motion.p
          className="text-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Take the first step towards a bright future with M.S. Naz High School.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/signup">
            <Button size="lg" className="bg-emerald-500 text-primary-foreground hover:bg-primary/90 transition-colors duration-300">
              Apply Now <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

