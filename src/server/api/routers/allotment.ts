import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const AlotmentRouter = createTRPCRouter({
  addToClass: publicProcedure
    .input(
      z.object({
        classId: z.string(),
        studentId: z.string(),
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.students.update({
          where: { studentId: input.studentId },
          data: {
            isAssign: true,
          },
        });

        await ctx.db.studentClass.create({
          data: {
            classId: input.classId,
            studentId: input.studentId,
            sessionId: input.sessionId,
          },
        });
      } catch (error) {
        console.error("Error adding to class:", error);
        throw new Error("Unable to add student to class.");
      }
    }),

  getStudentsInClass: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.studentClass.findMany({
          where: { classId: input.classId },
          include: {
            class: true,
            student: true,
            session: true,
          },
        });
        return data;
      } catch (error) {
        console.error("Error fetching students in class:", error);
        throw new Error("Unable to fetch students for the class.");
      }
    }),

    getStudentsByClassAndSession: publicProcedure
    .input(z.object({ classId: z.string(), sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.studentClass.findMany({
          where: { classId: input.classId, sessionId: input.sessionId },
          include: {
            class: true,
            student: true,
            session: true,
          },
        });
        return data;
      } catch (error) {
        console.error("Error fetching students in class:", error);
        throw new Error("Unable to fetch students for the class.");
      }
    }),
    

  deleteFromClass: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        classId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Remove the student from the studentClass table
        await ctx.db.studentClass.deleteMany({
          where: {
            studentId: input.studentId,
            classId: input.classId,
          },
        });

        // Update the student's isAssign status if needed
        await ctx.db.students.update({
          where: { studentId: input.studentId },
          data: {
            isAssign: false,
          },
        });

        return { success: true, message: "Student removed from class successfully." };
      } catch (error) {
        console.error("Error removing student from class:", error);
        throw new Error("Unable to remove student from class.");
      }
    }),
});
