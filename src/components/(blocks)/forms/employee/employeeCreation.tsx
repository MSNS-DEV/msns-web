'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { api } from "~/trpc/react"
import { toast } from '~/hooks/use-toast'

const employeeSchema = z.object({
  employeeName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters").max(100, "Father's name must not exceed 100 characters"),
  gender: z.enum(['MALE', 'FEMALE']),
  dob: z.string().min(1, "Date of Birth is required"),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  maritalStatus: z.enum(['Married', 'Unmarried', 'Widow', 'Divorced']),
  doj: z.string().min(1, "Date of Joining is required"),
  designation: z.enum(['Principal', 'Admin', 'Head', 'Clerk', 'Teacher', 'Worker']),
  residentialAddress: z.string().min(5, "Residential Address must be at least 5 characters"),
  mobileNo: z.string().regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format"),
  additionalContact: z.string().regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistani mobile number format").optional(),
  education: z.string().min(2, "Education must be at least 2 characters").max(100, "Education must not exceed 100 characters"),
})

type EmployeeSchema = z.infer<typeof employeeSchema>

export default function EmployeeCreationDialog() {
  const [expandedSection, setExpandedSection] = useState<'personal' | 'professional' | 'contact' | null>('personal')

  const form = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      gender: 'MALE',
      maritalStatus: 'Unmarried',
      designation: 'Teacher',
    },
  })

  const createEmployee = api.employee.createEmployee.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee registered successfully",
      })
      form.reset()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: EmployeeSchema) => {
    createEmployee.mutate(data)
  }

  const toggleSection = (section: 'personal' | 'professional' | 'contact') => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-4xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6">
            <h2 className="text-3xl font-bold">Employee Registration Form</h2>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  {/* Personal Data Section */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'personal' ? 'auto' : 60 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer bg-secondary p-4 rounded-t-lg"
                      onClick={() => toggleSection('personal')}
                    >
                      <h3 className="text-2xl font-semibold text-secondary-foreground">Personal Data</h3>
                      {expandedSection === 'personal' ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    <AnimatePresence>
                      {expandedSection === 'personal' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-secondary/10 rounded-b-lg"
                        >
                          <FormField
                            control={form.control}
                            name="employeeName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Employee Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fatherName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Father Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cnic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CNIC</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="00000-0000000-0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="maritalStatus"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Marital Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select marital status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Married">Married</SelectItem>
                                    <SelectItem value="Unmarried">Unmarried</SelectItem>
                                    <SelectItem value="Widow">Widow</SelectItem>
                                    <SelectItem value="Divorced">Divorced</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Professional Data Section */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'professional' ? 'auto' : 60 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer bg-secondary p-4 rounded-t-lg"
                      onClick={() => toggleSection('professional')}
                    >
                      <h3 className="text-2xl font-semibold text-secondary-foreground">Professional Data</h3>
                      {expandedSection === 'professional' ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    <AnimatePresence>
                      {expandedSection === 'professional' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-secondary/10 rounded-b-lg"
                        >
                          <FormField
                            control={form.control}
                            name="doj"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Joining</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select designation" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Principal">Principal</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Head">Head</SelectItem>
                                    <SelectItem value="Clerk">Clerk</SelectItem>
                                    <SelectItem value="Teacher">Teacher</SelectItem>
                                    <SelectItem value="Worker">Worker</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="education"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Education</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Contact Data Section */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'contact' ? 'auto' : 60 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer bg-secondary p-4 rounded-t-lg"
                      onClick={() => toggleSection('contact')}
                    >
                      <h3 className="text-2xl font-semibold text-secondary-foreground">Contact Data</h3>
                      {expandedSection === 'contact' ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    <AnimatePresence>
                      {expandedSection === 'contact' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-secondary/10 rounded-b-lg"
                        >
                          <FormField
                            control={form.control}
                            name="residentialAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Residential Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="mobileNo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="+923XXXXXXXXX" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Contact</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="+923XXXXXXXXX" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-muted p-6 flex justify-end">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              disabled={createEmployee.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {createEmployee.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Employee'
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}