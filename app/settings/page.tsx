'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: Date;
  lastUsed?: Date;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key_001',
      name: 'Production API Key',
      keyPrefix: 'sk_prod_abc123',
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date('2024-02-10'),
    },
    {
      id: 'key_002',
      name: 'Development Key',
      keyPrefix: 'sk_dev_xyz789',
      createdAt: new Date('2024-02-01'),
    },
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'webhook_001',
      url: 'https://api.example.com/fraud-alerts',
      events: ['analysis.completed', 'high_risk_detected'],
      enabled: true,
    },
  ]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const handleCopyKey = (keyId: string, keyPrefix: string) => {
    navigator.clipboard.writeText(`${keyPrefix}...`);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage API keys, webhooks, and integration settings
        </p>
      </div>

      <div className="space-y-6">
        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access
                </CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((key, index) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg bg-zinc-900/30"
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{key.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <code className="font-mono">
                        {visibleKeys.has(key.id) 
                          ? `${key.keyPrefix}••••••••••••••••`
                          : `${key.keyPrefix.slice(0, 10)}••••••••••••••••`
                        }
                      </code>
                      <span>•</span>
                      <span>Created {key.createdAt.toLocaleDateString()}</span>
                      {key.lastUsed && (
                        <>
                          <span>•</span>
                          <span>Last used {key.lastUsed.toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(key.id, key.keyPrefix)}
                    >
                      {copiedKey === key.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Webhooks Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configure webhook endpoints for real-time notifications
                </CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {webhooks.map((webhook, index) => (
                <motion.div
                  key={webhook.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg bg-zinc-900/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{webhook.url}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          webhook.enabled 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : 'bg-zinc-700 text-zinc-400'
                        }`}>
                          {webhook.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {webhook.events.map(event => (
                          <span
                            key={event}
                            className="text-xs px-2 py-1 bg-zinc-800 border border-zinc-700 rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Last delivery: 2 hours ago • 243 total deliveries</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Detection Models</CardTitle>
            <CardDescription>
              Configure AI model weights and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-zinc-900/30">
                <div>
                  <h4 className="font-medium mb-1">Specialized Detector Weight</h4>
                  <p className="text-sm text-muted-foreground">
                    Multiplier for specialized fraud detection models
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    defaultValue="1.5"
                    className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-right"
                  />
                  <span className="text-sm text-muted-foreground">x</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-zinc-900/30">
                <div>
                  <h4 className="font-medium mb-1">Minimum Confidence Threshold</h4>
                  <p className="text-sm text-muted-foreground">
                    Score threshold for fraud alerts (0-100%)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="70"
                    className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-right"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button>Save Configuration</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
