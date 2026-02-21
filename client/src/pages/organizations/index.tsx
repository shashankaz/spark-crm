import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns } from "./columns";
import { OrganizationCreateForm } from "./organization-create-form";

const OrganizationsPage = () => {
  const organizations = [
    {
      id: "1",
      name: "Acme Corporation",
      industary: "Technology",
      size: "500-1000",
      country: "United States",
      email: "contact@acmecorp.com",
      mobile: "+1 (555) 123-4567",
      website: "https://acmecorp.com",
      updatedAt: "2026-02-15T10:30:00Z",
    },
    {
      id: "2",
      name: "GlobalTech Solutions",
      industary: "Software",
      size: "1000-5000",
      country: "United Kingdom",
      email: "info@globaltech.co.uk",
      mobile: "+44 20 7946 0958",
      website: "https://globaltech.co.uk",
      updatedAt: "2026-02-14T08:15:00Z",
    },
    {
      id: "3",
      name: "Green Earth Ventures",
      industary: "Renewable Energy",
      size: "50-200",
      country: "Germany",
      email: "hello@greenearth.de",
      mobile: "+49 30 12345678",
      website: "https://greenearth.de",
      updatedAt: "2026-02-10T14:00:00Z",
    },
    {
      id: "4",
      name: "Pinnacle Finance Group",
      industary: "Finance",
      size: "200-500",
      country: "Canada",
      email: "support@pinnaclefinance.ca",
      mobile: "+1 (416) 987-6543",
      website: "https://pinnaclefinance.ca",
      updatedAt: "2026-02-12T09:45:00Z",
    },
    {
      id: "5",
      name: "MediCore Health",
      industary: "Healthcare",
      size: "1000-5000",
      country: "Australia",
      email: "contact@medicore.com.au",
      mobile: "+61 2 9876 5432",
      website: "https://medicore.com.au",
      updatedAt: "2026-02-18T11:20:00Z",
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Organizations | Dashboard</title>
        <meta name="description" content="Manage organizations in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl text-secondary-foreground dark:text-secondary font-semibold font-newsreader">
              Organizations
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your CRM organizations and their details
            </p>
          </div>
          <div className="space-x-2">
            <Button type="button" disabled>
              <Download />
              Export
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={organizations}
          placeholder="organizations"
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Create New Organization
              </DialogTitle>
            </DialogHeader>

            <OrganizationCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default OrganizationsPage;
