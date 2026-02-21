import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Pencil, Save, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { ProfileCard } from "@/components/profile/profile-card";

const dummyUser = {
  id: "1",
  name: "Shashank Verma",
  email: "shashank.verma@example.com",
  mobile: "+91 98765 43210",
  role: "Admin" as const,
  avatarUrl: "",
  jobTitle: "CRM Administrator",
  department: "Sales & Operations",
  location: "Mumbai, India",
  bio: "Experienced CRM admin managing sales pipelines, lead tracking, and team operations. Passionate about data-driven growth.",
  joinedAt: "2024-01-15",
  updatedAt: "2026-02-18",
};

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: dummyUser.name,
    email: dummyUser.email,
    mobile: dummyUser.mobile,
    jobTitle: dummyUser.jobTitle,
    department: dummyUser.department,
    location: dummyUser.location,
    bio: dummyUser.bio,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  function handleCancel() {
    setForm({
      name: dummyUser.name,
      email: dummyUser.email,
      mobile: dummyUser.mobile,
      jobTitle: dummyUser.jobTitle,
      department: dummyUser.department,
      location: dummyUser.location,
      bio: dummyUser.bio,
    });
    setEditing(false);
  }

  return (
    <>
      <Helmet>
        <title>Profile | Dashboard</title>
        <meta name="description" content="Your profile settings" />
      </Helmet>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <Heading title="Profile" />
          <Description description="Manage your personal information and account settings." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ProfileCard user={dummyUser} />

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About</CardTitle>
                  <CardDescription>
                    Your profile information as visible to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Bio
                    </p>
                    <p className="text-sm">{dummyUser.bio}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Full Name
                      </p>
                      <p>{dummyUser.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Email
                      </p>
                      <p>{dummyUser.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Mobile
                      </p>
                      <p>{dummyUser.mobile}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Job Title
                      </p>
                      <p>{dummyUser.jobTitle}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Department
                      </p>
                      <p>{dummyUser.department}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Location
                      </p>
                      <p>{dummyUser.location}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Role
                      </p>
                      <p>{dummyUser.role}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Last Updated
                      </p>
                      <p>
                        {new Date(dummyUser.updatedAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Edit Profile</CardTitle>
                      <CardDescription>
                        Update your personal information.
                      </CardDescription>
                    </div>
                    {!editing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(true)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => setEditing(false)}>
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile">Mobile</Label>
                      <Input
                        id="mobile"
                        value={form.mobile}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, mobile: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={form.jobTitle}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, jobTitle: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={form.department}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            department: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={form.location}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, location: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={form.bio}
                        disabled={!editing}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, bio: e.target.value }))
                        }
                        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-sm space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="current">Current Password</Label>
                      <Input
                        id="current"
                        type="password"
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={(e) =>
                          setPasswords((p) => ({
                            ...p,
                            current: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={passwords.next}
                        onChange={(e) =>
                          setPasswords((p) => ({ ...p, next: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={passwords.confirm}
                        onChange={(e) =>
                          setPasswords((p) => ({
                            ...p,
                            confirm: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <Separator />
                    <Button
                      type="button"
                      disabled={
                        !passwords.current ||
                        !passwords.next ||
                        passwords.next !== passwords.confirm
                      }
                    >
                      Update Password
                    </Button>
                    {passwords.next &&
                      passwords.confirm &&
                      passwords.next !== passwords.confirm && (
                        <p className="text-sm text-destructive">
                          Passwords do not match.
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
