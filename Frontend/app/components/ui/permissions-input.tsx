"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface PermissionsInputProps {
  value: Record<string, unknown>;
  onChange: (permissions: Record<string, unknown>) => void;
  label?: string;
  description?: string;
}

const COMMON_SCOPES = [
  { key: "read", label: "Read", description: "View data and resources" },
  { key: "write", label: "Write", description: "Create and update resources" },
  { key: "delete", label: "Delete", description: "Remove resources" },
  { key: "admin", label: "Admin", description: "Full administrative access" },
];

export function PermissionsInput({ value, onChange, label = "Permissions", description }: PermissionsInputProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Check if current permissions match simple scope format
  const isSimpleFormat = Object.keys(value).every(key => 
    COMMON_SCOPES.some(scope => scope.key === key) && typeof value[key] === 'boolean'
  );

  const handleScopeToggle = (scope: string) => {
    const newPermissions = { ...value };
    if (newPermissions[scope]) {
      delete newPermissions[scope];
    } else {
      newPermissions[scope] = true;
    }
    onChange(newPermissions);
    setJsonError(null);
  };

  const handleJsonChange = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      onChange(parsed);
      setJsonError(null);
    } catch (error) {
      setJsonError((error as Error).message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">
          {label}
          {description && <span className="text-xs text-muted-foreground ml-2">({description})</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="size-3" />
              Simple
            </>
          ) : (
            <>
              <ChevronDown className="size-3" />
              Advanced (JSON)
            </>
          )}
        </button>
      </div>

      {showAdvanced ? (
        <div>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder='{"read": true, "write": false, "custom": {"scope": "value"}}'
            rows={6}
            className={`w-full px-3 py-2 rounded border ${
              jsonError ? 'border-red-500' : 'border-border'
            } bg-background text-foreground font-mono text-xs`}
          />
          {jsonError && (
            <p className="text-xs text-red-500 mt-1">Invalid JSON: {jsonError}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2 border border-border rounded-lg p-4 bg-background/50">
          {COMMON_SCOPES.map((scope) => (
            <label
              key={scope.key}
              className="flex items-start gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={!!value[scope.key]}
                onChange={() => handleScopeToggle(scope.key)}
                className="mt-0.5 size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{scope.label}</div>
                <div className="text-xs text-muted-foreground">{scope.description}</div>
              </div>
            </label>
          ))}
          
          {!isSimpleFormat && Object.keys(value).length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Additional custom permissions:</p>
              <pre className="text-xs bg-background rounded p-2 overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
              <button
                type="button"
                onClick={() => setShowAdvanced(true)}
                className="text-xs text-primary hover:underline mt-2"
              >
                Edit in advanced mode
              </button>
            </div>
          )}
          
          {Object.keys(value).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No permissions selected. Select at least one scope.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
