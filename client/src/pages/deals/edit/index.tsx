import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { useDeal } from "@/hooks";

import { DealEditForm } from "./deal-edit-form";

const DealsEditPage = () => {
  const { dealId } = useParams<{ dealId: string }>();

  const { data: dealData, isPending: isDealPending } = useDeal({ id: dealId! });
  const deal = dealData?.deal;

  if (isDealPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading deal...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Deal not found.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/deals">Back to Deals</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {deal.name} | Deals</title>
        <meta name="description" content={`Edit deal ${deal.name}`} />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <Heading title={`Edit Deal: ${deal.name}`} />
          <Description description="Update details for this deal." />
        </div>

        <DealEditForm deal={deal} />
      </div>
    </>
  );
};

export default DealsEditPage;
