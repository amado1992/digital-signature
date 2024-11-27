export interface ApiClient {
  id?: number;
  created: number;
  enabled: boolean;
  end_date?: number;
  begin_date?: number;
  access_token: null;
  identifier: string;
  description: string;
  name: string;
  operationType?: any
}

export class ApiAssignPermissionClient {
  id_api_client: any
  list_id_permission: any
}