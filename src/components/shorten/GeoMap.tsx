import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Globe, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

interface GeoDataItem {
  country: string;
  code: string;
  count: number;
  latitude?: number;
  longitude?: number;
}

interface GeoMapProps {
  geoData: GeoDataItem[];
  className?: string;
}

export function GeoMap({ geoData, className }: GeoMapProps) {
  const [zoom, setZoom] = useState(1);
  const [viewBox, setViewBox] = useState("0 0 1000 500");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // Get total clicks
  const totalClicks = geoData.reduce((sum, item) => sum + item.count, 0);

  // Get top countries
  const topCountries = [...geoData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Handle zoom in
  const handleZoomIn = () => {
    if (zoom < 4) {
      setZoom(zoom + 0.5);
      // Adjust viewBox for zoom
      setViewBox(`${250 * zoom} ${125 * zoom} ${1000 / (zoom + 0.5)} ${500 / (zoom + 0.5)}`);
    }
  };

  // Handle zoom out
  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom - 0.5);
      // Reset viewBox if zooming all the way out
      if (zoom - 0.5 === 1) {
        setViewBox("0 0 1000 500");
      } else {
        setViewBox(`${250 * (zoom - 0.5)} ${125 * (zoom - 0.5)} ${1000 / (zoom - 0.5)} ${500 / (zoom - 0.5)}`);
      }
    }
  };

  // Get color based on click count
  const getCountryColor = (count: number) => {
    const maxCount = Math.max(...geoData.map(item => item.count));
    const intensity = maxCount > 0 ? count / maxCount : 0;

    // Blue color scale from light to dark
    return `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`;
  };

  // Simplified world map data (this would be a more complete dataset in a real implementation)
  const worldMapData = [
    { id: "US", d: "M215,220 L300,220 L300,270 L215,270 Z", name: "United States" },
    { id: "CA", d: "M215,170 L300,170 L300,220 L215,220 Z", name: "Canada" },
    { id: "MX", d: "M215,270 L300,270 L300,300 L215,300 Z", name: "Mexico" },
    { id: "BR", d: "M300,320 L350,320 L350,370 L300,370 Z", name: "Brazil" },
    { id: "GB", d: "M470,200 L480,200 L480,210 L470,210 Z", name: "United Kingdom" },
    { id: "FR", d: "M480,210 L490,210 L490,220 L480,220 Z", name: "France" },
    { id: "DE", d: "M490,200 L500,200 L500,210 L490,210 Z", name: "Germany" },
    { id: "IT", d: "M490,220 L500,220 L500,230 L490,230 Z", name: "Italy" },
    { id: "ES", d: "M470,220 L480,220 L480,230 L470,230 Z", name: "Spain" },
    { id: "RU", d: "M510,180 L600,180 L600,220 L510,220 Z", name: "Russia" },
    { id: "CN", d: "M650,220 L700,220 L700,270 L650,270 Z", name: "China" },
    { id: "IN", d: "M630,250 L660,250 L660,280 L630,280 Z", name: "India" },
    { id: "JP", d: "M720,220 L730,220 L730,240 L720,240 Z", name: "Japan" },
    { id: "AU", d: "M700,350 L750,350 L750,380 L700,380 Z", name: "Australia" },
  ];

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Shows where your link clicks are coming from around the world.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value)}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="south-america">South America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 1} className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 4} className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 bg-gray-50 rounded-lg border p-2 h-[300px] overflow-hidden">
            <svg
              viewBox={viewBox}
              width="100%"
              height="100%"
              className="overflow-visible"
            >
              {/* World map */}
              <g>
                {worldMapData.map((country) => {
                  const countryData = geoData.find(item => item.code === country.id);
                  const count = countryData?.count || 0;
                  const fillColor = countryData ? getCountryColor(count) : "#e5e7eb";

                  return (
                    <path
                      key={country.id}
                      id={country.id}
                      d={country.d}
                      fill={fillColor}
                      stroke="#fff"
                      strokeWidth="1"
                      data-count={count}
                      data-name={country.name}
                    >
                      <title>{`${country.name}: ${count} clicks`}</title>
                    </path>
                  );
                })}
              </g>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Top Countries</h3>
            <div className="space-y-2">
              {topCountries.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-white rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCountryColor(country.count) }}
                    ></div>
                    <span className="text-sm font-medium">{country.country}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{country.count}</span>
                    <span className="text-xs text-gray-500">
                      {((country.count / totalClicks) * 100).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
