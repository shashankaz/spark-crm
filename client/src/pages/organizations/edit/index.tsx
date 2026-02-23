import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";

import { OrganizationEditForm } from "./organization-edit-form";

import { useOrganization } from "@/hooks/use-organization";

const OrganizationsEditPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>();

  const { data, isPending } = useOrganization({ id: organizationId! });
  const org = data?.organization;

  if (isPending) return <TableSkeleton />;

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Organization not found.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/organizations">Back to Organizations</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {org.name} | Organizations</title>
        <meta name="description" content={`Edit organization ${org.name}`} />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-center gap-3">
            <Heading title={org.name} />
            {org.industry && (
              <Badge variant="secondary" className="capitalize">
                {org.industry}
              </Badge>
            )}
          </div>
          {org.country && (
            <Description
              description={`${org.country}${org.size ? ` · ${org.size.toUpperCase()}` : ``}`}
            />
          )}
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pocs">Points of Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <OrganizationEditForm organization={org} />
          </TabsContent>

          <TabsContent value="pocs" className="mt-6" />
        </Tabs>
      </div>
    </>
  );
};

export default OrganizationsEditPage;
