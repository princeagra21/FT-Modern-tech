import React from 'react'
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";

const DocumentationLink = () => {
  return (
   <div className="rounded-2xl border border-border bg-card p-5 dark:bg-foreground/5">
  <div className="flex items-center gap-2 mb-3">
    <LinkRoundedIcon className="text-muted" fontSize="small" />
    <div className="text-sm font-medium  text-foreground">
      Useful Documentation
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
    {[
      {
        title: "Firebase Setup",
        desc: "Web SDK Documentation",
        link: "https://firebase.google.com/docs/web/setup",
      },
      {
        title: "Google Geocoding",
        desc: "API Documentation",
        link: "https://developers.google.com/maps/documentation/geocoding",
      },
      {
        title: "Google OAuth 2.0",
        desc: "SSO Implementation",
        link: "https://developers.google.com/identity/protocols/oauth2",
      },
      {
        title: "Twilio WhatsApp",
        desc: "API Documentation",
        link: "https://www.twilio.com/docs/whatsapp",
      },
      {
        title: "WhatsApp Business",
        desc: "Meta Documentation",
        link: "https://developers.facebook.com/docs/whatsapp",
      },
      {
        title: "OpenAI API",
        desc: "Platform Documentation",
        link: "https://platform.openai.com/docs/introduction",
      },
    ].map(({ title, desc, link }) => (
      <a
        key={title}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-lg border border-border bg-background hover:bg-foreground/5  transition-colors"
      >
        <div className="font-medium text-foreground">{title}</div>
        <div className="text-muted-foreground">{desc}</div>
      </a>
    ))}
  </div>
</div>

  )
}

export default DocumentationLink