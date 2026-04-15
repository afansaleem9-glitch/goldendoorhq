import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'call-log': {
      const data = [
        { id: 'cl-1', direction: 'Outbound', from: '+17135550142', to: '+18325551234', duration: 342, result: 'Call connected', startTime: '2026-04-14T14:23:00Z', recording: true, contact: 'Robert Garcia' },
        { id: 'cl-2', direction: 'Inbound', from: '+16145550198', to: '+18005551000', duration: 187, result: 'Call connected', startTime: '2026-04-14T13:45:00Z', recording: true, contact: 'Jennifer Williams' },
        { id: 'cl-3', direction: 'Outbound', from: '+17135550142', to: '+13135550267', duration: 0, result: 'No answer', startTime: '2026-04-14T12:30:00Z', recording: false, contact: 'Michael Thompson' },
        { id: 'cl-4', direction: 'Outbound', from: '+17135550142', to: '+12815550334', duration: 523, result: 'Call connected', startTime: '2026-04-14T11:15:00Z', recording: true, contact: 'Daniel Martinez' },
        { id: 'cl-5', direction: 'Inbound', from: '+14195550478', to: '+18005551000', duration: 98, result: 'Call connected', startTime: '2026-04-14T10:02:00Z', recording: false, contact: 'Brian Henderson' },
        { id: 'cl-6', direction: 'Outbound', from: '+17135550142', to: '+18325550512', duration: 445, result: 'Call connected', startTime: '2026-04-13T16:30:00Z', recording: true, contact: 'Christopher Baker' },
        { id: 'cl-7', direction: 'Outbound', from: '+17135550142', to: '+17345550641', duration: 267, result: 'Call connected', startTime: '2026-04-13T15:00:00Z', recording: true, contact: 'James Nguyen' },
        { id: 'cl-8', direction: 'Inbound', from: '+12815550789', to: '+18005551000', duration: 0, result: 'Missed', startTime: '2026-04-13T14:12:00Z', recording: false, contact: 'William Davis' },
      ];
      return NextResponse.json({ data, total: data.length, source: 'ringcentral' });
    }
    case 'sms-log': {
      const data = [
        { id: 'sms-1', direction: 'Outbound', from: '+18005551000', to: '+17135550142', message: 'Hi Robert, your solar project has moved to NTP stage!', timestamp: '2026-04-14T14:30:00Z', status: 'Delivered', contact: 'Robert Garcia' },
        { id: 'sms-2', direction: 'Inbound', from: '+16145550198', to: '+18005551000', message: 'When will someone come for the site survey?', timestamp: '2026-04-14T13:50:00Z', status: 'Received', contact: 'Jennifer Williams' },
        { id: 'sms-3', direction: 'Outbound', from: '+18005551000', to: '+12815550334', message: 'SiteCapture photos received. Moving to next stage.', timestamp: '2026-04-14T11:20:00Z', status: 'Delivered', contact: 'Daniel Martinez' },
      ];
      return NextResponse.json({ data, total: data.length, source: 'ringcentral' });
    }
    case 'extensions': {
      const data = [
        { id: 'ext-101', name: 'Marcus Johnson', extension: '101', status: 'Online', department: 'Sales - TX' },
        { id: 'ext-102', name: 'Sarah Chen', extension: '102', status: 'On Call', department: 'Sales - TX' },
        { id: 'ext-103', name: 'David Park', extension: '103', status: 'Online', department: 'Sales - MI' },
        { id: 'ext-104', name: 'James Wright', extension: '104', status: 'Away', department: 'Sales - OH' },
        { id: 'ext-105', name: 'Afan Saleem', extension: '100', status: 'Online', department: 'Executive' },
      ];
      return NextResponse.json({ data, total: data.length, source: 'ringcentral' });
    }
    default:
      return NextResponse.json({ error: 'Use ?action=call-log|sms-log|extensions' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'ringout': {
      const { from, to } = body;
      return NextResponse.json({ success: true, data: { id: 'ro-' + Date.now(), status: 'InProgress', from, to, startTime: new Date().toISOString() } });
    }
    case 'send-sms': {
      const { from, to, text } = body;
      return NextResponse.json({ success: true, data: { id: 'sms-' + Date.now(), from, to, text, status: 'Queued', timestamp: new Date().toISOString() } });
    }
    default:
      return NextResponse.json({ error: 'Use action: ringout | send-sms' }, { status: 400 });
  }
}
