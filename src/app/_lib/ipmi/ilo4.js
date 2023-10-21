import * as snmp from "snmp-native";
import {
  MemoryStatus,
  MemoryTechnology,
  MemoryType,
  PSUStatus,
  ProcessorDesigner,
  ProcessorStatus,
  SystemFormFactor,
  TempLocation,
  TempStatus,
} from "./enums";

function hexToMacAddress(hexString) {
  if (hexString.length !== 12) {
    throw new Error("Invalid MAC address length");
  }
  //@ts-ignore
  const macAddress = hexString.match(/.{2}/g).join(":");
  return macAddress.toLowerCase(); // Convert to lowercase if needed
}

export class ILO4SNMPSession {
  constructor(config) {
    this.session = new snmp.Session(config);
  }
  /**
   * Returns system info about the device.
   * @returns {Promise<import('./types').SystemInformation>}
   */
  getSystemInfo() {
    return new Promise((resolve, reject) => {
      var oids = [
        `.1.3.6.1.2.1.1.1.0`, // sysDesc
        `.1.3.6.1.2.1.1.5.0`, // sysName
        `.1.3.6.1.4.1.232.2.2.4.2.0`, // model
        `.1.3.6.1.4.1.232.2.2.2.1.0`, // serialNo
        `.1.3.6.1.4.1.232.2.2.2.2.0`, // formFactor
        `.1.3.6.1.4.1.232.2.2.2.3.0`, // assetTag
        `.1.3.6.1.4.1.232.2.2.2.6.0`, // prodId
        `.1.3.6.1.4.1.232.9.2.5.1.1.4.2`, // iloMac
        `.1.3.6.1.4.1.232.9.2.5.1.1.5.2`, // iloIp
        `.1.3.6.1.4.1.232.9.2.5.1.1.6.2`, // iloSubnetMask
        `.1.3.6.1.4.1.232.9.2.5.1.1.13.2`, // iloGateway4
        `.1.3.6.1.4.1.232.9.2.5.1.1.9.2`, // iloSpeed
        `.1.3.6.1.4.1.232.9.2.5.1.1.10.2`, // iloDHCP
        `.1.3.6.1.4.1.232.9.2.5.1.1.14.2`, // iloDnsName
      ];
      this.session.getAll({ oids }, (err, varbinds) => {
        if (err) return reject(err);
        var [
          sysDesc,
          sysName,
          model,
          serialNo,
          formFactor,
          assetTag,
          prodId,
          iloMac,
          iloIp,
          iloSubnetMask,
          iloGateway4,
          iloSpeed,
          iloDHCP,
          iloDnsName,
        ] = varbinds.map((s, i) => {
          if (i == 7) {
            return s.valueHex;
          }
          return s.value;
        });
        resolve({
          sysDesc,
          sysName,
          model,
          serialNo,
          formFactor: SystemFormFactor[formFactor],
          assetTag,
          prodId,
          iloMac: hexToMacAddress(iloMac),
          iloIp: iloIp.join("."),
          iloSubnetMask: iloSubnetMask.join("."),
          iloGateway4: iloGateway4.join("."),
          iloSpeed,
          iloDHCP: iloDHCP == 2,
          iloDnsName,
        });
      });
    });
  }
  /**
   * @returns {import("./types").Processor[]}
   */
  getProcessors() {
    return new Promise(async (resolve, reject) => {
      var oids = [
        `.1.3.6.1.4.1.232.1.2.2.1.1.3`, // name
        `.1.3.6.1.4.1.232.1.2.2.1.1.4`, // speed
        `.1.3.6.1.4.1.232.1.2.2.1.1.6`, // status
        `.1.3.6.1.4.1.232.1.2.2.1.1.8`, // designer
        `.1.3.6.1.4.1.232.1.2.2.1.1.9`, // socket
        `.1.3.6.1.4.1.232.1.2.2.1.1.24`, // multithreading
        `.1.3.6.1.4.1.232.1.2.2.1.1.25`, // threads
        `.1.3.6.1.4.1.232.1.2.2.1.1.15`, // cores
      ];
      var res = [];
      var i = 0;
      for await (const oid of oids) {
        await new Promise((resolve, reject) => {
          this.session.getSubtree({ oid }, (err, varbind) => {
            if (err) {
              reject(err);
            } else {
              varbind.forEach((bind, ii) => {
                switch (i) {
                  case 0:
                    res[ii] = {};
                    res[ii].name = bind.value;
                    break;
                  case 1:
                    res[ii].speed = bind.value;
                    break;
                  case 2:
                    res[ii].status = bind.value;
                    break;
                  case 3:
                    res[ii].designer = bind.value;
                    break;
                  case 4:
                    res[ii].socket = bind.value;
                    break;
                  case 5:
                    res[ii].multithreading = bind.value;
                    break;
                  case 6:
                    res[ii].threads = bind.value;
                    break;
                  case 7:
                    res[ii].cores = bind.value;
                    break;
                  default:
                    break;
                }
              });
              i++;
              resolve(void 0);
            }
          });
        });
      }
      resolve(
        res.map(
          ({
            name,
            speed,
            status,
            designer,
            socket,
            multithreading,
            threads,
            cores,
          }) => {
            return {
              name,
              speed,
              status: ProcessorStatus[status],
              designer: ProcessorDesigner[designer],
              socket,
              multithreading: multithreading == 2,
              threads,
              cores,
            };
          }
        )
      );
    });
  }
  /**
   * @returns {import("./types").TempSensor[]}
   */
  getTemperature() {
    return new Promise(async (resolve, reject) => {
      var oids = [
        `.1.3.6.1.4.1.232.6.2.6.8.1.4.0`, // tempCelsius
        `.1.3.6.1.4.1.232.6.2.6.8.1.3.0`, // location
        `.1.3.6.1.4.1.232.6.2.6.8.1.5.0`, // threshold
        `.1.3.6.1.4.1.232.6.2.6.8.1.6.0`, // status
      ];
      var res = [];
      var i = 0;
      for await (const oid of oids) {
        await new Promise((resolve, reject) => {
          this.session.getSubtree({ oid }, (err, varbind) => {
            if (err) {
              reject(err);
            } else {
              varbind.forEach((bind, ii) => {
                switch (i) {
                  case 0:
                    res[ii] = {};
                    res[ii].tempCelsius = bind.value;
                    break;
                  case 1:
                    res[ii].location = bind.value;
                    break;
                  case 2:
                    res[ii].threshold = bind.value;
                    break;
                  case 3:
                    res[ii].status = bind.value;
                    break;
                  default:
                    break;
                }
              });
              i++;
              resolve(void 0);
            }
          });
        });
      }
      resolve(
        res.map(({ tempCelsius, location, threshold, status }) => {
          return {
            tempCelsius,
            location: TempLocation[location],
            threshold,
            status: TempStatus[status],
          };
        })
      );
    });
  }
  /**
   * @returns {import("./types").MemoryModule[]}
   */
  getMemory() {
    return new Promise(async (resolve, reject) => {
      var oids = [
        `.1.3.6.1.4.1.232.6.2.14.13.1.3`, // cpu
        `.1.3.6.1.4.1.232.6.2.14.13.1.5`, // moduleIndex
        `.1.3.6.1.4.1.232.6.2.14.13.1.6`, // size
        `.1.3.6.1.4.1.232.6.2.14.13.1.7`, // type
        `.1.3.6.1.4.1.232.6.2.14.13.1.8`, // technology
        `.1.3.6.1.4.1.232.6.2.14.13.1.9`, // manufacturer
        `.1.3.6.1.4.1.232.6.2.14.13.1.13`, // location
        `.1.3.6.1.4.1.232.6.2.14.13.1.14`, // frequency
        `.1.3.6.1.4.1.232.6.2.14.13.1.19`, // status
      ];
      var res = [];
      var i = 0;
      for await (const oid of oids) {
        await new Promise((resolve, reject) => {
          this.session.getSubtree({ oid }, (err, varbind) => {
            if (err) {
              reject(err);
            } else {
              varbind.forEach((bind, ii) => {
                switch (i) {
                  case 0:
                    res[ii] = {};
                    res[ii].cpu = bind.value;
                    break;
                  case 1:
                    res[ii].moduleIndex = bind.value;
                    break;
                  case 2:
                    res[ii].size = bind.value;
                    break;
                  case 3:
                    res[ii].type = bind.value;
                    break;
                  case 4:
                    res[ii].technology = bind.value;
                    break;
                  case 5:
                    res[ii].manufacturer = bind.value;
                    break;
                  case 6:
                    res[ii].location = bind.value;
                    break;
                  case 7:
                    res[ii].frequency = bind.value;
                    break;
                  case 8:
                    res[ii].status = bind.value;
                    break;
                  default:
                    break;
                }
              });
              i++;
              resolve(void 0);
            }
          });
        });
      }
      resolve(
        res.map(
          ({
            cpu,
            moduleIndex,
            size,
            type,
            technology,
            manufacturer,
            location,
            frequency,
            status,
          }) => {
            return {
              cpu,
              moduleIndex,
              size,
              type: MemoryType[type],
              technology: MemoryTechnology[technology],
              manufacturer,
              location,
              frequency,
              status: MemoryStatus[status],
            };
          }
        )
      );
    });
  }
  /**
   * @returns {Promise<import("./types").PowerSupply[]>}
   */
  getPowerSupplies() {
    return new Promise(async (resolve, reject) => {
      var oids = [
        `.1.3.6.1.4.1.232.6.2.9.3.1.2.0`, // bay
        `.1.3.6.1.4.1.232.6.2.9.3.1.3.0`, // present
        `.1.3.6.1.4.1.232.6.2.9.3.1.5.0`, // status
        `.1.3.6.1.4.1.232.6.2.9.3.1.6.0`, // voltage
        `.1.3.6.1.4.1.232.6.2.9.3.1.7.0`, // capacityUsed
        `.1.3.6.1.4.1.232.6.2.9.3.1.8.0`, // capacityMax
        `.1.3.6.1.4.1.232.6.2.9.3.1.9.0`, // redundant
        `.1.3.6.1.4.1.232.6.2.9.3.1.10.0`, // model
        `.1.3.6.1.4.1.232.6.2.9.3.1.11.0`, // serialNo
        `.1.3.6.1.4.1.232.6.2.9.3.1.13.0`, // hotpluggable
      ];
      var res = [];
      var i = 0;
      for await (const oid of oids) {
        await new Promise((resolve, reject) => {
          this.session.getSubtree({ oid }, (err, varbind) => {
            if (err) {
              reject(err);
            } else {
              varbind.forEach((bind, ii) => {
                switch (i) {
                  case 0:
                    res[ii] = {};
                    res[ii].bay = bind.value;
                    break;
                  case 1:
                    res[ii].present = bind.value;
                    break;
                  case 2:
                    res[ii].status = bind.value;
                    break;
                  case 3:
                    res[ii].voltage = bind.value;
                    break;
                  case 4:
                    res[ii].capacityUsed = bind.value;
                    break;
                  case 5:
                    res[ii].capacityMax = bind.value;
                    break;
                  case 6:
                    res[ii].redundant = bind.value;
                    break;
                  case 7:
                    res[ii].model = bind.value;
                    break;
                  case 8:
                    res[ii].serialNo = bind.value;
                    break;
                  case 9:
                    res[ii].hotpluggable = bind.value;
                    break;
                  default:
                    break;
                }
              });
              i++;
              resolve(void 0);
            }
          });
        });
      }
      resolve(
        res.map(
          ({
            bay,
            present,
            status,
            voltage,
            capacityUsed,
            capacityMax,
            redundant,
            model,
            serialNo,
            hotpluggable,
          }) => {
            return {
              bay,
              present: present == 3,
              status: PSUStatus[status],
              voltage,
              capacityUsed,
              capacityMax,
              redundant: redundant == 3,
              model: model.trim(),
              serialNo: serialNo.trim(),
              hotpluggable: hotpluggable == 3,
            };
          }
        )
      );
    });
  }
  close() {
    return this.session.close();
  }
}
