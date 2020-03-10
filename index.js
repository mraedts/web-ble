const POWER_SERVICE = 'cycling_power';
const POWER_MEASUREMENT = 'cycling_power_measurement';
const POWER_CONTROL = 'cycling_power_control_point';
const HEART_RATE_SERVICE = 'heart_rate';
const HEART_RATE_MEASUREMENT = 'heart_rate_measurement';

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
      filters: [{ services: [HEART_RATE_SERVICE] }]
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
    connectGATT();
  }
}

async function connectGATT() {
  try {
    const server = await bluetoothDevice.gatt.connect();
    console.log('Connecting to GATT protocol...');

    const service = await server.getPrimaryService(HEART_RATE_SERVICE);
    console.log('Retrieving GATT Characteristic...');

    const characteristic = service.getCharacteristic(HEART_RATE_MEASUREMENT);

    console.log('Setting Characteristic listener...');
    gattCharacteristic = characteristic;
    gattCharacteristic.addEventListener(
      'characteristicvaluechanged',
      handleValueChange
    );

    function handleValueChange(event) {
      let value = event.target.value.getUint8(0);
      console.log(value);
    }
  } catch (err) {
    throw err;
  }
}

async function main() {
  if (!navigator.bluetooth) {
    window.alert('Bluetooth is not available.');
    return;
  }
}

main();

function onReadBatteryLevelButtonClick() {
  return (bluetoothDevice ? Promise.resolve() : requestDevice())
    .then(_ => {
      log('Reading Battery Level...');
      return gattCharacteristic.readValue();
    })
    .catch(error => {
      log('Argh! ' + error);
    });
}

power.addEventListener('click', () => {
  onReadBatteryLevelButtonClick();
});
