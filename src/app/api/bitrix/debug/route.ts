import { NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';

export async function GET() {
  try {
    // Получаем все возможные данные из Bitrix24
    const [contacts, leads, deals, users] = await Promise.allSettled([
      bitrixService.getContacts(),
      bitrixService.getLeads(),
      bitrixService.getDeals(),
      bitrixService.getUsers()
    ]);

    return NextResponse.json({
      success: true,
      message: 'Bitrix24 debug info',
      data: {
        contacts: contacts.status === 'fulfilled' ? contacts.value : contacts.reason,
        leads: leads.status === 'fulfilled' ? leads.value : leads.reason,
        deals: deals.status === 'fulfilled' ? deals.value : deals.reason,
        users: users.status === 'fulfilled' ? users.value : users.reason,
        webhookUrl: 'https://b24-lfbuj2.bitrix24.kz/rest/1/ziht4f6iu0rv7myc'
      }
    });
  } catch (error) {
    console.error('Bitrix24 debug error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
