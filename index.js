const POWER_SERVICE = 'cycling_power';
const POWER_MEASUREMENT = 'cycling_power_measurement';
const POWER_CONTROL = 'cycling_power_control_point';
const HEART_RATE_SERVICE = 'heart_rate';
const HEART_RATE_MEASUREMENT = 'heart_rate_measurement';

const button = document.getElementById('textbutton');
const power = document.getElementById('power');

let bluetoothDevice;

let gattCharacteristic;

let tempval;

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
    connectGATT();
  }
}

async function connectGATT() {
  try {
    const server = await bluetoothDevice.gatt.connect();
    console.log('Connecting to GATT protocol...');

    const service = await server.getPrimaryService(POWER_SERVICE);
    console.log('Retrieving GATT Characteristic...');

    const characteristic = await service.getCharacteristic(POWER_MEASUREMENT);

    console.log('Setting Characteristic listener...');
    characteristic.startNotifications();
    characteristic.addEventListener(
      'characteristicvaluechanged',
      handleValueChange
    );

    gattCharacteristic = characteristic;

    function handleValueChange(event) {
      let value = event.target.value;
      power.textContent = value.getInt16(1);
    }
  } catch (err) {
    throw err;
  }
}

function parseBleData() {}

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
