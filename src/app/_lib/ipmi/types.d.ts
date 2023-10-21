import type {
  SystemFormFactor,
  PSUStatus,
  MemoryStatus,
  MemoryTechnology,
  MemoryType,
  TempLocation,
  TempStatus,
  ProcessorDesigner,
  ProcessorStatus,
} from "./enums";

export interface SystemInformation {
  sysDesc: string;
  sysName: string;
  iloMac: string;
  iloIp: string;
  iloSubnetMask: string;
  iloGateway4: string;
  iloSpeed: number;
  iloDHCP: boolean;
  iloDnsName: string;
  model: string;
  serialNo: string;
  formFactor: keyof typeof SystemFormFactor;
  assetTag: string;
  prodId: string;
}

export interface PowerSupply {
  bay: number;
  present: boolean;
  status: keyof typeof PSUStatus;
  voltage: number;
  capacityUsed: number;
  capacityMax: number;
  redundant: boolean;
  model: string;
  serialNo: string;
  hotpluggable: boolean;
}
export interface MemoryModule {
  cpu: number;
  moduleIndex: number;
  size: number;
  type: keyof typeof MemoryType;
  technology: keyof typeof MemoryTechnology;
  manufacturer: string;
  location: string;
  frequency: number;
  status: keyof typeof MemoryStatus;
}
export interface TempSensor {
  tempCelsius: number;
  location: keyof typeof TempLocation;
  threshold: number;
  status: keyof typeof TempStatus;
}
export interface Processor {
  name: string;
  speed: number;
  status: keyof typeof ProcessorStatus;
  designer: keyof typeof ProcessorDesigner;
  socket: number;
  multithreading: boolean;
  threads: number;
  cores: number;
}
