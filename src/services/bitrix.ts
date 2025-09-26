import { BitrixWebhook } from '@/types';

class BitrixService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = 'https://b24-lfbuj2.bitrix24.kz/rest/1/ziht4f6iu0rv7myc';
  }

  async handleWebhook(webhookData: BitrixWebhook) {
    try {
      console.log('Received Bitrix webhook:', webhookData);

      switch (webhookData.event) {
        case 'ONCRMDEALADD':
          return await this.handleDealAdd(webhookData.data);
        case 'ONCRMDEALUPDATE':
          return await this.handleDealUpdate(webhookData.data);
        case 'ONCRMLEADADD':
          return await this.handleLeadAdd(webhookData.data);
        case 'ONCRMLEADUPDATE':
          return await this.handleLeadUpdate(webhookData.data);
        default:
          console.log('Unknown webhook event:', webhookData.event);
          return { success: true, message: 'Event not handled' };
      }
    } catch (error) {
      console.error('Error handling Bitrix webhook:', error);
      throw error;
    }
  }

  private async handleDealAdd(data: any) {
    console.log('New deal added:', data);
    
    
    return {
      success: true,
      message: 'Deal add event processed',
      data: data
    };
  }

  private async handleDealUpdate(data: any) {
    console.log('Deal updated:', data);
    

    
    return {
      success: true,
      message: 'Deal update event processed',
      data: data
    };
  }

  private async handleLeadAdd(data: any) {
    console.log('New lead added:', data);
    
    return {
      success: true,
      message: 'Lead add event processed',
      data: data
    };
  }

  private async handleLeadUpdate(data: any) {
    console.log('Lead updated:', data);
    
    return {
      success: true,
      message: 'Lead update event processed',
      data: data
    };
  }

  async sendToBitrix(method: string, data: any) {
    if (!this.webhookUrl) {
      throw new Error('Bitrix webhook URL not configured');
    }

    try {
      const response = await fetch(`${this.webhookUrl}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ...data
        }),
      });

      if (!response.ok) {
        throw new Error(`Bitrix API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending data to Bitrix:', error);
      throw error;
    }
  }

  async createDeal(dealData: {
    title: string;
    stageId: string;
    opportunity: number;
    currencyId: string;
    contactId?: number;
    companyId?: number;
  }) {
    return await this.sendToBitrix('crm.deal.add', {
      fields: dealData
    });
  }

  async createLead(leadData: {
    title: string;
    name: string;
    lastName: string;
    phone?: string;
    email?: string;
    sourceId?: string;
  }) {
    return await this.sendToBitrix('crm.lead.add', {
      fields: leadData
    });
  }

  async createContact(contactData: {
    name: string;
    lastName: string;
    email?: string;
    phone?: string;
    sourceId?: string;
  }) {
    return await this.sendToBitrix('crm.contact.add', {
      fields: contactData
    });
  }

  async getDeals(filter?: any) {
    return await this.sendToBitrix('crm.deal.list', {
      filter: filter || {},
      select: ['*', 'UF_*']
    });
  }

  async getLeads(filter?: any) {
    return await this.sendToBitrix('crm.lead.list', {
      filter: filter || {},
      select: ['*', 'UF_*']
    });
  }

  async getContacts(filter?: any) {
    return await this.sendToBitrix('crm.contact.list', {
      filter: filter || {},
      select: ['*', 'UF_*']
    });
  }

  async updateContact(contactId: number, contactData: any) {
    return await this.sendToBitrix('crm.contact.update', {
      id: contactId,
      fields: contactData
    });
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    responsibleId?: number;
    deadline?: string;
    entityTypeId?: number;
    entityId?: number;
  }) {
    return await this.sendToBitrix('tasks.task.add', {
      fields: taskData
    });
  }

  async getUsers() {
    return await this.sendToBitrix('user.get', {
      filter: { 'ACTIVE': 'Y' }
    });
  }

  async getDealStages() {
    return await this.sendToBitrix('crm.dealcategory.stage.list', {});
  }
}

const bitrixService = new BitrixService();

export default bitrixService;
