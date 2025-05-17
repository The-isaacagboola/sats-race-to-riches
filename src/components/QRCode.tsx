
import React, { useEffect, useRef } from 'react';
import QRCodeStyling, { 
  type Options as QRCodeStylingOptions,
  type DrawType
} from 'qr-code-styling';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  logoImage?: string;
  logoWidth?: number;
  logoHeight?: number;
  qrStyle?: DrawType;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  logoImage,
  logoWidth = 60,
  logoHeight = 60,
  qrStyle = 'dots'
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling>();

  useEffect(() => {
    if (!qrCode.current) {
      const options: QRCodeStylingOptions = {
        width: size,
        height: size,
        data: value,
        dotsOptions: { 
          color: fgColor,
          type: qrStyle 
        },
        backgroundOptions: { color: bgColor },
      };
      
      // Add logo if provided
      if (logoImage) {
        options.image = logoImage;
        options.imageOptions = {
          crossOrigin: 'anonymous',
          margin: 10,
          hideBackgroundDots: true,
          imageSize: 0.3,
          width: logoWidth,
          height: logoHeight
        };
      }
      
      // Import dynamically to prevent SSR issues
      import('qr-code-styling').then(({ default: QRCodeStyling }) => {
        qrCode.current = new QRCodeStyling(options);
        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrCode.current.append(qrRef.current);
        }
      });
    } else {
      qrCode.current.update({ 
        data: value,
        width: size,
        height: size,
        dotsOptions: { color: fgColor },
        backgroundOptions: { color: bgColor },
      });
      
      if (logoImage) {
        qrCode.current.update({
          image: logoImage,
          imageOptions: {
            width: logoWidth,
            height: logoHeight
          }
        });
      }
    }
  }, [value, size, bgColor, fgColor, logoImage, logoWidth, logoHeight, qrStyle]);

  return <div ref={qrRef} />;
};

export default QRCode;
