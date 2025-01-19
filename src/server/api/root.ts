
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { RegisterRouter } from "./routers/register";
import { ClassRouter } from "./routers/class";
import { StudentRouter } from "./routers/student";
import { EmployeeRouter } from "./routers/employee";
import { SessionRouter } from "./routers/session";
import { AlotmentRouter } from "./routers/allotment";
import { SalaryRouter } from "./routers/salary";
import { feeRouter } from "./routers/fee";


export const appRouter = createTRPCRouter({
    register:RegisterRouter,
    class: ClassRouter,
    student:StudentRouter,
    employee:EmployeeRouter,
    salary:SalaryRouter,
    session:SessionRouter,
    fee:feeRouter,
    alotment:AlotmentRouter
});


export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);