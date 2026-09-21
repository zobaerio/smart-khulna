import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ServiceQRProps {
  url: string;
  size?: number;
}

export const ServiceQR: React.FC<ServiceQRProps> = ({ url, size = 150 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      <QRCodeSVG value={url} size={size} level="M" />
      <p className="mt-3 text-xs text-slate-500 font-medium text-center">স্ক্যান করুন তথ্য শেয়ার করতে</p>
    </div>
  );
};
