"use client";

import { Camera, Keyboard } from "lucide-react";

interface StartListingChoiceStepProps {
  selectedChildName: string;
  onChooseSmart: () => void;
  onChooseManual: () => void;
}

export function StartListingChoiceStep({
  selectedChildName,
  onChooseSmart,
  onChooseManual,
}: StartListingChoiceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2" style={{ color: "var(--ember-gray-900)" }}>
          How would you like to start?
        </h3>
        <p className="text-sm" style={{ color: "var(--ember-gray-600)" }}>
          Pick the path for listing an item for {selectedChildName}. You can choose camera-assisted smart listing or enter details manually.
        </p>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={onChooseSmart}
          className="rounded-xl border p-4 text-left transition-all duration-200 hover:border-[var(--ember-primary)] hover:bg-[var(--ember-primary-5)]"
          style={{ borderColor: "var(--ember-gray-300)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--ember-primary-10)" }}>
              <Camera className="w-5 h-5" style={{ color: "var(--ember-primary)" }} />
            </div>
            <div>
              <p className="font-medium" style={{ color: "var(--ember-gray-900)" }}>
                Smart Listing - with Camera
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--ember-gray-600)" }}>
                Use your camera/photo, then Ember suggests likely item matches for you to confirm.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onChooseManual}
          className="rounded-xl border p-4 text-left transition-all duration-200 hover:border-[var(--ember-primary)] hover:bg-[var(--ember-primary-5)]"
          style={{ borderColor: "var(--ember-gray-300)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--ember-gray-200)" }}>
              <Keyboard className="w-5 h-5" style={{ color: "var(--ember-gray-700)" }} />
            </div>
            <div>
              <p className="font-medium" style={{ color: "var(--ember-gray-900)" }}>
                Manual Listing - Enter Details
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--ember-gray-600)" }}>
                Enter item details yourself and continue through the existing pre-list form.
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
