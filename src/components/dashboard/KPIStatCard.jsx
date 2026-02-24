import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPIStatCard = ({ label, value, icon: Icon, trend, trendLabel, color }) => {
    const isPositive = trend >= 0;

    return (
        <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>

                    {(trend !== undefined && trend !== null) && (
                        <div className={cn(
                            "flex items-center gap-1 mt-2 text-xs font-medium",
                            isPositive ? "text-emerald-600" : "text-rose-600"
                        )}>
                            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{Math.abs(trend)}%</span>
                            <span className="text-slate-400 font-normal ml-1">{trendLabel || 'vs last month'}</span>
                        </div>
                    )}
                </div>

                <div className={cn("p-3 rounded-xl shadow-sm", color || "bg-slate-900")}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </CardContent>
        </Card>
    );
};

export default KPIStatCard;
