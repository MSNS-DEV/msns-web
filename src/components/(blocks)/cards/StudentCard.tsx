  import { DollarSignIcon, LayersIcon, NotebookTabsIcon, Settings2Icon, User2Icon, UserPlus2Icon } from "lucide-react";
  import Link from "next/link";
  
  export const StudentCards = () => {
    const services = [
      {
        title: "Student Profile",
        description: "Generate comprehensive financial reports and analytics.",
        icon: <User2Icon className="mb-4 h-8 w-8 text-purple-500" />,
        href: "/student/profile",
      },
      {
        title: "Enrollment/ Registration",
        description:
          "Easily enroll new students and manage their financial records.",
        icon: <UserPlus2Icon className="mb-4 h-12 w-12 text-green-500" />,
        href: "/registration/portal",
      },
      {
        title: "Academics",
        description:
          "Easily enroll new students and manage their financial records.",
        icon: <NotebookTabsIcon className="mb-4 h-12 w-12 text-blue-500" />,
        href: "/admin/academics",
      },
      {
        title: "Classes",
        description: "Create and manage new classes or courses for the school.",
        icon: <LayersIcon className="mb-4 h-12 w-12 text-indigo-500" />,
        href: "/admin/academics/classwiseDetail",
      },
      {
        title: "Fee Records",
        description: "Streamline tuition and fee collection processes.",
        icon: <DollarSignIcon className="mb-4 h-12 w-12 text-green-500" />,
        href: "/revenue",
      },
      {
        title: "settings",
        description: "Customize payment plans and automate recurring payments.",
        icon: <Settings2Icon className="mb-4 h-12 w-12 text-red-500" />,
        href: "/student/settings",
      },
    ];
  
    return (
      <section className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Link
            href={service.href}
            key={index}
            className="transform rounded-lg bg-yellow-100 p-6 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              {service.icon}
              <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </Link>
        ))}
      </section>
    );
  };
  