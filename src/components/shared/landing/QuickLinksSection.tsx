import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardHeader, CardTitle } from "~/components/ui/card"

interface QuickLinksSectionProps {
  linkCards: Array<{ title: string; href: string }>;
}

export function QuickLinksSection({ linkCards }: QuickLinksSectionProps) {
  return (
    <section className="py-4 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Quick Links
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {linkCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Link href={card.href}>
                <Card className="bg-green-800 text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

