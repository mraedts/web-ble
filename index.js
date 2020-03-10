const POWER_SERVICE = '0x1818';

const POWER_MEASUREMENT = '0x2A63';

const POWER_CONTROL = '0x2A66';

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
    const options = {
      acceptAllDevices: true
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
