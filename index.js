// import { base64ToBlob } from './js/utils/base64.js';
// import { enlargeImage } from './js/utils/enlargeImage';

let urlForZipFile = ''

const urlForSession = 'https://bmrtapplicationdev.appskeeper.in/v1/sessions/session';
const data = {
  "appToken": "0f4365b8-a41d-41c3-80d9-b23bc6e2594f",
  "deviceToken": "qwe123",
};

fetch(urlForSession, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(sessionData => {
    const accessToken = sessionData.result.token;
    console.log(accessToken);

    const urlForIssue = 'https://bmrtapplicationdev.appskeeper.in/v1/issues';

    const dataForIssue = {
      "appInfo": {
        "minSdk": "21",
        "targetSdk": "30",
        "isDebugMode": true,
        "debuggerAttach": false,
        "packageId": "com.example.app",
        "locale": "en_US",
        "buildFlavour": "release",
        "versionCode": "123",
        "versionName": "1.2.3"
      },
      "deviceInfo": {
        "name": "Pixel 4a",
        "manufacturer": "Google",
        "model": "Pixel 4a",
        "deviceId": "12345abcdef",
        "deviceVersion": "Android 12"
      },
      "platform": {
        "isRooted": false,
        "os": "iOS"
      },
      "dimensions": {
        "width": "1080",
        "height": "2340",
        "scale": "3.0",
        "dpi_x": "400",
        "dpi_y": "400",
        "density": "2.75",
        "density_dpi": "420"
      },
      "type": "bug",
      "email": "user@example.com",
      "accessToken": accessToken,
      "appToken": "0f4365b8-a41d-41c3-80d9-b23bc6e2594f",
      "video": "https://example.com/video.mp4",
      "screenshot": "https://example.com/screenshot.png",
      "shortSummary": "App crashes when clicking the button",
      "description": "The app crashes immediately after clicking the button on the main screen.",
      "trackingSdkVersion": "2.1.0",
      "totalDuration": "5m30s",
      "createdAt": "2024-11-08T10:30:00.000Z",
      "uploadedAt": "2024-11-08T10:33:12.624Z",
    }
    

    return fetch(urlForIssue, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(dataForIssue)
    });
  })
  .then(response => response.json())
  .then(issueData => {
    console.log("Issue created successfully", issueData);
    urlForZipFile = issueData.result.url; 
    console.log(urlForZipFile); 
  })
  .catch((error) => {
    console.error("Error:", error);
  });


const main = {
  runSdk() {
    initialiseActionsMenu();
    addEventListeners();
  }
};

function addEventListeners() {
  const cameraIcon = document.getElementById('def-camera');
  const imgRenderPlace = document.getElementById('def-img');
  const actionsUI = document.getElementById('def-ui');

  cameraIcon.addEventListener('click', function () {
    if (cameraIcon.textContent === 'Capture') {
      cameraIcon.style.visibility = 'hidden';
      actionsUI.style.backgroundColor = 'white';

      html2canvas(document.querySelector("body"), {
        allowTaint: true,
        useCORS: true,
        height: window.innerHeight,
        width: window.innerWidth,
        x: window.scrollX,
        y: window.scrollY
      }).then(canvas => {
        const imageData = canvas.toDataURL();
        const imageBlob = base64ToBlob(imageData);
        imgRenderPlace.src = imageData;
        imgRenderPlace.style.opacity = '1';
        cameraIcon.style.visibility = 'visible';
        actionsUI.style.backgroundColor = 'black';

        sendToAPI(imageBlob, '');  
      });

      cameraIcon.textContent = 'Cancel';
    } else if (cameraIcon.textContent === 'Cancel') {
      imgRenderPlace.style.opacity = '0';
      cameraIcon.textContent = 'Capture';
    }
  });

  imgRenderPlace.addEventListener('click', function () {
    enlargeImage(imgRenderPlace.src);
  });
}

