const POWER_SERVICE = 'cycling_power';

const POWER_MEASUREMENT = 'cycling_power_measurement';

const POWER_CONTROL = 'cycling_power_control_point';

const button = document.getElementById('textbutton');
const power = document.getElementById('power');

let bluetoothDevice;

let gattCharacteristic;

function BLEIsAvailable() {
  if (navigator.bluetooth) return true;
  return false;
}

async function getDevice() {
  try {
    const all = {
      acceptAllDevices: true
    };

    const options = {
      filters: [{ services: [POWER_SERVICE] }]
    };

    navigator.bluetooth.requestDevice(options).then(device => {
      bluetoothDevice = device;
    });
  } catch (err) {
    throw err;
  }
}

async function read() {
  if (bluetoothDevice != undefined) {
    const connection = await bluetoothDevice.connectGATT();
  }
}

function connectGATT() {
  return bluetoothDevice.gatt
    .connect()
    .then(server => {
      console.log('Connecting to GATT protocol...');
      return server.getPrimaryService(POWER_SERVICE);
    })
    .then(service => {
      return service.getCharacteristic(POWER_MEASUREMENT);
    })
    .then(characteristic => {
      gattCharacteristic = characteristic;
      gattCharacteristic.addEventListener(
        'characteristicvaluechanged',
        char => {
          power.textContent = char.toString();
        }
      );
    });
}
