import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import React from "react";

interface LearningGoalsFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const LearningGoalsForm: React.FC<LearningGoalsFormProps> = ({ onCancel, onSave }) => (
  <form className="space-y-6 max-w-xl" onSubmit={e => { e.preventDefault(); onSave(); }}>
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
      <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
);

export default LearningGoalsForm; 