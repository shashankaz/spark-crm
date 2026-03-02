import { useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";

import { Skeleton } from "@/components/ui/skeleton";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { WorkflowEditForm } from "./workflow-edit-form";

import { useWorkflow } from "@/hooks";

const WorkflowEditPage = () => {
  const { workflowId } = useParams<{ workflowId: string }>();

  const navigate = useNavigate();

  const { data, isLoading, isError } = useWorkflow({ id: workflowId ?? "" });
  const workflow = data?.workflow;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !workflow) {
    return (
      <div className="space-y-4">
        <div className="border-b pb-4">
          <Heading title="Workflow Not Found" />
          <Description description="The workflow you are looking for could not be found." />
        </div>
        <button
          className="text-sm text-muted-foreground underline"
          onClick={() => navigate("/admin/workflows")}
        >
          ← Back to Workflows
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {workflow.name} | Dashboard</title>
        <meta name="description" content={`Edit workflow ${workflow.name}`} />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <Heading title={workflow.name} />
          <Description description="Edit workflow details, trigger, and actions" />
        </div>

        <WorkflowEditForm workflow={workflow} />
      </div>
    </>
  );
};

export default WorkflowEditPage;
