import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { z } from "zod"

const employeeSchema = z.object({
  employeeName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters").max(100, "Father's name must not exceed 100 characters"),
  gender: z.enum(['MALE', 'FEMALE', 'CUSTOM']),
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

export const EmployeeRouter = createTRPCRouter({
  getEmployees: publicProcedure.query(async ({ ctx }) => {
    try {
      const employees = await ctx.db.employees.findMany()
      return employees
    } catch (error) {
      console.error(error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "Something went wrong.",
      })
    }
  }),

  createEmployee: publicProcedure
    .input(employeeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.employees.create({
          data: input
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong'
        })
      }
    }),

  deleteEmployeesByIds: publicProcedure
    .input(z.object({
      employeeIds: z.string().array(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.employees.deleteMany({
          where: {
            employeeId: {
              in: input.employeeIds,
            },
          },
        })
      } catch (error) {
        console.error(error)
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: "Something went wrong." 
        })
      }
    }),
})