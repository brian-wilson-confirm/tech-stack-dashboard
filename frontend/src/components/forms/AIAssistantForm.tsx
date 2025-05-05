import React from "react";
import { Button } from "../ui/button";

interface AIAssistantFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const AIAssistantForm: React.FC<AIAssistantFormProps> = ({ onCancel, onSave }) => (
  <form className="space-y-6 max-w-xl" onSubmit={e => { e.preventDefault(); onSave(); }}>
    <div>
      <label className="block text-sm font-medium mb-1">AI Assistant (Placeholder)</label>
      <p className="text-xs text-muted-foreground mt-1">Form fields for AI assistant settings go here.</p>
    </div>
    <div className="flex gap-2 justify-end pt-4">
      <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
);

export default AIAssistantForm; 