function enlargeImage(imageSrc) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column'
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';

  const modalImage = document.createElement('img');
  modalImage.src = imageSrc;
  modalImage.style.maxWidth = '90%';
  modalImage.style.maxHeight = '80%';
  modalImage.style.objectFit = 'contain';
  modalImage.style.position = 'absolute';

  const canvasElement = document.createElement('canvas');
  canvasElement.style.position = 'absolute';
  canvasElement.style.top = '0';
  canvasElement.style.left = '0';
  canvasElement.style.zIndex = '10';

  modal.appendChild(modalImage);
  modal.appendChild(canvasElement);

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Submit';
  saveButton.style.position = 'absolute';
  saveButton.style.padding = '10px';
  saveButton.style.backgroundColor = '#fff';
  saveButton.style.border = 'none';
  saveButton.style.cursor = 'pointer';
  saveButton.style.top = '20px';
  saveButton.style.right = '20px';
  saveButton.style.borderRadius = '5px';
  saveButton.style.zIndex = '20';
  modal.appendChild(saveButton);

  const descriptionField = document.createElement('input');
  descriptionField.style.width = '50%';
  descriptionField.style.marginTop = '50px';
  descriptionField.style.padding = '10px';
  descriptionField.style.fontSize = '14px';
  descriptionField.style.borderRadius = '5px';
  descriptionField.style.border = '1px solid #ccc';
  descriptionField.placeholder = 'Write description...';

  modal.appendChild(descriptionField);

  const canvasContainer = document.getElementById('canvas-container');
  canvasContainer.appendChild(modal);

  const canvas = new fabric.Canvas(canvasElement);
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.color = '#000000';

  modalImage.onload = function () {
    canvas.setWidth(modalImage.width);
    canvas.setHeight(modalImage.height);
    canvas.renderAll();
  };

  canvas.on('path:created', function () {
    const newImage = canvas.toDataURL();
    console.log(newImage, ">>>new");
  });


  saveButton.addEventListener('click', function () {
    saveButton.style.display = 'none';
    
    html2canvas(modal).then(function (canvas) {
      const imageURLbase64 = canvas.toDataURL('image/png');
      const editedImageBlob = base64ToBlob(imageURLbase64);
      
      const description = descriptionField.value;
      console.log(description, ">>>desc");
      const metaJson = {
        "metadata": {
          "batteryInfo": [
            {
              "isCharging": true,
              "lowPowerMode": true,
              "batteryPercentage": "75%",
              "capturedAt": "2024-11-08T10:33:12.624Z",
              "duration": "15m"
            }
          ],
          "network": [
            {
              "type": "Wi-Fi",
              "status": "connected",
              "rssi": "-60dBm",
              "ssid": "MyWiFiNetwork",
              "bssid": "00:14:22:01:23:45",
              "mcc": "310",
              "mnc": "260",
              "name": "Home Wi-Fi",
              "networkCountryCode": "US",
              "simCountryCode": "US",
              "phoneType": "Smartphone",
              "capturedAt": "2024-11-08T10:33:15.000Z",
              "duration": "5m"
            }
          ],
          "deviceOrientation": [
            {
              "value": "portrait",
              "capturedAt": "2024-11-08T10:33:20.000Z",
              "duration": "10m"
            }
          ],
          "applicationState": [
            {
              "value": "foreground",
              "capturedAt": "2024-11-08T10:33:25.000Z",
              "duration": "7m"
            }
          ],
          "multiWindow": [
            {
              "value": false,
              "capturedAt": "2024-11-08T10:33:30.000Z",
              "duration": "5m"
            }
          ],
          "topView": [
            {
              "value": "com.example.app.MainActivity",
              "capturedAt": "2024-11-08T10:33:35.000Z",
              "duration": "6m"
            }
          ],
          "cpuUtilization": [
            {
              "value": "18%",
              "capturedAt": "2024-11-08T10:33:40.000Z",
              "duration": "5m"
            }
          ],
          "flash": [
            {
              "capturedAt": "2024-11-08T10:33:45.000Z",
              "memory": "30MB",
              "unit": "MB"
            }
          ],
          "memory": [
            {
              "capturedAt": "2024-11-08T10:33:50.000Z",
              "memory": "1.8GB",
              "unit": "GB"
            }
          ],
          "bluetooth": [
            {
              "isConnected": true,
              "name": "Bluetooth Speaker",
              "capturedAt": "2024-11-08T10:33:12.624Z",
              "duration": "15m"
            }
          ]
        }
      }
      

      var zip = new JSZip();

      zip.file('snapshot.jpeg', editedImageBlob);
      zip.file('meta.json', JSON.stringify(metaJson))
      console.log(zip , ">>>zip");
      console.log(urlForZipFile , "url_for_zip_file");
      
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        console.log(content , ">>con");
        const file = new File([content], 'BMRTLogs.zip', { type: 'application/zip' });
        console.log(file , ">>file");
        // saveAs(file)
        
        fetch(urlForZipFile, {
          method: 'PUT',
          body: content,
        })
        .then(response => response.json())
        .then(data => {
          console.log('API Response:', data);
          saveButton.style.display = 'block';
        })
        .catch(error => {
          console.error('Error uploading ZIP:', error);
          saveButton.style.display = 'block';
        });
      });
    });
});
}


