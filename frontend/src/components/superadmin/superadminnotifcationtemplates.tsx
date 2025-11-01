import React from 'react';
import { DisplayMap, SmartAutoTable } from '../common/simpletable';

type EmailTemplate = {
  id: string;
  title: string;
  languageCode: string; // comes from DB
};

const EmailTemplatesData: EmailTemplate[] = [
  { id: '1', title: 'Vehicle Ignition On', languageCode: 'en' },
  { id: '2', title: 'Vehicle Speeding',            languageCode: 'en' },
  { id: '3', title: 'Vehicle Stopped',          languageCode: 'hi' },
  { id: '4', title: 'Vehicle Overheating',    languageCode: 'es' },
  { id: '5', title: 'Vehicle Battery Low',        languageCode: 'ar' },
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


function SuperadminNotificationsTemplates() {
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

export default SuperadminNotificationsTemplates;