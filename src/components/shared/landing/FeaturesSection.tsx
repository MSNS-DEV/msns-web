import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardTitle } from "~/components/ui/card"
import { GraduationCap, Book, Users, Calendar } from 'lucide-react'

export function FeaturesSection() {
  return (
    <section className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Why Choose M.S. Naz High School?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<GraduationCap className="h-12 w-12 text-primary" />}
            title="Academic Excellence"
            description="Our rigorous curriculum prepares students for success in higher education and beyond."
            delay={0}
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-primary" />}
            title="Dedicated Faculty"
            description="Experienced teachers committed to nurturing each student's potential."
            delay={0.2}
          />
          <FeatureCard
            icon={<Book className="h-12 w-12 text-primary" />}
            title="Diverse Programs"
            description="A wide range of academic and extracurricular activities to foster well-rounded development."
            delay={0.4}
          />
          <FeatureCard
            icon={<Calendar className="h-12 w-12 text-primary" />}
            title="Modern Facilities"
            description="State-of-the-art classrooms, labs, and sports facilities to enhance learning experiences."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-center">{icon}</div>
          <CardTitle className="mb-2">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

