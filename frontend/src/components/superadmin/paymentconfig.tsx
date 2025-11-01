'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Material Design Icons
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PublicIcon from '@mui/icons-material/Public';

// ---------------- Types & Constants ----------------

type Environment = 'sandbox' | 'production';

interface PaymentGatewayConfig {
  id: string;
  name: string;
  enabled: boolean;
  environment: Environment;
  isPrimary: boolean;
  credentials: {
    apiKey?: string;
    secretKey?: string;
    publishableKey?: string;
    merchantId?: string;
    clientId?: string;
    clientSecret?: string;
    webhookSecret?: string;
  };
  supportedCurrencies: string[];
  supportedCountries: string[];
  features: string[];
}

const PAYMENT_GATEWAYS = [
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '💳',
    description: 'Global payment processing with extensive features',
    features: ['Cards', 'Wallets', 'Local Methods', 'Subscriptions', 'Connect'],
    defaultCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    regions: ['Global', 'North America', 'Europe', 'Asia Pacific'],
    fields: ['publishableKey', 'secretKey', 'webhookSecret'],
  },
  {
    id: 'adyen',
    name: 'Adyen',
    logo: '🅰️',
    description: 'Enterprise payment platform with unified commerce',
    features: ['Cards', 'Local Methods', 'POS', 'Risk Management'],
    defaultCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
    regions: ['Global', 'Europe', 'Asia Pacific', 'Latin America'],
    fields: ['apiKey', 'merchantAccount', 'clientKey', 'webhookSecret'],
  },
  {
    id: 'checkout',
    name: 'Checkout.com',
    logo: '✓',
    description: 'Cloud-based payment gateway with global reach',
    features: ['Cards', 'Alternative Payments', 'Fraud Detection'],
    defaultCurrencies: ['USD', 'EUR', 'GBP', 'AED'],
    regions: ['Global', 'Europe', 'Middle East', 'Asia Pacific'],
    fields: ['publicKey', 'secretKey', 'webhookSecret'],
  },
  {
    id: 'braintree',
    name: 'Braintree',
    logo: '🌳',
    description: 'PayPal-owned payment platform for modern commerce',
    features: ['Cards', 'PayPal', 'Venmo', 'Apple Pay', 'Google Pay'],
    defaultCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
    regions: ['North America', 'Europe', 'Asia Pacific'],
    fields: ['merchantId', 'publicKey', 'privateKey'],
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '⚡',
    description: 'Leading payment solution for India',
    features: ['Cards', 'UPI', 'Netbanking', 'Wallets', 'EMI'],
    defaultCurrencies: ['INR', 'USD', 'EUR'],
    regions: ['India', 'Asia Pacific'],
    fields: ['keyId', 'keySecret', 'webhookSecret'],
  },
  {
    id: 'mollie',
    name: 'Mollie',
    logo: '🔷',
    description: 'European payment service provider',
    features: ['Cards', 'iDEAL', 'SEPA', 'PayPal', 'Klarna'],
    defaultCurrencies: ['EUR', 'GBP', 'USD'],
    regions: ['Europe'],
    fields: ['apiKey', 'profileId', 'webhookSecret'],
  },
  {
    id: 'gocardless',
    name: 'GoCardless',
    logo: '🏦',
    description: 'Bank payment and recurring billing specialist',
    features: ['Direct Debit', 'Bank Payments', 'Recurring Billing'],
    defaultCurrencies: ['GBP', 'EUR', 'USD', 'SEK', 'DKK'],
    regions: ['Europe', 'North America', 'Asia Pacific'],
    fields: ['accessToken', 'webhookSecret'],
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    logo: '🦋',
    description: 'African payment infrastructure platform',
    features: ['Cards', 'Mobile Money', 'Bank Transfer', 'USSD'],
    defaultCurrencies: ['NGN', 'KES', 'GHS', 'ZAR', 'USD'],
    regions: ['Africa'],
    fields: ['publicKey', 'secretKey', 'encryptionKey', 'webhookSecret'],
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    logo: '💰',
    description: 'Latin America\'s leading fintech platform',
    features: ['Cards', 'Cash', 'Bank Transfer', 'Installments'],
    defaultCurrencies: ['BRL', 'ARS', 'MXN', 'CLP', 'COP'],
    regions: ['Latin America'],
    fields: ['publicKey', 'accessToken', 'webhookSecret'],
  },
  {
    id: 'xendit',
    name: 'Xendit',
    logo: '🚀',
    description: 'Southeast Asian payment gateway',
    features: ['Cards', 'E-Wallets', 'Virtual Accounts', 'Retail Outlets'],
    defaultCurrencies: ['IDR', 'PHP', 'THB', 'MYR', 'VND'],
    regions: ['Southeast Asia'],
    fields: ['publicKey', 'secretKey', 'webhookToken'],
  },
  {
    id: 'paystack',
    name: 'Paystack',
    logo: '📚',
    description: 'Modern payment platform for African businesses',
    features: ['Cards', 'Bank Transfer', 'USSD', 'Mobile Money'],
    defaultCurrencies: ['NGN', 'GHS', 'ZAR', 'USD'],
    regions: ['Africa'],
    fields: ['publicKey', 'secretKey', 'webhookSecret'],
  },
  {
    id: '2c2p',
    name: '2C2P',
    logo: '🏪',
    description: 'Asia-Pacific payment solutions provider',
    features: ['Cards', 'E-Wallets', 'Online Banking', 'QR Payments'],
    defaultCurrencies: ['SGD', 'THB', 'MYR', 'HKD', 'USD'],
    regions: ['Asia Pacific', 'Southeast Asia'],
    fields: ['merchantId', 'secretKey', 'webhookSecret'],
  },
  {
    id: 'amazonpay',
    name: 'Amazon Payment Services',
    logo: '📦',
    description: 'Middle East payment gateway by Amazon',
    features: ['Cards', 'Apple Pay', 'Installments', 'KNET'],
    defaultCurrencies: ['AED', 'SAR', 'EGP', 'USD'],
    regions: ['Middle East', 'North Africa'],
    fields: ['merchantIdentifier', 'accessCode', 'secretKey'],
  },
  {
    id: 'dlocal',
    name: 'dLocal',
    logo: '🌎',
    description: 'Global payment platform for emerging markets',
    features: ['Cards', 'Bank Transfer', 'Cash', 'Alternative Payments'],
    defaultCurrencies: ['USD', 'BRL', 'MXN', 'ARS', 'CLP', 'INR'],
    regions: ['Latin America', 'Africa', 'Asia Pacific'],
    fields: ['apiKey', 'secretKey', 'xLogin', 'xTransKey'],
  },
];

