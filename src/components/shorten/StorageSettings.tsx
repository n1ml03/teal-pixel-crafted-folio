import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  Calendar,
  HardDrive,
  RotateCcw,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { URLShortenerService } from '@/services/URLShortenerService.ts';
import { toast } from 'sonner';

interface StorageSettingsProps {
  onClose?: () => void;
}

const StorageSettings: React.FC<StorageSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState(URLShortenerService.getStorageSettings());
  const [stats, setStats] = useState(URLShortenerService.getStorageStats());
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Refresh stats when settings change
  useEffect(() => {
    const newStats = URLShortenerService.getStorageStats();
    setStats(newStats);
  }, [settings]);

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      URLShortenerService.updateStorageSettings(settings);
      toast.success('Storage settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const exportData = URLShortenerService.exportURLs(true);
      
      // Create blob and download
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `url-shortener-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('URLs exported successfully!');
    } catch (error) {
      toast.error('Failed to export URLs');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const success = URLShortenerService.importURLs(text, true);
      
      if (success) {
        toast.success('URLs imported successfully!');
        setStats(URLShortenerService.getStorageStats());
      } else {
        toast.error('Failed to import URLs');
      }
    } catch (error) {
      toast.error('Failed to import URLs: ' + error.message);
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const success = URLShortenerService.restoreFromBackup();
      
      if (success) {
        toast.success('Backup restored successfully!');
        setStats(URLShortenerService.getStorageStats());
      } else {
        toast.error('No backup found or restore failed');
      }
    } catch (error) {
      toast.error('Failed to restore backup');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleCleanup = () => {
    URLShortenerService.initialize();
    setStats(URLShortenerService.getStorageStats());
    toast.success('Storage cleanup completed!');
  };

  const getStorageWarningLevel = () => {
    const usagePercent = (stats.storageSizeMB / settings.maxStorageSize) * 100;
    if (usagePercent > 90) return 'error';
    if (usagePercent > 70) return 'warning';
    return 'success';
  };

  const warningLevel = getStorageWarningLevel();

  return (
    <div className="space-y-6">
      <Card className="border border shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure how your URLs are stored and managed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Storage Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Storage Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalUrls}</div>
                <div className="text-sm text-blue-700">Total URLs</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.permanentUrls}</div>
                <div className="text-sm text-green-700">Permanent URLs</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.expiredUrls}</div>
                <div className="text-sm text-orange-700">Expired URLs</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.storageSizeMB.toFixed(2)}MB
                </div>
                <div className="text-sm text-purple-700">Storage Used</div>
              </div>
            </div>

            {/* Storage Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Storage Usage</span>
                <Badge variant={warningLevel === 'error' ? 'destructive' : warningLevel === 'warning' ? 'secondary' : 'default'}>
                  {((stats.storageSizeMB / settings.maxStorageSize) * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    warningLevel === 'error' ? 'bg-red-500' : 
                    warningLevel === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((stats.storageSizeMB / settings.maxStorageSize) * 100, 100)}%` }}
                />
              </div>
            </div>

            {warningLevel !== 'success' && (
              <Alert className={warningLevel === 'error' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}>
                <AlertTriangle className={`h-4 w-4 ${warningLevel === 'error' ? 'text-red-600' : 'text-orange-600'}`} />
                <AlertTitle>Storage Warning</AlertTitle>
                <AlertDescription>
                  {warningLevel === 'error' 
                    ? 'Storage limit exceeded! Consider cleaning up old URLs or increasing the limit.'
                    : 'Storage usage is high. Consider enabling auto-cleanup or managing your URLs.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Default Expiration Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Default Expiration
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="defaultExpiration">Default expiration (days)</Label>
              <div className="space-y-3">
                <Slider
                  value={[settings.defaultExpirationDays]}
                  onValueChange={(value) => handleSettingsChange('defaultExpirationDays', value[0])}
                  max={3650}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>No expiration</span>
                  <span className="font-medium">{settings.defaultExpirationDays} days</span>
                  <span>10 years max</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Storage Management Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoCleanup">Auto Cleanup</Label>
                  <p className="text-sm text-gray-500">Automatically remove expired URLs</p>
                </div>
                <Checkbox 
                  id="autoCleanup"
                  checked={settings.autoCleanup}
                  onCheckedChange={(checked) => handleSettingsChange('autoCleanup', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableBackup">Enable Backup</Label>
                  <p className="text-sm text-gray-500">Create automatic backups of your URLs</p>
                </div>
                <Checkbox 
                  id="enableBackup"
                  checked={settings.enableBackup}
                  onCheckedChange={(checked) => handleSettingsChange('enableBackup', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compression">Enable Compression</Label>
                  <p className="text-sm text-gray-500">Compress data to save storage space</p>
                </div>
                <Checkbox 
                  id="compression"
                  checked={settings.compressionEnabled}
                  onCheckedChange={(checked) => handleSettingsChange('compressionEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStorage">Maximum storage size (MB)</Label>
                <Input
                  id="maxStorage"
                  type="number"
                  value={settings.maxStorageSize}
                  onChange={(e) => handleSettingsChange('maxStorageSize', parseInt(e.target.value) || 50)}
                  min={10}
                  max={500}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Backup & Restore */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Backup & Restore
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export URLs'}
              </Button>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isImporting}
                />
                <Button 
                  disabled={isImporting}
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? 'Importing...' : 'Import URLs'}
                </Button>
              </div>
              
              <Button 
                onClick={handleRestore}
                disabled={isRestoring}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RotateCcw className="h-4 w-4" />
                {isRestoring ? 'Restoring...' : 'Restore Backup'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button 
              onClick={handleCleanup}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clean Expired URLs
            </Button>
            
            <div className="flex gap-3">
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button 
                onClick={saveSettings}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">Storage Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Enable compression to save up to 30% storage space</li>
                <li>• Set appropriate expiration times to automatically manage storage</li>
                <li>• Regular backups help protect against data loss</li>
                <li>• Use permanent storage for important URLs you want to keep forever</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageSettings; 