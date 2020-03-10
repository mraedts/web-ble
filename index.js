const POWER_SERVICE = 'cycling_power';

const POWER_MEASUREMENT = 'cycling_power_measurement';

const POWER_CONTROL = 'cycling_power_control_point';

const HEART_RATE = 'heart_rate';

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
      filters: [{ services: [HEART_RATE] }]
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
    await connectGATT();
  }
}

async function connectGATT() {
  //
  try {
    return bluetoothDevice.gatt
      .connect()
      .then(server => {
        console.log('Connecting to GATT protocol...');
        return server.getPrimaryService(HEART_RATE);
      })
      .then(service => {
        console.log('Retrieving GATT Characteristic...');
        return service.getCharacteristic(HEART_RATE_MEASUREMENT);
      })
      .then(characteristic => {
        console.log('Setting Characteristic listener...');
        console.log(characteristic.value.getUint8(0));
        gattCharacteristic = characteristic;
        gattCharacteristic.addEventListener(
          'characteristicvaluechanged',
          handleValueChange
        );
      });

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

  await getDevice();
  read();
}

main();
