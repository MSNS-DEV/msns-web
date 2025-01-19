"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { CalendarDays, Search, RefreshCcw } from "lucide-react";
import { api } from "~/trpc/react";
import { SessionCreationDialog } from "../forms/annualSession/SessionCreation";
import SessionDeletionDialog from "../forms/annualSession/SessionDeletion";
import Link from "next/link";

export const SessionList = () => {
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sessionList = [], refetch } =
    api.session.getSessions.useQuery(); // Use more descriptive variable name

  const filteredSessions = sessionList.filter((session) =>
    session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const toggleAllSessions = () => {
    setSelectedSessions(
      selectedSessions.size === filteredSessions.length
        ? new Set()
        : new Set(filteredSessions.map((s) => s.sessionId)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="shrink-0"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <SessionCreationDialog />
          <SessionDeletionDialog
            sessionIds={Array.from(selectedSessions)}
            onSuccess={() => setSelectedSessions(new Set())}
          />
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllSessions}
          className="text-sm"
        >
          {selectedSessions.size === filteredSessions.length
            ? "Deselect All"
            : "Select All"}
        </Button>
        <span className="text-sm text-muted-foreground">
          {selectedSessions.size} of {filteredSessions.length} selected
        </span>
      </div>

      {/* Sessions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSessions.map((session) => (
          <Card key={session.sessionId} className="relative overflow-hidden">
            <div className="absolute right-2 top-2">
              <Checkbox
                checked={selectedSessions.has(session.sessionId)}
                onCheckedChange={() =>
                  toggleSessionSelection(session.sessionId)
                }
              />
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{session.sessionName}</h3>
                {true !== undefined && true && (
                  <Badge className="bg-green-500">Active</Badge>
                )}
              </div>

              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                <div>
                  Start: {new Date(session.sessionFrom).toLocaleDateString()}
                </div>
                <div>
                  End: {new Date(session.sessionTo).toLocaleDateString()}
                </div>
              </div>

              {/* <SessionDialog sessionId={session.sessionId} isActive={true} /> */}
              <Button asChild>
                <Link href={`/academics/sessionalDetails/${session.sessionId}`}>Session detail</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="py-12 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No sessions found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by creating a new session"}
          </p>
        </div>
      )}
    </div>
  );
};
