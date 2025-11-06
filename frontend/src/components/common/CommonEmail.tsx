"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SendIcon from "@mui/icons-material/Send";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend?: (data: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
  }) => void;
}

// Simple tag input for emails
const TagInput: React.FC<{
  placeholder: string;
  value: string[];
  onChange: (v: string[]) => void;
}> = ({ placeholder, value, onChange }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) onChange([...value, input.trim()]);
      setInput("");
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
      {value.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm text-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== idx))}
            className="ml-1 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

const SendEmailDialog: React.FC<SendEmailDialogProps> = ({
  open,
  onOpenChange,
  onSend,
}) => {
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    if (onSend) onSend({ to, cc, bcc, subject, body });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center justify-between">
            Send Email
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Compose and send an email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <TagInput placeholder="To" value={to} onChange={setTo} />
          <TagInput placeholder="Cc" value={cc} onChange={setCc} />
          <TagInput placeholder="Bcc" value={bcc} onChange={setBcc} />
          <Input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border-border text-foreground bg-background"
          />
          <Textarea
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px] border-border text-foreground bg-background"
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            onClick={handleSend}
            className="rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            <SendIcon className="mr-2 h-4 w-4" /> Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendEmailDialog;
