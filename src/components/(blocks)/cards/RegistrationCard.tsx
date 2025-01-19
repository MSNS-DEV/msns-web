import { UserPlus, Users, BookOpenCheck, School } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const RegistrationCards = () => {
  const services = [
    {
      title: "Student Registration",
      description: "Register new students and manage their admission process with ease.",
      icon: <UserPlus className="w-12 h-12 mb-4 text-emerald-500" />,
      href: "/userReg/student/create",
      color: "from-emerald-400 to-green-600",
      iconBg: "bg-emerald-100"
    },
    {
      title: "Active Students",
      description: "View and manage currently enrolled students' information.",
      icon: <Users className="w-12 h-12 mb-4 text-blue-500" />,
      href: "/userReg/student/view",
      color: "from-blue-400 to-indigo-600",
      iconBg: "bg-blue-100"
    },
    {
      title: "Employee Registration",
      description: "Streamline the process of registering new faculty members.",
      icon: <School className="w-12 h-12 mb-4 text-purple-500" />,
      href: "/userReg/faculty/create",
      color: "from-purple-400 to-pink-600",
      iconBg: "bg-purple-100"
    },
    {
      title: "Active Employees",
      description: "Access and manage current faculty member information.",
      icon: <BookOpenCheck className="w-12 h-12 mb-4 text-orange-500" />,
      href: "/userReg/faculty/view",
      color: "from-orange-400 to-red-600",
      iconBg: "bg-orange-100"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative min-h-[600px] w-full bg-[url('/jpg/Schoolview.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative container mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className="group"
            >
              <Link href={service.href}>
                <div className="relative p-2">
                  {/* Background gradient card with tilt effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.color} 
                    opacity-80 transform transition-transform duration-300 
                    group-hover:scale-105 group-hover:rotate-0 -rotate-2`} />
                  
                  {/* Content card */}
                  <div className="relative bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Icon with background */}
                      <div className={`p-3 rounded-xl ${service.iconBg} transform transition-transform duration-300 group-hover:scale-110`}>
                        {service.icon}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800">
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600">
                        {service.description}
                      </p>
                      
                      {/* Access button */}
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Access {service.title.split(' ')[0]}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};