import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Clock, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { Button } from '@/components/ui/button.tsx';

interface TimeHeatmapItem {
  day: number; // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  count: number;
}

interface TimeHeatmapProps {
  data: TimeHeatmapItem[];
  className?: string;
}

export function TimeHeatmap({ data, className }: TimeHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [maxCount, setMaxCount] = useState(0);

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Process data for heatmap
  useEffect(() => {
    // Initialize 2D array with zeros (7 days x 24 hours)
    const heatmap: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));
    let max = 0;

    // Fill in the data
    data.forEach(item => {
      heatmap[item.day][item.hour] += item.count;
      if (heatmap[item.day][item.hour] > max) {
        max = heatmap[item.day][item.hour];
      }
    });

    setHeatmapData(heatmap);
    setMaxCount(max);
  }, [data]);

  // Get color based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-50';
    
    const intensity = maxCount > 0 ? count / maxCount : 0;
    
    if (intensity < 0.2) return 'bg-blue-50';
    if (intensity < 0.4) return 'bg-blue-100';
    if (intensity < 0.6) return 'bg-blue-200';
    if (intensity < 0.8) return 'bg-blue-300';
    return 'bg-blue-400';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Click Activity Heatmap
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Shows when your links are most active throughout the week.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-1">
              <div className="w-12"></div>
              {Array.from({ length: 24 }).map((_, hour) => (
                <div key={hour} className="flex-1 text-center text-xs text-gray-500">
                  {hour}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            {heatmapData.map((hours, dayIndex) => (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: dayIndex * 0.05 }}
                className="flex items-center mb-1"
              >
                <div className="w-12 text-xs font-medium text-gray-500">{dayNames[dayIndex]}</div>
                {hours.map((count, hourIndex) => (
                  <TooltipProvider key={hourIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex-1 aspect-square rounded-sm border border-gray-100 ${getColor(count)}`}
                        ></div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-medium">{dayNames[dayIndex]} {hourIndex}:00</div>
                          <div>{count} clicks</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </motion.div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center justify-end mt-4 gap-2">
              <div className="text-xs text-gray-500">Fewer</div>
              {['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400'].map((color, index) => (
                <div key={index} className={`w-4 h-4 ${color} border border-gray-200 rounded-sm`}></div>
              ))}
              <div className="text-xs text-gray-500">More</div>
            </div>
            
            {/* Peak times */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Peak Activity Times</h4>
              <div className="grid grid-cols-2 gap-2">
                {findPeakTimes(heatmapData).map((peak, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-blue-50 p-2 rounded-md border border-blue-100"
                  >
                    <div className="text-sm font-medium text-blue-700">
                      {dayNames[peak.day]} at {peak.hour}:00
                    </div>
                    <div className="text-xs text-blue-600">
                      {peak.count} clicks
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to find peak times
function findPeakTimes(heatmapData: number[][]): { day: number; hour: number; count: number }[] {
  const peaks: { day: number; hour: number; count: number }[] = [];
  
  // Flatten the data and sort by count
  const flatData: { day: number; hour: number; count: number }[] = [];
  
  heatmapData.forEach((hours, day) => {
    hours.forEach((count, hour) => {
      if (count > 0) {
        flatData.push({ day, hour, count });
      }
    });
  });
  
  // Sort by count (descending)
  flatData.sort((a, b) => b.count - a.count);
  
  // Return top 4 peaks
  return flatData.slice(0, 4);
}
