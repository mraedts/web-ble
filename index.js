const POWER_SERVICE = 'cycling_power';
const POWER_MEASUREMENT = 'cycling_power_measurement';
const POWER_CONTROL = 'cycling_power_control_point';
const HEART_RATE_SERVICE = 'heart_rate';
const HEART_RATE_MEASUREMENT = 'heart_rate_measurement';
const FITNESS_MACHINE_SERVICE = 'fitness_machine';
const FITNESS_CONTROL_POINT = 'fitness_machine_control_point';
const BIKE_DATA = 'indoor_bike_data';

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
      filters: [{ services: [FITNESS_MACHINE_SERVICE] }]
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

    const service = await server.getPrimaryService(FITNESS_MACHINE_SERVICE);
    console.log('Retrieving GATT Characteristic...');

    const characteristic = await service.getCharacteristic(BIKE_DATA);

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
      console.log(value);
    }
  } catch (err) {
    throw err;
  }
}

function parseBleData(dataView) {
  let result = {};

  result.instantPower = dataView.getInt16(1);

  return result;
}

async function main() {
  if (!navigator.bluetooth) {
    window.alert('Bluetooth is not available.');
    return;
  }
}

main();

button.addEventListener('click', () => {});
