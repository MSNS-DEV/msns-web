"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const formSchema = z.object({
  sessionId: z.string().min(1, "Session is required"),
  classId: z.string().min(1, "Class is required"),
  studentId: z.string().min(1, "Student is required"),
  feeId: z.string().min(1, "Fee name is required"),
});

export function FeeAssignmentDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const feeData = api.fee.getAllFees.useQuery();
  const sessionData = api.session.getSessions.useQuery();
  const classData = api.class.getClasses.useQuery();
  const studentData = api.alotment.getStudentsByClassAndSession.useQuery(
    { classId: form.watch("classId"), sessionId: form.watch("sessionId")},
    { enabled: !!form.watch("classId") },
  );

  const assignFee = api.fee.assignFeeToStudent.useMutation({
    onSuccess: () => {
      toast({
        title: "Fee assigned successfully",
        description: "The fee has been assigned to the student.",
      });
      setOpen(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error assigning fee",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    assignFee.mutate({
      feeId: values.feeId,
      classId: values.classId,
      studentId: values.studentId,
      sessionId: values.sessionId,
      discount: 0,
      discountbypercent: 0,
      discountDescription: "",
    });
  };

  return (
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline" className="flex items-center space-x-2">
      <span>Fee Assignment</span>
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[80%]">
    <DialogHeader>
      <DialogTitle className="text-xl font-bold">Fee Assignment</DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        Assign fees to students and view existing assignments.
      </DialogDescription>
    </DialogHeader>

    <Tabs defaultValue="assign">
      <TabsList className="mt-4">
        <TabsTrigger value="assign">Assign Fee</TabsTrigger>
        <TabsTrigger value="view">View Assignments</TabsTrigger>
      </TabsList>

      <TabsContent value="assign">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Session Field */}
            <FormField
              control={form.control}
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                    disabled={sessionData.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessionData.data?.map((session) => (
                        <SelectItem
                          key={session.sessionId}
                          value={session.sessionId}
                        >
                          {session.sessionName} ({session.sessionFrom} - {session.sessionTo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Class Field */}
            <div className="border-t pt-4">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("sessionId") || classData.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classData.data?.map((class_) => (
                          <SelectItem key={class_.classId} value={class_.classId}>
                            {class_.grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Student Field */}
            <div className="border-t pt-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("classId") || studentData.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studentData.data?.map((student) => (
                          <SelectItem
                            key={student.studentId}
                            value={student.studentId}
                          >
                            {student.student.studentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fee Field */}
            <div className="border-t pt-4">
              <FormField
                control={form.control}
                name="feeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fees</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={feeData.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {feeData.data?.map((fee) => (
                          <SelectItem key={fee.feeId} value={fee.feeId}>
                            {fee.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="pt-6 border-t">
              <Button type="submit" variant="default" disabled={assignFee.isPending}>
                {assignFee.isPending ? "Assigning..." : "Assign Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  </DialogContent>
</Dialog>

  );
}