function initialiseActionsMenu() {
  const actionsUI = document.createElement('div');
  const cameraIcon = document.createElement('button');
  const imgRenderPlace = document.createElement('img');
  const canvasContainer = document.createElement('div');

  imgRenderPlace.id = 'def-img';
  cameraIcon.id = 'def-camera';
  actionsUI.id = 'def-ui';
  canvasContainer.id = 'canvas-container';

  cameraIcon.textContent = 'Capture';
  cameraIcon.style.color = 'black';
  cameraIcon.style.backgroundColor = 'white';
  cameraIcon.style.width = '80%';
  cameraIcon.style.position = 'relative';
  cameraIcon.style.top = '50%';
  cameraIcon.style.left = '50%';
  cameraIcon.style.transform = 'translate(-50%, -50%)';
  cameraIcon.style.cursor = 'pointer';
  cameraIcon.style.zIndex = '100';

  actionsUI.style.position = 'fixed';
  actionsUI.style.bottom = '16px';
  actionsUI.style.right = '16px';
  actionsUI.style.width = '100px';
  actionsUI.style.height = '60px';
  actionsUI.style.backgroundColor = 'black';
  actionsUI.style.borderRadius = '10px';
  actionsUI.style.zIndex = '100';

  imgRenderPlace.style.position = 'fixed';
  imgRenderPlace.style.width = '20vw';
  imgRenderPlace.style.height = '30vh';
  imgRenderPlace.style.objectFit = 'contain';
  imgRenderPlace.style.right = '16px';
  imgRenderPlace.style.bottom = '80px';
  imgRenderPlace.style.opacity = '0';
  imgRenderPlace.style.background = "red";
  imgRenderPlace.style.zIndex = '100';

  canvasContainer.style.position = 'absolute';
  canvasContainer.style.top = '0';
  canvasContainer.style.left = '0';
  canvasContainer.style.width = '100%';
  canvasContainer.style.height = '100%';
  canvasContainer.style.zIndex = '10';

  document.body.appendChild(canvasContainer);
  document.body.appendChild(actionsUI);
  actionsUI.appendChild(cameraIcon);
  document.body.appendChild(imgRenderPlace);
}

// utils/base64.js
export function base64ToBlob(base64Data) {
  const byteString = atob(base64Data.split(',')[1]);
  const byteArray = new Uint8Array(byteString.length);
  
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const mimeType = base64Data.split(';')[0].split(':')[1];
  return new Blob([byteArray], { type: mimeType });
}


main.runSdk();
