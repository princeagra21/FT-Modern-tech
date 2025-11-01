import React from 'react';
import { DisplayMap, SmartAutoTable } from '../common/simpletable';

type EmailTemplate = {
  id: string;
  title: string;
  languageCode: string; // comes from DB
};

const EmailTemplatesData: EmailTemplate[] = [
  { id: '1', title: 'User Creation (Welcome)', languageCode: 'en' },
  { id: '2', title: 'Verify Email',            languageCode: 'en-US' },
  { id: '3', title: 'Password Reset',          languageCode: 'hi' },
  { id: '4', title: 'Invoice Notification',    languageCode: 'es' },
  { id: '5', title: 'OTP Verification',        languageCode: 'ar' },
];


const displayOptions: DisplayMap<EmailTemplate> = {
  0: {
    title: () => "Title",
    content: (row) => <span className="font-medium">{row.title}</span>
  },
  1: {
    title: () => "Language",
    content: (row) => <span className="uppercase text-xs tracking-wide">{row.languageCode}</span>
  }
}


function SuperAdminEmailTemplates() {
  return (
    <div className="space-y-4">
      <SmartAutoTable
        title="Email Templates"
        data={EmailTemplatesData}
        getRowId={(r) => r.id}
        displayOptions={displayOptions}
        onRowClick={(row) => {
          console.log("Row Clicked →", row.title);
          // TODO: Open email template editor/viewer
        }}
      />
    </div>
  );
}

export default SuperAdminEmailTemplates;