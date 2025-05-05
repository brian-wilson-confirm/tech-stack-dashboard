import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const sidebarSections = [
  "Profile",
  "Account",
  "Appearance",
  "Notifications",
  "Display",
];

export function SettingsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [selectedSection, setSelectedSection] = React.useState("Profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-48 border-r bg-muted/50 flex flex-col py-6 px-2">
            {sidebarSections.map((section) => (
              <button
                key={section}
                className={`text-left px-4 py-2 rounded mb-1 font-medium transition-colors ${
                  selectedSection === section
                    ? "bg-white text-black shadow"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-1">Settings</DialogTitle>
              <DialogDescription className="mb-6">
                Manage your account settings and set e-mail preferences.
              </DialogDescription>
            </DialogHeader>
            {selectedSection === "Profile" && (
              <form className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input defaultValue="shadcn" />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input placeholder="Select a verified email to display" />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can manage verified email addresses in your email settings.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Textarea defaultValue="I own a computer." />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can @mention other users and organizations to link to them.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URLs</label>
                  <Input className="mb-2" defaultValue="https://shadcn.com" />
                  <Input defaultValue="http://twitter.com/shadcn" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add links to your website, blog, or social media profiles.
                  </p>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            )}
            {/* Add forms for other sections as needed */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog; 