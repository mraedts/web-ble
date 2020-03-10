const POWER_SERVICE = 'org.bluetooth.service.cycling_power';

const POWER_MEASUREMENT =
  'org.bluetooth.characteristic.cycling_power_measurement';

const POWER_CONTROL =
  'org.bluetooth.characteristic.cycling_power_control_point';

const button = document.getElementById('textbutton');
const power = document.getElementById('power')

let bluetoothDevice;

let gattCharacteristic;

function BLEIsAvailable() {
  if (navigator.bluetooth) return true;
  return false;
}

async function getDevice() {
  try {
    const params = {
      returnAllDevices: true
    };

    const device = await navigator.bluetooth.requestDevice(params);
    bluetoothDevice = device;
  } catch (err) {
    throw err;
  }
}


function read() {
  if (bluetoothDevice != undefined) {
    const connection = await bluetoothDevice.connectGATT()    

  }
}


function connectGATT() {

  return bluetoothDevice.gatt.connected()
    .then(server => {
    console.log('Connecting to GATT protocol...')
      return server.getPrimaryService(POWER_SERVICE)
    })
    .then(service => {
      return service.getCharacteristic(POWER_MEASUREMENT)
    })
    .then(characteristic => {
      gattCharacteristic = characteristic
      gattCharacteristic.addEventListener('characteristicvaluechanged', char => {
        power.textContent = char.toString()
      })

    })
}