const COMMON_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'INR', 'SGD',
  'HKD', 'KRW', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'NGN', 'KES', 'ZAR',
  'GHS', 'AED', 'SAR', 'EGP', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'DKK', 'SEK', 'NOK'
];

// ---------------- Persistence ----------------

const LS_KEY = 'payment-gateway-configs-v1';

function loadConfigs(): Record<string, PaymentGatewayConfig> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveConfigs(configs: Record<string, PaymentGatewayConfig>) {
  localStorage.setItem(LS_KEY, JSON.stringify(configs));
}

// ---------------- Helper Functions ----------------

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(' ');
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    apiKey: 'API Key',
    secretKey: 'Secret Key',
    publishableKey: 'Publishable Key',
    publicKey: 'Public Key',
    privateKey: 'Private Key',
    merchantId: 'Merchant ID',
    merchantAccount: 'Merchant Account',
    merchantIdentifier: 'Merchant Identifier',
    clientId: 'Client ID',
    clientKey: 'Client Key',
    clientSecret: 'Client Secret',
    webhookSecret: 'Webhook Secret',
    webhookToken: 'Webhook Token',
    accessToken: 'Access Token',
    accessCode: 'Access Code',
    keyId: 'Key ID',
    keySecret: 'Key Secret',
    encryptionKey: 'Encryption Key',
    profileId: 'Profile ID',
    xLogin: 'X-Login',
    xTransKey: 'X-Trans-Key',
  };
  return labels[field] || field;
}

// ---------------- Component ----------------

