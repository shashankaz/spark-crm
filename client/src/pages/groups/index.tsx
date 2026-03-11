import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Users, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";

import { GroupCreateForm } from "./group-create-form";
import { GroupLeadsTable } from "./group-leads-table";
import { EmailTemplatesTab } from "./email-template-tab";

import { useGroups } from "@/hooks";

const GroupsPage = () => {
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isPending } = useGroups();
  const groups = data?.groups ?? [];

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Groups | Dashboard</title>
        <meta name="description" content="Manage lead groups and campaigns" />
      </Helmet>

      <div className="space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Groups & Templates" />
            <Description description="Manage lead groups, email templates, and campaigns" />
          </div>
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus />
            Create Group
          </Button>
        </div>

        <Tabs defaultValue="groups" className="space-y-2">
          <TabsList>
            <TabsTrigger value="groups">
              <Users className="h-3.5 w-3.5" />
              Groups
              {groups.length > 0 && (
                <span className="ml-1 text-[10px] font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
                  {groups.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-3.5 w-3.5" />
              Email Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <GroupLeadsTable groups={groups} />
          </TabsContent>

          <TabsContent value="templates">
            <EmailTemplatesTab />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Create New Group</DialogTitle>
          </DialogHeader>
          <GroupCreateForm setOpen={setCreateOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupsPage;
