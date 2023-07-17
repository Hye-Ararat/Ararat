export interface LxdStoragePool {
  config?: {
    size?: string;
    source?: string;
  };
  description: string;
  driver: string;
  locations?: string[];
  name: string;
  source?: string;
  status?: string;
  used_by?: string[];
}

export interface LxdStoragePoolResources {
  inodes: {
    used: number;
    total: number;
  };
  space: {
    used: number;
    total: number;
  };
}
export interface LxdVolumeAndState {
  "config": { [key: string]: string };
  "description": string;
  "name": string;
  "type": string;
  "used_by": string[];
  "location": string;
  "content_type": string;
  "project": string;
  "created_at": string;
  "status": {
    "usage": {
      "used": number;
      "total": number;
    }
  };
  "device": {
    "path": string;
    "pool": string;
    "source"?: string;
    "type": string;
  };
  key: string
}
