import { BitrixWebhook } from '@/types';
import { getBitrixWebhookUrl } from '@/config/bitrix';

class BitrixService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = getBitrixWebhookUrl();
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

    const fullUrl = `${this.webhookUrl}/${method}`;
    console.log('🌐 Отправляем запрос в Битрикс24:', {
      url: fullUrl,
      method: 'POST',
      data: data
    });

    try {
      // Преобразуем данные в правильный формат для Битрикс24
      const formData = new URLSearchParams();
      
      // Если есть fields, обрабатываем их отдельно
      if (data.fields) {
        Object.entries(data.fields).forEach(([key, value]) => {
          formData.append(`fields[${key}]`, String(value));
        });
      }
      
      // Добавляем остальные параметры
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'fields') {
          formData.append(key, String(value));
        }
      });

      console.log('📤 Отправляемые данные:', formData.toString());

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      console.log('📡 Ответ от Битрикс24:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Ошибка ответа от Битрикс24:', errorText);
        throw new Error(`Bitrix API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Успешный ответ от Битрикс24:', result);
      return result;
    } catch (error) {
      console.error('❌ Ошибка отправки данных в Битрикс24:', error);
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
    console.log('📞 Отправляем запрос в Битрикс24 для создания контакта:', {
      method: 'crm.contact.add',
      data: contactData,
      webhookUrl: this.webhookUrl
    });
    
    // Формируем данные в правильном формате для Битрикс24
    const result = await this.sendToBitrix('crm.contact.add', {
      fields: {
        NAME: contactData.name,
        LAST_NAME: contactData.lastName,
        EMAIL: contactData.email ? [{ VALUE: contactData.email, VALUE_TYPE: 'WORK' }] : undefined,
        PHONE: contactData.phone ? [{ VALUE: contactData.phone, VALUE_TYPE: 'WORK' }] : undefined,
        SOURCE_ID: contactData.sourceId || 'WEB'
      }
    });
    
    console.log('📞 Ответ от Битрикс24:', result);
    return result;
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

  async updateDeal(dealId: number, dealData: any) {
    console.log('🔄 Обновляем сделку в Битрикс24:', { dealId, dealData });
    
    const result = await this.sendToBitrix('crm.deal.update', {
      id: dealId,
      fields: dealData
    });
    
    console.log('✅ Сделка обновлена:', result);
    return result;
  }
}

const bitrixService = new BitrixService();

export default bitrixService;
