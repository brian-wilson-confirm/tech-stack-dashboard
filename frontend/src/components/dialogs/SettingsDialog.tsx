import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LearningGoalsForm from "../forms/LearningGoalsForm";
import FocusDifficultyForm from "../forms/FocusDifficultyForm";
import AIAssistantForm from "../forms/AIAssistantForm";
import NotificationsRemindersForm from "../forms/NotificationsRemindersForm";
import DisplayBehaviorForm from "../forms/DisplayBehaviorForm";
import DataPrivacyForm from "../forms/DataPrivacyForm";
import AdvancedSettingsForm from "../forms/AdvancedSettingsForm";

const sidebarSections = [
  { index: 0, title: "Learning Goals" },
  { index: 1, title: "Focus & Difficulty" },
  { index: 2, title: "AI Assistant" },
  { index: 3, title: "Notifications & Reminders" },
  { index: 4, title: "Display & Behavior" },
  { index: 5, title: "Data & Privacy" },
  { index: 6, title: "Advanced Settings" },
];

export function SettingsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [selectedSection, setSelectedSection] = React.useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-full p-0 overflow-hidden gap-0">
        {/* Heading */}
        <div className="px-8 pt-6 w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-1">Settings</DialogTitle>
              <DialogDescription className="mb-8">
                Manage your account settings and set e-mail preferences.
              </DialogDescription>
            </DialogHeader>
        </div>
        <div className="border-b w-full" />


        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-48 border-r bg-muted/50 flex flex-col py-6 px-2">
            {sidebarSections.map((section) => (
              <button
                key={section.index}
                className={`text-left px-4 py-2 rounded mb-1 font-medium transition-colors text-sm ${
                  selectedSection === section.index
                    ? "bg-white text-black shadow"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setSelectedSection(section.index)}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedSection === 0 && (
              <LearningGoalsForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
            {selectedSection === 1 && (
              <FocusDifficultyForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
            {selectedSection === 2 && (
              <AIAssistantForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
            {selectedSection === 3 && (
              <NotificationsRemindersForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
            {selectedSection === 4 && (
              <DisplayBehaviorForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
            {selectedSection === 5 && (
              <DataPrivacyForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
            {selectedSection === 6 && (
              <AdvancedSettingsForm 
                onCancel={() => onOpenChange(false)}
                onSave={() => onOpenChange(false)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog; 