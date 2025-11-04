'use client'
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import {  NavigationMenu, type NavItem,  } from "@/components/common/sidenav";

// Material Design Icons (MUI)
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SuperAdminProfile from "@/components/superadmin/superadminprofile";
import SuperAdminWhiteLabel from "@/components/superadmin/superadminwhitelabel";
import SuperAdminAPIConfig from "@/components/superadmin/superadminapiconfig";
import SuperAdminSMTPSettings from "@/components/superadmin/smtpsettings";
import SuperAdminLocalization from "@/components/superadmin/superadminlocalization";
import SuperAdminSettings from "@/components/superadmin/superadminsettings";
import PaymentGatewayConfig from "@/components/superadmin/paymentconfig";
import UserPolicyManagement from "@/components/superadmin/userpolicy";
import SuperAdminBranding from "@/components/superadmin/superadminbranding";
import SuperAdminEmailTemplates from "@/components/superadmin/superadminemailtemplates";
import SuperadminNotificationsTemplates from "@/components/superadmin/superadminnotifcationtemplates";





// ——————————————————————————————————————————
// Navigation Configuration & Content Components
// ——————————————————————————————————————————
const navItems: NavItem[] = [
  { key: "profile", label: "Profile", icon: PersonOutlineRoundedIcon },
  { key: "whitelabel", label: "White Label", icon: BrushOutlinedIcon },
  { key: "branding", label: "Branding", icon: FormatColorFillIcon },
  { key: "api", label: "API Config", icon: ApiOutlinedIcon },
  { key: "smtp", label: "SMTP Settings", icon: EmailOutlinedIcon },
  { key: "localization", label: "Localization", icon: LanguageOutlinedIcon },
  { key: "settings", label: "Settings", icon: SettingsOutlinedIcon },
  { key: "emailtemplates", label: "Email Templates", icon: EmailOutlinedIcon },
  { key: "notificationstemplates", label: "Push Notification Templates", icon: EmailOutlinedIcon },
  { key: "paymentgateway", label: "Payment Gateway", icon: PaymentOutlinedIcon },
  { key: "policy", label: "Update User Policy", icon: DescriptionOutlinedIcon },
];





// Content renderer based on active navigation
function renderContent(activeKey: string) {
  switch (activeKey) {
    case "profile":
      return <SuperAdminProfile />;
    case "whitelabel":
      return <SuperAdminWhiteLabel />
    case "branding":
      return <SuperAdminBranding />;
    case "api":
      return <SuperAdminAPIConfig />;
    case "smtp":
      return <SuperAdminSMTPSettings />;
    case "localization":
      return <SuperAdminLocalization />;
    case "settings":
      return <SuperAdminSettings />;
    case "emailtemplates":
      return <SuperAdminEmailTemplates />;
    case "notificationstemplates":
      return <SuperadminNotificationsTemplates />;
    case "paymentgateway":
      return <PaymentGatewayConfig />;
    case "policy":
      return <UserPolicyManagement />;
    default:
      return <> Profile Content  </>;
  }
}

export default function SingleUser() {
  const [activeNavKey, setActiveNavKey] = React.useState("profile");
  

 
  // Handle navigation change
  const handleNavChange = (key: string) => {
    setActiveNavKey(key);
  };

  return (
    <TooltipProvider>
      <div className="min-h-[100vh] w-full">
        {/* Main 3/7 layout */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
            {/* LEFT: 3 — Separate User Identity and Navigation */}
            <aside className="md:col-span-3">
              <div className="sticky top-[68px] space-y-6">                
               
                <NavigationMenu 
                  navItems={navItems}
                  activeKey={activeNavKey}
                  onNavChange={handleNavChange}
                />
              </div>
            </aside>

            {/* RIGHT: 7 — Dynamic content based on navigation */}
            <section className="md:col-span-7">
              <Card className="rounded-3xl border-neutral-200 shadow-sm min-h-[600px]">
                {renderContent(activeNavKey)}
              </Card>
            </section>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </TooltipProvider>
  );
}


