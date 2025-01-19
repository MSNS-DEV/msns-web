"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { toast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"

const salaryAssignmentSchema = z.object({
  employeeId: z.string().min(1, "Employee selection is required"),
  baseSalary: z.number().min(10000, "Base salary must be at least 10,000 PKR"),
  increment: z.number().min(0, "Increment cannot be negative"),
  sessionId: z.string().min(1, "Session selection is required"),
})

type SalaryAssignmentSchema = z.infer<typeof salaryAssignmentSchema>

export function SalaryAssignmentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeProps[]>([])

  const form = useForm<SalaryAssignmentSchema>({
    resolver: zodResolver(salaryAssignmentSchema),
    defaultValues: {
      baseSalary: 10000,
      increment: 0,
    },
  })

  const { data: employees, isLoading: isLoadingEmployees } = api.employee.getEmployees.useQuery()
  const { data: sessions, isLoading: isLoadingSessions } = api.session.getSessions.useQuery()

  const assignSalary = api.salary.assignSalary.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Salary assigned successfully",
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
    onSettled: () => setIsLoading(false),
  })

  useEffect(() => {
    if (employees) {
      setFilteredEmployees(
        employees.filter((employee) =>
          employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.fatherName.toLowerCase().includes(searchTerm.toLowerCase())
        )        
      )
    }
  }, [searchTerm, employees])

  const onSubmit = (data: SalaryAssignmentSchema) => {
    setIsLoading(true)
    assignSalary.mutate(data)
  }

  if (isLoadingEmployees || isLoadingSessions) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Assign Salary</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Employee</FormLabel>
                  <FormControl>
                    <div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <Input
                            type="text"
                            placeholder="Search employees..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                          />
                          {filteredEmployees?.map((employee) => (
                            <SelectItem
                              key={employee.employeeId}
                              value={employee.employeeId}
                            >
                              {employee.employeeName} | {employee.fatherName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Salary (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="increment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Increment (PKR)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Session</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessions?.map((session) => (
                        <SelectItem key={session.sessionId} value={session.sessionId}>
                          {session.sessionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Assigning..." : "Assign Salary"}
        </Button>
      </CardFooter>
    </Card>
  )
}