import React from "react";
import { Button } from "../ui/button";

interface FocusDifficultyFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const FocusDifficultyForm: React.FC<FocusDifficultyFormProps> = ({ onCancel, onSave }) => (
  <form className="space-y-6 max-w-xl" onSubmit={e => { e.preventDefault(); onSave(); }}>
    <div>
      <label className="block text-sm font-medium mb-1">Focus & Difficulty (Placeholder)</label>
      <p className="text-xs text-muted-foreground mt-1">Form fields for focus and difficulty settings go here.</p>
    </div>
    <div className="flex gap-2 justify-end pt-4">
      <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
);

export default FocusDifficultyForm; 