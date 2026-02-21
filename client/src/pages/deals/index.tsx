import { Helmet } from "react-helmet-async";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns } from "./columns";

const DealPage = () => {
  const deals = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      organization: "Acme Corp",
      email: "john.doe@example.com",
      score: 85,
      updatedAt: "2024-06-01",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      organization: "Globex Inc",
      email: "jane.smith@example.com",
      score: 75,
      updatedAt: "2024-06-02",
    },
    {
      id: "3",
      firstName: "Carlos",
      lastName: "Martinez",
      organization: "Initech",
      email: "carlos.martinez@initech.com",
      score: 92,
      updatedAt: "2024-06-03",
    },
    {
      id: "4",
      firstName: "Priya",
      lastName: "Sharma",
      organization: "Umbrella Corp",
      email: "priya.sharma@umbrella.com",
      score: 68,
      updatedAt: "2024-06-04",
    },
    {
      id: "5",
      firstName: "Liam",
      lastName: "O'Brien",
      organization: "Stark Industries",
      email: "liam.obrien@stark.com",
      score: 81,
      updatedAt: "2024-06-05",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Deals | Dashboard</title>
        <meta name="description" content="Manage deals in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Deals" />
            <Description description="Manage your CRM deals and their status" />
          </div>
          <Button type="button" disabled>
            <Download />
            Export
          </Button>
        </div>

        <DataTable columns={columns} data={deals} placeholder="deals" />
      </div>
    </>
  );
};

export default DealPage;
