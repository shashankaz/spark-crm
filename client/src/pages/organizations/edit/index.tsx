import { useState } from "react";
import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { Plus, Star, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Organization, POC } from "@/types";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { OrganizationEditForm } from "./organization-edit-form";
import { POCCreateForm } from "./poc-create-form";
import type { POCFormValues } from "./poc-form-schema";

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    _id: "1",
    name: "Acme Corporation",
    industry: "Technology",
    size: "Enterprise",
    country: "United States",
    email: "contact@acmecorp.com",
    mobile: "5551234567",
    website: "https://acmecorp.com",
    updatedAt: "2026-02-15T10:30:00Z",
    pocs: [
      {
        id: "p1",
        name: "Alice Johnson",
        email: "alice@acmecorp.com",
        mobile: "9876543210",
        designation: "CTO",
        isPrimary: true,
      },
      {
        id: "p2",
        name: "Bob Lee",
        email: "bob@acmecorp.com",
        mobile: "9001234567",
        designation: "Sales Manager",
        isPrimary: false,
      },
    ],
  },
  {
    _id: "2",
    name: "GlobalTech Solutions",
    industry: "Technology",
    size: "Enterprise",
    country: "United Kingdom",
    email: "info@globaltech.co.uk",
    mobile: "4420794609",
    website: "https://globaltech.co.uk",
    updatedAt: "2026-02-14T08:15:00Z",
    pocs: [],
  },
  {
    _id: "3",
    name: "Green Earth Ventures",
    industry: "Other",
    size: "SMB",
    country: "Germany",
    email: "hello@greenearth.de",
    mobile: "4930123456",
    website: "https://greenearth.de",
    updatedAt: "2026-02-10T14:00:00Z",
    pocs: [],
  },
  {
    _id: "4",
    name: "Pinnacle Finance Group",
    industry: "Finance",
    size: "Mid-Market",
    country: "Canada",
    email: "support@pinnaclefinance.ca",
    mobile: "4169876543",
    website: "https://pinnaclefinance.ca",
    updatedAt: "2026-02-12T09:45:00Z",
    pocs: [],
  },
  {
    _id: "5",
    name: "MediCore Health",
    industry: "Healthcare",
    size: "Enterprise",
    country: "Australia",
    email: "contact@medicore.com.au",
    mobile: "6129876543",
    website: "https://medicore.com.au",
    updatedAt: "2026-02-18T11:20:00Z",
    pocs: [],
  },
];

const OrganizationsEditPage = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [pocDialogOpen, setPocDialogOpen] = useState(false);

  const org = MOCK_ORGANIZATIONS.find((o) => o._id === organizationId);
  const [pocs, setPocs] = useState<POC[]>(org?.pocs ?? []);

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

  const handleAddPOC = (data: POCFormValues) => {
    const newPOC: POC = {
      id: `poc-${Date.now()}`,
      ...data,
      isPrimary: data.isPrimary,
    };
    setPocs((prev) => {
      const updated = data.isPrimary
        ? prev.map((p) => ({ ...p, isPrimary: false }))
        : prev;
      return [...updated, newPOC];
    });
    console.log("POC added:", newPOC);
  };

  const handleSetPrimary = (id: string) => {
    setPocs((prev) => prev.map((p) => ({ ...p, isPrimary: p.id === id })));
  };

  const handleDeletePOC = (id: string) => {
    setPocs((prev) => prev.filter((p) => p.id !== id));
  };

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
            {org.industry && <Badge variant="secondary">{org.industry}</Badge>}
          </div>
          {org.country && (
            <Description
              description={`${org.country}${org.size ? ` · ${org.size}` : ``}`}
            />
          )}
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pocs">
              Points of Contact
              <span className="ml-1.5 rounded-full bg-muted text-muted-foreground text-xs px-1.5 py-0.5">
                {pocs.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <OrganizationEditForm organization={org} />
          </TabsContent>

          <TabsContent value="pocs" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Points of Contact</h2>
                  <p className="text-muted-foreground text-sm">
                    Manage contacts associated with {org.name}
                  </p>
                </div>
                <Button type="button" onClick={() => setPocDialogOpen(true)}>
                  <Plus />
                  Add Contact
                </Button>
              </div>

              {pocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    No contacts added yet.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPocDialogOpen(true)}
                  >
                    <Plus />
                    Add First Contact
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pocs.map((poc) => (
                    <Card key={poc.id} className="relative">
                      {poc.isPrimary && (
                        <span className="absolute top-3 right-3">
                          <Badge variant="default" className="gap-1 text-xs">
                            <Star className="h-3 w-3" />
                            Primary
                          </Badge>
                        </span>
                      )}
                      <CardHeader className="pb-2 pr-24">
                        <CardTitle className="text-base">{poc.name}</CardTitle>
                        <CardDescription>{poc.designation}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        <a
                          href={`mailto:${poc.email}`}
                          className="block text-blue-600 dark:text-blue-400 hover:underline truncate"
                        >
                          {poc.email}
                        </a>
                        <a
                          href={`tel:${poc.mobile}`}
                          className="block text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {poc.mobile}
                        </a>

                        <div className="flex items-center gap-2 pt-3">
                          {!poc.isPrimary && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => handleSetPrimary(poc.id)}
                                >
                                  <Star className="h-3 w-3" />
                                  Set Primary
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Mark as primary contact
                              </TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-destructive hover:text-destructive"
                                onClick={() => handleDeletePOC(poc.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Remove
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove contact</TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={pocDialogOpen} onOpenChange={setPocDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add Point of Contact</DialogTitle>
          </DialogHeader>
          <POCCreateForm setOpen={setPocDialogOpen} onAdd={handleAddPOC} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationsEditPage;