export default function PaymentGatewayConfig() {
  const [configs, setConfigs] = useState<Record<string, PaymentGatewayConfig>>({});
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Load configs on mount
  useEffect(() => {
    setConfigs(loadConfigs());
  }, []);

  // Get or create config for a gateway
  const getConfig = (gatewayId: string): PaymentGatewayConfig => {
    if (configs[gatewayId]) return configs[gatewayId];
    
    const gateway = PAYMENT_GATEWAYS.find(g => g.id === gatewayId);
    return {
      id: gatewayId,
      name: gateway?.name || '',
      enabled: false,
      environment: 'sandbox',
      isPrimary: false,
      credentials: {},
      supportedCurrencies: gateway?.defaultCurrencies || [],
      supportedCountries: [],
      features: gateway?.features || [],
    };
  };

  // Update config
  const updateConfig = (gatewayId: string, updates: Partial<PaymentGatewayConfig>) => {
    setConfigs(prev => ({
      ...prev,
      [gatewayId]: { ...getConfig(gatewayId), ...updates },
    }));
  };

  // Update credential field
  const updateCredential = (gatewayId: string, field: string, value: string) => {
    const config = getConfig(gatewayId);
    updateConfig(gatewayId, {
      credentials: { ...config.credentials, [field]: value },
    });
  };

  // Toggle currency
  const toggleCurrency = (gatewayId: string, currency: string) => {
    const config = getConfig(gatewayId);
    const currencies = config.supportedCurrencies.includes(currency)
      ? config.supportedCurrencies.filter(c => c !== currency)
      : [...config.supportedCurrencies, currency];
    updateConfig(gatewayId, { supportedCurrencies: currencies });
  };

  // Set as primary
  const setPrimary = (gatewayId: string) => {
    const newConfigs = { ...configs };
    Object.keys(newConfigs).forEach(id => {
      newConfigs[id] = { ...newConfigs[id], isPrimary: id === gatewayId };
    });
    setConfigs(newConfigs);
  };

  // Save all configs
  const handleSave = () => {
    saveConfigs(configs);
  };

  // Reset configs
  const handleReset = () => {
    setConfigs({});
    localStorage.removeItem(LS_KEY);
  };

  // Filter gateways by search
  const filteredGateways = PAYMENT_GATEWAYS.filter(gateway =>
    gateway.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gateway.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gateway.regions.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Count enabled gateways
  const enabledCount = Object.values(configs).filter(c => c.enabled).length;
  const primaryGateway = Object.values(configs).find(c => c.isPrimary);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <PaymentIcon className="dark:text-neutral-100" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Payment Gateway Configuration</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Configure and manage your payment processors</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700">
            <RestoreIcon className="mr-2" /> Reset
          </Button>
          <Button onClick={handleSave} className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-neutral-100">
            <SaveIcon className="mr-2" /> Save All
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="mb-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium dark:text-neutral-100">Active Configuration</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {enabledCount} gateway{enabledCount !== 1 ? 's' : ''} enabled
            </div>
          </div>
          <Separator className="bg-neutral-200 dark:bg-neutral-700 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Enabled Gateways</div>
              <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{enabledCount}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Primary Gateway</div>
              <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {primaryGateway ? primaryGateway.name : 'Not Set'}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Total Available</div>
              <div className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{PAYMENT_GATEWAYS.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search gateways by name, region, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />
      </div>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGateways.map((gateway) => {
          const config = getConfig(gateway.id);
          const isConfigured = Object.keys(config.credentials).some(key => config.credentials[key as keyof typeof config.credentials]);
          
          return (
            <Dialog key={gateway.id} open={selectedGateway === gateway.id} onOpenChange={(open) => {
              if (!open) setSelectedGateway(null);
            }}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedGateway(gateway.id)}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 cursor-pointer transition-all hover:shadow-md hover:border-neutral-400 dark:hover:border-neutral-500"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-3xl">{gateway.logo}</div>
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">{gateway.name}</div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{gateway.regions.join(', ')}</div>
                      </div>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => updateConfig(gateway.id, { enabled: checked })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-3">{gateway.description}</p>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {config.enabled && (
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 text-xs">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Enabled
                      </Badge>
                    )}
                    {config.isPrimary && (
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs">
                        <VerifiedUserIcon className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                    {isConfigured && (
                      <Badge variant="outline" className="bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 text-xs">
                        Configured
                      </Badge>
                    )}
                  </div>
                </motion.div>
              </DialogTrigger>

              {/* Configuration Dialog */}
              <DialogContent className="rounded-2xl md:min-w-4xl max-h-[90vh] overflow-y-auto dark:bg-neutral-900 dark:border-neutral-700">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{gateway.logo}</div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{gateway.name}</DialogTitle>
                      <DialogDescription className="text-sm dark:text-neutral-400">{gateway.description}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="credentials" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-3 mb-6 dark:bg-neutral-800 dark:border-neutral-700">
                    <TabsTrigger value="credentials" className="dark:data-[state=active]:bg-neutral-700 dark:text-neutral-300">Credentials</TabsTrigger>
                    <TabsTrigger value="settings" className="dark:data-[state=active]:bg-neutral-700 dark:text-neutral-300">Settings</TabsTrigger>
                    <TabsTrigger value="features" className="dark:data-[state=active]:bg-neutral-700 dark:text-neutral-300">Features</TabsTrigger>
                  </TabsList>

                  {/* Credentials Tab */}
                  <TabsContent value="credentials" className="space-y-4">
                    {/* Environment Selection */}
                    <div>
                      <Label className="mb-2 block text-sm font-medium dark:text-neutral-200">Environment</Label>
                      <div className="flex gap-2">
                        {(['sandbox', 'production'] as Environment[]).map((env) => (
                          <button
                            key={env}
                            onClick={() => updateConfig(gateway.id, { environment: env })}
                            className={classNames(
                              'flex-1 rounded-xl border px-4 py-2.5 text-sm transition-all',
                              config.environment === env
                                ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black'
                                : 'border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                            )}
                          >
                            {env === 'sandbox' ? '🧪 Sandbox (Test)' : '🚀 Production (Live)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="dark:bg-neutral-700" />

                    {/* Credential Fields */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium dark:text-neutral-200">API Credentials</Label>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs dark:text-neutral-300 dark:hover:bg-neutral-700"
                              >
                                <InfoIcon className="w-4 h-4 mr-1" /> Security Info
                              </Button>
                            </DialogTrigger>
                              <DialogContent className="rounded-2xl dark:bg-neutral-900 dark:border-neutral-700">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 dark:text-neutral-100">
                                    <VerifiedUserIcon className="text-neutral-700 dark:text-neutral-300" />
                                    Security Best Practices
                                  </DialogTitle>
                                  <DialogDescription className="space-y-3 pt-4">
                                    <div>
                                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">🔐 Development Environment</h4>
                                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        Credentials are currently stored locally in your browser's localStorage for development and testing purposes only.
                                      </p>
                                    </div>
                                    <Separator className="dark:bg-neutral-700" />
                                    <div>
                                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">⚠️ Production Warning</h4>
                                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        <strong>Never store sensitive credentials in localStorage in production.</strong> Use secure backend storage with:
                                      </p>
                                      <ul className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 list-disc list-inside ml-2">
                                        <li>Environment variables (.env files)</li>
                                        <li>Encrypted database storage</li>
                                        <li>Secret management services (AWS Secrets Manager, HashiCorp Vault, etc.)</li>
                                        <li>Server-side API calls only</li>
                                      </ul>
                                    </div>
                                    <Separator className="dark:bg-neutral-700" />
                                    <div>
                                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">✅ Recommended Approach</h4>
                                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                        Configure payment gateways through a secure admin API endpoint that:
                                      </p>
                                      <ul className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 list-disc list-inside ml-2">
                                        <li>Requires authentication and authorization</li>
                                        <li>Encrypts credentials before storage</li>
                                        <li>Logs all configuration changes</li>
                                        <li>Uses HTTPS for all communications</li>
                                      </ul>
                                    </div>
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowSecrets(prev => ({ ...prev, [gateway.id]: !prev[gateway.id] }))}
                              className="text-xs dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                              {showSecrets[gateway.id] ? (
                                <>
                                  <VisibilityOffIcon className="w-4 h-4 mr-1" /> Hide
                                </>
                              ) : (
                                <>
                                  <VisibilityIcon className="w-4 h-4 mr-1" /> Show
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {gateway.fields.map((field) => (
                          <div key={field}>
                            <Label htmlFor={`${gateway.id}-${field}`} className="mb-1.5 block text-sm dark:text-neutral-200">
                              {getFieldLabel(field)}
                            </Label>
                            <Input
                              id={`${gateway.id}-${field}`}
                              type={showSecrets[gateway.id] ? 'text' : 'password'}
                              value={config.credentials[field as keyof typeof config.credentials] || ''}
                              onChange={(e) => updateCredential(gateway.id, field, e.target.value)}
                              placeholder={`Enter ${getFieldLabel(field)}`}
                              className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 font-mono text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4">
                      {/* Primary Gateway */}
                      <div className="flex items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 p-4">
                        <div>
                          <div className="text-sm font-medium dark:text-neutral-100">Set as Primary Gateway</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {config.isPrimary ? 'This is your default payment processor' : 'Make this the default payment processor'}
                          </div>
                        </div>
                        <Switch
                          checked={config.isPrimary}
                          onCheckedChange={() => setPrimary(gateway.id)}
                          disabled={!config.enabled}
                        />
                      </div>

                      <Separator className="dark:bg-neutral-700" />

                      {/* Supported Currencies */}
                      <div>
                        <Label className="mb-2 block text-sm font-medium dark:text-neutral-200">Supported Currencies</Label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {COMMON_CURRENCIES.map((currency) => (
                            <button
                              key={currency}
                              onClick={() => toggleCurrency(gateway.id, currency)}
                              className={classNames(
                                'rounded-lg border px-2 py-1.5 text-xs font-medium transition-all',
                                config.supportedCurrencies.includes(currency)
                                  ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black'
                                  : 'border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                              )}
                            >
                              {currency}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                          Selected: {config.supportedCurrencies.length} {config.supportedCurrencies.length === 1 ? 'currency' : 'currencies'}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Features Tab */}
                    <TabsContent value="features" className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-medium dark:text-neutral-200">Supported Features</Label>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs dark:text-neutral-300 dark:hover:bg-neutral-700"
                              >
                                <InfoIcon className="w-4 h-4 mr-1" /> Feature Info
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl dark:bg-neutral-900 dark:border-neutral-700">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 dark:text-neutral-100">
                                  <CheckCircleIcon className="text-green-600 dark:text-green-400" />
                                  About {gateway.name} Features
                                </DialogTitle>
                                <DialogDescription className="space-y-3 pt-4">
                                  <div>
                                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">📋 Feature Availability</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                      The features listed are the core capabilities of {gateway.name}. Availability may vary based on:
                                    </p>
                                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 list-disc list-inside ml-2">
                                      <li>Your geographic region and business location</li>
                                      <li>Account type and verification status</li>
                                      <li>Business category and compliance requirements</li>
                                      <li>Transaction volume and merchant agreement</li>
                                    </ul>
                                  </div>
                                  <Separator className="dark:bg-neutral-700" />
                                  <div>
                                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">🌍 Regional Differences</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                      Payment methods and features can differ significantly by region. Some local payment methods are only available in specific countries.
                                    </p>
                                  </div>
                                  <Separator className="dark:bg-neutral-700" />
                                  <div>
                                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">💡 Getting Started</h4>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                      Contact {gateway.name} support to:
                                    </p>
                                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 space-y-1 list-disc list-inside ml-2">
                                      <li>Verify which features are available for your account</li>
                                      <li>Request access to additional payment methods</li>
                                      <li>Get integration assistance and documentation</li>
                                      <li>Understand pricing and transaction fees</li>
                                    </ul>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {gateway.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-3"
                            >
                              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <span className="text-sm text-neutral-800 dark:text-neutral-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="dark:bg-neutral-700" />

                      <div>
                        <Label className="mb-3 block text-sm font-medium dark:text-neutral-200">Regional Coverage</Label>
                        <div className="flex flex-wrap gap-2">
                          {gateway.regions.map((region, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                              <PublicIcon className="w-3 h-3 mr-1" />
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
