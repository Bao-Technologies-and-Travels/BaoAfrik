import React, { useEffect, useState } from 'react';

interface MustUsersArcProps {
  percentage?: number;
  users?: number;
  width?: number;
}

const MustUsersArc: React.FC<MustUsersArcProps> = ({
  percentage = 67.56,
  users = 104,
  width = 280
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const totalBars = 13;
  const filledBars = Math.floor((percentage / 100) * totalBars);
  const partialBarProgress = ((percentage / 100) * totalBars) - filledBars;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setAnimatedPercentage(percentage);
        clearInterval(timer);
      } else {
        setAnimatedPercentage(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [percentage]);

  const currentFilledBars = Math.floor((animatedPercentage / 100) * totalBars);
  const currentPartialProgress = ((animatedPercentage / 100) * totalBars) - currentFilledBars;

  // SVG paths from bar1.svg (filled) and bar2.svg (unfilled)
  const filledBarPath =
    "M7.88646 0.109009C4.63222 -0.515968 1.47175 1.61414 1.01088 4.89565C0.522854 8.37051 0.188118 11.8652 0.00764532 15.3695C-0.162785 18.6788 2.53587 21.3701 5.84958 21.3743L44.9405 21.423C48.2542 21.4271 50.9165 18.7391 51.2109 15.4384C51.2374 15.1414 51.2658 14.8445 51.2962 14.5477C51.6337 11.2513 49.5301 8.10672 46.2758 7.48174L7.88646 0.109009Z";
  const unfilledBarPath =
    "M45.4727 21.375C48.7864 21.375 51.4884 18.687 51.3221 15.3775C51.146 11.873 50.8156 8.37788 50.3319 4.90241C49.8751 1.62034 46.7173 -0.51371 43.4623 0.107224L5.06372 7.43213C1.80872 8.05306 -0.298859 11.195 0.0345459 14.4919C0.0645599 14.7886 0.0926361 15.0856 0.118759 15.3827C0.409027 18.6837 3.06801 21.375 6.38171 21.375H45.4727Z";

  // 4-color gradient for filled bars
  const getBarColor = (index: number, isFilled: boolean): string => {
    if (!isFilled) return '#F4F4F4';

    const progress = index / (filledBars - 1 || 1);
    if (progress < 0.33) return '#83C4F8';
    if (progress < 0.67) return '#B8DDFB';
    return '#CFE8FC';
  };

  // Original arc parameters
  const centerX = width / 2;
  const centerY = width * 0.85;
  const radius = width * 0.42;

  const getBarTransform = (index: number) => {
    // 180° arc with 13 bars and increased gaps between them
    // Spread bars out more to create visible gaps
    const angleStep = 180 / (totalBars - 1);
    const angleDeg = -180 + (index * angleStep);
    const angleRad = angleDeg * (Math.PI / 180);

    // Position along semi-circle arc
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);

    // Bars oriented radially outward from center
    return { x, y, rotation: angleDeg };
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: `${width}px` }}>
      <svg
        width={width}
        height={width * 0.75}
        className="relative"
        style={{ overflow: 'visible' }}
      >
        {Array.from({ length: totalBars }).map((_, index) => {
          const isFilled = index < currentFilledBars;
          const isPartial = index === currentFilledBars && currentPartialProgress > 0;
          const { x, y, rotation } = getBarTransform(index);

          // Transform: move to arc point -> rotate -> move path center to origin -> scale down bars
          const transform = `translate(${x}, ${y}) rotate(${rotation}) translate(-26, -11) scale(0.65)`;

          const barColor = getBarColor(index, isFilled || isPartial);
          // Use unfilledBarPath for ALL bars to ensure identical orientation, spacing, and placement
          // Only the color differs between filled (blue) and unfilled (gray) bars
          const barPath = unfilledBarPath;

          return (
            <g key={index} transform={transform}>
              {isPartial ? (
                <>
                  <path d={unfilledBarPath} fill="#F4F4F4" stroke="#E5E7EB" strokeWidth="0.5" />
                  <g>
                    <defs>
                      <clipPath id={`partial-clip-${index}`}>
                        <rect x="0" y="0" width="52" height={22 * currentPartialProgress} />
                      </clipPath>
                    </defs>
                    <path
                      d={unfilledBarPath}
                      fill={barColor}
                      clipPath={`url(#partial-clip-${index})`}
                    />
                  </g>
                </>
              ) : (
                <path
                  d={barPath}
                  fill={barColor}
                  stroke={!isFilled ? '#E5E7EB' : 'none'}
                  strokeWidth={!isFilled ? '0.5' : '0'}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center Text - Percentage */}
      <div
        className="absolute"
        style={{
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}
      >
        <p
          className="font-bold text-[#212121] mb-1"
          style={{
            fontSize: '1rem',
            fontFamily: 'Bricolage Grotesque, sans-serif',
            lineHeight: '1.1',
            margin: 0
          }}
        >
          {percentage.toFixed(2)}%
        </p>
        <p
          className="text-[#B0B0B0]"
          style={{
            fontSize: '0.65rem',
            fontFamily: 'Poppins, sans-serif',
            marginTop: '4px',
            marginBottom: '16px'
          }}
        >
          Must users: {users}
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4" style={{ marginTop: '48px' }}>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full" style={{ width: '8px', height: '8px', backgroundColor: '#83C4F8' }} />
          <span className="text-[#9C9C9C]" style={{ fontSize: '0.6rem', fontFamily: 'Poppins, sans-serif' }}>
            United Kingdom
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="rounded-full"
            style={{ width: '8px', height: '8px', backgroundColor: '#F4F4F4', border: '1px solid #E5E7EB' }}
          />
          <span className="text-[#9C9C9C]" style={{ fontSize: '0.6rem', fontFamily: 'Poppins, sans-serif' }}>
            Other countries
          </span>
        </div>
      </div>
    </div>
  );
};

export default MustUsersArc;
