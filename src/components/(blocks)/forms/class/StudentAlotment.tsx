"use client"

import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import {
  Dialog,
  DialogContent,
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

const formSchema = z.object({
  studentId: z.string({ required_error: "Student is required." }),
  sessionId: z.string({ required_error: "Session is required." }),
});

export const StudentAllotmentDialog = ({ classId }: { classId: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const sessionYears = api.session.getSessions.useQuery();
  const students = api.student.getUnAllocateStudents.useQuery();

  const allotStudent = api.alotment.addToClass.useMutation({
    onSuccess:()=>{
      form.reset()
    }
  });
  const formSubmitted = (values: z.infer<typeof formSchema>) => {
    allotStudent.mutate({
        classId:classId,
        sessionId:values.sessionId,
        studentId:values.studentId
    })
  };

  const filteredStudents = students.data?.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add student</Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Allot student to class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(formSubmitted)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select student</FormLabel>
                  <FormControl>
                    <div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          <Input
                            type="text"
                            placeholder="Search students..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                          />
                          {filteredStudents?.map((student) => (
                            <SelectItem
                              key={student.studentId}
                              value={student.studentId}
                            >
                              {student.studentName} | {student.fatherName}
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
              name="sessionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select the session</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessionYears.data?.map((session) => (
                        <SelectItem
                          value={session.sessionId}
                          key={session.sessionId}
                        >
                          {session.sessionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={allotStudent.isPending}
              className="w-full"
            >
              {allotStudent.isPending ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Allot student"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
