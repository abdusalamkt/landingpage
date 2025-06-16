'use client';

import Image from 'next/image';
import './service.css';

const items = [
  {
    number: '1',
    title: 'EXTEND LIFESPAN',
    description:
      'Routine servicing preserves the integrity and performance of your partitions, adding years to their usability.',
    position: 'top-center',
    level: 1
  },
  {
    number: '2',
    title: 'ENSURE SAFETY',
    description:
      'Well-maintained systems protect your staff, clients, and visitors from mechanical failure or injury.',
    position: 'left-top',
    level: 1
  },
  {
    number: '3',
    title: 'BOOST EFFICIENCY',
    description:
      'Regular maintenance ensures smooth, hassle-free operation for daily use and quick transitions.',
    position: 'right-top',
    level: 1
  },
  {
    number: '4',
    title: 'CATCH ISSUES EARLY',
    description:
      'Identifying minor damages early prevents costly repairs and unexpected downtime later on.',
    position: 'left-center',
    level: 2
  },
  {
    number: '5',
    title: 'MONITOR CONDITION',
    description:
      'Scheduled checks track wear and usage, giving insight into your partition\'s long-term health.',
    position: 'right-center',
    level: 2
  },
  {
    number: '6',
    title: 'PREVENT EMERGENCIES',
    description:
      'Proactive care drastically reduces the chance of sudden malfunctions or disruptions.',
    position: 'left-bottom',
    level: 3
  },
  {
    number: '7',
    title: 'MAINTAIN ACOUSTICS',
    description:
      'Proper servicing safeguards sound insulation levels, keeping spaces quiet and productive.',
    position: 'right-bottom',
    level: 3
  },
  {
    number: '8',
    title: 'PROTECT YOUR INVESTMENT',
    description:
      'Regular servicing maximizes the return on your partition systems by maintaining quality and performance over time.',
    position: 'bottom-center',
    level: 3
  },
];

export default function ServicePage() {
  return (
    <div className="service-container">
      <div className="service-center">
        {/* Connecting Lines */}
        <svg className="connection-lines" viewBox="0 0 1200 800">
          {/* Level 1 lines (30% height) */}
          <g className="level-1-lines">
            {/* Center point at 30% */}
            {/* <circle cx="600" cy="240" r="4" fill="#000" /> */}
            {/* Line to top-center */}
            <line x1="600" y1="240" x2="600" y2="80" stroke="#000" strokeWidth="2" />
            {/* Line to left-top */}
            <line x1="600" y1="240" x2="200" y2="240" stroke="#000" strokeWidth="2" />
            {/* Line to right-top */}
            <line x1="600" y1="240" x2="1000" y2="240" stroke="#000" strokeWidth="2" />
          </g>
          
          {/* Level 2 lines (50% height) */}
          <g className="level-2-lines">
            {/* Center point at 50% */}
            {/* <circle cx="600" cy="400" r="4" fill="#000" /> */}
            {/* Line to left-center */}
            <line x1="600" y1="400" x2="200" y2="400" stroke="#000" strokeWidth="2" />
            {/* Line to right-center */}
            <line x1="600" y1="400" x2="1000" y2="400" stroke="#000" strokeWidth="2" />
          </g>
          
          {/* Level 3 lines (80% height) */}
          <g className="level-3-lines">
            {/* Center point at 80% */}
            <circle cx="600" cy="640" r="4" fill="#000" />
            {/* Line to left-bottom */}
            <line x1="600" y1="640" x2="200" y2="640" stroke="#000" strokeWidth="2" />
            {/* Line to right-bottom */}
            <line x1="600" y1="640" x2="1000" y2="640" stroke="#000" strokeWidth="2" />
            {/* Line to bottom-center */}
            <line x1="600" y1="640" x2="600" y2="740" stroke="#000" strokeWidth="2" />
          </g>
        </svg>

        <Image
          src="/service.NG"
          alt="Partition Image"
          width={300}
          height={600}
          className="service-image"
        />
        
        {items.map((item, index) => (
          <div key={index} className={`service-item ${item.position} level-${item.level}`}>
            <div className="service-number">{item.number}</div>
            <div className="service-content">
              <div className="service-title">{item.title}</div>
              <div className="service-description">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}