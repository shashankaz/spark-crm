import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";

import { ContactEditForm } from "./contact-edit-form";

import { useContact, useToggleContactStar } from "@/hooks";

const ContactsEditPage = () => {
  const { contactId } = useParams<{ contactId: string }>();

  const { data, isPending } = useContact({ id: contactId! });
  const contact = data?.contact;

  const { mutate: toggleStar, isPending: isTogglingStart } =
    useToggleContactStar();

  const handleToggleStar = () => {
    toggleStar(
      { id: contactId! },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  if (isPending) return <TableSkeleton />;

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Contact not found.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/contacts">Back to Contacts</Link>
        </Button>
      </div>
    );
  }

  const fullName = [contact.firstName, contact.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Helmet>
        <title>Edit {fullName} | Contacts</title>
        <meta name="description" content={`Edit contact ${fullName}`} />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Heading title={fullName} />
                {contact.jobTitle && (
                  <Badge variant="secondary">{contact.jobTitle}</Badge>
                )}
              </div>
              <Description
                description={[contact.email, contact.orgName]
                  .filter(Boolean)
                  .join(" · ")}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleStar}
              disabled={isTogglingStart}
            >
              <Star
                className={`mr-2 h-4 w-4 ${contact.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
              {contact.starred ? "Unstar" : "Star"}
            </Button>
          </div>
        </div>

        <ContactEditForm contact={contact} />
      </div>
    </>
  );
};

export default ContactsEditPage;
