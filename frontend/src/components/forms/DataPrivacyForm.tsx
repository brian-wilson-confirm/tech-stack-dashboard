import React from "react";
import { Button } from "../ui/button";

interface DataPrivacyFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const DataPrivacyForm: React.FC<DataPrivacyFormProps> = ({ onCancel, onSave }) => (
  <form className="space-y-6 max-w-xl" onSubmit={e => { e.preventDefault(); onSave(); }}>
    <div>
      <label className="block text-sm font-medium mb-1">Data & Privacy (Placeholder)</label>
      <p className="text-xs text-muted-foreground mt-1">Form fields for data and privacy settings go here.</p>
    </div>
    <div className="flex gap-2 justify-end pt-4">
      <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
);

export default DataPrivacyForm; 